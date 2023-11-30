<template>
    <ElFormItem
        v-if="formConfig && formItemConfig"
        :class="{
            'no-colon': formConfig.colon === false,
            'g-form-item': true,
            'show-tip': formItemConfig.tip || currentFieldHistoryInfo,
            'field-log-tip': currentFieldHistoryInfo,
            [`tip-${formItemConfig.tipPosition || 'append'}`]: formItemConfig.tip,
            'no-margin-b':
                (formItemConfig?.controlConfig?.type as any) === 'table' ||
                formItemConfig?.controlConfig?.type === 'collapseItem',
            'no-label':
                formItemConfig?.controlConfig?.type === 'collapseItem' ||
                formItemConfig?.controlConfig?.type === 'placeholder'
        }"
        v-bind="(elFormItemProps as any)"
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

        <!-- 优先级1：自定义 Render 控件 -->
        <template v-if="formItemConfig.render">
            <FunctionalComponent
                :render="
                    formItemConfig.render(
                        toRef(formConfig.model, formItemConfig.prop),
                        formItemConfig.prop
                    )
                "
            />
        </template>

        <!-- 优先级2：配置式控件（组） -->
        <template
            v-else-if="formItemConfig.controlConfigs && formItemConfig.controlConfigs.length > 0"
        >
            <FormItemControlGroup
                :form-item-config="formItemConfig"
                :control-configs="formItemConfig.controlConfigs"
                :source-model="formConfig.model"
                :prop-key="formItemConfig.prop"
            />
        </template>

        <!-- 优先级3：配置式控件（单） -->
        <template v-else-if="formItemConfig.controlConfig">
            <FormItemControl
                :form-item-config="formItemConfig"
                :control-config="formItemConfig.controlConfig"
                :prop="toRef(formConfig.model, formItemConfig.prop)"
            />
        </template>

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

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GFormItem'
})
</script>

<script lang="ts" setup>
import { toRef, computed, isVNode } from 'vue'
import type { FormProps, FormItemProps } from '../../interface'
import _ from 'lodash'
import { ElFormItem, ElTooltip } from 'element-plus'
import useHistoryLog from './hooks/useHistoryLog'
import useArgAdvance from './hooks/useArgAdvance'
import { GIcon as LGIcon } from '../../../GIcon'

// 组件
import FunctionalComponent from '../../../FunctionalComponent'
import FormItemControl from '../formItemControl.vue'
import FormItemControlGroup from '../formItemControlGroup.vue'
import FormItemLabelTip from './components/labelTip.vue'

const props = withDefaults(
    defineProps<{
        /**
         * 表单 item 配置参数
         */
        formItemConfig: FormItemProps
        /**
         * 表单配置对象
         */
        formConfig: FormProps
    }>(),
    {
        formItemConfig: null,
        formConfig: null
    }
)

// 字段配置属性包装
useArgAdvance(props)

// 字段历史变更记录
const { currentFieldHistoryInfo } = useHistoryLog({
    formConfig: props.formConfig,
    formItemConfig: props.formItemConfig
})

// 没有 label 的控件列表：将 labelWidth 置为 0
const labelWidth = computed(() => {
    if (!props.formItemConfig.label) return '0px'
    if (props.formItemConfig.labelWidth) return props.formItemConfig.labelWidth
    if (props.formConfig?.labelWidth) return props.formConfig.labelWidth
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

        // 拖拽平台扩展属性
        selected,
        default: defaultval,
        _control_propertys_,
        _events_provide_,
        _events_holding_,
        _extend_properties_,

        // 剩余原生 element 有效属性
        ...formItemProps
    } = props.formItemConfig
    return formItemProps
})
</script>

<style lang="scss" scoped></style>
