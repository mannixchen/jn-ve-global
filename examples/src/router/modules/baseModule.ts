import { RouteConfig } from '@jsjn/types/Route'

/**
 * 业务路由为 / 路由的后代路由，path 不需要加 '/'
 * 否则将被定义为根路径
 * 参考：https://next.router.vuejs.org/zh/guide/essentials/nested-routes.html
 *
 * 路由配置参数参考：https://next.router.vuejs.org/zh/api/#routerecordraw
 * 路由配置呈嵌套模式，只有拥有 component 的配置才会被真正注册呈路由，没有 component 仅做层级结构
 */
const routes: Array<RouteConfig> = [
    {
        path: 'baseModule',
        name: 'baseModule',
        meta: {
            title: 'BaseModule',
            icon: 'el-Cpu'
        },
        children: [
            {
                path: 'index',
                name: 'baseModule-index',
                meta: {
                    title: '总览',
                    isBlurry: true
                },
                component: () => import('@/views/demo/baseModuleTest/index.vue')
            },
            {
                path: 'selection',
                name: 'baseModule-selection',
                meta: {
                    title: 'Selection',
                    isBlurry: true
                },
                component: () => import('@/views/demo/baseModuleTest/selectionDemo.vue')
            }
        ]
    }
]

export default routes
