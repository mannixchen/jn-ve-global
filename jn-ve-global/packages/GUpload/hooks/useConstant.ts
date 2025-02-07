import { computed, useAttrs, ref } from 'vue'
import { humpObj2PartitionObj, Local } from '@jsjn/utils'
import { getVuexCache, getToken } from '../../_globalConstant/vuexCache'

export default (props) => {
    const attrsSource = useAttrs()
    // 预览框
    const modalShow = ref<boolean>(false)

    /**
     * 传递参数有两种情况：
     *  1. 单独使用：传递的参数为短横线分割
     *  2. Form 中使用：传递的参数为驼峰命名
     *
     * 驼峰需要转换成短横线
     */
    const attrs = computed<{ [k: string]: any }>(() => humpObj2PartitionObj(attrsSource))

    /**
     * header 携带 token
     */
    const localReqHeaders = computed(() => {
        const transitiveHeader = attrs.value.headers
        let Authorization = transitiveHeader ? transitiveHeader.Authorization : ''

        // 缓存的优先级较高，会覆盖用户传递的
        const vuexCache = getVuexCache()
        if (vuexCache && vuexCache.loginInfo) {
            const token = getToken()
            Authorization = token ? `Bearer ${token}` : Authorization
        }

        if (Authorization) {
            return {
                ...transitiveHeader,
                Authorization
            }
        }
        return transitiveHeader
    })

    /**
     * 控件的类型：
     *  除去原有的三种，扩展了 'avatar' 类型
     *  avatar 实际取得 'picture-card'；（内置配置，方便用户）
     */
    const uploadListType = computed<'text' | 'picture' | 'picture-card' | 'avatar' | undefined>(
        () => {
            const type = attrs.value['list-type']
            return type === 'avatar' ? undefined : attrs.value['list-type']
        }
    )

    // 进度条的宽度
    const strokeWidth = computed(() => {
        let width: number
        switch (uploadListType.value) {
        case 'picture-card':
            width = 6
            break
        case 'picture':
            width = 4
            break
        case 'text':
            width = 2
            break
        default:
            width = 6
        }

        return width
    })

    /**
     * avatar 模式将取消文件列表的显示；（内置配置，方便用户）
     * avatar 相当于单选
     */
    const localShowFileList = computed(() =>
        attrs.value['list-type'] === 'avatar' ? false : attrs.value['show-file-list']
    )

    /**
     * avatar 模式将限制只能存在一个文件；（内置配置，方便用户）
     * 其他则取用户传递或不限制
     */
    const localLimit = computed(() =>
        attrs.value['list-type'] === 'avatar' ? 1 : attrs.value['limit']
    )

    /**
     * avatar 模式将限制文件类型为 'image/*'
     * 其他这由用户指定
     */
    const localAccept = computed(() => {
        if (attrs.value['accept']) return attrs.value['accept']
        return attrs.value['list-type'] === 'avatar' ? 'image/*' : attrs.value['accept']
    })

    /**
     * 默认地址，处理兼容无界
     */
    const localUploadUrl = computed(() => {
        if (!attrs.value['action']) return attrs.value['action']
        return _compatibilityUrl(attrs.value['action'])
    })

    const localDownloadUrl = computed(() => {
        if (!props.downloadUrl) return props.downloadUrl
        return _compatibilityUrl(props.downloadUrl)
    })

    const localGetWpsEditLinkApi = computed(() => {
        if (!props.getWpsEditLinkApi) return props.getWpsEditLinkApi
        return _compatibilityUrl(props.getWpsEditLinkApi)
    })

    function _compatibilityUrl(url: string) {
        if (!url) return url
        if (window['__MAIN_HOST_PATH__'] && !url.includes(window['__MAIN_HOST_PATH__'])) {
            return `${window['__MAIN_HOST_PATH__']}${url}`
        }
        return url
    }

    return {
        modalShow,
        attrs,
        localReqHeaders,
        uploadListType,
        strokeWidth,
        localShowFileList,
        localLimit,
        localAccept,
        localUploadUrl,
        localDownloadUrl,
        localGetWpsEditLinkApi
    }
}
