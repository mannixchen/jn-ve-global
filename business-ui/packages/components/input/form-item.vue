<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-07 17:07:20
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-30 14:13:36
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <g-advance-input v-model="localModelValue" v-bind="inputProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { GAdvanceInput } from 'jn-ve-global'
import { ElFormItem } from 'element-plus'
import type { BiAdvanceInputProps, BiFiAdvanceInputProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiAdvanceInput'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<BiFiAdvanceInputProps>(), {
    prop: '',
    label: '输入框',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props as any, [
    // {
    //     type: 'email',
    //     message: '请输入正确的邮箱格式'
    // }
])

const inputProps = useControlProps(props as any, useAttrs()) as any

const formModel = inject(modelKey)

const modelValue = defineModel<string | number>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
