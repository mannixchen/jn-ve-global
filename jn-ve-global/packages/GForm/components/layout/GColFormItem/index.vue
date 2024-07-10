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
        <LGFormItem v-bind="props">
            <!-- 针对低码平台，这里要有一个 slot 占位，作为容器 -->
            <template #default="{ itemConfig, vmodel }">
                <slot :item-config="(itemConfig as FormItemProps)" :vmodel="(vmodel as Ref<any>)" />
            </template>
        </LGFormItem>
    </ElCol>
</template>

<script lang="ts" setup>
import { type Ref } from 'vue'
import { type FormItemProps } from '../../../interface'
import { ElCol } from 'element-plus'
import LGFormItem from '../GFormItem/index.vue'

defineOptions({
    name: 'GColFormItem'
})

const props = withDefaults(
    defineProps<{
        formItemConfig: FormItemProps
    }>(),
    {
        formItemConfig: null
    }
)

/**
 * 从统一的 FormItemProps 中，提取出 el-col 的配置参数
 */
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
