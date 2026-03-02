<template>
    <div v-loading="loadFlag" class="pic-wrapper" @click="getValidateCode">
        <!-- <PicCode v-if="createFlag" v-model="code" :is-random="false" /> -->
        <img v-if="createFlag" :src="currentImg" alt="">
    </div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'ValidateCode'
})
</script>

<script lang="tsx" setup>
import { ref, onMounted, computed, inject, watch } from 'vue'
import { apis } from '@/api'
// import PicCode from '@jsjn/basic-core-components/business/picCode/index.vue'
import { BaseResponse } from 'jn-ve-global'
import { v4 as uuidV4 } from 'uuid'
import loginedKey from '../constant/injectionKey'

const emits = defineEmits(['update:modelValue'])

const http = apis.common
const createFlag = ref<boolean>(false)
const loadFlag = ref<boolean>(false)
const isLogined = inject(loginedKey)

watch(() => isLogined.value, getValidateCode, { immediate: true })

function getValidateCode() {
    loadFlag.value = true
    createFlag.value = false

    // 验证码唯一协同登录唯一
    const key = uuidV4().replace(/-/g, '')
    emits('update:modelValue', key)

    getCodeImg(key)
}

/**
 * 获取后台生成的字符
 */
const code = ref<string>('')
function getCodeText(key: string) {
    http['getValidateCode']({ key })
        .then((res) => {
            if (res.code === '000000') {
                code.value = res.data
            }
        })
        .finally(() => {
            createFlag.value = true
            loadFlag.value = false
        })
}

/**
 * 获取后台生成的图片
 */
const currentImg = ref<string>()
function getCodeImg(key: string) {
    http['getValidateCodeImg']({ key })
        .then((res) => {
            if (res.code === '000000') {
                currentImg.value = `data:image/gif;base64,${res.data}`
            }
        })
        .finally(() => {
            createFlag.value = true
            loadFlag.value = false
        })
}
</script>

<style lang="scss" scoped>
.pic-wrapper {
    width: 200px !important;
    height: 60px !important;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);

    :deep(.el-loading-spinner) {
        transform: translateY(-50%) !important;
    }

    > img {
        width: 100%;
        height: 100%;
        cursor: pointer;
        border-radius: 4px;
    }
}
</style>
