import { watch, ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import { PreviewMode } from '../constant/enums'
import { global } from '@jsjn/utils'
import { UploadFile } from '../../GUpload/interface/UploadFile'
import { WPS_PREVIEW_EXT } from '../constant/fileTypeList'
import { typeIsValid } from '../utils'

interface Params {
    /**
     * 预览模式
     */
    previewMode?: PreviewMode
    props: {
        [key: string]: any
    }
}

export default ({
    props
}: Params): {
    localPreviewMode: ComputedRef<PreviewMode>
    isWpsPreview: (fileName: string) => boolean
} => {
    /**
     * 预览模式
     *  - wps: 使用 wps 预览，仅限于已经购买了 wps 服务的客户，监管购买了
     *  - default: 默认预览，组件库封装的预览
     *
     * 默认根据微应用的应用标志位判断，用户 props 传递的权重更高
     */
    const localPreviewMode = computed(
        () =>
            props.previewMode ||
            (['regtech'].includes(global.__VUE_APP_MODE__) ? PreviewMode.WPS : PreviewMode.LOCAL)
    )

    /**
     * 判断是否需要前往 wps 预览
     * @param file
     * @returns
     */
    function isWpsPreview(fileName: string) {
        return localPreviewMode.value === PreviewMode.WPS && typeIsValid(WPS_PREVIEW_EXT, fileName)
    }

    return {
        localPreviewMode,
        isWpsPreview
    }
}
