<template>
    <g-loding-shade :show="loadRouteFlag" />
    <router-view />
</template>

<script lang="ts">
export default {
    name: 'App'
}
</script>

<script lang="ts" setup>
import { watchEffect, onMounted, ref } from 'vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { OpenMode } from '@jsjn/types/entity/AppFunc'
import { detectBrowser } from '@jsjn/utils'
import useGetSystemSafeInfo from '@/login/hooks/useGetSystemSafeInfo'

useGetSystemSafeInfo()

const store = useStore()
const route = useRoute()
const routeControlMode: string = 'frontEnd'
const loadRouteFlag = ref<boolean>(true)
onMounted(() => {
    setTimeout(() => {
        loadRouteFlag.value = false
    }, 300)
})

// 浏览器信息
store.commit('currentStatus/setCurrentBrowser', detectBrowser(window.navigator))
// 页面刷新，初始化用户信息的加载状态等
store.commit('currentStatus/setUserInfoUpdated', false)
store.commit('currentStatus/setSysdictUpdated', false)

watchEffect(() => {
    /**
     * 判断是否是根路由模式
     *  1. 路由隐藏 + 外部打开（静态的）--- 第一优先级
     *  2. 通过路由携带的参数 routeMode=root 标识当前路由模式为 "根路由模式"（动态的）--- 第二优先级
     *  3. 工作流页面 + 携带 root 标识 + 移动端 --- 第三优先级
     */
    store.commit(
        'currentStatus/setIsRootRoute',
        (route.meta.hidden && route.meta.openMode === OpenMode.NEW) ||
            (route.query.routeMode === 'root' && route.name !== 'workflow-root') ||
            (route.query.routeMode === 'root' &&
                route.name === 'workflow-root' &&
                store.state.currentStatus.currentBrowser.os.phone)
    )

    /**
     * 前后端路由去除差异化 why?
     *  前后台路由配置源对象存在差异：
     *      - 后台返回的配置对象的每一个节点 path 都是绝对路径的，即：'/uums/userMage/orgMage'
     *      - 前台配置的对象（业务路由），是作为根路由 '/' 的子路由存在的，每一个节点的 path 是不带 '/' 的，如：'uums/userMage/orgMage'
     *
     * 而我们通过在通过 route 获取当前路由 path 时，获取到的是带有 '/' 的，获取到的 path 可以直接在后台路由配置对象中查找源，但在前台配置对象中不行
     * 所以，在这里做了一个前后台当前路由的区分化，通过这个全局变量，可以无差异的从 routeConfigs 中查找源数据
     */
    store.commit(
        'currentStatus/setCurrentPath',
        routeControlMode === 'backEnd' ? route.path : route.path.substring(1)
    )
})
</script>

<style lang="scss" scoped></style>
