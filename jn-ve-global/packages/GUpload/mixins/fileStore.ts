import { ref, computed, watch, reactive } from 'vue'
import _ from 'lodash'
import { getFileType, getFileBlobUrlByRequest } from '../utils'

export default ({ emits, props, attrs, uploadRef }) => {
    /**
     * 当前活跃的 file
     *  1. 列表模式能够获取到点击的文件信息
     *  2. avatar 只能够获取用户默认传递 | 上传成功的 file
     */
    const currentFile = ref(null)

    /**
     * 普通的列表模式，将抛出有效的 fileList
     */
    const localFileList = computed({
        get: () =>
            _.cloneDeep(props.fileList).map((file, index) => {
                const proxyFile = reactive(file)
                // 异步获取文件的 url，proxy 代理 file，file.url 发生变化时，会渲染列表
                if (!file.url && file.fileId && props.downloadUrl) {
                    const fileType = getFileType(file.name)
                    const url = `${props.downloadUrl}/${file.fileId}`
                    getFileBlobUrlByRequest(url, fileType).then((localBolbUrl) => {
                        proxyFile.url = localBolbUrl
                    })
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

            if (props.imgUrl || !props.downloadUrl) return

            if (attrs.value['list-type'] === 'avatar') {
                const url = `${props.downloadUrl}/${fileId}`
                const localBolbUrl = await getFileBlobUrlByRequest(url)
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