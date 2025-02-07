import { ElMessageBox, ElMessage } from 'element-plus'
import { UploadFile } from '../interface/UploadFile'
import { fillFileMemoryUrl, fillFileWpsPreviewUrl } from '../utils'
import { typeIsValid } from '../../GFilePreview/utils'
import { PreviewMode, WPS_PREVIEW_EXT } from '../../GFilePreview'
import { getToken } from '../../_globalConstant/vuexCache'

export default ({
    uploadRef,
    currentFile,
    props,
    modalShow,
    attrs,
    emits,
    localDownloadUrl,
    isWpsPreview,
    localGetWpsEditLinkApi
}) => {
    // 预览
    const filePreview = (file: UploadFile) => {
        // 预览行为，覆盖本地
        if (props.onMagnify) {
            props.onMagnify(file)
            return
        }

        // wps 预览
        if (isWpsPreview(file.name)) {
            wpsPreview(file).then(() => {
                currentFile.value = file
                modalShow.value = true
            })
            return
        }

        // 默认预览行为
        loadFile(file).then(() => {
            currentFile.value = file
            modalShow.value = true
        })
    }

    // 下载
    const fileDownload = (file: UploadFile) => {
        // 下载行为，覆盖本地
        if (props.onDownload) {
            props.onDownload(file)
            return
        }

        /**
         * url 直接交由浏览器下载：url + fileId + token
         */
        let aDom = document.createElement('a')
        aDom.href = file.url
            ? file.url
            : `${localDownloadUrl.value}/${file.fileId}?token=${getToken()}`
        aDom.setAttribute('download', file.name)
        aDom.click()
        aDom = null

        // 先走 js 内存下载
        // loadFile(file).then(() => {
        //     // 默认下载行为
        //     let aDom = document.createElement('a')
        //     aDom.href = file.url
        //     aDom.setAttribute('download', file.name)
        //     aDom.click()
        //     aDom = null
        // })
    }

    /**
     * 删除头像：
     * 1. 清空文件列表（因为 Avatar 限制了只能存在一个文件）
     * 2. 清空当前活跃的 file
     * 3. 清空绑定的 fileID
     * 4. 触发用户传递的 on-remove
     *
     * 清空列表的方法并不能触发组件的 onRemove 事件，所以要在这里抛出绑定的值
     */
    const delAvatar = () => {
        ElMessageBox.confirm(`是否删除，重新上传`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            /**
             * 如果当前 file 是上传的 file 对象，需要调用组件的 handleRemove 方法
             * 将 file 传递给方法，移除后触发 on-remove 方法
             */
            if (currentFile.value.raw && currentFile.value.raw) {
                uploadRef.value.handleRemove(currentFile.value)
            }

            if (currentFile.value && !currentFile.value.raw) {
                // 清空绑定的 fileId
                emits('update:modelValue', '')
                // 同时执行用户传递的
                attrs.value['on-remove']?.()
            }

            currentFile.value = null
        })
    }

    // 删除
    const delFile = (file: UploadFile) => {
        ElMessageBox.confirm(`是否删除 ${file.name}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            uploadRef.value.handleRemove(file)
            props.onDelete?.(file)
        })
    }

    /**
     * 使用 wps 预览：使用的是 wps 的收费 sdk，需要用户自己购买
     *  - 监管购买了
     *  - 新核心不能用
     */
    function wpsPreview(file: UploadFile) {
        return new Promise<UploadFile>((resolve, reject) => {
            if (file.wpsPreviewUrl) {
                resolve(file)
            } else {
                fillFileWpsPreviewUrl(file, localGetWpsEditLinkApi.value, props.timeout).then(
                    (res) => {
                        if (res.wpsPreviewUrl) {
                            resolve(file)
                        } else {
                            const msg = '获取 wps 预览地址失败，请检查！'
                            ElMessage.error(msg)
                            reject(new Error(msg))
                        }
                    }
                )
            }
        })
    }

    /**
     * 加载文件资源
     *  - 已有：执行行为 预览 or 下载
     *  - 未有：请求接口，回调执行行为
     * @param file
     * @param cb
     * @returns
     */
    function loadFile(file: UploadFile) {
        return new Promise<UploadFile>((resolve, reject) => {
            if (file.url) {
                resolve(file)
            } else {
                fillFileMemoryUrl(file, localDownloadUrl.value, props.timeout).then((res) => {
                    if (res.url) {
                        resolve(file)
                    } else {
                        const msg = '获取文件出错，请检查！'
                        ElMessage.error(msg)
                        reject(new Error(msg))
                    }
                })
            }
        })
    }

    return {
        filePreview,
        fileDownload,
        delAvatar,
        delFile,
        wpsPreview,
        loadFile
    }
}
