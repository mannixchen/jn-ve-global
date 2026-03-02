import { RouteRecordRaw } from 'vue-router'
import BusinessRoutes, { routeConfigs2RegisteredRoutes } from '../frontEnd'
import Login from '@/views/_login/index.vue'
import Layout from '@/views/_layout/index.vue'
import Home from '@/views/home/index.vue'

const commonRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'layoutMain',
        component: Layout,
        redirect: '/home',
        children: BusinessRoutes as any
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/:path(.*)*',
        component: () => import(/* webpackChunkName: "error-404" */ '@/views/error/404.vue')
    },
    {
        path: '/500',
        component: () => import(/* webpackChunkName: "error-500" */ '@/views/error/500.vue')
    }
]

export default commonRoutes
