<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-04-02 10:20:29
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-02 14:37:47
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-year-range\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <bi-input-range
        :class="[ns.b(), ns.is('disabled', disabled), ns.is('focus', isFocus)]"
        :range-separator="rangeSeparator"
    >
        <template #start>
            <el-date-picker
                ref="startRef"
                v-model="startYear"
                :class="ns.e('start')"
                :placeholder="startPlaceholder"
                v-bind="yearProps"
                @blur="handleStartBlur"
                @focus="handleFocus"
            />
        </template>
        <template #end>
            <el-date-picker
                ref="endRef"
                v-model="endYear"
                :class="ns.e('end')"
                :placeholder="startPlaceholder"
                v-bind="yearProps"
                @blur="handleEndBlur"
                @focus="handleFocus"
            />
        </template>
    </bi-input-range>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import BiInputRange from '../input-range/index.vue'
import { InputYearRangeProps, Year } from './type'
import { YearFormat } from '../../constants'
import { useNamespace } from '../../hooks'
import { ElMessage, InputInstance } from 'element-plus'
import dayjs from 'dayjs'

const COMPONENT_NAME = 'BiInputYearRange'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<InputYearRangeProps>(), {
    startPlaceholder: '开始年份',
    endPlaceholder: '结束年份',
    rangeSeparator: '-',
    format: YearFormat.DEFAULT,
    valueFormat: YearFormat.DEFAULT
})

const emits = defineEmits<{
    'update:modelValue': [val: [Year, Year]]
}>()

const ns = useNamespace('input-year-range')

const startYear = ref<Year>(props?.modelValue?.[0])
const endYear = ref<Year>(props?.modelValue?.[1])

const startRef = ref()
const endRef = ref()

const isFocus = ref<boolean>(false)

const yearProps = computed(() => {
    const { clearable, format, valueFormat, disabled } = props
    return {
        type: 'year',
        disabled,
        clearable,
        format,
        valueFormat
    }
})

const setYear = (start: Year, end: Year) => {
    console.log('setYear', start, end)
    if (
        ![null, undefined, ''].includes(start as any) &&
        ![null, undefined, ''].includes(end as any) &&
        dayjs(start).isAfter(dayjs(end))
    ) {
        ElMessage.warning('开始年份不能大于结束年份，请重新选择')
        return false
    }
    return true
}

const handleStartBlur = () => {
    if ([null, undefined, ''].includes(startYear.value as any)) {
        startYear.value = null
    } else if (!setYear(startYear.value, endYear.value)) {
        startYear.value = null
    }
    isFocus.value = false
    emits('update:modelValue', [startYear.value, endYear.value])
}

const handleEndBlur = () => {
    if ([null, undefined, ''].includes(endYear.value as any)) {
        endYear.value = null
    } else if (!setYear(startYear.value, endYear.value)) {
        endYear.value = null
    }
    isFocus.value = false
    emits('update:modelValue', [startYear.value, endYear.value])
}

const handleFocus = () => {
    isFocus.value = true
}
</script>

<style lang="scss">
@import '../../theme-chalk/input-year-range.scss';
</style>
