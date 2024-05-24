<template>
    <el-form-item v-bind="elFromItemProps">
        <slot />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs, inject } from 'vue'
import { ElFormItem, FormItemProp as ElFormItemProps } from 'element-plus'
import { BiFormItemProps } from './type'
import { modelKey } from '../../constants'

const COMPONENT_NAME = 'BiFormItem'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<BiFormItemProps>(), {
    prop: ''
})

const elFromItemProps = computed(() => {
    const {
        prop,
        label,
        labelWidth,
        required,
        rules,
        error,
        showMessage,
        inlineMessage,
        size,
        validateStatus
    } = props
    return {
        prop,
        label,
        labelWidth,
        required,
        rules,
        error,
        showMessage,
        inlineMessage,
        size,
        validateStatus
    }
})

const controlProps = computed(() => {
    const {
        prop,
        label,
        labelWidth,
        required,
        rules,
        error,
        showMessage,
        inlineMessage,
        size,
        validateStatus,
        ...restProps
    } = props

    return restProps
})

const formModel = inject(modelKey)

const modelValue = defineModel<any>({ default: null })

const localModelValue = formModel ? formModel?.[props.prop as string] : modelValue
</script>

<style lang="scss" scoped></style>
