import { watch, ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFile } from '../interface/UploadFile'

interface Params {
    currentFile: Ref<UploadFile>
    localFileList: Ref<UploadFile[]>
    isWpsPreview: (fileName: string) => boolean
    wpsPreview: (file: UploadFile) => Promise<UploadFile>
    loadFile: (file: UploadFile) => Promise<UploadFile>
}

export default ({ currentFile, localFileList, isWpsPreview, wpsPreview, loadFile }: Params) => {
    // 连续预览
    const preImgHandle = () => {
        const tIndex = _findTargetFileIndex(currentFile.value, localFileList.value)
        const preIndex = tIndex - 1
        if (preIndex < 0) {
            ElMessage.warning('没有了!')
            return
        }
        const tFile = localFileList.value[preIndex]
        _previewTargetFile(tFile)
    }

    const nextImgHandle = () => {
        const tIndex = _findTargetFileIndex(currentFile.value, localFileList.value)
        const preIndex = tIndex + 1
        if (preIndex >= localFileList.value.length) {
            ElMessage.warning('到底了!')
            return
        }
        const tFile = localFileList.value[preIndex]
        _previewTargetFile(tFile)
    }

    function _previewTargetFile(file: UploadFile) {
        if (isWpsPreview(file.name)) {
            // wps 预览，回填 file.wpsPreviewUrl
            wpsPreview(file).then((packagedFile) => {
                currentFile.value = packagedFile
            })
            return
        }

        // 普通预览，回填 file.url
        loadFile(file).then((packagedFile) => {
            currentFile.value = packagedFile
        })
    }

    function _findTargetFileIndex(file: UploadFile, fileList: UploadFile[]) {
        return fileList.findIndex((item) => item.fileId === file.fileId)
    }

    return {
        preImgHandle,
        nextImgHandle
    }
}
