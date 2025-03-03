<template>
    <div
        :class="[ns.b(), isAmount ? ns.b('amount') : '', ns.is('disabled', inputNumberDisabled)]"
        :capital-amount="capitalAmount"
    >
        <el-input
            ref="elInputRef"
            v-model="displayValue"
            type="text"
            :disabled="inputNumberDisabled"
            :placeholder="placeholder"
            :formatter="formatter"
            :parser="parser"
            v-bind="$attrs"
            @wheel="handleWheel"
            @blur="handleBlur"
            @focus="handleFocus"
            @input="handleInput"
            @change="handleInputChange"
        >
            <template #suffix>
                <span>{{ suffixText }}</span>
            </template>
            <template v-if="isAmount && currencyVisible" #append>
                <el-select-v2
                    v-model="currentCurrency"
                    :class="ns.b('currency')"
                    size="large"
                    disabled
                    :options="currencyOptions"
                />
            </template>
        </el-input>
        <!-- <div v-if="capitalAmountVisible && false" :class="[ns.be('amount', 'capital')]">
            {{ capitalAmount }}
        </div> -->
    </div>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs, withDefaults, Plugin } from 'vue'
import type { InputInstance } from 'element-plus'
import { InputNumberProps, InputNumberValue, BiInputNumberData } from './type'
import { InputNumberDisplayTypes, inputNumberSuffixMap, Currency, currencyOptions } from './const'
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT, AmountUnits } from '../../constants'
import { useFormItem, useFormDisabled, ElInput, ElSelectV2 } from 'element-plus'
import { isNil, isNaN, isNumber, isUndefined, isString } from 'lodash'
import { toThousands as toThousandsFunc, clearNoNum } from '@jsjn/utils'
import { dealBigMoney } from '../../utils'
import { useNamespace } from '../../hooks'

const COMPONENT_NAME = 'BiInputNumber'
defineOptions({
    name: COMPONENT_NAME
})

console.log('BiInputNumber')

const props = withDefaults(defineProps<InputNumberProps>(), {
    modelValue: '',
    placeholder: '请输入',
    type: InputNumberDisplayTypes.NUMBER,
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY,
    currencyVisible: false,
    currency: Currency.CNY
})

const elInputRef = ref<InputInstance>()

const ns = useNamespace('input-number')

const data = reactive<BiInputNumberData>({
    userInput: null,
    currentValue: props.modelValue
})

const emits = defineEmits<{
    'update:modelValue': [val: InputNumberValue]
    blur: [e: FocusEvent]
    focus: [e: FocusEvent]
    // [INPUT_EVENT]: [val: InputNumberValue]
    input: [val: InputNumberValue]
    change: [cur: InputNumberValue, prev: InputNumberValue]
}>()

const inputNumberDisabled = useFormDisabled()

const displayValue = computed<InputNumberValue>(() => {
    // console.log('displayValue')
    if (data.userInput !== null && isNumber(Number(data.userInput))) {
        return data.userInput
    }
    let currentValue: InputNumberValue = data.currentValue
    if (isNil(currentValue) || currentValue === '') return ''
    if (isNumber(currentValue) || isNumber(Number(currentValue))) {
        if (isNaN(Number(currentValue))) return ''
        if (!isUndefined(props.precision)) {
            currentValue = Number(currentValue).toFixed(props.precision)
        }
    }
    return currentValue
})

// 金额相关
const currentCurrency = computed(() => props.currency)
const capitalAmountVisible = computed<boolean>(() => props.toCapitalAmount)

const capitalAmount = computed<string>(() => {
    let aomunt = ''
    if (props.toCapitalAmount) {
        aomunt = dealBigMoney(displayValue.value, props.type)
    }
    return aomunt
})

const suffixText = computed<string>(() => inputNumberSuffixMap.get(props.type) ?? '')

// const getPrecision = (value: InputNumberValue) => {
//     if (isNil(value)) return 0
//     const valueString = value.toString()
//     const dotPosition = valueString.indexOf('.')
//     let precision = 0
//     if (dotPosition !== -1) {
//         precision = valueString.length - dotPosition - 1
//     }
//     return precision
// }

// const numPrecision = computed(() => {
//     const stepPrecision = getPrecision(props.step)
//     if (!isUndefined(props.precision)) {
//         if (stepPrecision > props.precision) {
//             debugWarn('InputNumber', 'precision should not be less than the decimal places of step')
//         }
//         return props.precision
//     } else {
//         return Math.max(getPrecision(props.modelValue), stepPrecision)
//     }
// })

const toPrecision = (num: number, pre?: number) => {
    // if (isUndefined(pre)) pre = numPrecision.value
    if (isUndefined(pre)) pre = props.precision
    if (pre === 0) return Math.round(num)
    let snum = String(num)
    const pointPos = snum.indexOf('.')
    if (pointPos === -1) return num
    const nums = snum.replace('.', '').split('')
    const datum = nums[pointPos + pre]
    if (!datum) return num
    const length = snum.length
    if (snum.charAt(length - 1) === '5') {
        snum = `${snum.slice(0, Math.max(0, length - 1))}6`
    }
    return Number.parseFloat(Number(snum).toFixed(pre))
}

const verifyValue = (value: InputNumberValue, update?: boolean): number | null | undefined => {
    const { max, min, precision } = props
    if (max < min) {
        throw new Error('InputNumber min should not be greater than max.')
    }

    let newVal = Number(value)
    if (isNil(value) || value === '' || isNaN(newVal)) {
        return null
    }
    // if (value === '') {
    //     if (valueOnClear === null) {
    //         return null
    //     }
    //     newVal = isString(valueOnClear) ? { min, max }[valueOnClear] : valueOnClear
    // }
    // if (stepStrictly) {
    //     newVal = toPrecision(Math.round(newVal / step) * step, precision)
    // }
    if (!isUndefined(precision)) {
        newVal = toPrecision(Number(newVal), precision)
    }
    if (newVal > max || newVal < min) {
        newVal = newVal > max ? max : min
        update && emits(UPDATE_MODEL_EVENT, newVal)
    }
    return newVal
}

const setCurrentValue = (value: InputNumberValue, emitChange = true) => {
    // console.log('setCurrentValue', value)
    const oldVal = data.currentValue
    const newVal = verifyValue(value)
    if (!emitChange) {
        emits(UPDATE_MODEL_EVENT, newVal!)
        return
    }
    if (oldVal === newVal && value) return
    data.userInput = null
    emits(UPDATE_MODEL_EVENT, newVal!)
    if (oldVal !== newVal) {
        emits(CHANGE_EVENT, newVal!, oldVal!)
    }
    // if (props.validateEvent) {
    //     formItem?.validate?.('change').catch((err) => debugWarn(err))
    // }
    data.currentValue = newVal
}

const setCurrentValueToModelValue = () => {
    if (Number(data.currentValue) !== Number(props.modelValue)) {
        data.currentValue = props.modelValue
    }
}

const handleInput = (value: string) => {
    value = clearNoNum(value)
    data.userInput = value
    const newVal = value === '' ? null : Number(value)
    emits(INPUT_EVENT, newVal)
    setCurrentValue(newVal, false)
}

const handleInputChange = (value: string) => {
    value = clearNoNum(value)
    const newVal = value !== '' ? Number(value) : ''
    if ((isNumber(Number(newVal)) && !isNaN(Number(newVal))) || value === '') {
        setCurrentValue(newVal)
    }
    setCurrentValueToModelValue()
    data.userInput = null
}

const handleBlur = (event: MouseEvent | FocusEvent) => {
    data.userInput = null
    emits('blur', event)
    // if (props.validateEvent) {
    //     formItem?.validate?.('blur').catch((err) => debugWarn(err))
    // }
}

const handleWheel = (e: MouseEvent) => {
    if (document.activeElement === e.target) e.preventDefault()
}

const handleFocus = (event: MouseEvent | FocusEvent) => {
    emits('focus', event)
}

const formatter = computed<Function>(() => {
    return props.toThousands ? toThousandsFunc : (val) => val
    // return (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

const parser = computed<Function>(() => {
    return props.toThousands ? (value) => value.replace(/,/g, '') : (val) => val
    // return (val) => val
})

const focus = () => {
    elInputRef.value?.focus?.()
}

const blur = () => {
    elInputRef.value?.blur?.()
}

const clear = () => {
    console.log('clear')
    elInputRef.value?.clear?.()
}

defineExpose({
    focus,
    blur,
    clear
})
</script>

<style lang="scss">
@import '../../theme-chalk/input-number.scss';
</style>
