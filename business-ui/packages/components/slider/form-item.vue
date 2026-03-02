<template>
    <el-form-item v-bind="elFormItemProps">
        <el-slider v-model="localModelValue" v-bind="sliderProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElSlider } from 'element-plus'
import type { FiSliderProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiSlider'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiSliderProps>(), {
    prop: '',
    label: '滑块',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const sliderProps = useControlProps(props, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<number | number[]>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
