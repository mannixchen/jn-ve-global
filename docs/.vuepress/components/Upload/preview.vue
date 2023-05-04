<template>
    <g-button-group :btns="btns" />

    <g-modal v-model="modalShow" title="文件预览">
        <g-file-preview :file-name="currentFile.name" :source="currentFile.url" />
    </g-modal>
</template>

<script lang="ts" setup name="FilePreview">
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import type { BtnProps } from 'jn-ve-global'
import fileList from './data/fileList.json'

const currentFile = ref()
const modalShow = ref<boolean>(false)

const btns = reactive<BtnProps[]>([
    {
        label: '展示 docx',
        onClick() {
            currentFile.value = fileList[2]
            modalShow.value = true
        }
    },
    {
        label: '展示 excel',
        type: 'danger',
        onClick() {
            modalShow.value = true
            currentFile.value = fileList[3]
        }
    },
    {
        label: '展示 pdf',
        type: 'success',
        onClick() {
            modalShow.value = true
            currentFile.value = fileList[1]
        }
    },
    {
        label: '展示 图片',
        type: 'success',
        onClick() {
            modalShow.value = true
            currentFile.value = fileList[0]
        }
    }
])
</script>

<style lang="scss" scoped></style>
