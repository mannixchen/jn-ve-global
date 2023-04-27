import axios from 'axios'
import interceptorsReqHandle from './interceptors/request'
import interceptorsResHandle from './interceptors/response'
import { printErrorMsg } from './utils'

/**
 * 创建axios实例
 * 创建实例时的配置 将被用在各个请求的配置默认值
 *  > 在实例创建后修改默认值使用 instance.defaults[prop]
 *
 * 默认值的优先顺序：
 * 创建请求时传入的配置 > 实例的配置 > axios lib/default.js 内的配置
 */
const headers = {}
const instance = axios.create({
    timeout: 1000 * 8,
    headers
})

// 请求拦截器
instance.interceptors.request.use(interceptorsReqHandle, (error) => Promise.reject(error))

// 响应拦截器
instance.interceptors.response.use(interceptorsResHandle, (error) => {
    printErrorMsg()
    return Promise.reject(error)
})

export default instance
