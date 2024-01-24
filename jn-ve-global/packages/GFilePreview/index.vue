<template>
    <div
        v-if="previewType && !loadComSourceErr"
        v-loading="loadingSourceFlag || loadComSourceFlag"
        class="g-file-preview__wrapper"
        :style="`height: ${[PreviewType.IMG].includes(previewType) ? 0 : contentHeight}`"
    >
        <!-- 图片预览 -->
        <ElImageViewer
            v-if="fileUrl && [PreviewType.IMG].includes(previewType)"
            :url-list="[fileUrl]"
            @close="emits('close')"
        />

        <!-- 本地 word、excel 使用插件 -->
        <component
            :is="currentOfficeCom"
            v-if="
                fileUrl &&
                    [PreviewType.DOCX, PreviewType.EXCEL].includes(previewType) &&
                    currentOfficeCom &&
                    isMounted
            "
            :src="fileUrl"
            :style="`height: ${contentHeight}`"
        />

        <!-- 本地 pdf 使用 pdfjs/viewer 预览 -->
        <iframe
            v-if="fileUrl && [PreviewType.PDF].includes(previewType)"
            :src="localPdfjsViewerUrl"
            frameborder="0"
            :style="`width: 100%; height: ${contentHeight}; padding: 0; margin: 0`"
        />

        <!-- wps 内嵌预览 -->
        <iframe
            v-if="fileUrl && [PreviewType.WPS].includes(previewType)"
            :src="fileUrl"
            frameborder="0"
            :style="`width: 100%; height: ${contentHeight}; padding: 0; margin: 0`"
        />
    </div>

    <div v-else class="error">
        {{ !loadComSourceErr ? '文件类型出错，或类型不支持预览' : '加载资源出错....' }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GFilePreview'
})
</script>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watchEffect, watch } from 'vue'
import { IMG_EXT } from './constant/fileTypeList'
import { getFileType } from './utils'
import _ from 'lodash'
import useSource from './hooks/useSource'
import { ElImageViewer } from 'element-plus'
import { getFileBlobUrlByRequest, getFileWpsPreviewUrl } from '../GUpload/utils'
import { global } from '@jsjn/utils'
import { PreviewMode, PreviewType } from './constant/enums'
import useLocalPreviewMode from './hooks/useLocalPreviewMode'

const props = withDefaults(
    defineProps<{
        fileName: string
        fileId?: string
        source?: string | Blob
        downloadUrl?: string
        /**
         * 已获取好的 wps 预览的 url
         */
        wpsPreviewUrl?: string
        /**
         * 下载的请求超时时间
         */
        timeout?: number
        /**
         * 内容高度
         */
        contentHeight?: string
        /**
         * 使用 wps 预览的接口 url
         */
        getWpsEditLinkApi?: string
        /**
         * 预览模式
         */
        previewMode?: PreviewMode
    }>(),
    {
        downloadUrl: '/kinso-basic-open-server/v1/document/file/download',
        getWpsEditLinkApi: '/supervision-publicuse-server/v1/wps/preview',
        timeout: 1000 * 20,
        contentHeight: '90vh'
    }
)

const emits = defineEmits(['close'])

const { localPreviewMode, isWpsPreview } = useLocalPreviewMode({ props })

const documentTitleCache = global.document.title
onUnmounted(() => (global.document.title = documentTitleCache))

const loadingSourceFlag = ref<boolean>(true)
const fileUrl = ref<string>('')
const isLocalCreateURL = ref<boolean>(false)
const isMounted = ref<boolean>(false)

// pdfjs 提供的 viewer 预览地址
const localPdfjsViewerUrl = computed(
    () => `${global.location.origin}/lib/pdfjs-4.0.379/web/viewer.html?file=${fileUrl.value}`
)

onMounted(() => {
    nextTick(() => {
        isMounted.value = true
    })
})

/**
 * 预览类型与文件名有区别
 * 预览类型是通过文件名区分出来的，主要包含见：PreviewType
 */
const previewType = computed<PreviewType>(() => {
    const fileType = getFileType(props.fileName)

    // wps 预览
    if (isWpsPreview(props.fileName)) {
        return PreviewType.WPS
    }

    // 图片预览，不受预览模式影响
    if (IMG_EXT.includes(fileType)) {
        return PreviewType.IMG
    }

    // 本地预览
    if (['pdf'].includes(fileType)) {
        return PreviewType.PDF
    }

    if (['docx'].includes(fileType)) {
        return PreviewType.DOCX
    }

    if (['xls', 'xlsx'].includes(fileType)) {
        return PreviewType.EXCEL
    }

    return null
})

const { initSource, currentOfficeCom, loadComSourceFlag, loadComSourceErr } = useSource({
    previewType
})

/**
 * 监听预览类型变化，初始化本地预览资源
 */
watch(
    () => previewType.value,
    (type) => {
        if (!type || localPreviewMode.value === PreviewMode.WPS) return
        if ([PreviewType.DOCX, PreviewType.EXCEL].includes(type)) {
            initSource()
        }
    },
    { immediate: true }
)

watchEffect(() => {
    fileUrl.value = ''
    if (!previewType.value) return

    // wps 预览行为
    if (previewType.value === PreviewType.WPS) {
        if (props.wpsPreviewUrl) {
            fileUrl.value = props.wpsPreviewUrl
            loadingSourceFlag.value = false
            return
        }

        const id = props.fileId
        const reqUrl = `${props.getWpsEditLinkApi}?fileId=${id}&fileName=${props.fileName}`
        loadingSourceFlag.value = true

        getFileWpsPreviewUrl(reqUrl, props.timeout)
            .then((url) => {
                if (url) {
                    fileUrl.value = url
                    loadingSourceFlag.value = false
                } else {
                    loadingSourceFlag.value = false
                    loadComSourceErr.value = true
                }
            })
            .catch(() => {
                loadingSourceFlag.value = false
                loadComSourceErr.value = true
            })

        return
    }

    const id = props.fileId
    const source = props.source

    // 用户传递已经处理好的数据：url 或者 blob
    if (source) {
        if (_.isString(source)) {
            fileUrl.value = source
            loadingSourceFlag.value = false
            return
        }
        fileUrl.value = global.URL.createObjectURL(source as Blob)
        isLocalCreateURL.value = true
        loadingSourceFlag.value = false
        return
    }

    // 用户直接传递 id：通过接口获取数据
    if (id) {
        loadingSourceFlag.value = true
        loadComSourceErr.value = false

        getFileBlobUrlByRequest(`${props.downloadUrl}/${id}`, previewType.value, props.timeout)
            .then((url) => {
                fileUrl.value = url
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
    fileUrl.value && isLocalCreateURL.value && global.URL.revokeObjectURL(fileUrl.value)
})
</script>

<style lang="scss" scoped>
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
