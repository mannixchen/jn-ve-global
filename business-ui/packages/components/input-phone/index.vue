<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-12 15:13:34
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-31 14:26:43
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-phone\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <g-advance-input
        v-model="localModelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        :suffix-icon="Phone"
        v-bind="$attrs"
    />
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, withDefaults } from 'vue'
import BiInputProps, { InputValue } from '../input-email/type'
import { UPDATE_MODEL_EVENT } from '../../constants'
import { Phone } from '@element-plus/icons-vue'
import { GAdvanceInput } from 'jn-ve-global'

const COMPONENT_NAME = 'BiInputPhone'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<BiInputProps>(), {
    modelValue: '',
    placeholder: '请输入电话号码'
})

// console.log(COMPONENT_NAME)

// const props =defineProps({
//     modelValue: {
//         type: String,
//         default: () => ''
//     }
// })

const emits = defineEmits<{
    // [UPDATE_MODEL_EVENT]: [val: InputNumberValue]
    'update:modelValue': [val: InputValue]
}>()

// const emits = defineEmits([`${UPDATE_MODEL_EVENT}`])

const localModelValue = computed<InputValue>({
    get: (val) => props.modelValue,
    set: (val) => {
        emits(UPDATE_MODEL_EVENT, val)
    }
})
</script>

<style lang="scss" scoped></style>
