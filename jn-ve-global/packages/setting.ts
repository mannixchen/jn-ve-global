import {
    setBaseModuleMode,
    BaseModuleMode,
    getDefauleMode,
    setDefauleMode
} from './_globalConstant/baseModuleMode'
import { setAppMode } from './_globalConstant/appMode'
import {
    setIterceptorsReqHandle,
    setIterceptorsResHandle,
    ReqHandle,
    ResHandle
} from './_http/httpInterceptors'
import { setPrefix } from './_http/prefix'

export interface Settings {
    appMode?: string
    baseModuleMode?: BaseModuleMode
    baseModuleDefaultMode?: BaseModuleMode
    interceptorsReqHandle: ReqHandle
    interceptorsResHandle: ResHandle
    prefix?: string
}

/**
 * 设置组件库的全局环境配置
 * @param props
 * @returns
 */
export function setting(props: Settings) {
    if (!props) return

    const {
        appMode,
        baseModuleDefaultMode,
        baseModuleMode,
        interceptorsReqHandle,
        interceptorsResHandle,
        prefix
    } = props

    if (appMode) {
        setAppMode(appMode)
    } else if (window['__VUE_APP_MODE__']) {
        setAppMode(window['__VUE_APP_MODE__'])
    }

    /**
     * baseModule 的模式参数
     *  - 如果设置了，就去对应微应用设置的值
     *  - 如果没有，就取基座设置的默认值
     */
    if (baseModuleDefaultMode) {
        setDefauleMode(baseModuleDefaultMode)
    }

    if (baseModuleMode) {
        setBaseModuleMode(baseModuleMode)
    } else {
        setBaseModuleMode(getDefauleMode())
    }

    // 请求相关配置
    interceptorsReqHandle && setIterceptorsReqHandle(interceptorsReqHandle)
    interceptorsResHandle && setIterceptorsResHandle(interceptorsResHandle)
    prefix && setPrefix(prefix)
}
