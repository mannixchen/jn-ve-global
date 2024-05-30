<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-30 11:08:29
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-30 11:36:10
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\upload\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <g-upload v-model="localModelValue" v-bind="uploadProps" />
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, useAttrs, inject } from 'vue'
import { GUpload } from 'jn-ve-global'
import { ElFormItem } from 'element-plus'
import type { BiFiUploadProps } from './type'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'

const COMPONENT_NAME = 'BiFiUpload'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<BiFiUploadProps>(), {
    prop: '',
    label: '上传文件',
    required: undefined,
    showMessage: true,
    showFileList: true,
    autoUpload: true
})

const elFormItemProps = useFormItemProps(props, [
    // {
    //     type: 'email',
    //     message: '请输入正确的邮箱格式'
    // }
])

const uploadProps = useControlProps(props, useAttrs()) as any

const formModel = inject(modelKey)

const modelValue = defineModel<string[] | number[]>({ default: null })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
