<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-07 17:07:20
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-28 16:22:17
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-number-range\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <bi-input-number-range v-model="localModelValue" v-bind="inputNumberRangeProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem } from 'element-plus'
import type { FiInputNumberRangeProps } from './type'
import BiInputNumberRange from './index.vue'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'
import { InputValue } from '../input-email'

const COMPONENT_NAME = 'BiFiInputNumberRange'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiInputNumberRangeProps>(), {
    prop: '',
    label: '数字范围',
    required: undefined,
    showMessage: true
})

const elFormItemProps = useFormItemProps(props, [
    // {
    //     type: 'email',
    //     message: '请输入正确的邮箱格式'
    // }
])

const inputNumberRangeProps = useControlProps(props, useAttrs()) as any

const formModel = inject(modelKey)

const modelValue = defineModel<[InputValue, InputValue]>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
