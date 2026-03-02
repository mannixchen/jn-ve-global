<template>
    <el-form-item v-bind="elFormItemProps">
        <bi-checkbox v-model="localModelValue" v-bind="checkboxProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, inject, useAttrs } from 'vue'
import { ElFormItem } from 'element-plus'
import type { FiCheckboxProps } from './type'
import BiCheckbox from './index.vue'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiCheckbox'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiCheckboxProps>(), {
    prop: '',
    label: '复选框',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [
    // {
    //     type: 'email',
    //     message: '请输入正确的邮箱格式'
    // }
])

const checkboxProps = useControlProps(props, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<number[] | string[]>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
