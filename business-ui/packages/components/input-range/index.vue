<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-20 17:08:10
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-01 10:23:04
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-range\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div :class="[ns.b(), nsInput.e('wrapper')]">
        <slot name="prepend" />
        <slot name="start" v-bind="$attrs" />
        <slot name="range-separator">
            <span :class="nsRange.b('separator')">{{ rangeSeparator }}</span>
        </slot>
        <slot name="end" v-bind="$attrs" />
        <slot name="suffix" />
        <!-- <div v-if="clearable" :class="ns.e('clear')" @click="clear">
            <el-icon>
                <CircleClose />
            </el-icon>
        </div> -->
        <slot name="append" />
    </div>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import { InputRangeProps } from './type'
import { useNamespace } from '../../hooks'
// import { CircleClose } from '@element-plus/icons-vue'

const COMPONENT_NAME = 'BiInputRange'
defineOptions({
    name: COMPONENT_NAME
})

const ns = useNamespace('input-range')
const nsRange = useNamespace('range')
const nsInput = useNamespace('input')

const props = withDefaults(defineProps<InputRangeProps>(), {
    rangeSeparator: '-'
})
// const separator = computed(() => props.rangeSeparator)
console.log(COMPONENT_NAME, props)

const emits = defineEmits<{
    clear: [val?: any]
    // input: [val: string | number]
    // change: [start: string | number, end: string | number]
}>()

// let startValue: string | number, endValue: string | number

// const setValue = (start: string | number, end: string | number) => {
//     if (
//         [null, undefined, ''].includes(start as string) &&
//         [null, undefined, ''].includes(end as string) &&
//         Number(start) > Number(end)
//     ) {
//         start = end
//     }
// }

// const handleStartInput = (val: string | number) => {
//     console.log('handleStartInput', val)
//     setValue(val, endValue)
//     startValue = val
//     emits('input', val)
// }

// const handleEndInput = (val) => {
//     setValue(startValue, val)
//     endValue = val
//     emits('input', val)
// }

const clear = () => {
    emits('clear')
}
// const onChangeStartValue = (val: string | number) => {
// }

// const modelValue = defineModel<string[] | number[]>()
</script>

<style lang="scss">
@import '../../theme-chalk/input-range.scss';
</style>
