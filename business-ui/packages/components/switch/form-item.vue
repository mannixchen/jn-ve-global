<template>
    <el-form-item v-bind="elFormItemProps">
        <el-switch v-model="localModelValue" v-bind="switchProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElSwitch } from 'element-plus'
import type { FiSwitchProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiSwitch'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiSwitchProps>(), {
    prop: '',
    label: '开关',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const switchProps = useControlProps(props, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<string | number | boolean>({ default: false })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
