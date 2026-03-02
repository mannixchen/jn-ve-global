<template>
    <el-form-item v-bind="elFormItemProps">
        <el-cascader v-model="localModelValue" v-bind="cascaderProps" style="width: 100%;" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElCascader } from 'element-plus'
import type { FiCascaderProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiCascader'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiCascaderProps>(), {
    prop: '',
    label: '级联选择',
    required: undefined,
    showMessage: true,
    clearable: true,
    showAllLevels: true,
    teleported: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const cascaderProps = useControlProps(props, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<Array<string | number>>({
    default: null
})

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
