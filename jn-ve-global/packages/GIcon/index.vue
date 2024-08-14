<template>
    <!-- 阿里图标 -->
    <i
        v-if="iconIsValid && ['icon-', 'ali-'].some((prefix) => icon.indexOf(prefix) === 0)"
        :class="[icon, 'iconfont']"
        v-bind="$attrs"
    />

    <!-- El Icon -->
    <ElIcon v-else-if="iconIsValid && elIconComponentName" v-bind="$attrs" class="g-icon">
        <component :is="elIcons[elIconComponentName]" />
    </ElIcon>

    <!-- 本地svg -->
    <component
        :is="jnIcons[localSvgCompName]"
        v-else-if="iconIsValid"
        :class="['custom-svg-icon', { 'svg-icon-custom-color': customColor }]"
        v-bind="$attrs"
    />
</template>

<script lang="ts">
export default {
    name: 'GIcon',
    inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElIcon } from 'element-plus'
import { camelCase } from '@jsjn/utils'
import * as elIcons from '@element-plus/icons-vue'
import * as jnIcons from '@jsjn/icons-vue'

const props = withDefaults(
    defineProps<{
        icon: String
        /**
         * 本地 svg 存在固有设计样式颜色，需要保留
         * 因此，需要主动开启自定义颜色
         */
        customColor?: boolean
    }>(),
    {
        customColor: false
    }
)

// 有值且为字符串，保险
const iconIsValid = computed(() => props.icon && typeof props.icon === 'string')

// 截取 el icon 组件的名字
const elIconComponentName = computed(() => {
    if (!iconIsValid.value) return null
    const name = props.icon.indexOf('el-') === 0 ? props.icon.replace(/^el-/, '') : null
    return elIcons[name] ? name : null
})

// 本地 svg 名称映射
const localSvgCompName = computed(() => {
    if (!iconIsValid.value) return null
    const name = camelCase(props.icon, { pascalCase: true })
    return jnIcons[name] ? name : null
})
</script>

<style lang="scss" scoped>
.g-icon {
    vertical-align: top;
    line-height: 1;
    width: auto;
    height: auto;

    svg {
        vertical-align: top;
    }
}

.custom-svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: top;
}
</style>
