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
        path: 'lowcode',
        name: 'lowcode',
        meta: {
            title: '低代码',
            icon: 'el-Pointer'
        },
        children: [
            {
                path: 'formGenerateTest',
                name: 'formGenerateTest',
                meta: {
                    title: 'FormGenerate'
                },
                component: () => import('@/views/demo/lowcode/formGenerateTest/index.vue')
            },
            {
                path: 'lowcodePlatform',
                name: 'lowcodePlatform',
                meta: {
                    title: 'LowcodePlatform'
                },
                component: () => import('@/views/demo/lowcode/lowcodePlatform/index.vue')
            }
        ]
    }
]

export default routes
