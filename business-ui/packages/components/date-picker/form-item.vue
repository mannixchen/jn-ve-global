<template>
    <el-form-item v-bind="elFormItemProps">
        <el-date-picker v-model="localModelValue" v-bind="datePickerProps" style="width: 100%;" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElDatePicker } from 'element-plus'
import type { FiDatePickerProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiDatePicker'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiDatePickerProps>(), {
    prop: '',
    label: '日期选择',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const datePickerProps = useControlProps(props, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<Date | [Date, Date] | [string, string]>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
