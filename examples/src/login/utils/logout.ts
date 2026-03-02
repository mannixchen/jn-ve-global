import initCurrenLoginUserInfo, { initLoginInfo } from './initCurrenLoginUserInfo'
import { apis } from '@/api'
import { toLoginPage } from './login'

export default (appMode?: string, haveLoginKey: boolean = true, cb?: () => void) => {
    const http = apis.common
    http['logout']().then(async (res) => {
        await toLoginPage()
        // 初始化用户、路由、tag 等信息
        initCurrenLoginUserInfo()
        // 初始化登录信息
        initLoginInfo()
    })
}
