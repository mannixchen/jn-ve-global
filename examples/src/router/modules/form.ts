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
        path: 'form',
        name: 'form',
        meta: {
            title: '表单',
            icon: 'jg-public-kapian-zhengcewenjian'
        },
        children: [
            {
                path: 'all',
                name: 'all',
                meta: {
                    title: '总览'
                },
                component: () => import('@/views/demo/form/index.vue')
            },
            {
                path: 'address',
                name: 'address',
                meta: {
                    title: 'address'
                },
                component: () => import('@/views/demo/form/address.vue')
            },
            {
                path: 'controlGroup',
                name: 'controlGroup',
                meta: {
                    title: 'ControlGroup'
                },
                component: () => import('@/views/demo/form/controlGroup.vue')
            },
            {
                path: 'figureInput',
                name: 'figureInput',
                meta: {
                    title: 'figureInput'
                },
                component: () => import('@/views/demo/form/figureInput.vue')
            },
            {
                path: 'disToolTip',
                name: 'disToolTip',
                meta: {
                    title: 'disToolTip'
                },
                component: () => import('@/views/demo/form/disToolTip.vue')
            },
            {
                path: 'dynamic',
                name: 'dynamic',
                meta: {
                    title: 'dynamic'
                },
                component: () => import('@/views/demo/form/dynamic.vue')
            },
            {
                path: 'splitItem',
                name: 'splitItem',
                meta: {
                    title: 'splitItem'
                },
                component: () => import('@/views/demo/form/splitItem.vue')
            },
            {
                path: 'choose',
                name: 'choose',
                meta: {
                    title: 'choose'
                },
                component: () => import('@/views/demo/form/choose.vue')
            },
            {
                path: 'formItems',
                name: 'formItems',
                meta: {
                    title: 'formItems'
                },
                component: () => import('@/views/demo/form/formItems.vue')
            },
            {
                path: 'businessUI',
                name: 'businessUI',
                meta: {
                    title: 'businessUI'
                },
                component: () => import('@/views/demo/form/businessUI.vue')
            }
            // {
            //     path: 'formGenerateTest',
            //     name: 'formGenerateTest',
            //     meta: {
            //         title: 'FormGenerate'
            //     },
            //     component: () => import('@/views/demo/form/formGenerateTest/index.vue')
            // },
            // {
            //     path: 'lowcodePlatform',
            //     name: 'lowcodePlatform',
            //     meta: {
            //         title: 'LowcodePlatform'
            //     },
            //     component: () => import('@/views/demo/form/lowcodePlatform/index.vue')
            // }
        ]
    }
]

export default routes
