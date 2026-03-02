import AppFunc from '@jsjn/types/entity/AppFunc'
import { RouteConfig } from '@jsjn/types/Route'

export default interface AppFuncTree {
    /**
     * 当前用户的功能树源数据（包含权限）
     */
    currentUserAppFuncTree: AppFunc[]
    /**
     * 包含系统所有功能的树（不包含权限，即应用功能模块的全量数据）
     */
    systemAppFuncTree: AppFunc[]
    /**
     * 当进行应用管理时，触发刷新当前用户功能树的 flag
     */
    updateAppFuncTreeFlag: boolean
    /**
     * 后台源数据 => 前端需要的格式
     */
    routeConfigs: RouteConfig[]
    /**
     * 有 component 的组件（有效注册）
     */
    registeredRoutes: RouteConfig[]
    /**
     * 加载后台 route flag，这个只是标识请求后台应用功能数据的时间，是应用级别的，路由加载则是页面级别的
     * 在后台请求完成后，还会有：
     *  - 动态添加 route 的时间
     *  - 首页菜单 dom 生成时间，这个时间较长
     * 
     * 与路由跳转加载的 falg 是不同的
     */
    loadRouteFlag: boolean
    /**
     * 用户无权限
     * 常见于用户菜单数组长度为 0
     */
    userNoAccess: boolean
}
