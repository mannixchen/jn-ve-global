import { ref, computed, watch, reactive, Ref, WritableComputedRef } from 'vue'
import _ from 'lodash'
import { fillFileMemoryUrl, getFileBlobUrlByRequest } from '../utils'
import { getFileType } from '../../GFilePreview/utils'
import { UploadFile } from '../interface/UploadFile'
import { IMG_EXT } from '../../GFilePreview'

const sizeMapping = {
    text: 20,
    'picture-card': 146,
    'picture': 70,
    avatar: 146
}

export default ({
    emits,
    props,
    attrs,
    uploadRef,
    localDownloadUrl
}): {
    currentFile: Ref<UploadFile>
    localFileList: WritableComputedRef<UploadFile[]>
} => {
    /**
     * 当前活跃的 file
     *  1. 列表模式能够获取到点击的文件信息
     *  2. avatar 只能够获取用户默认传递 | 上传成功的 file
     */
    const currentFile = ref<UploadFile>(null)

    /**
     * 普通的列表模式，将抛出有效的 fileList
     */
    const localFileList = computed({
        get: () =>
            _.cloneDeep(props.fileList).map((file: UploadFile) => {
                // proxy 代理 file，file.url 发生变化时，会同步渲染 dom
                const proxyFile = reactive(file)

                // 异步获取文件的 url
                if (!file.url && file.fileId && localDownloadUrl.value) {
                    const fileType = getFileType(file.name)

                    /**
                     * 加载及装填图片的 “缩略图” ，来自服务器裁剪的图片资源
                     *  1. 必须是图片类型
                     *  2. 在上传文件成功后，会更新列表，但列表包含旧的元素，且旧的元素，已经装填过 thumb 了 --- 20250312 fix
                     */
                    if (IMG_EXT.includes(fileType) && !(file.thumb || file.url)) {
                        fillFileMemoryUrl(
                            proxyFile,
                            `${localDownloadUrl.value}`,
                            props.timeout,
                            'thumb',
                            `?width=${sizeMapping[attrs.value['list-type']]}`
                        )
                    }
                }
                return proxyFile
            }),
        set: (list) => {
            emits('update:fileList', list)
        }
    })

    // 头像模式回填
    const localImgUrl = ref<string>(props.imgUrl)
    watch(
        () => props.imgUrl,
        (imgUrl) => (localImgUrl.value = imgUrl)
    )

    /**
     * 头像将类似于单选，imgUrl 服务头像
     * fileList 服务文件列表上传
     */
    watch(
        () => localImgUrl.value,
        (url) => {
            if (attrs.value['list-type'] === 'avatar') {
                if (url) {
                    /**
                     * avatar 模式将意味着查看照片模式，而 currentFile 需要一个 name 属性
                     * 这里的 name 只是一个假象，为弹框模式做判断
                     */
                    currentFile.value = {
                        name: '*.png',
                        url: url
                    }
                } else if (!url) {
                    currentFile.value = null
                    uploadRef.value?.clearFiles()
                }
            }
        },
        { immediate: true }
    )

    watch(
        () => props.modelValue,
        async (fileId) => {
            if (!fileId) {
                localImgUrl.value = ''
                return
            }

            if (props.imgUrl || !localDownloadUrl.value) return

            if (attrs.value['list-type'] === 'avatar') {
                const url = `${localDownloadUrl.value}/${fileId}`
                const localBolbUrl = await getFileBlobUrlByRequest(url, undefined, props.timeout)
                localImgUrl.value = localBolbUrl
            }
        },
        { immediate: true }
    )

    return {
        currentFile,
        localFileList
    }
}
