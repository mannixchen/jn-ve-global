<template>
    <div class="slider">
        <h3>安全验证</h3>

        <div class="content">
            <div class="bg-img-div">
                <img id="bg-img" ref="bgImgRef" src="">
            </div>
            <div id="slider-img-div" ref="sliderImgDivRef" class="slider-img-div">
                <img id="slider-img" ref="sliderImgRef" src="">
            </div>
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
            <div id="slider-close-btn" class="close-btn" @click="emits('close')" />
            <div id="slider-refresh-btn" class="refresh-btn" @click="refreshCaptcha" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'CaptchaSlider'
})
</script>

<script lang="ts" setup>
import { watch, ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import BaseCaptcha from './utils/BaseCaptcha'
import { getStyle, size2Rem } from '@jsjn/utils'
import { ElMessage } from 'element-plus'
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

let captcha: BaseCaptcha = null
const sliderMoveBtnRef = ref<HTMLElement>(null)
const sliderImgDivRef = ref<HTMLElement>(null)
const bgImgRef = ref<HTMLElement>(null)
const sliderImgRef = ref<HTMLElement>(null)

onMounted(() => {
    refreshCaptcha()

    captcha = new BaseCaptcha({
        doDown() {
            sliderMoveBtnRef.value.style.backgroundPosition = `-${getSize(5)}px 31.0092%`
        },
        doMove(currentCaptchaConfig) {
            const moveX = currentCaptchaConfig.moveX
            sliderMoveBtnRef.value.style.transform = `translate(${moveX}px, 0px)`
            sliderImgDivRef.value.style.transform = `translate(${moveX}px, 0px)`
        },
        valid(captchaConfig) {
            let data = {
                bgImageWidth: captchaConfig.bgImageWidth,
                bgImageHeight: captchaConfig.bgImageHeight,
                sliderImageWidth: captchaConfig.sliderImageWidth,
                sliderImageHeight: captchaConfig.sliderImageHeight,
                startSlidingTime: captchaConfig.startTime,
                endSlidingTime: captchaConfig.stopTime,
                trackList: captchaConfig.trackArr
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
    http['get_capcha_source']().then((res) => {
        reset()

        // 缩放
        fieldsSizeLargen(res.data.captcha)

        currentCaptchaId.value = res.data.id
        bgImgRef.value.setAttribute('src', res.data.captcha.backgroundImage)
        sliderImgRef.value.setAttribute('src', res.data.captcha.sliderImage)

        const bgImgW = parseFloat(getStyle(bgImgRef.value, 'width'))
        const bgImgH = parseFloat(getStyle(bgImgRef.value, 'height'))
        const sliderImgW = parseFloat(getStyle(sliderImgRef.value, 'width'))
        const sliderImgH = parseFloat(getStyle(sliderImgRef.value, 'height'))

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
            img {
                width: 100%;
            }
        }

        .slider-img-div {
            height: 100%;
            position: absolute;
            transform: translate(0px, 0px);
            img {
                height: 100%;
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

        .refresh-btn,
        .close-btn {
            display: inline-block;
            transition: transform 0.3s;

            &:active {
                transform: scale(0.9);
            }
        }

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

    .slider-move-btn:hover,
    .close-btn:hover,
    .refresh-btn:hover {
        cursor: pointer;
    }
}
</style>
