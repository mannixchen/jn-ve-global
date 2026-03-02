<template>
    <template v-if="!config.meta.hidden && (config.meta.grade <= maxGrade || collapse)">
        <!-- 
            有子且无组件：菜单仅做层级结构展示
         -->
        <template v-if="!config.component && config.children && !!config.children.length">
            <!-- 小于最大层级（普通的 sub-menu） -->
            <el-sub-menu
                v-if="config.meta.grade < maxGrade || collapse"
                :class="`grade-${config.meta.grade} menu-grade`"
                v-bind="$attrs"
                popper-class="aside-menu-shrink-popup"
            >
                <template #title>
                    <div v-if="config.meta.icon" class="icon-wrapper flex-center">
                        <g-icon
                            :icon="config.meta.icon"
                            :custom-color="isLocalSvgIcon(config.meta.icon)"
                        />
                    </div>
                    <g-hint-box :text="config.meta.title" />
                </template>

                <template v-for="subItem in config.children" :key="subItem.path">
                    <AsideMenuItem :config="subItem" :index="subItem.path" />
                </template>
            </el-sub-menu>

            <!-- 
                浮出型菜单：等于最大层级 = 浮出菜单目标层级（浮出菜单的触发器 menu-item） 
                菜单选择页菜单：最大层级，跳转菜单选择页（监管）
            -->
            <template v-if="config.meta.grade === maxGrade && !collapse">
                <el-popover
                    v-if="!isRegtech"
                    popper-class="popper-sub-menu-wrapper"
                    placement="right"
                    :offset="0"
                    trigger="hover"
                    @after-enter="operationClass(config.path, 'add')"
                    @hide="operationClass(config.path, 'remove')"
                >
                    <template #reference>
                        <el-menu-item
                            :index="config.path"
                            :class="`popover-menu-trigger grade-${config.meta.grade} menu-grade`"
                            :data-path="config.path"
                            disabled
                        >
                            <div v-if="config.meta.icon" class="icon-wrapper flex-center">
                                <g-icon
                                    :icon="config.meta.icon"
                                    :custom-color="isLocalSvgIcon(config.meta.icon)"
                                />
                            </div>
                            <div class="menu-item-content">
                                <g-hint-box :text="config.meta.title" />
                            </div>
                        </el-menu-item>
                    </template>

                    <PopperSubMenu :config="config.children" />
                </el-popover>

                <!-- 监管跳转选择菜单页 -->
                <el-menu-item
                    v-else
                    :index="config.path"
                    :class="`popover-menu-trigger grade-${config.meta.grade} menu-grade`"
                    :data-path="config.path"
                    @click="toSelectMenuPage(config.path)"
                >
                    <div v-if="config.meta.icon" class="icon-wrapper flex-center">
                        <g-icon
                            :icon="config.meta.icon"
                            :custom-color="isLocalSvgIcon(config.meta.icon)"
                        />
                    </div>
                    <div class="menu-item-content">
                        <g-hint-box :text="config.meta.title" />
                    </div>
                </el-menu-item>
            </template>
        </template>

        <!-- 无子（无分等级，皆为 menu-item） -->
        <template v-else>
            <el-menu-item
                v-bind="$attrs"
                :class="`grade-${config.meta.grade} ${
                    !config.component ? 'no-component' : ''
                } menu-grade`"
                :disabled="!config.component"
            >
                <div v-if="config.meta.icon" class="icon-wrapper flex-center">
                    <g-icon
                        :icon="config.meta.icon"
                        :custom-color="isLocalSvgIcon(config.meta.icon)"
                    />
                </div>
                <template #title>
                    <div class="menu-item-content" :data-path="$attrs.index">
                        <g-hint-box :text="config.meta.title" />
                    </div>
                </template>
            </el-menu-item>
        </template>
    </template>
</template>

<script lang="ts">
export default {
    name: 'AsideMenuItem',
    inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { PropType, inject, watchEffect } from 'vue'
import { RouteConfig } from '@jsjn/types/Route'
import PopperSubMenu from './popperSubMenu/index.vue'
import { useRouter } from 'vue-router'
import { Base64 } from 'js-base64'
import { isLocalSvgIcon } from '@/views/_layout/utils'
import maxGradeKey from '../constant/maxGradeKey'
import isRegtechKey from '@/views/_layout/constant/isRegtechKey'
import collapseKey from '@/views/_layout/constant/collapseKey'

const collapse = inject(collapseKey)
const maxGrade = inject(maxGradeKey)
const isRegtech = inject(isRegtechKey)

const props = withDefaults(
    defineProps<{
        config: RouteConfig
    }>(),
    {
        config: () => ({} as any)
    }
)

const router = useRouter()

// 依据弹框浮出状态，为一级菜单 添加 || 移除 hover
const operationClass = (path: string, type: 'add' | 'remove') => {
    const triggers = document.querySelectorAll('.popover-menu-trigger')
    triggers.forEach((triggerDom) => {
        const dataPath = triggerDom.getAttribute('data-path')
        // 当前触发的元素
        if (dataPath === path) {
            triggerDom.classList[type]('popover-show')

            // 父节点（1级菜单）
            triggerDom.parentElement.parentElement.parentElement.classList[type]('popover-show')
        }
    })
}

// 监管采用菜单选择页的模式
const toSelectMenuPage = (path: string) => {
    const encodePath = Base64.encode(path)
    // 避免分割菜单，造成多余的参数，进行 base64 转义
    router.replace(`/selectMenu/${encodePath}`)
}
</script>

<style lang="scss" scoped></style>
