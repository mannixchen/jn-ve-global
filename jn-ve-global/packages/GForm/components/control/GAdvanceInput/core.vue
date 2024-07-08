<template>
    <ElInputCom v-if="!reload" ref="localElInputRef" v-bind="(localInputProps as any)">
        <!-- input 插槽
                - 组件（VNode/JSX.Element）
                - 组件库内图标（ali-/el-/jg-）
                - 文本
         -->
        <template v-for="(slot, key) in inputSlots" :key="key" #[key]>
            <component :is="slot" v-if="typeof slot !== 'string'" />
            <LGIcon v-else-if="stringIsIcon(slot)" :icon="slot" />
            <span v-else>{{ slot }}</span>
        </template>
    </ElInputCom>
</template>

<script lang="ts">
export default {
    name: 'GAdvanceInputCore',
    inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import useInputSlots from './hooks/useInputSlots'
import type { InputControlConfig } from '../../../interface'
import { stringIsIcon } from '@jsjn/utils'
import { GIcon as LGIcon } from '../../../../GIcon'
import { ElInput as ElInputCom } from 'element-plus'

const props = withDefaults(
    defineProps<{
        elInputRef?: InstanceType<typeof ElInputCom> | null
    }>(),
    {
        elInputRef: null
    }
)

const emits = defineEmits(['update:elInputRef'])

/**
 * 处理 input 的配置对象
 *  - 排除插槽所占据的属性
 */
const attrs = useAttrs()
const localInputProps = computed<InputControlConfig['props']>(() => {
    const { prefix, suffix, prepend, append, ...inputProps } = attrs
    return inputProps
})

/**
 * 获取有效的 slot 及主动重绘
 */
const { inputSlots, reload } = useInputSlots(attrs)

/**
 * 抛出本地实际的 input ref
 */
const localElInputRef = computed<any>({
    get: () => props.elInputRef,
    set(instance) {
        if (!instance) return
        emits('update:elInputRef', instance)
    }
})
</script>

<style lang="scss" scoped></style>
