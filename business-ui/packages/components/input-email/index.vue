<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-12 15:13:34
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-22 14:08:17
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-email\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <g-advance-input
        v-model="localModelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        :suffix-icon="Message"
        v-bind="$attrs"
    />
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, withDefaults } from 'vue'
import BiInputProps from './type'
import { UPDATE_MODEL_EVENT } from '../../constants'
import { InputNumberValue } from '../input-number'
import { Message } from '@element-plus/icons-vue'
import { GAdvanceInput } from 'jn-ve-global'


const COMPONENT_NAME = 'BiInputEmail'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<BiInputProps>(), {
    modelValue: '',
    placeholder: '请输入邮箱'
})

console.log('BiInputEmail')

// const props =defineProps({
//     modelValue: {
//         type: String,
//         default: () => ''
//     }
// })

const emits = defineEmits<{
    // [UPDATE_MODEL_EVENT]: [val: InputNumberValue]
    'update:modelValue': [val: InputNumberValue]
}>()

// const emits = defineEmits([`${UPDATE_MODEL_EVENT}`])

const localModelValue = computed<InputNumberValue>({
    get: (val) => props.modelValue,
    set: (val) => {
        emits(UPDATE_MODEL_EVENT, val)
    }
})
</script>

<style lang="scss" scoped></style>
