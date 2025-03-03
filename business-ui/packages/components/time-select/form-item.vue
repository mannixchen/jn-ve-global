<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-29 13:55:57
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-30 15:21:53
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\time-select\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <el-time-select v-model="localModelValue" v-bind="timeSelectProps" style="width: 100%;" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { ElFormItem, ElTimeSelect } from 'element-plus'
import type { FiTimeSelectProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiTimeSelect'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiTimeSelectProps>(), {
    prop: '',
    label: '时间下拉选择',
    required: undefined,
    showMessage: true,
    validateEvent: true
})

const elFormItemProps = useFormItemProps(props, [])

const timeSelectProps = useControlProps(props, useAttrs())

const formModel = inject(modelKey)

const modelValue = defineModel<string>({
    default: null
})

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
