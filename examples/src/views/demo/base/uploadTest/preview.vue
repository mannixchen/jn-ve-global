<template>
    <g-button-group :btns="btns" />

    <g-modal v-model="modalShow" title="文件预览">
        <g-file-preview
            :file-name="currentFile.name"
            :file-id="currentFile.fileId"
            :source="currentSource"
            :download-url="FILE_DOWNLOAD_URL"
        />
    </g-modal>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import { BtnProps } from 'jn-ve-global'
import fileList from './fileList.json'
import { apis } from '@/api'
import { FILE_DOWNLOAD_URL } from '@/constants/commonApiUrl'

const http = apis.common
const currentFile = ref()
const currentSource = ref<string | Blob>(undefined)
const modalShow = ref<boolean>(false)
const btns = reactive<BtnProps[]>([
    {
        label: '展示 docx',
        onClick() {
            modalShow.value = true
            currentFile.value = fileList[3]

            // http['getFileStream']({
            //     id: fileList[3].fileId
            // }).then((res) => {
            //     currentSource.value = res as any
            // })
        }
    },
    {
        label: '展示 excel',
        type: 'danger',
        onClick() {
            modalShow.value = true
            currentFile.value = fileList[4]

            // http['getFileStream']({
            //     id: fileList[4].fileId
            // }).then((res) => {
            //     currentSource.value = res as any
            // })
        }
    },
    {
        label: '展示 pdf',
        type: 'success',
        onClick() {
            modalShow.value = true
            currentFile.value = fileList[2]

            // http['getFileStream']({
            //     id: fileList[2].fileId
            // }).then((res) => {
            //     currentSource.value = res as any
            // })
        }
    },
    {
        label: '展示 图片',
        type: 'success',
        onClick() {
            modalShow.value = true
            currentFile.value = fileList[1]

            // http['getFileStream']({
            //     id: fileList[1].fileId
            // }).then((res) => {
            //     const blob = new Blob([res as any], { type: 'image/*;' })
            //     currentSource.value = res as any
            // })
        }
    }
])
</script>

<style lang="scss" scoped></style>
