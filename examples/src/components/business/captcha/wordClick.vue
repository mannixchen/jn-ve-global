<template>
    <div class="slider word-click">
        <h3>安全验证</h3>

        <div class="slider-move">
            <span class="slider-move-span">请依次点击: </span>
            <img ref="tipImgRef" src="" class="tip-img">
        </div>
        <div ref="contentRef" class="content" @click="handleContentClick">
            <div ref="bgImgDivRef" class="bg-img-div">
                <img id="bg-img" ref="bgImgRef" src="">
            </div>
            <div ref="bgClickDivRef" class="bg-click-div" />
        </div>
        <div class="bottom">
            <div id="slider-close-btn" class="close-btn" @click="emits('close')" />
            <div id="slider-refresh-btn" class="refresh-btn" @click="refreshCaptcha" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'CaptchaWordClick'
})
</script>

<script lang="ts" setup>
import { watch, ref, computed, reactive, onMounted, onUnmounted, h } from 'vue'
import BaseCaptcha from './utils/BaseCaptcha'
import axios from 'axios'
import { getStyle, size2Rem } from '@jsjn/utils'
import { ElMessage } from 'element-plus'
import { apis } from '@/api'
import type { CurrentCaptchaConfig } from './utils/BaseCaptcha'

const props = withDefaults(
    defineProps<{
        /**
         * 登录的 codeKey = 滑动验证码返回的 id
         */
        codeKey?: string
    }>(),
    {}
)

const emits = defineEmits<{
    (e: 'update:codeKey', key: string): void
    (e: 'close'): void
    (e: 'valid', id: string, data: CurrentCaptchaConfig, refreshCaptcha?: () => void): void
    (e: 'refresh', id: string): void
}>()

const http = apis['common']

const currentCaptchaId = ref<string>('')
watch(
    () => currentCaptchaId.value,
    (key) => {
        emits('update:codeKey', key)
    }
)

const bgImgDivRef = ref<HTMLElement>(null)
const bgClickDivRef = ref<HTMLElement>(null)
const contentRef = ref<HTMLElement>(null)
const bgImgRef = ref<HTMLElement>(null)
const tipImgRef = ref<HTMLElement>(null)

let startSlidingTime: Date
let entSlidingTime: Date
const trackArr = []
let clickCount = 0

onMounted(() => {
    refreshCaptcha()
})

function handleContentClick(event) {
    clickCount++

    if (clickCount === 1) {
        startSlidingTime = new Date()
        window.addEventListener('mousemove', move)
    }

    trackArr.push({
        x: event.offsetX,
        y: event.offsetY,
        type: 'click',
        t: new Date().getTime() - startSlidingTime.getTime()
    })

    const left = event.offsetX - 10
    const top = event.offsetY - 10

    const dom = document.createElement('span')
    dom.setAttribute('class', 'click-span')
    dom.setAttribute('style', `left: ${left}PX; top: ${top}PX;`)
    dom.appendChild(document.createTextNode(`${clickCount}`))
    bgClickDivRef.value.append(dom as any)

    if (clickCount === 4) {
        // 校验
        entSlidingTime = new Date()
        window.removeEventListener('mousemove', move)
        valid()
    }
}

function move(event) {
    if (event instanceof TouchEvent) {
        event = event.touches[0]
    }

    trackArr.push({
        x: event.offsetX,
        y: event.offsetY,
        t: new Date().getTime() - startSlidingTime.getTime(),
        type: 'move'
    })
}

function valid() {
    let data = {
        bgImageWidth: parseFloat(getStyle(bgImgDivRef.value, 'width')),
        bgImageHeight: parseFloat(getStyle(contentRef.value, 'height')),
        sliderImageWidth: -1,
        sliderImageHeight: -1,
        startSlidingTime: startSlidingTime,
        endSlidingTime: entSlidingTime,
        trackList: trackArr
    }

    // 校验
    emits('valid', currentCaptchaId.value, data as any, refreshCaptcha)
}

function refreshCaptcha() {
    http['get_capcha_source']({
        type: 'WORD_CLICK'
    }).then((res) => {
        reset()
        currentCaptchaId.value = res.data.id
        bgImgRef.value.setAttribute('src', res.data.captcha.backgroundImage)
        tipImgRef.value.setAttribute('src', res.data.captcha.sliderImage)

        // 抛出刷新事件
        emits('refresh', res.data.id)
    })
}

function reset() {
    startSlidingTime = null
    entSlidingTime = null
    trackArr.length = 0
    clickCount = 0
    currentCaptchaId.value = ''

    // 移除数字节点
    bgClickDivRef.value.querySelectorAll('.click-span').forEach((node) => {
        bgClickDivRef.value.removeChild(node)
    })

    window.removeEventListener('mousemove', move)
}

defineExpose({
    reset,
    currentCaptchaId,
    refreshCaptcha
})
</script>

<style lang="scss">
.slider.word-click {
    background-color: #fff;
    width: 278px;
    // height: 250px;
    height: fit-content;
    z-index: 999;
    box-sizing: border-box;
    padding: 9px;
    border-radius: 6px;
    box-shadow: var(--el-box-shadow-light);
    position: relative;
    user-select: none;

    >h3 {
        color: var(--el-text-color-regular);
    }

    .content {
        width: 100%;
        height: 159px;
        position: relative;

        .bg-img-div {
            width: 100%;
            height: 100%;
            position: absolute;
            transform: translate(0px, 0px);
            z-index: 0;

            img {
                width: 100%;
            }
        }

        .bg-click-div {
            z-index: 1;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }

        .click-span {
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 50px;
            background-color: #409eff;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            color: #fff;
            border: 2px solid #fff;
        }
    }

    .slider-move {
        height: 40px;
        width: 100%;
        position: relative;

        .slider-move-span {
            font-size: 18px;
            display: inline-block;
            height: 40px;
            line-height: 40px;
            color: var(--el-text-color-secondary);
        }

        .tip-img {
            width: 130px;
            position: absolute;
            right: 5px;
        }
    }

    .bottom {
        height: 19px;
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        opacity: var(--captcha-bottom-opacity);

        .close-btn {
            width: 20px;
            height: 20px;
            background-position: 0 44.86874%;
            margin-right: 20px;
        }

        .refresh-btn {
            width: 20px;
            height: 20px;
            background-position: 0 81.38425%;
        }
    }

    .refresh-btn,
    .close-btn {
        background: url(./imgs/captcha-sprite.png) no-repeat;
        background-size: 260px 439px;
        display: inline-block;
        cursor: pointer;
        transition: transform 0.3s;

        &:active {
            transform: scale(0.9);
        }
    }
}
</style>
