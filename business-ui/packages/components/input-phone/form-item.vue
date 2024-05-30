<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-07 15:16:36
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-28 16:12:17
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-phone\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <bi-input-phone v-model="localModelValue" v-bind="inputPhoneProps" />
        <!-- <el-input v-model="value" /> -->
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem } from 'element-plus'
import type { FiInputProps, InputValue } from '../input-email/type'
import BiInputPhone from './index.vue'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiInputCard'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiInputProps>(), {
    // placeholder: '请输入身份证号',
    prop: '',
    required: undefined,
    showMessage: true,
    label: '电话'
})

const elFormItemProps = useFormItemProps(props)

const inputPhoneProps = useControlProps(props, useAttrs()) as any

const formModel = inject(modelKey)

const modelValue = defineModel<InputValue>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
