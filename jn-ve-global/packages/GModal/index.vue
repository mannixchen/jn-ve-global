<template>
    <!-- dialog 对话框 -->
    <ElDialog
        v-if="localType === 'dialog'"
        ref="modalRef"
        :width="localWidth"
        destroy-on-close
        top="5vh"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        v-bind="eleProps"
        :class="`g-custom-dialog
            ${attrs['custom-class'] ? ' ' + attrs['custom-class'] : ''}`"
        :align-center="verticalCenter"
    >
        <!-- title -->
        <template v-if="$slots.title" #header>
            <slot name="title" />
        </template>

        <!-- 弹框内容 -->
        <template #default>
            <slot />
        </template>

        <!-- 底部按钮 -->
        <template v-if="!hideFooter && ($slots.footer || (btns && !!btns.length))" #footer>
            <slot name="footer">
                <LGButtonGroup
                    v-if="btns && !!btns.length"
                    class="modal-btn-wrapper"
                    :btns="btns"
                />
            </slot>
        </template>
    </ElDialog>

    <!-- drawer 抽屉 -->
    <ElDrawer
        v-if="localType === 'drawer'"
        ref="modalRef"
        :size="localWidth"
        destroy-on-close
        append-to-body
        v-bind="eleProps"
        :custom-class="`g-custom-drawer ${attrs['custom-class'] || ''}`"
    >
        <!-- title -->
        <template v-if="$slots.title" #header>
            <slot name="title" />
        </template>

        <!-- 内容 -->
        <div class="drawer-content">
            <ElScrollbar class="drawer-content-scrollbar">
                <slot />
            </ElScrollbar>
        </div>

        <!-- 底 -->
        <div v-if="!hideFooter && ($slots.footer || (btns && !!btns.length))" class="drawer-footer">
            <slot name="footer">
                <LGButtonGroup
                    v-if="btns && !!btns.length"
                    class="modal-btn-wrapper"
                    :btns="btns"
                />
            </slot>
        </div>
    </ElDrawer>
</template>

<script lang="ts">
export default {
    name: 'GModal',
    inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { ref, computed, useAttrs } from 'vue'
import { GButtonGroup as LGButtonGroup, type BtnProps } from '../GButtonGroup'
import _ from 'lodash'
import { partitionObj2HumpObj } from '@jsjn/utils'
import { ElDialog, ElDrawer, ElScrollbar } from 'element-plus'

export interface Props {
    /**
     * 类型
     */
    type?: 'dialog' | 'drawer'
    /**
     * 底部按钮组
     */
    btns?: BtnProps[]
    /**
     * 隐藏底部，权重较高
     */
    hideFooter?: boolean
    /**
     * 宽度
     */
    width?: string | number
    /**
     * 是否垂直居中
     */
    verticalCenter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'dialog',
    btns: () => [],
    hideFooter: false,
    width: '',
    verticalCenter: false
})

const attrs = useAttrs()
const eleProps = computed(() => {
    const obj = partitionObj2HumpObj(attrs) as any

    if (props.type === 'dialog') {
        const { alignCenter, customClass, ...dialogEleProps } = obj
        return dialogEleProps
    } else {
        const { alignCenter, ...drawerEleProps } = obj
        return drawerEleProps
    }
})

// 本地类型（做统一化控制）
const localType = computed(() => props.type)
const modalRef = ref(null)

// 本地 width
const localWidth = computed(() => {
    if (props.width) return props.width
    if (props.type === 'dialog') return '70%'
    return '50%'
})

defineExpose({
    localType,
    modalRef
})
</script>

<style lang="scss" scoped>
.modal-btn-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
}
</style>
<style lang="scss">
@import './styles.scss';
</style>
