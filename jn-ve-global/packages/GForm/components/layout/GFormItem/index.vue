<template>
    <ElFormItem
        v-if="formItemConfig"
        :class="currentClasss"
        v-bind="elFormItemProps"
        :label-width="labelWidth"
    >
        <!-- 自定义 label -->
        <template v-if="formItemConfig.label" #label>
            <FormItemLabelTip
                v-if="formItemConfig.tip && formItemConfig.tipPosition === 'label'"
                :content="formItemConfig.tip"
                :icon="formItemConfig.tipIcon"
                :popper-class="formItemConfig.tipPopperClass"
                :placement="formItemConfig.tipPlacement"
            />

            <!-- 组件 || jsx 元素 -->
            <component :is="formItemConfig.label" v-if="isVNode(formItemConfig.label)" />

            <!-- 文本 -->
            <span v-if="_.isString(formItemConfig.label)">
                {{ formItemConfig.label }}
            </span>

            <!-- tsx -->
            <FunctionalComponent
                v-if="_.isFunction(formItemConfig.label)"
                :render="formItemConfig.label()"
            />
        </template>

        <slot
            :item-config="(formItemConfig as FormItemProps)"
            :scope-form-config="rootFormConfig"
            :vmodel="(toRef(rootFormConfig.model, formItemConfig.prop) as Ref<any>)"
        >
            <!-- 优先级1：自定义 Render 控件 -->
            <template v-if="formItemConfig.render">
                <FunctionalComponent
                    :render="
                        formItemConfig.render(
                            toRef(rootFormConfig.model, formItemConfig.prop),
                            formItemConfig.prop,
                            rootFormConfig
                        )
                    "
                />
            </template>

            <!-- 优先级2：配置式控件（组） -->
            <template
                v-else-if="
                    formItemConfig.controlConfigs && formItemConfig.controlConfigs.length > 0
                "
            >
                <FormItemControlGroup
                    :form-item-config="formItemConfig"
                    :control-configs="formItemConfig.controlConfigs"
                    :source-model="rootFormConfig.model"
                    :prop-key="formItemConfig.prop"
                />
            </template>

            <!-- 优先级3：配置式控件（单） -->
            <template v-else-if="formItemConfig.controlConfig">
                <FormItemControl
                    :form-item-config="formItemConfig"
                    :control-config="formItemConfig.controlConfig"
                    :prop="toRef(rootFormConfig.model, formItemConfig.prop)"
                />
            </template>
        </slot>

        <!-- 提醒：append -->
        <FormItemLabelTip
            v-if="formItemConfig.tip && formItemConfig.tipPosition !== 'label'"
            :content="formItemConfig.tip"
            :icon="formItemConfig.tipIcon"
            :popper-class="formItemConfig.tipPopperClass"
            :placement="formItemConfig.tipPlacement"
        />

        <!-- 字段变更历史 -->
        <ElTooltip
            v-if="currentFieldHistoryInfo"
            :content="`修改前值：${currentFieldHistoryInfo.old}`"
        >
            <span class="item-tip log">
                <LGIcon icon="xhx-public-tip-info" />
            </span>
        </ElTooltip>
    </ElFormItem>
</template>

<script lang="ts" setup>
import { toRef, computed, isVNode, inject, type Ref } from 'vue'
import _ from 'lodash'
import type { FormItemProps } from '../../../interface'
import { ElFormItem, ElTooltip } from 'element-plus'
import useHistoryLog from './hooks/useHistoryLog'
import useArgAdvance from './hooks/useArgAdvance'
import { GIcon as LGIcon } from '../../../../GIcon'

// 组件
import FunctionalComponent from '../../../../FunctionalComponent'
import FormItemControl from './components/formItemControl.vue'
import FormItemControlGroup from './components/formItemControlGroup.vue'
import FormItemLabelTip from './components/labelTip.vue'

import formConfigProvideKey from '../../../constant/formConfigProvideKey'

defineOptions({
    name: 'GFormItem'
})

const props = withDefaults(
    defineProps<{
        /**
         * 表单 item 配置参数
         */
        formItemConfig: FormItemProps
    }>(),
    {
        formItemConfig: null
    }
)

const rootFormConfig = inject(formConfigProvideKey)

// 字段配置属性包装
useArgAdvance({ ...props, formConfig: rootFormConfig.value })

// 字段历史变更记录
const { currentFieldHistoryInfo } = useHistoryLog({
    formConfig: rootFormConfig.value,
    formItemConfig: props.formItemConfig
})

const currentClasss = computed(() => {
    const type = props.formItemConfig?.controlConfig?.type

    return {
        'no-colon': rootFormConfig.value?.colon === false || props.formItemConfig?.colon === false,
        'g-form-item': true,
        'show-tip': props.formItemConfig.tip || currentFieldHistoryInfo,
        'field-log-tip': currentFieldHistoryInfo.value,
        [`tip-${props.formItemConfig.tipPosition || 'append'}`]: props.formItemConfig.tip,
        'no-margin-b': ['table', 'collapseItem'].includes(type),
        'no-label': ['collapseItem', 'placeholder'].includes(type)
    }
})

// 没有 label 的控件列表：将 labelWidth 置为 0
const labelWidth = computed(() => {
    if (!props.formItemConfig.label) return '0px'
    if (props.formItemConfig.labelWidth) return props.formItemConfig.labelWidth
    if (rootFormConfig.value?.labelWidth) return rootFormConfig.value.labelWidth
    return 'auto'
})

// el-form-item 的配置
const elFormItemProps = computed<any>(() => {
    const {
        // 组件库扩展属性
        label,
        hide,
        group,
        render,
        controlConfigs,
        controlConfig,
        span,
        offset,
        xs,
        sm,
        md,
        lg,
        xl,
        tip,

        // 剩余原生 element 有效属性
        ...formItemProps
    } = props.formItemConfig
    return formItemProps
})
</script>
