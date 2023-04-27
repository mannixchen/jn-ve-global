<template>
    <el-scrollbar
        v-loading="updateAppFuncTreeFlag"
        element-loading-spinner="el-icon-loading"
        class="scrollbar-hide-x not-select aside-menu-wrapper"
    >
        <el-menu
            :class="['aside-menu', layoutMode]"
            :default-active="activeMenuItemPath"
            :unique-opened="true"
            :collapse="collapse"
            :collapse-transition="false"
            @select="handleSelect"
        >
            <template v-for="(routeConfig, index) in menus" :key="`${routeConfig.path}-${index}`">
                <MenuItem :config="routeConfig" :index="routeConfig.path" />
            </template>
        </el-menu>
    </el-scrollbar>
</template>

<script lang="ts">
export default {
    name: 'AsideMenu',
    inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { computed, inject, provide } from 'vue'
import { useStore } from '@/store'
import NavTo from '@/hooks/navTo'
import { RouteConfig } from '@jsjn/types/Route'
import MenuItem from './components/menuItem.vue'
import _ from 'lodash'
import { Base64 } from 'js-base64'
import { useRoute } from 'vue-router'
import maxGradeKey from './constant/maxGradeKey'
import { findAncestor, addGrade } from '../../utils'
import collapseKey from '../../constant/collapseKey'
import layoutModeKey from '../../constant/layoutModeKey'

const props = withDefaults(
    defineProps<{
        maxGrade: number
    }>(),
    {
        maxGrade: 10
    }
)

provide(maxGradeKey, props.maxGrade)

const collapse = inject(collapseKey)
const layoutMode = inject(layoutModeKey)

const store = useStore()
const { navTo } = NavTo()
const route = useRoute()

const currentPath = computed(() => {
    /**
     * 如果是菜单选择页，需要动态处理携带的激活路由参数
     *  - base64 解密：携带时，为了避免路径分割，进行了 base64 加密
     */
    if (route.name === 'selectMenu' && route.params.currentPath) {
        return Base64.decode(route.params.currentPath as string)
    }

    // 默认采用当前路由匹配的 path
    return store.state.currentStatus.currentPath
})
const updateAppFuncTreeFlag = computed(() => store.state.appFuncTree.updateAppFuncTreeFlag)

// 真实菜单（前台 || 后台）
const menus = computed<RouteConfig[]>(() =>
    addGrade(_.cloneDeep(store.state.appFuncTree.routeConfigs), 1)
)

/**
 * 计算当前路由的祖先，进行选中操作
 * 获取菜单上的有效节点（1、2 级）
 */
const activeMenuItemAncestors = computed(() =>
    findAncestor(menus.value, currentPath.value).filter(
        (menu) => (menu.meta.grade as number) <= props.maxGrade
    )
)

/**
 * 监管和 newcore 的默认选中机制不一样
 *  - 监管：选取二级
 *  - newcore：选取一级（旧，后选取当前激活的）
 */
const activeMenuItemPath = computed(() => {
    const index = activeMenuItemAncestors.value.length - 1

    return activeMenuItemAncestors.value.length > 0
        ? activeMenuItemAncestors.value[index].path
        : currentPath.value
})

// 菜单的选中事件
const handleSelect = (index) => {
    navTo(index)
}
</script>

<style lang="scss" scoped>
@import './styles/baseStyles.scss';
</style>
<style lang="scss">
@import './styles/popupStyles.scss';
@import './styles/popupMenuStyles.scss';
</style>
