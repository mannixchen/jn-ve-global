<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-29 14:41:25
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-30 15:18:24
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\transfer\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <el-transfer v-model="localModelValue" v-bind="transferProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElTransfer } from 'element-plus'
import type { FiTransferProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiTransfer'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiTransferProps>(), {
    prop: '',
    label: '穿梭框',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const transferProps = useControlProps(props, useAttrs())
console.log('transferProps', transferProps)

const formModel = inject(modelKey)

const modelValue = defineModel<Array<string | number>>({
    default: []
})

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
