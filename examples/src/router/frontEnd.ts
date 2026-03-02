import { RouteConfig } from '@jsjn/types/Route'
import _ from 'lodash'
import store from '@/store'
import { hump2Partition } from '@jsjn/utils'

let registeredRoutes: RouteConfig[] = []
const modules = import.meta.glob<any>('./modules/*.ts', { eager: true })

const systemRouteConfigTree = Object.keys(modules).reduce((module, path) => {
    let sourceModule: RouteConfig[] = modules[path].default
    sourceModule && (module = module.concat(sourceModule))
    return module
}, [])

// 路由配置对象（供菜单使用，树形结构）
const copyRouteConfigs: RouteConfig[] = _.cloneDeep(systemRouteConfigTree)
// 实际注册的路由（供 vue-router 使用，一维数组）
registeredRoutes = routeConfigs2RegisteredRoutes(copyRouteConfigs)

/**
 * 将路由：
 *  - 源配置对象
 *  - 实际注册路由
 * 存进 store，深克隆断链保险源数据的安全
 */
store.commit('appFuncTree/setRouteConfigs', _.cloneDeep(copyRouteConfigs))
store.commit('appFuncTree/setRegisteredRoutes', _.cloneDeep(registeredRoutes))

/**
 * 多维数组变为一维数组注册路由
 * 实际上，业务模块的路由都应期望放在 Main 组件下，但是路由的声明文件最好拥有层级结构（并适用菜单的配置）
 * 故：将声明的路由配置 “拉平” 成一维数组，集中注册到 '/' 路由下，使其能够在 Main 组件下的 <router-view /> 展示
 */
export function routeConfigs2RegisteredRoutes(source: Array<RouteConfig>): RouteConfig[] {
    for (let i = 0; i < source.length; i++) {
        if (source[i].children) {
            const parentPath = source[i].path

            // 子拼接父 的路径标识
            source[i].children!.forEach((subItem) => {
                subItem.path = `${parentPath}/${subItem.path}`
            })

            // 父拼接子 行成一维数组
            source = source.slice(0, i + 1).concat(source[i].children!, source.slice(i + 1))
        }
    }

    return source.filter((route) => route.component)
}

export default registeredRoutes
