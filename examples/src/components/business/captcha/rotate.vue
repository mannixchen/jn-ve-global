<template>
    <div class="slider rotate">
        <h3>安全验证</h3>

        <div class="content">
            <div class="bg-img-div">
                <img id="rotate-bg-img" ref="rotateBgImgRef" src="">
            </div>
            <div ref="rotateImgDivRef" class="rotate-img-div">
                <img id="rotate-image" ref="rotateImageRef" src="">
            </div>
        </div>
        <div class="slider-move">
            <div class="slider-move-track">
                请拖动滑块旋转正确位置
            </div>
            <div
                id="rotate-move-btn"
                ref="rotateMoveBtnRef"
                class="slider-move-btn"
                @mousedown="handleMousedown"
            />
        </div>
        <div class="bottom">
            <div id="rotate-close-btn" class="close-btn" @click="emits('close')" />
            <div id="rotate-refresh-btn" class="refresh-btn" @click="refreshCaptcha" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'CaptchaRotate'
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
const rotateBgImgRef = ref<HTMLElement>(null)
const rotateImageRef = ref<HTMLElement>(null)
const rotateMoveBtnRef = ref<HTMLElement>(null)
const rotateImgDivRef = ref<HTMLElement>(null)

onMounted(() => {
    refreshCaptcha()

    captcha = new BaseCaptcha({
        doDown(config) {
            rotateMoveBtnRef.value.style.backgroundPosition = `-${getSize(5)}px 31.0092%`
        },
        doMove(currentCaptchaConfig) {
            const moveX = currentCaptchaConfig.moveX
            rotateMoveBtnRef.value.style.transform = `translate(${moveX}px, 0px)`
            rotateImgDivRef.value.style.transform = `rotate(${
                moveX / (currentCaptchaConfig.end / 360)
            }deg)`
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
    http['get_capcha_source']({
        type: 'ROTATE'
    }).then((res) => {
        reset()

        // 缩放
        fieldsSizeLargen(res.data.captcha)

        currentCaptchaId.value = res.data.id
        rotateBgImgRef.value.setAttribute('src', res.data.captcha.backgroundImage)
        rotateImageRef.value.setAttribute('src', res.data.captcha.sliderImage)

        const bgImgH = parseFloat(getStyle(rotateBgImgRef.value, 'height'))
        const sliderImgW = parseFloat(getStyle(rotateImageRef.value, 'width'))
        const sliderImgH = parseFloat(getStyle(rotateImageRef.value, 'height'))

        captcha.initConfig(getSize(206), bgImgH, sliderImgW, sliderImgH, getSize(206))

        // 抛出刷新事件
        emits('refresh', res.data.id)
    })
}

function reset() {
    rotateMoveBtnRef.value.style.backgroundPosition = `-${getSize(5)}px 11.79625%`
    rotateMoveBtnRef.value.style.transform = 'translate(0px, 0px)'
    rotateImgDivRef.value.style.transform = 'rotate(0deg)'
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

        .rotate-img-div {
            height: 100%;
            position: absolute;
            transform: rotate(0deg);
            margin-left: 50px;
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

        .refresh-btn,
        .close-btn {
            display: inline-block;
            transition: transform 0.3s;

            &:active {
                transform: scale(0.9);
            }
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

    .after {
        color: #88949d;
    }
}
</style>
