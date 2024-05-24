<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-07 15:16:36
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-22 15:41:24
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-card\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <bi-input-card
            v-model="localModelValue"
            :disabled="disabled"
            :placeholder="placeholder"
            v-bind="$attrs"
        />
        <!-- <el-input v-model="value" /> -->
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRaw, watch, toRef, computed, reactive, ref, inject } from 'vue'
import { ElFormItem } from 'element-plus'
import type { FiInputProps, InputValue } from '../input-email/type'
import BiInputCard from './index.vue'
import { modelKey } from '../../constants'
import { useFormItemProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiInputCard'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiInputProps>(), {
    // placeholder: '请输入身份证号',
    prop: '',
    required: undefined,
    showMessage: true,
    label: '身份证'
})

// const value = ref()

const elFormItemProps = useFormItemProps(props)

// console.log('BiFiInputCard', props, elFormItemProps)

// const rules = [{ required: true, message: 'age is required' }]

const formModel = inject(modelKey)

const modelValue = defineModel<InputValue>({ default: null })

const localModelValue = formModel
    ? toRef(formModel, props.prop as string)
    // : defineModel<InputValue>({ default: null })
    : modelValue

// watch(
//     () => formModel,
//     () => {
//         console.log('formModel', formModel)
//     },
//     {
//         deep: true,
//         immediate: true
//     }
// )
</script>

<style lang="scss" scoped></style>
