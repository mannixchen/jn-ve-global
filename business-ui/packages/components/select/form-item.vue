<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-30 15:48:26
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-31 11:14:14
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\select\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <el-select-v2 v-model="localModelValue" v-bind="selectProps" style="width: 100%;" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElSelectV2 } from 'element-plus'
import type { FiSelectProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiSelect'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiSelectProps>(), {
    prop: '',
    label: '下拉选择',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const selectProps = useControlProps(props, useAttrs()) as any

const formModel = inject(modelKey)

const modelValue = defineModel<string[] | number[]>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
