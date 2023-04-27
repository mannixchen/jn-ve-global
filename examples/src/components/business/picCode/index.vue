<template>
    <el-tooltip class="item" effect="dark" content="看不清，换一张" placement="bottom">
        <div ref="codeBoxRef" class="pic-code" @click="refresh" />
    </el-tooltip>
</template>

<script lang="ts">
export default {
    name: 'PicCode',
    inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { ref, withDefaults, getCurrentInstance, onMounted, watchEffect, watch } from 'vue'
import GVerify from './GVerify'

interface Props {
    /**
     * 指定 or 随机生成的值
     *  1. 如果未传递，则随机生成
     *  2. 如果传递了，依据外部生成
     */
    modelValue: string
    /**
     * 特定的 canvas id
     */
    canvasId?: string
    /**
     * 生成的长度
     */
    codeLength?: number
    /**
     * 类型
     * blend: 数字字母混合类型
     * number: 纯数字
     * letter: 纯字母
     */
    type?: 'blend' | 'number' | 'letter'
    /**
     * 是否内部随机生成
     */
    isRandom?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    canvasId: 'verifyCanvas',
    codeLength: 4,
    type: 'blend',
    isRandom: true
})

const emits = defineEmits(['update:modelValue'])
const { proxy } = getCurrentInstance() as any
const codeBoxRef = ref<HTMLElement>(null)
const gVerifyInstance = ref<GVerify>(null)

onMounted(() => {
    init()
})

watch(
    () => props.modelValue,
    (val) => {
        /**
         * 刷新验证码有两种行为：
         *  1. 随机：组件自己生成验证码，然后抛给父级
         *  2. 外部指定：由父级生成，然后刷新展示
         */
        if (!props.isRandom) {
            gVerifyInstance.value.options.code = val
            gVerifyInstance.value.refresh()
        }
    }
)

// 点击更新
const refresh = () => {
    if (!props.isRandom) return
    // 刷新
    gVerifyInstance.value.refresh()
    emits('update:modelValue', gVerifyInstance.value.getCode())
}

function init() {
    gVerifyInstance.value = new GVerify({
        wrap: codeBoxRef.value,
        canvasId: props.canvasId,
        type: props.type,
        code: !props.isRandom ? props.modelValue : '',
        codeLength: props.codeLength,
        isRandom: props.isRandom
    })

    if (props.isRandom) {
        emits('update:modelValue', gVerifyInstance.value.getCode())
    }
}
</script>

<style lang="scss" scoped>
.pic-code {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
}
</style>
