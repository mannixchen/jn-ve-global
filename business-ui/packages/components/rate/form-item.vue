<template>
    <el-form-item v-bind="elFormItemProps">
        <el-rate v-model="localModelValue" v-bind="rateProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElRate } from 'element-plus'
import type { FiRateProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiRate'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiRateProps>(), {
    prop: '',
    label: '评分',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const rateProps = useControlProps(props, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<number>({ default: 0 })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
