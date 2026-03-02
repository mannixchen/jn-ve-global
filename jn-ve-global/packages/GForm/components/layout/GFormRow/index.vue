<template>
    <ElRow :gutter="rootFormConfig?.gutter ?? 20" class="form-item-row">
        <slot />
    </ElRow>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { FormProps } from '../../../interface'
import { ElRow } from 'element-plus'
import formConfigProvideKey from '../../../constant/formConfigProvideKey'

defineOptions({
    name: 'GFormRow'
})

const rootFormConfig = inject(formConfigProvideKey)
</script>

<style lang="scss" scoped>
.form-item-row {
    &.is-collapse-layout {
        padding: 10px 20px 14px;
    }
}
</style>
