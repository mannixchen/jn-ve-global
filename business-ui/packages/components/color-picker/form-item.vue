<template>
    <el-form-item v-bind="elFormItemProps">
        <el-color-picker v-model="localModelValue" v-bind="inputEmailProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElColorPicker } from 'element-plus'
import type { FiColorPickerProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiColorPicker'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiColorPickerProps>(), {
    prop: '',
    label: '取色器',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const inputEmailProps = useControlProps(props, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<string>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
