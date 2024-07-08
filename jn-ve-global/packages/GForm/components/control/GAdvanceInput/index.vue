<template>
    <div style="width: 100%">
        <InputCore
            v-show="!inputDisabled || !exceedBoxWidth"
            v-model="localModelValue"
            v-model:el-input-ref="localInputRef"
            v-bind="$attrs"
        />

        <!-- 仅展示作用 -->
        <template v-if="inputDisabled && exceedBoxWidth">
            <ElTooltip
                :content="localModelValue"
                placement="top-start"
                popper-class="input-lang-word-popper"
            >
                <InputCore :model-value="localModelValue" v-bind="$attrs" />
            </ElTooltip>
        </template>
    </div>
</template>

<script lang="ts">
export default {
    name: 'GAdvanceInput',
    inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import useInputDisabledTooltip from './hooks/useInputDisabledTooltip'
import InputCore from './core.vue'
import { ElInput as ElInputCom, ElTooltip } from 'element-plus'

/**
 * TODO: elInputRef?: InstanceType<typeof ElInputCom> | null
 */
const props = withDefaults(
    defineProps<{
        elInputRef?: any
        modelValue: string | number | any
    }>(),
    {
        modelValue: ''
    }
)

const emits = defineEmits(['update:modelValue', 'update:elInputRef'])

// 双向绑定的数据
const localModelValue = computed({
    get: () => props.modelValue,
    set(val) {
        emits('update:modelValue', val)
    }
})

/**
 * input 禁用时，tooltip 处理
 *  - elInputRef：input 控件的 ref
 *  - inputDisabled：是否禁用
 *  - exceedBoxWidth：内容是否超出宽度
 */
const {
    elInputRef: localInputRef,
    inputDisabled,
    exceedBoxWidth
} = useInputDisabledTooltip(localModelValue)

/**
 * 抛出 input 的 ref 引用
 */
watch(
    () => localInputRef.value,
    (instance) => {
        emits('update:elInputRef', instance)
    }
)
</script>

<style lang="scss" scoped></style>
