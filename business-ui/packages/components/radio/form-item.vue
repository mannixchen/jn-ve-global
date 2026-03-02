<template>
    <el-form-item v-bind="elFormItemProps">
        <bi-radio v-model="localModelValue" v-bind="radioProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, inject, useAttrs } from 'vue'
import { ElFormItem } from 'element-plus'
import type { FiRadioProps } from './type'
import BiRadio from './index.vue'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiRadio'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiRadioProps>(), {
    prop: '',
    label: '单选框',
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

const radioProps = useControlProps(props, useAttrs()) as any

const formModel = inject(modelKey)

const modelValue = defineModel<string | number | boolean>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
