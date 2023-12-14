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
        path: 'base',
        name: 'base',
        meta: {
            title: '基础组件',
            icon: 'ali-icon--zujian'
        },
        children: [
            {
                path: 'iconTest',
                name: 'iconTest',
                meta: {
                    title: 'Icon'
                },
                component: () => import('@/views/demo/base/iconTest/index.vue')
            },
            {
                path: 'transfer',
                name: 'transfer',
                meta: {
                    title: 'Transfer'
                },
                component: () => import('@/views/demo/base/transfer/index.vue')
            },
            {
                path: 'treeTest',
                name: 'treeTest',
                meta: {
                    title: 'Tree'
                },
                component: () => import('@/views/demo/base/treeTest/index.vue')
            },
            {
                path: 'collapseTest',
                name: 'collapseTest',
                meta: {
                    title: 'Collapse'
                },
                component: () => import('@/views/demo/base/collapseTest/index.vue')
            },
            {
                path: 'buttonTest',
                name: 'buttonTest',
                meta: {
                    title: 'ButtonTest'
                },
                children: [
                    {
                        path: 'btnBase',
                        name: 'btnBase',
                        meta: {
                            title: 'ButtonBase'
                        },
                        component: () => import('@/views/demo/base/buttonTest/index.vue')
                    },
                    {
                        path: 'btnGroup',
                        name: 'btnGroup',
                        meta: {
                            title: 'BtnGroup'
                        },
                        component: () => import('@/views/demo/base/buttonTest/btnGroupTest.vue')
                    }
                ]
            },
            {
                path: 'infoSAA',
                name: 'infoSAA',
                meta: {
                    title: 'infoSAA'
                },
                children: [
                    {
                        path: 'infoSelectTest',
                        name: 'infoSelectTest',
                        meta: {
                            title: 'InfoSelect'
                        },
                        component: () =>
                            import('@/views/demo/base/infoSAA/infoSelectTest/index.vue')
                    },
                    {
                        path: 'infoSelectAllTest',
                        name: 'infoSelectAllTest',
                        meta: {
                            title: 'InfoSelectAll'
                        },
                        component: () =>
                            import('@/views/demo/base/infoSAA/infoSelectAllTest/index.vue')
                    },
                    {
                        path: 'infoAutocompleteTest',
                        name: 'infoAutocompleteTest',
                        meta: {
                            title: 'InfoAutocomplete'
                        },
                        component: () =>
                            import('@/views/demo/base/infoSAA/infoAutocompleteTest/index.vue')
                    }
                ]
            },
            {
                path: 'selectTreeTest',
                name: 'selectTreeTest',
                meta: {
                    title: 'SelectTree'
                },
                children: [
                    {
                        path: 'selectTreeV1',
                        name: 'selectTreeV1',
                        meta: {
                            title: 'ButtonBase'
                        },
                        component: () => import('@/views/demo/base/selectTreeTest/index.vue')
                    },
                    {
                        path: 'elSelectTree',
                        name: 'elSelectTree',
                        meta: {
                            title: 'ElSelectTree'
                        },
                        component: () => import('@/views/demo/base/selectTreeTest/elSelectTree.vue')
                    }
                ]
            },
            {
                path: 'uploadTest',
                name: 'uploadTest',
                meta: {
                    title: 'Upload'
                },
                children: [
                    {
                        path: 'uploadPreview',
                        name: 'uploadPreview',
                        meta: {
                            title: 'Preview'
                        },
                        component: () => import('@/views/demo/base/uploadTest/index.vue')
                    },
                    {
                        path: 'fileList',
                        name: 'fileList',
                        meta: {
                            title: 'FileList'
                        },
                        component: () => import('@/views/demo/base/uploadTest/fileList.vue')
                    },
                    {
                        path: 'filePreview',
                        name: 'filePreview',
                        meta: {
                            title: 'FilePreview'
                        },
                        component: () => import('@/views/demo/base/uploadTest/preview.vue')
                    },
                    {
                        path: 'folderTest',
                        name: 'folderTest',
                        meta: {
                            title: 'FolderTest'
                        },
                        component: () => import('@/views/demo/base/uploadTest/folderTest.vue')
                    }
                ]
            },
            {
                path: 'modalTest',
                name: 'modalTest',
                meta: {
                    title: 'Modal'
                },
                children: [
                    {
                        path: 'modalPreview',
                        name: 'modalPreview',
                        meta: {
                            title: 'Preview'
                        },
                        component: () => import('@/views/demo/base/modalTest/index.vue')
                    },
                    {
                        path: 'dateTest',
                        name: 'dateTest',
                        meta: {
                            title: 'DateTest'
                        },
                        component: () => import('@/views/demo/base/modalTest/index2.vue')
                    }
                ]
            }
        ]
    }
]

export default routes
