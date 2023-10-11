<template>
    <div
        v-if="previewType && !loadComSourceErr"
        v-loading="loadingSourceFlag || loadComSourceFlag"
        class="g-file-preview__wrapper"
    >
        <component
            :is="currentOfficeCom"
            v-if="['pdf', 'docx', 'excel'].includes(previewType) && currentOfficeCom && isMounted"
            :src="fileUrl"
            style="height: 90vh"
        />

        <img v-if="previewType === 'img'" :src="fileUrl" alt="">
    </div>

    <div
        v-else
        class="error"
        v-text="
            !loadComSourceErr
                ? '文件类型出错，目前仅支持 [image,pdf,docx,xlsx]'
                : '加载资源出错....'
        "
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GFilePreview'
})
</script>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watchEffect, watch } from 'vue'
import { imgSuffix } from '../GUpload/constant/fileTypeList'
import { getFileType } from '../GUpload/utils'
import _ from 'lodash'
import myAxios from '../_http/http'
import useSource from './hooks/useSource'

const props = withDefaults(
    defineProps<{
        fileName: string
        fileId?: string
        source?: string | Blob
        downloadUrl?: string
        /**
         * 下载的请求超时时间
         */
        timeout?: number
    }>(),
    {
        downloadUrl: '/kinso-basic-open-server/v1/document/file/download',
        timeout: 1000 * 20
    }
)

const loadingSourceFlag = ref<boolean>(true)

const isMounted = ref<boolean>(false)
onMounted(() => {
    nextTick(() => {
        isMounted.value = true
    })
})

// 预览类型
const previewType = computed<'img' | 'pdf' | 'docx' | 'excel'>(() => {
    const fileType = getFileType(props.fileName)
    if (imgSuffix.includes(fileType)) {
        return 'img'
    }

    if (fileType === 'pdf') {
        return 'pdf'
    }

    if (['docx' /* , 'doc' */].includes(fileType)) {
        return 'docx'
    }

    if (['xls', 'xlsx'].includes(fileType)) {
        return 'excel'
    }

    return null
})

const { initSource, currentOfficeCom, loadComSourceFlag, loadComSourceErr } = useSource({
    previewType
})
watch(
    () => previewType.value,
    (type) => {
        if (!type) return
        if (type !== 'img') {
            initSource()
        }
    },
    { immediate: true }
)

const fileUrl = ref<string>('')
const isLocalCreateURL = ref<boolean>(false)
watchEffect(() => {
    if (!previewType.value) return

    const id = props.fileId
    const source = props.source

    // 用户传递已经处理好的数据
    if (source) {
        if (_.isString(source)) {
            fileUrl.value = source
            loadingSourceFlag.value = false
            return
        }
        fileUrl.value = window.URL.createObjectURL(source as Blob)
        isLocalCreateURL.value = true
        loadingSourceFlag.value = false
        return
    }

    // 用户直接传递 id
    if (id) {
        loadingSourceFlag.value = true
        loadComSourceErr.value = false

        myAxios
            .get(`${props.downloadUrl}/${id}`, {
                responseType: 'blob',
                timeout: props.timeout
            })
            .then((res) => {
                fileUrl.value = window.URL.createObjectURL(res as any)
                isLocalCreateURL.value = true
                loadingSourceFlag.value = false
            })
            .catch(() => {
                loadingSourceFlag.value = false
                loadComSourceErr.value = true
            })
    }
})

onUnmounted(() => {
    fileUrl.value && isLocalCreateURL.value && window.URL.revokeObjectURL(fileUrl.value)
})
</script>

<style lang="scss" scoped>
.g-file-preview__wrapper {
    min-height: 400px;
    max-height: 90vh;
    overflow: auto;
    max-width: 90vw;

    > img {
        display: block;
        margin: 0 auto;
    }
}

.error {
    font-size: 20px;
    color: var(--el-color-danger);
    text-align: center;
    margin: 20px 0;
}
</style>

<style>
.x-spreadsheet-contextmenu {
    display: none !important;
}
</style>
