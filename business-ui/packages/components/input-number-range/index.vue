<template>
    <bi-input-range
        :class="[ns.b(), ns.is('disabled', disabled), ns.is('focus', isFocus)]"
        :range-separator="rangeSeparator"
    >
        <template v-if="boundaryVisible" #prepend>
            <el-select-v2
                v-model="includeBoundary"
                :class="ns.e('prepend')"
                size="large"
                disabled
                :options="includeBoundaryOptions"
            />
        </template>
        <template #start>
            <bi-input-number
                ref="startRef"
                v-model="startValue"
                :class="ns.e('start')"
                :placeholder="startPlaceholder"
                :min="startMin"
                :max="startMax"
                v-bind="inputNumberProps"
                @blur="handleStartBlur"
                @focus="handleFocus"
            />
        </template>
        <template #end>
            <bi-input-number
                ref="endRef"
                v-model="endValue"
                :class="ns.e('end')"
                :placeholder="endPlaceholder"
                :min="endMin"
                :max="endMax"
                v-bind="inputNumberProps"
                @blur="handleEndBlur"
                @focus="handleFocus"
            />
        </template>
        <template #suffix>
            <span :class="ns.e('unit')">{{ suffixText }}</span>
        </template>
        <template v-if="isAmount && currencyVisible" #append>   
            <el-select-v2
                v-model="currentCurrency"
                :class="ns.e('append')"
                size="large"
                disabled
                :options="currencyOptions"
            />
        </template>
    </bi-input-range>
</template>

<script lang="ts" setup>
import { nextTick, watch, ref, computed, reactive, toRefs } from 'vue'
import BiInputRange from '../input-range/index.vue'
import BiInputNumber from '../input-number/index.vue'
import { InputNumberRangeProps } from './type'
import {
    InputNumberDisplayTypes,
    Currency,
    InputNumberProps,
    inputNumberSuffixMap,
    currencyOptions
} from '../input-number'
import { InputValue } from '../input-email'
import { ElMessage, InputInstance, ElSelectV2, ElInput } from 'element-plus'
import { includeBoundaryOptions, Boundary } from './const'
import { useNamespace } from '../../hooks'

const COMPONENT_NAME = 'BiInputNumberRange'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<InputNumberRangeProps>(), {
    startPlaceholder: '请输入',
    endPlaceholder: '请输入',
    startMin: Number.NEGATIVE_INFINITY,
    satrtMax: Number.POSITIVE_INFINITY,
    endMin: Number.NEGATIVE_INFINITY,
    endMax: Number.POSITIVE_INFINITY,
    rangeSeparator: '-',
    type: InputNumberDisplayTypes.NUMBER,
    currency: Currency.CNY,
    boundary: Boundary.INCLUDE
})

console.log(COMPONENT_NAME, props)

const emits = defineEmits<{
    'update:modelValue': [val: [InputValue, InputValue]]
}>()

const ns = useNamespace('input-number-range')

const startValue = ref<InputValue>(props?.modelValue?.[0])
const endValue = ref<InputValue>(props?.modelValue?.[1])

const startRef = ref<InputInstance>()
const endRef = ref<InputInstance>()

const isFocus = ref<boolean>(false)

const inputNumberProps = computed(() => {
    const { precision, isAmount, toThousands, toCapitalAmount, disabled, clearable, type } = props
    return { precision, isAmount, toThousands, toCapitalAmount, disabled, clearable, type }
})

const suffixText = computed<string>(() => inputNumberSuffixMap.get(props.type) ?? '')

// 金额相关
// const currentCurrency = computed(() => props.currency)
const currentCurrency = computed(
    () => currencyOptions.find((item) => item.value === props?.currency)?.label ?? ''
)

const includeBoundary = computed(() => props.boundary)

// const modelValue = defineModel<[InputValue, InputValue]>({ default: ['', ''] })
const setValue = (start: InputValue, end: InputValue) => {
    console.log('setValue', start, end)
    // emits('update:modelValue', [start, end])
    if (
        ![null, undefined, ''].includes(start as any) &&
        ![null, undefined, ''].includes(end as any) &&
        Number(start) > Number(end)
    ) {
        // start = end
        ElMessage.warning('起始值不能大于结束值，请重新输入')
        return false
    }
    return true
}

const handleStartBlur = () => {
    console.log('handleBlur')
    if ([null, undefined, ''].includes(startValue.value as any)) {
        startRef.value.clear()
    } else if (!setValue(startValue.value, endValue.value)) {
        startRef.value.clear()
    }
    isFocus.value = false
    emits('update:modelValue', [startValue.value, endValue.value])
}

const handleEndBlur = () => {
    console.log('handleBlur')
    if ([null, undefined, ''].includes(endValue.value as any)) {
        endRef.value.clear()
    } else if (!setValue(startValue.value, endValue.value)) {
        endRef.value.clear()
    }
    isFocus.value = false
    emits('update:modelValue', [startValue.value, endValue.value])
}

const handleFocus = () => {
    isFocus.value = true
}
</script>

<style lang="scss">
@import '../../theme-chalk/input-number-range.scss';
</style>
