<template>
    <el-tooltip
        v-if="isShow"
        :placement="placement"
        :popper-class="[popperClass, 'form-item-tip__popper']"
    >
        <template #content>
            <!-- 组件 || jsx 元素 -->
            <component :is="content" v-if="isVNode(content)" />

            <!-- 文本 -->
            <span v-if="_.isString(content)" v-html="content" />

            <!-- render 函数 -->
            <FunctionalComponent v-if="_.isFunction(content)" :render="content()" />
        </template>

        <span class="item-tip">
            <LGIcon :icon="icon" />
        </span>
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: 'FormItemLabelTip'
}
</script>

<script lang="ts" setup>
import { isVNode, computed } from 'vue'
import LGIcon from '../../../../GIcon/index.vue'
import { FormItemProps } from '../../../index'
import FunctionalComponent from '../../../../FunctionalComponent'
import _ from 'lodash'
import { ElTooltip } from 'element-plus'

const props = withDefaults(
    defineProps<{
        content: FormItemProps['tip']
        icon?: string
        popperClass?: FormItemProps['tipPopperClass']
        placement?: FormItemProps['tipPlacement']
    }>(),
    {
        content: null,
        icon: 'el-QuestionFilled',
        popperClass: '',
        placement: 'top'
    }
)

const isShow = computed<boolean>(() => {
    if (_.isString(props.content) && props.content) return true
    if (_.isFunction(props.content) && props.content()) return true
    if (isVNode(props.content)) return true
    return false
})
</script>

<style lang="scss" scoped></style>
