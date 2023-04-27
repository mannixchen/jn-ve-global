<template>
    <jn-editor v-model="html" :upload-url="uploadUrl" :download-url="downloadUrl" />
</template>

<script lang="ts">
export default {
    name: 'ServerUploadTest'
}
</script>

<script lang="ts" setup>
import { watch, ref } from 'vue'

const prefix = '/proxy'

const html = ref<string>('')
const uploadUrl = `${prefix}/kinso-basic-open-server/v1/document/file/upload`
const downloadUrl = `${prefix}/kinso-basic-open-server/v1/document/file/download`

watch(
    () => html.value,
    (val) => {
        console.log(`%c 编辑器内容 ==== `, 'color: yellow;', val)
    }
)
</script>

<style lang="scss" scoped></style>
