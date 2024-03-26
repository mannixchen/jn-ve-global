<template>
    <ElCollapse
        :id="id"
        ref="collapseRef"
        v-model="localModelValue"
        v-bind="$attrs"
        :disabled="localDisabled"
        :class="['custom-collapse', `${mode}-mode`, { 'is-show-anchor': showNavBars }]"
    >
        <slot />
    </ElCollapse>

    <ul
        v-if="collapseItemModels?.length"
        :class="['cpllapse-nav-bars__wrapper', { 'is-packup': isPackup }, collapsStyleMode]"
    >
        <ElScrollbar ref="anchorWrapperRef" :max-height="anchorWrapperMaxH">
            <template v-for="item in collapseItemModels" :key="item.top">
                <li :class="{ 'is-active': item.isActive }" @click="handleNav(item as any)">
                    <span>{{ item.label }}</span>
                </li>
            </template>
        </ElScrollbar>

        <li class="back-top" @click="backTop">
            <LGIcon v-if="collapsStyleMode === 'syb'" icon="el-Download" class="back-top-icon" />
            <span>返回顶部</span>
        </li>

        <li class="packup-trigger" @click="isPackup = !isPackup">
            <span>
                <LGIcon :icon="isPackup ? 'el-ArrowLeftBold' : 'el-ArrowRightBold'" />
            </span>
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GCollapse'
})
</script>
<script lang="ts" setup>
import { computed, provide } from 'vue'
import disabledKey from './constant/disabledKey'
import modeKey from './constant/modeKey'
import { ElCollapse, ElScrollbar } from 'element-plus'
import useAnchor from './hooks/useAnchor'
import { GIcon as LGIcon } from '../GIcon'
import { getCollapseMode } from '../_globalConstant/CollapseMode'

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

// 样式模式
const collapsStyleMode = getCollapseMode()

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

.is-show-anchor {
    position: relative;
}

.cpllapse-nav-bars__wrapper {
    --navbar-zindex: 1999;
    --bars-w: 160px;
    --bar-radius: 6px;
    --packup-w: 40px;
    --trigger-size: 25px;
    --trigger-color: #4e5966;

    position: fixed;
    top: 55%;
    transform: translateY(-50%);
    right: 0;
    width: var(--bars-w);
    z-index: var(--navbar-zindex);
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
    border-radius: var(--bar-radius);
    transition: all 0.3s;

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
        font-size: 16px;
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
                width: var(--trigger-size);
                height: var(--trigger-size);
                line-height: var(--trigger-size);
                text-align: center;
                border: 2px solid var(--trigger-color);
                border-radius: 50%;
                color: var(--trigger-color);
                transition: all 0.2s;
            }

            &:hover {
                span {
                    --trigger-color: #558dfd;
                }
            }
        }
    }

    &.syb {
        --bars-w: 150px;

        background: #ffffff;
        box-shadow: 0px 0px 10px 0px rgba(201, 201, 201, 0.5);
        border-radius: 6px 0px 0px 6px;

        &.is-packup {
            box-sizing: border-box;
            transform: translate(var(--bars-w), -50%);
            padding-left: 0;
        }

        li {
            font-size: 14px;
            text-align: left;
            padding-left: 26px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            position: relative;

            &:hover,
            &.is-active {
                background-color: transparent;
                color: #0091ff;
            }

            &.is-active {
                font-weight: 600;

                &::before {
                    content: '';
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: transparent;
                    border: 2px solid rgba(0, 145, 255, 1);
                    display: block;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 10px;
                    box-sizing: border-box;
                }
            }
        }

        .back-top {
            border-top: 1px solid #f7f7f7;
            color: #0091ff;
            letter-spacing: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0;
            padding: 0;

            span {
                margin-left: 4px;
            }

            .back-top-icon {
                font-size: 18px;
                transform: rotate(180deg);
            }
        }

        .packup-trigger {
            --trigger-w: 26px;

            padding: 0 !important;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
            left: calc(-1 * var(--trigger-w));
            width: var(--trigger-w);
            height: 60px;
            box-shadow: var(--el-box-shadow-dark);
            background-image: linear-gradient(180deg, #3aaaff 0%, #0493ff 99%);
            border-radius: 6px 0 0 6px;
            z-index: -1;

            span {
                --trigger-color: #fff;
                --trigger-size: 18px;
                font-size: 12px !important;
            }

            &:hover {
                span {
                    --trigger-color: #fff;
                }
            }
        }
    }
}
</style>
