<template>
    <el-container class="layout-root">
        <el-aside v-if="!isRootRoute" class="layout-aside" :class="{ 'is-collapse': collapse }">
            <div class="logo-wrapper">
                <img src="@/assets/images/jn-logo.jpg" alt="">
            </div>
            <AsideMenu :max-grade="10" />
        </el-aside>
        <el-container
            :class="{
                'layout-main': true,
                'is-full-screen': isFullScreen
            }"
        >
            <el-header v-if="!isRootRoute" class="layout-main-header">
                <!-- 页面核心头部占位 -->
                <SystemInfo />
            </el-header>
            <el-main
                v-if="!isAccessDenied"
                :class="['layout-main-content', { 'is-root-route': isRootRoute }]"
            >
                <g-loding-shade :show="routeLoading" />
                <RouterView :key="currentRouteViewKey" />
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
export default {
    name: 'BusinessLayoutMain'
}
</script>

<script lang="ts" setup>
import { computed, getCurrentInstance, ref, provide, onUnmounted, readonly, watch } from 'vue'
import { useStore } from '@/store'
// newcore 和 监管 公用组件
import collapseKey from './constant/collapseKey'
import { useRoute } from 'vue-router'
import isRegtechKey from './constant/isRegtechKey'
import layoutModeKey from './constant/layoutModeKey'
import AsideMenu from './components/asideMenu/index.vue'
import SystemInfo from './components/systemInfo/index.vue'

const props = withDefaults(
    defineProps<{
        mode?: 'newcore' | 'regtech' | 'managed-cloud'
    }>(),
    {
        mode: 'newcore'
    }
)

provide(layoutModeKey, props.mode)
provide(isRegtechKey, props.mode === 'regtech')

const { proxy } = getCurrentInstance() as any
const store = useStore()
const route = useRoute()

// 注册 & 传递 collapse state
const collapse = ref<boolean>(false)
provide(collapseKey, readonly(collapse))

// 当前路径 router-view 的 key，iframe 需要
const currentRouteViewKey = computed(() => {
    if (
        store.state.currentStatus.currentPath.includes('iframe') ||
        (route.meta.urlQuery as string)?.includes('onlyKey')
    ) {
        return store.state.currentStatus.currentPath
    }

    return undefined
})

// 当前业务是否全屏（收起面包屑和标签）
const isFullScreen = computed(() => store.state.currentStatus.isFullScreen)

/**
 * 当前是否是根路由
 *  1. 根路由：隐藏菜单及顶部，只存业务核心区域，常用于流程对接页面
 *  2. 业务路由：常规布局
 */
const isRootRoute = computed(() => store.state.currentStatus.isRootRoute)

// 路由切换
const routeLoading = computed(() => store.state.currentStatus.routeLoading)

// 是否首次登录（紧急通知推送）
const isFirstAfterLogin = computed(() => store.state.currentStatus.isFirstAfterLogin)

// 是否需要改密
const hintUpdatePass = computed(
    () => store.state.currentStatus.hintUpdatePass && !!store.state.currentUserInfo.passwordNeedEdit
)

/**
 * 拒绝访问
 */
const isAccessDenied = computed(() => {
    // 获取用户信息失败
    if (!Object.keys(store.state.currentUserInfo.accountInfo).length) {
        return true
    }

    if (
        store.state.currentUserInfo.instituInfo.instituId !==
        store.state.currentUserInfo.loginInfo.instituId
    ) {
        return false
    }

    // 角色信息无效
    if (
        store.state.currentUserInfo.instituInfo.attribute !== '99' &&
        store.state.currentUserInfo.roleList.length === 0 &&
        store.state.currentUserInfo.roleModelList.length === 0 &&
        store.state.currentUserInfo.roleDepartList.length === 0
    ) {
        return true
    }

    return false
})

/**
 * 通过第三方注册修改 collapse 的状态
 */
const changeAsideMenuCollapseHandle = (state) => (collapse.value = state)
proxy.mittBus.on('changeAsideMenuCollapse', changeAsideMenuCollapseHandle)
onUnmounted(() => proxy.mittBus.off('changeAsideMenuCollapse', changeAsideMenuCollapseHandle))
</script>

<style lang="scss" scoped>
@import './styles.scss';

.layout-root {
    :deep(.aside-menu) {
        .el-menu-item,
        .el-sub-menu__title {
            &:hover {
                --jn-menu-item-active-color: var(--jn-base-active-color);
                background-image: linear-gradient(
                    90deg,
                    #ffffff 0%,
                    rgba(255, 255, 255, 0.8) 100%
                ) !important;
            }
        }

        .is-active {
            &.el-menu-item {
                background-image: linear-gradient(
                    90deg,
                    #ffffff 0%,
                    rgba(255, 255, 255, 0.8) 100%
                ) !important;

                &,
                i,
                .custom-svg-icon,
                .menu-item-content,
                &.grade-1 .custom-svg-icon,
                &.grade-1 i {
                    color: var(--jn-base-active-color) !important;
                }
            }
        }
    }
}
</style>
