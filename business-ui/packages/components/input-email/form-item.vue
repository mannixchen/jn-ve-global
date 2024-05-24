<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-07 17:07:20
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-16 09:36:44
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-email\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <bi-input-email
            v-model="localModelValue"
            :disabled="disabled"
            :placeholder="placeholder"
            v-bind="$attrs"
        />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, watch, ref, computed, reactive, toRefs, inject } from 'vue'
import { ElFormItem } from 'element-plus'
import type { FiInputProps, InputValue } from '../input-email/type'
import BiInputEmail from './index.vue'
import { modelKey } from '../../constants'
import { useFormItemProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiInputEmail'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiInputProps>(), {
    prop: '',
    label: '邮箱',
    required: undefined,
    showMessage: true
})

const elFormItemProps = useFormItemProps(props, [{
    type: 'email',
    message: '请输入正确的邮箱格式'
}])

const formModel = inject(modelKey)

const modelValue = defineModel<InputValue>({ default: null })

const localModelValue = formModel
    ? toRef(formModel, props.prop as string)
    // : defineModel<InputValue>({ default: null })
    : modelValue
</script>

<style lang="scss" scoped></style>
