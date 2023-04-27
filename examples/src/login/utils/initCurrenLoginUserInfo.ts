import store from '@/store'
import router from '@/router'

/**
 * 清空登录信息
 */
export function initLoginInfo() {
    store.commit('loginInfo/setLoginInfo', {
        access_token: ''
    })
}

/**
 * 初始化数据存储
 */
export function initSysCurrentDataCache() {}

export default () => {
    // 清空登录用户的信息
    store.commit('currentUserInfo/setCurrentUserInfo', {
        device: '',
        accountInfo: {},
        clientInfo: {},
        instituInfo: {},
        loginInfo: {},
        departList: [],
        postList: []
    })

    // 清空系统数据
    initSysCurrentDataCache()
}
