/* eslint-disable indent */
import myAxios from '@/http'
import { REQMethods, RequestConfig, REQParamsType } from '@jsjn/types/Request'
import { filterObj } from '@jsjn/utils'
import qs from 'qs'
import defaultPrefix from './prefix'

/**
 * 创建请求地址传入 api
 * @param {String url}
 */
const mergeUrl = (api: string, p?: string) => (!p ? `${defaultPrefix}/${api}` : `${p}/${api}`)

/**
 * 创建请求根据预设的映射表
 * @param {Array mapping}
 */
export function createRequestByMapping(mapping: Array<RequestConfig>) {
    return mapping.reduce(
        (
            modules: {
                [key: string]: (params?: any) => Promise<any>
            },
            item: RequestConfig
        ) => {
            /**
             * 多个代理
             */
            let url = !item.devPrefix ? mergeUrl(item.api) : mergeUrl(item.api, item.devPrefix)

            /**
             * myAxios 配置对象初始化
             */
            let reqConfig: RequestConfig['axiosRequestConfig'] = item.axiosRequestConfig
                ? item.axiosRequestConfig
                : {}

            // 配置自定义请求头
            item.headers && (reqConfig['headers'] = item.headers)

            // 如果指明请求的参数类型是 keyValue，需要添加请求头 Content-Type
            if (item.paramType && item.paramType === REQParamsType.KEY_VALUE) {
                reqConfig['headers']['Content-Type'] = 'application/x-www-form-urlencoded'
            }

            // 创建请求方法（返回请求的 Promise）
            modules[item.name] = function (params?: any): Promise<any> {
                /**
                 * 简单请求 + put 请求，可能会有 RESTful 的参数：以 query 的形式携带 ==> 需要手动拼接到 url 上面
                 */
                let jointUrl = url
                if (item.paramType && item.paramType === REQParamsType.QUERY) {
                    if (params && Object.keys(params).length) {
                        Object.keys(params).forEach((key) => {
                            jointUrl += `/${params[key]}`
                        })
                    }
                }

                switch (item.method) {
                    case REQMethods.GET:
                    case REQMethods.DELETE:
                    case REQMethods.HEAD: {
                        /**
                         * 简单请求参数携带方式分为两种：
                         *  1. RESTful，参数以 query 的形式携带 ==> 需要手动拼接到 url 上面
                         *  2. 以 search 的形式携带，默认
                         */
                        if (!item.paramType || item.paramType !== REQParamsType.QUERY) {
                            // 过滤请求参数
                            const reqParams = filterObj(params)
                            reqConfig!['params'] = params
                        }

                        return myAxios[item.method](jointUrl, reqConfig)
                    }
                    case REQMethods.POST: {
                        // 如果是 KeyVlue 形式的，需要特殊处理，默认为 JSON
                        let data: any =
                            item.paramType === REQParamsType.KEY_VALUE
                                ? qs.stringify(params)
                                : params

                        return myAxios[item.method](url, data, reqConfig)
                    }
                    case REQMethods.PUT: {
                        // 如果是 KeyVlue 形式的，需要特殊处理，默认为 JSON
                        let data: any =
                            item.paramType === REQParamsType.KEY_VALUE
                                ? qs.stringify(params)
                                : params

                        // 如果是 query 形式的，清空 data，参数携带到 url 上
                        if (item.paramType === REQParamsType.QUERY) {
                            data = null
                        }

                        return myAxios[item.method](jointUrl, data, reqConfig)
                    }
                }
            }
            return modules
        },
        {}
    )
}
