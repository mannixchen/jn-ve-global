import { InternalAxiosRequestConfig } from 'axios'
import excludeApis from '../constant/excludeApis'
import { isBusinessReq } from '../utils'
import router from '@/router'
import store from '@/store'
import commonApi from '@/api/modules/common.api'

/**
 * 请求拦截处理函数
 * @param config 请求参数
 * @returns
 */
export default async function interceptorsReqHandle(config: InternalAxiosRequestConfig) {
    // 业务请求
    if (isBusinessReq(config.url as string, excludeApis)) {
        // 公用请求头拼接
        const { access_token } = store.state.loginInfo
        const instituId = store.state.currentUserInfo.instituInfo.instituId
        const userId = store.state.currentUserInfo.accountInfo.userId
        const currentRoute = router.currentRoute.value

        // 普通业务请求需要携带 access_token
        config.headers['Authorization'] = `Bearer ${access_token}`
        config.headers['token_instituId'] = instituId
        config.headers['token_userId'] = userId
        config.headers['clientId'] = import.meta.env.VITE_CLIENT_ID

        /**
         * 业务携带当前路由的 funcId
         */
        if (currentRoute.meta.funcId) {
            config.headers['funcId'] = currentRoute.meta.funcId as string
        }
    }

    /**
     * 一般业务请求需要本地判断登录是否有效，即通过 refreshHandle 方法
     * 特殊情况下，需要调用校验是否登录有效的接口：
     *  - 页面有权限，接口无权限，登录实际未超时
     *
     * 判断的接口又不属于业务接口，且不需要判断是否登录，不需要重定向到登录等（已通过 excludeApis 排除）
     * 同时，这个判断登录失效的接口是需要当前 access_token 的
     *
     * 所以在请求这里单独设立入口，判断是否 checkLogin 的 api，做 token 的携带
     */
    if (config.url.includes(commonApi.find((apiConfig) => apiConfig.name === 'checkLogin').api)) {
        const { access_token } = store.state.loginInfo
        config.headers['Authorization'] = `Bearer ${access_token}`
    }

    return config
}
