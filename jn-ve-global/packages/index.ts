import type { App, Plugin } from 'vue'
import type { BaseModuleMode } from './_globalConstant/baseModuleMode'
import { ReqHandle, ResHandle } from './_http/httpInterceptors'

export * from './GTable'
export * from './GForm'
export * from './GSelectTree/v1'
export * from './GBaseModule'
export * from './GTabs'
export * from './GChart'
export * from './GFormGenerate'
export * from './JnEditor/interface/tinymce'
export * from './GUpload/interface/UploadFile'

export { default as GAddress } from './GAddress/index.vue'
export { default as GButtonGroup } from './GButtonGroup/index.vue'
export { default as GCollapse } from './GCollapse/index.vue'
export { default as GCollapseItem } from './GCollapse/component/GCollapseItem/index.vue'
export { default as GDButton } from './GDButton/index.vue'
export { default as GFigureInput } from './GFigureInput/index.vue'
export { default as GFilePreview } from './GFilePreview/index.vue'
export { default as GForm } from './GForm/index.vue'
export { default as GFormItem } from './GForm/component/GFormItem/index.vue'
export { default as GHintBox } from './GHintBox/index.vue'
export { default as GIcon } from './GIcon/index.vue'
export { default as GIconPicker } from './GIconPicker/v2/index.vue'
export { default as GAdvanceInput } from './GForm/component/GAdvanceInput/index.vue'
export { default as GBaseModule } from './GBaseModule/index.vue'
export { default as GTable } from './GTable/index.vue'

export { default as UploadFile } from './GUpload/interface/UploadFile'
export { default as InfoColumnProps } from './GInfoSA/interface/InfoColumnProps'
export { default as IrregularTableCell } from './GIrregularTable/interface/Cell'
export { BaseModuleMode }

// 注册的模块的抛出的类型
declare const _default: (
    app: App,
    props?: {
        appMode?: string
        baseModuleMode?: BaseModuleMode
        baseModuleDefaultMode?: BaseModuleMode
        interceptorsReqHandle?: ReqHandle
        interceptorsResHandle?: ResHandle
    }
) => void
export default _default as Plugin
// 组件库内的图标资源
export declare const icons: {
    elIconKeys: string[]
    aliIcons: string[]
    localIcons: string[]
}
