import {
    setBaseModuleMode,
    BaseModuleMode,
    getDefauleMode,
    setDefauleMode
} from './_globalConstant/baseModuleMode'
import { setAppMode } from './_globalConstant/appMode'
import { type CollapseMode, getCollapseMode, setCollapseMode } from './_globalConstant/CollapseMode'
import {
    setIterceptorsReqHandle,
    setIterceptorsResHandle,
    ReqHandle,
    ResHandle
} from './_http/httpInterceptors'
import { setPrefix } from './_http/prefix'

export interface VeGlobalSetting {
    /**
     * 应用模式
     */
    appMode?: string
    /**
     * 基座模式（微应用单独设置）
     */
    baseModuleMode?: BaseModuleMode
    /**
     * 基座默认模式
     */
    baseModuleDefaultMode?: BaseModuleMode
    /**
     * collapse 的模式
     */
    collapseMode?: CollapseMode
    /**
     * 请求拦截器
     */
    interceptorsReqHandle: ReqHandle
    /**
     * 响应拦截器
     */
    interceptorsResHandle: ResHandle
    /**
     * 请求前缀
     */
    prefix?: string
}

/**
 * 设置组件库的全局环境配置
 * @param props
 * @returns
 */
export function setting(props: VeGlobalSetting) {
    if (!props) return

    const {
        appMode,
        baseModuleDefaultMode,
        baseModuleMode,
        interceptorsReqHandle,
        interceptorsResHandle,
        prefix,
        collapseMode
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

    // collapse 模式：事业部和研发部（默认）
    if (collapseMode) {
        setCollapseMode(collapseMode)
    }

    // 请求相关配置
    interceptorsReqHandle && setIterceptorsReqHandle(interceptorsReqHandle)
    interceptorsResHandle && setIterceptorsResHandle(interceptorsResHandle)
    prefix && setPrefix(prefix)
}
