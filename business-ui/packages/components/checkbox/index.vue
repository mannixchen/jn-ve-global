<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-14 10:37:37
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-22 14:05:49
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\checkbox\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-checkbox-group v-model="localModelValue" :disabled="disabled" v-bind="$attrs">
        <template v-for="(checkboxOptionProps, index) in options" :key="`${checkboxOptionProps.value}-${index}`">
            <el-checkbox v-bind="checkboxOptionProps" />
        </template>
    </el-checkbox-group>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs, withDefaults } from 'vue'
import { BiCheckboxProps, CheckboxOptionProps } from './type'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'
// import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
// import { UPDATE_MODEL_EVENT } from '../../constants'

const COMPONENT_NAME = 'BiCheckbox'
defineOptions({
    name: COMPONENT_NAME
})

console.log(COMPONENT_NAME)

const props = withDefaults(defineProps<BiCheckboxProps>(), {})

// const props =defineProps({
//     modelValue: {
//         type: String,
//         default: () => null
//     }
// })

// const emits = defineEmits<{
//     [UPDATE_MODEL_EVENT]: [val: string | number | boolean]
// }>()

const disabled = computed<boolean>(() => props.disabled)

const options = computed<CheckboxOptionProps[]>(() => props.options)

// const localModelValue = computed<string | number | boolean>({    
//     get: () => props.modelValue,
//     set: (val) => {  
//         emits(UPDATE_MODEL_EVENT, val)
//     }
// })
const localModelValue = defineModel<string[] | number[]>()
</script>

<style lang="scss" scoped></style>
