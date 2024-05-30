<template>
    <el-form-item v-bind="elFormItemProps">
        <el-tree-select v-model="localModelValue" v-bind="treeSelectProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElTreeSelect } from 'element-plus'
import type { FiTreeSelectProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiTreeSelect'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiTreeSelectProps>(), {
    prop: '',
    label: '树形选择',
    required: undefined,
    showMessage: true,
    reserveKeyword: true,
    persistent: true,
    validateEvent: true,

    renderAfterExpand: true,
    expandOnClickNode: true,
    autoExpandParent: true
})

const elFormItemProps = useFormItemProps(props as any, [])

const treeSelectProps = useControlProps(props as any, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<string | number | Array<string | number> | boolean>({
    default: null
})

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
