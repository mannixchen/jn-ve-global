<template>
    <div ref="sliderRef" class="slider">
        <h3>安全验证</h3>
        <div class="content">
            <div id="slider-img-div" ref="sliderImgDivRef" class="slider-img-div">
                <img id="slider-img" src="">
            </div>
            <div ref="bgImgDivRef" class="bg-img-div" />
        </div>
        <div class="slider-move">
            <div class="slider-move-track">
                请拖动滑块完成拼图
            </div>
            <div
                id="slider-move-btn"
                ref="sliderMoveBtnRef"
                class="slider-move-btn"
                @mousedown="handleMousedown"
            />
        </div>
        <div class="bottom">
            <div
                id="slider-close-btn"
                ref="sliderCloseBtn"
                class="close-btn"
                @click="emits('close')"
            />
            <div
                id="slider-refresh-btn"
                ref="sliderRefreshBtnRef"
                class="refresh-btn"
                @click="refreshCaptcha"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'CaptchaConcat'
})
</script>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'
import BaseCaptcha from './utils/BaseCaptcha'
import { getStyle } from '@jsjn/utils'
import { apis } from '@/api'
import type { CurrentCaptchaConfig } from './utils/BaseCaptcha'
import useSizeMath from './hooks/useSizeMath'

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
const { fieldsSizeLargen, fieldsSizeLessen, getSize } = useSizeMath()

const currentCaptchaId = ref<string>('')
watch(
    () => currentCaptchaId.value,
    (key) => {
        emits('update:codeKey', key)
    }
)

const sliderRef = ref<HTMLElement>(null)
const sliderMoveBtnRef = ref<HTMLElement>(null)
const sliderImgDivRef = ref<HTMLElement>(null)
const bgImgDivRef = ref<HTMLElement>(null)
const sliderCloseBtn = ref<HTMLElement>(null)
const sliderRefreshBtnRef = ref<HTMLElement>(null)
let captcha: BaseCaptcha = null

onMounted(() => {
    refreshCaptcha()

    captcha = new BaseCaptcha({
        doDown(config) {
            sliderMoveBtnRef.value.style.backgroundPosition = `-${getSize(5)}px 31.0092%`
        },
        doMove(config) {
            const moveX = config.moveX
            sliderMoveBtnRef.value.style.transform = `translate(${moveX}px, 0px)`
            sliderImgDivRef.value.style.backgroundPositionX = `${moveX}px`
        },
        valid(config) {
            let data = {
                bgImageWidth: config.bgImageWidth,
                bgImageHeight: config.bgImageHeight,
                sliderImageWidth: config.sliderImageWidth,
                sliderImageHeight: config.sliderImageHeight,
                startSlidingTime: config.startTime,
                endSlidingTime: config.stopTime,
                trackList: config.trackArr
            }

            // 反缩放
            fieldsSizeLessen(data)
            data.trackList.forEach((item) => {
                fieldsSizeLessen(item, ['x', 'y'])
            })

            // 校验
            emits('valid', currentCaptchaId.value, data as any, refreshCaptcha)
        }
    })
})

function refreshCaptcha() {
    http['get_capcha_source']({
        type: 'CONCAT'
    }).then((res) => {
        reset()

        // 缩放
        fieldsSizeLargen(res.data.captcha)

        currentCaptchaId.value = res.data.id
        bgImgDivRef.value.style.backgroundImage = `url(${res.data.captcha.backgroundImage})`
        sliderImgDivRef.value.style.backgroundImage = `url(${res.data.captcha.backgroundImage})`
        sliderImgDivRef.value.style.backgroundPosition = '0px 0px'
        const backgroundImageHeight = res.data.captcha.bgImageHeight
        var height =
            ((backgroundImageHeight - res.data.captcha.data) / backgroundImageHeight) * getSize(159)

        sliderImgDivRef.value.style.height = `${height}px`

        const bgImgW = parseFloat(getStyle(bgImgDivRef.value, 'width'))
        const bgImgH = parseFloat(getStyle(bgImgDivRef.value, 'height'))
        const sliderImgW = parseFloat(getStyle(sliderImgDivRef.value, 'width'))
        const sliderImgH = parseFloat(getStyle(sliderImgDivRef.value, 'height'))
        captcha.initConfig(bgImgW, bgImgH, sliderImgW, sliderImgH, getSize(206))

        // 抛出刷新事件
        emits('refresh', res.data.id)
    })
}

function reset() {
    sliderMoveBtnRef.value.style.backgroundPosition = `-${getSize(5)}px 11.79625%`
    sliderMoveBtnRef.value.style.transform = 'translate(0px, 0px)'
    sliderImgDivRef.value.style.transform = 'translate(0px, 0px)'
    currentCaptchaId.value = ''
}

function handleMousedown(e) {
    captcha.down(e)
}

defineExpose({
    reset,
    currentCaptchaId,
    refreshCaptcha
})
</script>

<style lang="scss" scoped>
.slider {
    background-color: #fff;
    width: 278px;
    // height: 285px;
    z-index: 999;
    box-sizing: border-box;
    padding: 9px;
    border-radius: 6px;
    box-shadow: var(--el-box-shadow-light);
    user-select: none;

    > h3 {
        color: var(--el-text-color-regular);
    }

    .content {
        width: 100%;
        height: 159px;
        position: relative;

        .slider-img-div {
            height: 100%;
            width: 100%;
            background-size: 100% 159px;
            position: absolute;
            transform: translate(0px, 0px);
            /*border-bottom: 1px solid blue;*/
            z-index: 1;

            img {
                height: 100%;
            }
        }

        .bg-img-div {
            width: 100%;
            height: 100%;
            position: absolute;
            transform: translate(0px, 0px);
            background-size: 100% 159px;
            background-image: none;
            background-position: 0 0;
            z-index: 0;

            img {
                width: 100%;
            }
        }
    }

    .slider-move {
        height: 60px;
        width: 100%;
        margin: 11px 0;
        position: relative;

        .slider-move-track {
            line-height: 38px;
            font-size: 12px;
            text-align: center;
            white-space: nowrap;
            color: #88949d;
            -moz-user-select: none;
            -webkit-user-select: none;
            user-select: none;
            opacity: var(--captcha-move-track-opacity);
        }

        .slider-move-btn {
            transform: translate(0px, 0px);
            background-position: -5px 11.79625%;
            position: absolute;
            top: -12px;
            left: 0;
            width: 66px;
            height: 66px;
        }
    }

    .bottom {
        height: 19px;
        width: 100%;
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
    .close-btn,
    .slider-move-track,
    .slider-move-btn {
        background: url(./imgs/captcha-sprite.png) no-repeat;
        background-size: 260px 439px;
    }

    .refresh-btn,
    .close-btn {
        display: inline-block;
        transition: transform 0.3s;

        &:active {
            transform: scale(0.9);
        }
    }
    .slider-move-btn:hover,
    .close-btn:hover,
    .refresh-btn:hover {
        cursor: pointer;
    }
}
</style>
