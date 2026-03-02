import AppPackage from '@jsjn/types/entity/AppPackage'

export default interface CurrentStatus {
    /**
     * 当前活跃的微应用
     */
    currentMicroApp: string
    /**
     * 当前路由 path
     */
    currentPath: string
    /**
     * 页面跳转 路由加载 flag
     */
    routeLoading: boolean
    /**
     * 是否为根路由
     */
    isRootRoute: boolean
    /**
     * 当前业务是否全屏（非全屏）
     */
    isFullScreen: boolean
    /**
     * 当前屏幕与设计稿的比例
     */
    screenRatio: number
    /**
     * 是否在登录之后
     *  1. 登录
     *  2. 重新登录
     */
    isFirstAfterLogin: boolean
    /**
     * 是否提示更改密码，同步首次登录
     */
    hintUpdatePass: boolean
    /**
     * 当前浏览器信息
     */
    currentBrowser: {
        os: { phone: boolean; tablet: boolean; [k: string]: any }
        browser: { [k: string]: any }
    }
    /**
     * 字典数据是否更新完毕
     */
    sysdictUpdated: boolean
    /**
     * 用户信息是否更新完毕
     */
    userInfoUpdated: boolean
    /**
     * [已废弃] 当前系统（应用包）
     * 监管
     */
    currentSystem: AppPackage
    /**
     * 当前系统的未读消息数量，来源
     *  - 轮询
     *  - 阅读消息后的返回值
     */
    currentMessageCount: number
    /**
     * 当前存活在前端的消息列表，不同于未读列表，
     * 这个是用来展示页面的
     */
    currentFrontEndMsgCount: number
    /**
     * 是否被替换掉了（被挤掉线）
     */
    isReplaced: boolean
    /**
     * 系统名称
     */
    sysName: string
}
