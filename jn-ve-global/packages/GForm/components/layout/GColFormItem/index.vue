<template>
    <ElCol
        v-if="formItemConfig && !formItemConfig.hide"
        :class="[
            'design-item-box',
            'form-item-col',
            {
                [`${formItemConfig.class}-col`]: formItemConfig.class
            }
        ]"
        v-bind="getElColConfigs(formItemConfig)"
    >
        <LGFormItem v-bind="props" />
    </ElCol>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GColFormItem'
})
</script>

<script lang="ts" setup>
import { FormItemProps, FormProps } from '../../../index'
import LGFormItem from '../GFormItem/index.vue'
import { ElCol } from 'element-plus'

const props = withDefaults(
    defineProps<{
        /**
         * 表单 item 配置参数
         */
        formItemConfig: FormItemProps
        /**
         * 表单配置对象
         */
        formConfig: FormProps
    }>(),
    {
        formItemConfig: null,
        formConfig: null
    }
)

// el col 的配置：响应式布局 || span 布局
const getElColConfigs = (item: FormItemProps): any => {
    const baseConfig = {
        offset: item.offset ?? 0
    }

    const spanConfig = {
        ...baseConfig,
        span: item.span ?? 6
    }

    const bootstrapConfig = {
        ...baseConfig,
        xs: item.xs ?? 24,
        sm: item.sm ?? 12,
        md: item.md ?? 12,
        lg: item.lg ?? 8,
        xl: item.xl ?? 8
    }

    if (item.span) return spanConfig
    if (item.xs || item.sm || item.md || item.lg || item.xl) return bootstrapConfig
    return spanConfig
}
</script>

<style lang="scss" scoped></style>
