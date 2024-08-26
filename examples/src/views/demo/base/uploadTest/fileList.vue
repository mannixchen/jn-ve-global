<template>
    <div class="examples-base-wrapper">
        <el-button type="success" size="small" @click="updateFileList">
            更新列表
        </el-button>

        <h3>Text</h3>
        <div class="box">
            <g-upload
                v-model="fileIds"
                v-model:fileList="fileList"
                :action="FILE_UPLOAD_URL"
                list-type="text"
                :download-url="FILE_DOWNLOAD_URL"
                :size="3000"
            />
        </div>

        <h3>照片墙</h3>
        <g-upload
            v-model="fileIds"
            v-model:fileList="fileList"
            :action="FILE_UPLOAD_URL"
            list-type="picture-card"
            :download-url="FILE_DOWNLOAD_URL"
            :timeout="1000 * 60"
        />

        <h3>列表</h3>
        <g-upload
            v-model="fileIds"
            v-model:fileList="fileList"
            :action="FILE_UPLOAD_URL"
            list-type="picture"
            del-hide
            :download-url="FILE_DOWNLOAD_URL"
            :timeout="1000 * 60"
        />

        <h3>头像</h3>
        <g-upload
            v-model="avatarId"
            :img-url="imgUrl"
            :action="FILE_UPLOAD_URL"
            list-type="avatar"
            :download-url="FILE_DOWNLOAD_URL"
        />
    </div>
</template>

<script lang="ts">
export default {
    name: 'FileList'
}
</script>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive } from 'vue'
import source from './fileList.json'
import { FILE_UPLOAD_URL, FILE_DOWNLOAD_URL } from '@/constants/commonApiUrl'

const fileIds = ref<string[]>([])
const fileList = ref<any[]>([])

// 头像
const avatarId = ref<string>('')
const imgUrl = ref('')

watch(
    () => avatarId.value,
    (avatarId) => {
        console.log(`%c avatarId == `, 'color: #f56c6c;', avatarId)
    }
)

watch(
    () => fileIds.value,
    (list) => {
        console.log(`%c fileIds == `, 'color: #67c23a;', fileIds.value)
    }
)

watch(
    () => fileList.value,
    (list) => {
        console.log(
            `%c fileList onChanges *************************************** `,
            'color: #67c23a;',
            list
        )
    },
    {
        deep: true
    }
)

const updateFileList = () => {
    fileList.value = source
}

const onPreview = (file) => {
    console.group(`%c onPreview`, 'color: #000;', +new Date())
    console.log(`%c file == `, 'color: #67c23a;', file)
    console.groupEnd()
}

const onDownload = (file) => {
    console.group(`%c onDownload`, 'color: #000;', +new Date())
    console.log(`%c file == `, 'color: #67c23a;', file)
    console.groupEnd()
}

const onProgress = (event, file, fileList) => {
    console.group(`%c onProgress`, 'color: #000;', +new Date())
    console.log(`%c event == `, 'color: #000;', event)
    console.log(`%c fileList == `, 'color: #f56c6c;', fileList)
    console.log(`%c file == `, 'color: #67c23a;', file)
    console.groupEnd()
}

const onError = (err, file, fileList) => {
    console.group(`%c onError`, 'color: red;', +new Date())
    console.log(`%c err == `, 'color: #f56c6c;', err)
    console.log(`%c fileList == `, 'color: #f56c6c;', fileList)
    console.log(`%c file == `, 'color: #67c23a;', file)
    console.groupEnd()
}

const onChange = (file, fileList) => {
    console.group(`%c onChange`, 'color: #000;', +new Date())
    console.log(`%c fileList == `, 'color: #f56c6c;', fileList)
    console.log(`%c file == `, 'color: #67c23a;', file)
    console.groupEnd()
}

const onSuccess = (response, file, fileList2) => {
    console.group(`%c onSuccess`, 'color: #000;')
    console.log(`%c response == `, 'color: #67c23a;', response)
    console.log(`%c fileList2 == `, 'color: #f56c6c;', fileList2)
    console.log(`%c file == `, 'color: #67c23a;', file)
    console.groupEnd()
}

const onRemove = (file, fileList) => {
    console.group(`%c onRemove`, 'color: #000;')
    console.log(`%c response == `, 'color: #67c23a;', file)
    console.log(`%c fileList2 == `, 'color: #f56c6c;', fileList)
    console.groupEnd()
}
</script>

<style lang="scss" scoped>
h3 {
    margin: 20px 0 10px 0;
}

.box {
    width: 400px;
}
</style>

<style lang="scss"></style>
