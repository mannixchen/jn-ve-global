<template>
    <ElCollapseItem
        v-bind="$attrs"
        :disabled="localDisabled"
        :class="[
            'custom-collapse-item',
            `${collapseMode}-mode-item`,
            { 'is-shadow': shadow },
            `${collapsStyleMode}-style-mode`
        ]"
    >
        <template #title>
            <div class="collapse-item-title">
                <div class="label">
                    <LGIcon v-if="prefix" :icon="prefix" class="prefix-icon" />

                    <!-- 事业部的风格修改 -->
                    <LGIcon
                        v-if="collapsStyleMode === ('syb' as any)"
                        icon="syb-collpase-icon"
                        class="active-icon"
                    />

                    <slot name="title">
                        <span class="label__text">{{ attrs.title }}</span>

                        <ElTooltip
                            v-if="tip"
                            :content="tip"
                            class="box-item"
                            effect="dark"
                            placement="top"
                        >
                            <span class="tooltip__trigger">
                                <LGIcon icon="el-QuestionFilled" />
                            </span>
                        </ElTooltip>
                    </slot>

                    <LGIcon
                        v-if="collapsStyleMode !== ('syb' as any)"
                        :icon="isRegtech ? 'el-ArrowRight' : 'el-DArrowRight'"
                        class="active-icon"
                    />
                </div>

                <div class="right-oper__slot__wrapper">
                    <slot name="right-oper">
                        <LGButtonGroup
                            v-if="btns && btns.length"
                            :btns="btns"
                            @click.stop="void 0"
                        />
                    </slot>
                </div>
            </div>
        </template>

        <!-- 内容 -->
        <template #default>
            <!-- 表单 -->
            <div v-if="formConfig" class="form-wrapper">
                <LGForm :config="formConfig" />
            </div>

            <!-- 表格 -->
            <div v-if="tableConfig" class="table-wrapper">
                <LGTable :config="tableConfig" />
            </div>

            <!-- 自定义 -->
            <slot />
        </template>
    </ElCollapseItem>
</template>

<script lang="ts">
export default {
    name: 'GCollapseItem'
}
</script>

<script lang="ts" setup>
import { inject, computed, useAttrs } from 'vue'
import disabledKey from '../../constant/disabledKey'
import modeKey from '../../constant/modeKey'

import { ElCollapseItem, ElTooltip } from 'element-plus'
import { GIcon as LGIcon } from '../../../GIcon'
import { GButtonGroup as LGButtonGroup, type BtnProps } from '../../../GButtonGroup'
import { GForm as LGForm, type FormProps } from '../../../GForm'
import { GTable as LGTable, type TableConfig } from '../../../GTable'
import { getCollapseMode } from '../../../_globalConstant/CollapseMode'
import { Bases } from '../../../setting'
import { getBase } from '../../../_globalConstant/base'

export interface Props {
    /**
     * 表单配置
     */
    formConfig?: FormProps
    /**
     * 表格配置
     */
    tableConfig?: TableConfig<any>
    /**
     * 高度，表格可能需要最小高度
     */
    height?: number
    /**
     * 前缀图标
     */
    prefix?: string
    /**
     * 禁用
     */
    disabled?: boolean
    /**
     * 按钮
     */
    btns?: BtnProps[]
    /**
     * 卡片模式，区分背景时，提供盒子阴影
     */
    shadow?: boolean
    /**
     * 标题 tip
     */
    tip?: string
}

const props = withDefaults(defineProps<Props>(), {
    formConfig: null,
    tableConfig: null,
    height: 300,
    prefix: '',
    disabled: undefined,
    btns: () => [],
    shadow: false
})

// 是否监管基座
const isRegtech = computed(() => getBase() === Bases.REGTECH)

// 样式模式
const collapsStyleMode = getCollapseMode()

const attrs = useAttrs()
const tableHeight = computed(() => `${props.height}px`)
const isDisabledForParent = inject(disabledKey)
const collapseMode = inject(modeKey)
const localDisabled = computed(() => isDisabledForParent.value ?? props.disabled)
</script>

<style lang="scss">
@import './styles/panel.scss';
@import './styles/card.scss';
@import './styles/theme.scss';

.custom-collapse-item {
    .table-wrapper {
        height: v-bind(tableHeight);
    }

    .collapse-item-title {
        --jn-ve-g-btn-height: 30px;

        width: 100%;
        justify-content: space-between;

        &,
        > .label {
            display: flex;
            align-items: center;

            .tooltip__trigger {
                display: flex;
                align-items: center;
                padding-left: 10px;
                color: var(--el-collapse-header-text-color);
                font-size: 18px;
            }
        }
    }
}
</style>
