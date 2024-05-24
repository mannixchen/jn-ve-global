<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-22 14:16:56
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-23 11:17:30
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\form-item.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
-->
<template>
    <el-form-item v-bind="elFormItemProps">
        <bi-detail ref="detailRef" v-model="localModelValue" v-bind="detailProps" slot-from-parent>
            <slot />
        </bi-detail>
    </el-form-item>
</template>

<script lang="ts" setup>
import { toRef, watch, ref, computed, reactive, toRefs, inject } from 'vue'
import { ElFormItem } from 'element-plus'
import type { FiDetailProps, DetailProps } from './type'
import BiDetail from './index.vue'
import { modelKey } from '../../constants'
import { useFormItemProps, useControlProps } from '../../hooks'
import { useDefaultProps } from './hooks'

const COMPONENT_NAME = 'BiFiDetail'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FiDetailProps>(), {
    prop: '',
    label: '明细',
    required: undefined,
    showMessage: true,
    ...useDefaultProps()
} as any)

const elFormItemProps = useFormItemProps(props as any, [
    {
        asyncValidator: async (rule, value, callback, source, options) => {
            if (!detailRef.value?.forms?.length) return callback()
            await Promise.all(detailRef.value?.forms?.map((item) => item?.instance?.validate())).then(
                (res) => {
                    return callback()
                }
            ).catch(() => {
                return callback(new Error(''))
            })
        }
    }
])

const detailProps = useControlProps(props as any) as any
const detailRef = ref()

// console.log('BiFiDetail', props, detailProps)

const formModel = inject(modelKey)

const modelValue = defineModel<FiDetailProps['modelValue']>({ default: [] })

const localModelValue = formModel ? toRef(formModel, props.prop as string) : modelValue
</script>

<style lang="scss" scoped></style>
