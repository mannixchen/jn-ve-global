<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-12 16:22:02
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-09 09:34:45
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\radio\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-radio-group v-model="localModelValue" :disabled="disabled" v-bind="$attrs">
        <template v-for="(optionProps, index) in options" :key="`${optionProps.value}-${index}`">
            <el-radio v-bind="optionProps" />
        </template>
    </el-radio-group>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs, withDefaults } from 'vue'
import { BiRadioProps } from './type'
import { ElRadio, ElRadioGroup } from 'element-plus'
import { RadioOptionProps } from 'jn-ve-global'
// import { UPDATE_MODEL_EVENT } from '../../constants'

const COMPONENT_NAME = 'BiRadio'
defineOptions({
    name: COMPONENT_NAME
})

console.log(COMPONENT_NAME)

const props = withDefaults(defineProps<BiRadioProps>(), {
    modelValue: ''
})

// const props =defineProps({
//     modelValue: {
//         type: String,
//         default: () => ''
//     },
//     disabled: {
//         type: Boolean,
//         default: () => false
//     },
//     options: {
//         type: Array<any>,
//         default: () => []
//     }
// })

// const emits = defineEmits<{
//     [UPDATE_MODEL_EVENT]: [val: string | number | boolean]
// }>()

const disabled = computed<boolean>(() => props.disabled)

const options = computed<RadioOptionProps[]>(() => props.options)

// const localModelValue = computed<string | number | boolean>({
//     get: () => props.modelValue,
//     set: (val) => {
//         emits(UPDATE_MODEL_EVENT, val)
//     }
// })
const localModelValue = defineModel<string | number | boolean>({ default: '' })
</script>

<style lang="scss" scoped></style>
