<template>
    <el-collapse
        :id="id"
        ref="collapseRef"
        v-model="localModelValue"
        v-bind="$attrs"
        :disabled="localDisabled"
        :class="['custom-collapse', `${mode}-mode`]"
    >
        <slot />
    </el-collapse>

    <ul
        v-if="collapseItemModels?.length"
        :class="['cpllapse-nav-bars__wrapper', { 'is-packup': isPackup }]"
    >
        <el-scrollbar ref="anchorWrapperRef" :max-height="anchorWrapperMaxH">
            <template v-for="item in collapseItemModels" :key="item.top">
                <li :class="{ 'is-active': item.isActive }" @click="handleNav(item as any)">
                    <span>{{ item.label }}</span>
                </li>
            </template>
        </el-scrollbar>
        <li class="back-top" @click="backTop">
            <span>返回顶部</span>
        </li>

        <li class="packup-trigger" @click="isPackup = !isPackup">
            <span>
                <g-icon :icon="isPackup ? 'el-ArrowLeftBold' : 'el-ArrowRightBold'" />
            </span>
        </li>
    </ul>
</template>

<script lang="ts">
export default {
    name: 'GCollapse'
}
</script>
<script lang="ts" setup>
import { computed, provide, useSlots, ref, onMounted, shallowRef, watch } from 'vue'
import disabledKey from './constant/disabledKey'
import modeKey from './constant/modeKey'
import { ElCollapse } from 'element-plus'
import useAnchor from './hooks/useAnchor'

const props = withDefaults(
    defineProps<{
        modelValue: string | string[]
        /**
         * 模式
         *  - card 卡片
         *  - panel 面板
         */
        mode?: 'card' | 'panel'
        /**
         * 禁用下属所有节点
         */
        disabled?: boolean
        /**
         * 是否显示导航条
         */
        showNavBars?: boolean
        /**
         * 可选父容器，默认值取直接父容器
         */
        parent?: HTMLElement
    }>(),
    {
        mode: 'panel',
        disabled: undefined,
        showNavBars: false,
        parent: null
    }
)

const emits = defineEmits(['update:modelValue'])

const localModelValue = computed({
    get: () => props.modelValue,
    set(val) {
        emits('update:modelValue', val)
    }
})

const localDisabled = computed(() => (props.mode === 'card' ? true : props.disabled))
const localMode = computed(() => props.mode)
provide(disabledKey, localDisabled)
provide(modeKey, localMode)

const {
    id,
    collapseItemModels,
    handleNav,
    collapseRef,
    backTop,
    anchorItemHeight,
    anchorWrapperMaxH,
    anchorWrapperRef,
    isPackup
} = useAnchor({
    props
})
</script>
<style lang="scss" scoped>
.custom-collapse {
    border: none !important;
}

.cpllapse-nav-bars__wrapper {
    --bars-w: 180px;
    --bar-radius: 6px;
    --packup-w: 40px;

    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: var(--bars-w);
    z-index: 1999;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
    border-radius: var(--bar-radius);
    transition: all 0.3s;

    // 收起的
    &.is-packup {
        box-sizing: border-box;
        transform: translate(calc(var(--bars-w) - var(--packup-w)), -50%);
        padding-left: var(--packup-w);

        .packup-trigger {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
        }
    }

    li {
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #4e5966;
        font-size: 18px;
        text-align: center;
        font-weight: 600;
        line-height: v-bind(anchorItemHeight);
        height: v-bind(anchorItemHeight);
        padding: 0 10px;
        cursor: pointer;
        border-radius: var(--bar-radius);
        transition: background-color 0.3s;

        &.is-active,
        &:hover {
            background-color: #2f93f7;
            border-radius: var();
            color: #fff;
        }

        &.back-top,
        &.packup-trigger {
            color: #558dfd !important;
            background-color: #fff;
        }

        &.packup-trigger {
            &,
            > span {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            span {
                width: 25px;
                height: 25px;
                line-height: 25px;
                text-align: center;
                border: 2px solid #4e5966;
                border-radius: 50%;
                color: #4e5966;
                transition: all 0.2s;
            }

            &:hover {
                span {
                    color: #558dfd;
                    border-color: #558dfd;
                }
            }
        }
    }
}
</style>
