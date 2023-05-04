import * as VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './common'
import { Base64 } from 'js-base64'
import _ from 'lodash'
import store from '@/store'
import { toLoginPage, isTimeout } from '@/login/utils/login'
import { apis } from '@/api'

// 加载进度条配置
NProgress.configure({ showSpinner: false })

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

// 变量组
const loginPath = '/login'

// 前置
router.beforeEach(async (to, from) => {
    NProgress.start()
    // 设置路由加载状态
    store.commit('currentStatus/setRouteLoading', true)
    // 设置网页 title
    document.title = import.meta.env.VITE_SYS_NAME

    // 校验登录是否失效
    // if (to.path !== loginPath) {
    //     const isDevitalize = await apis.common['checkLogin']()
    //     if (isDevitalize.data !== true) {
    //         store.commit('loginInfo/setLoginInfo', {
    //             'access_token': ''
    //         })

    //         await toLoginPage()
    //         return false
    //     }
    // }

    /**
     * 无登录权限（token）权重最高
     * 无效则跳转登录页
     *  - 非登录页
     *  - 超时（无 token）
     *  - 目标需要登录
     */
    if (
        to.path !== loginPath &&
        isTimeout() &&
        (to.meta.isNeedLogin === true || to.meta.isNeedLogin === undefined)
    ) {
        await toLoginPage()
        return false
    }

    /**
     * 如果在登录页 且 登录有效 ==> 自动跳转到业务页
     */
    if (to.path === loginPath && !isTimeout()) {
        const fromPath = to.query['from'] as string
        const decodePath = fromPath ? Base64.decode(fromPath) : '/'
        return {
            path: decodePath,
            replace: true
        }
    }

    return true
})

// 后置
router.afterEach(async (to, from) => {
    NProgress.done()
    store.commit('currentStatus/setRouteLoading', false)

    /**
     * 在获取完后台菜单数据后，肯定是要重定向回页面的
     * 所以，在路由跳转结束后再结束掉加载 “菜单/路由” 的标识
     */
    store.commit('appFuncTree/setLoadRouteFlag', false)

    /**
     * 是否登录（重置首次登录的 flag）
     *  1. 首次登录
     *  2. 重新登录
     */
    if (to.path === '/login') {
        store.dispatch('currentStatus/updateFirstLogin', true)
    }
})

export default router
