import { RouteConfig } from '@jsjn/types/Route'

/**
 * 查找目标元素的所有父级（包含自身）
 * @param source 源数据
 * @param targetPath 目标数据
 * @returns 目标数据的所有父节点（包含自身）
 */
export function findAncestor(source: RouteConfig[], targetPath: string): Array<RouteConfig> {
    let temp: Array<RouteConfig> = []

    function recursion(source: RouteConfig[], target: string) {
        return source.some((item) => {
            if (item.path === target) {
                temp.unshift(item)
                return true
            }
            if (item.children && item.children.length > 0) {
                let subFlag = recursion(item.children, target)
                if (subFlag) temp.unshift(item)
                return subFlag
            }
        })
    }

    let isHasTarge: boolean = recursion(source, targetPath)
    return temp
}

/**
 * 根据激活的 path 查找对应的配置对象
 * @param source
 * @param currentPath
 * @returns
 */
export function findCurrentRouteConfig(source: RouteConfig[], currentPath: string): RouteConfig {
    let obj: any = null

    function recursion(source: RouteConfig[], currentPath: string) {
        source.forEach((item) => {
            if (item.children && item.children.length > 0) {
                recursion(item.children, currentPath)
            }

            if (item.path === currentPath) {
                obj = item
            }
        })
    }
    recursion(source, currentPath)
    return obj
}

/**
 * 为每一级的菜单配置层级标识
 * @param routeConfigs 路由配置源
 * @param grade 层级
 * @returns
 */
export function addGrade(routeConfigs: RouteConfig[], grade: number): RouteConfig[] {
    return routeConfigs.map((routeConfig) => {
        routeConfig['meta']['grade'] = grade

        if (routeConfig.children && routeConfig.children.length > 0) {
            routeConfig.children = addGrade(routeConfig.children, grade + 1)
        }

        return routeConfig
    })
}

/**
 * 判断是否本地的 svg 图标
 * @param iconName 图标名称
 * @returns
 */
export function isLocalSvgIcon(iconName: string) {
    return !['el-', 'ali-'].some((item) => item.startsWith(iconName))
}
