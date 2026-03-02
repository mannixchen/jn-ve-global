import type { RequestConfig } from '@jsjn/types/Request'
import router from '@/router'
import commonApi from '@/api/modules/common.api'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
import reqErrorText from '@/constants/reqErrorText'

/**
 * 一些接口可能在登录页不需要拦截，在业务页的时候需要拦截（否定 excludeNames 的部分接口）
 *  如：getPasClass
 */
export const businessInterceptApi = ['getPasClass']

/**
 * 依据给定的名称，在 commonApi 里面查找对应的 api
 * @param names 注册的 api 的名称
 * @returns
 */
export function getApisByNames(source: RequestConfig[], names: string[]): string[] {
    return names.map((name) => source.find((apiConfig) => apiConfig.name === name)!.api)
}

// 固定的（即在加载当前模块时，就把对应的 urls 映射出来）
const businessPageInterceptApiUrls = getApisByNames(commonApi, businessInterceptApi)

/**
 * 是否为业务请求（不需要拦截的）
 * @param url 当前请求的 url
 * @param apis 排除项的 api
 * @returns boolean
 */
export function isBusinessReq(url: string, apis: string[]): boolean {
    /**
     * 判断当前请求是否属于业务页的鉴权请求
     */
    if (businessPageInterceptApiUrls.some((item) => url.includes(item))) {
        const currentRouteIsLogin = router.currentRoute.value.path === '/login'
        if (!currentRouteIsLogin) {
            return true
        }
    }

    return apis.every((api) => !url.includes(api))
}

/**
 * 统一处理接口抛出错误信息的方式
 * @param errorMsg 错误消息
 * @param type 弹窗类型
 * @param duration 延迟关闭时间
 */
export const printErrorMsg = _.debounce(
    (
        errorMsg: string = reqErrorText.AXIOS_ERRS,
        type: 'error' | 'info' | 'success' | 'warning' = 'error',
        duration: number = 3000
    ): void => {
        ElMessage({
            message: errorMsg,
            type,
            duration
        })
    },
    100
)
