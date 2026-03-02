<template>
    <div class="test-box">
        <g-button-group :btns="btns" />
        <GUploadFolder
            ref="this$GUploadFolder"
            :data="filesData"
            :upload-url="FILE_UPLOAD_URL"
            :download-url="FILE_DOWNLOAD_URL"
            :disabled="false"
            @folder-content-change="handleFolderContentChange"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FolderTest'
})
</script>

<script lang="ts" setup>
import { watch, ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import mockFolder from './folder.json'
import { FILE_UPLOAD_URL, FILE_DOWNLOAD_URL } from '@/constants/commonApiUrl'
import { type BtnProps, GUploadFolder } from 'jn-ve-global'

const filesData = ref(mockFolder)
const this$GUploadFolder = ref<any>(null)

watch(
    () => filesData.value,
    (data) => {
        console.log(`%c 文件夹：`, 'color: #67c23a;', data)
    },
    {
        deep: true
    }
)

const btns = reactive<BtnProps[]>([
    {
        label: '下载全部',
        onClick() {
            this$GUploadFolder.value.downloadAll()
        }
    }
])

function handleFolderContentChange(currentFolder, currentFiles) {
    console.log(`%c 1. 当前文件夹 === `, 'color: #67c23a;', currentFolder)
    console.log(`%c 2. 当前活跃的文件列表 === `, 'color: #f56c6c;', currentFiles)
}
</script>

<style lang="scss" scoped>
.test-box {
    background-color: #fff;
}
</style>
