<template>
    <ElRow :gutter="formConfig?.gutter ?? 20" class="form-item-row">
        <slot />
    </ElRow>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GFormRow'
})
</script>

<script lang="ts" setup>
import type { FormProps } from '../../../interface'
import { ElRow } from 'element-plus'

const props = withDefaults(
    defineProps<{
        formConfig?: FormProps
    }>(),
    {
        formConfig: null
    }
)
</script>

<style lang="scss" scoped>
.form-item-row {
    &.is-collapse-layout {
        padding: 10px 20px 14px;
    }
}
</style>
