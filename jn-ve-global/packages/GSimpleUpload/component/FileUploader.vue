<template>
    <div class="file-uploader">
        <uploader
            ref="uploaderRef"
            class="uploader-wrapper"
            :opptions="options"
            :file-status-text="fileStatusText"
            :auto-start="false"
            @file-added="onFileAdded"
            @file-success="onFileSuccess"
            @file-progress="onFileProgress"
            @file-error="onFileError"
        >
            <uploader-unsupport />
        </uploader>
    </div>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import uploader from 'vue-simple-uploader'
import { FileUploaderProps } from '../interface'

const COMPONENT_NAME = 'FileUploader'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<FileUploaderProps>(), {
    autoStart: false,
    fileStatusText: () => ({
        success: '上传成功',
        error: 'error',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
    }),
    options: () => ({
        target: ''
    })
})

const onFileAdded = (file, event) => {}

// const onFileSuccess = 
</script>

<style lang="scss" scoped></style>
