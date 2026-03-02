import {
    setBaseModuleMode,
    BaseModuleMode,
    getDefauleMode,
    setDefauleMode
} from './_globalConstant/baseModuleMode'
import { setAppMode } from './_globalConstant/appMode'
import { setBase } from './_globalConstant/base'
import { type DefaultBaseModuleProps, setBaseModuleProps } from './_globalConstant/baseModuleProps'
import { type CollapseMode, getCollapseMode, setCollapseMode } from './_globalConstant/CollapseMode'
import {
    setIterceptorsReqHandle,
    setIterceptorsResHandle,
    ReqHandle,
    ResHandle
} from './_http/httpInterceptors'
import { setPrefix } from './_http/prefix'

/**
 * 基座（每个项目都有各自的基座，基座名称的集合，以枚举方式展示）
 */
export enum Bases {
    REGTECH = 'regtech',
    CONSUMER = 'consumer',
    CORPORATE_CREDIT = 'corporate-credit',
    DATA_SUBMISSION = 'data-submission',
    GUARANTEE_LEASE = 'guarantee-lease',
    LETTER_GUARANTEE = 'letter-guarantee',
    MAINTENANCE = 'maintenance',
    MANAGED_CLOUD = 'managed-cloud',
    NEWCORE = 'newcore',
    RONGFENG = 'rongfeng',
    UU_CENTER = 'uu-center',
    XINBAOZD = 'xinbaozd'
}

export type Base =
    | Bases.REGTECH
    | Bases.CONSUMER
    | Bases.CORPORATE_CREDIT
    | Bases.DATA_SUBMISSION
    | Bases.GUARANTEE_LEASE
    | Bases.LETTER_GUARANTEE
    | Bases.MAINTENANCE
    | Bases.MANAGED_CLOUD
    | Bases.NEWCORE
    | Bases.RONGFENG
    | Bases.UU_CENTER
    | Bases.XINBAOZD

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
     * 基座模式（微应用单独设置）
     */
    baseModuleProps?: DefaultBaseModuleProps
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
    /**
     * 基座
     */
    base?: Base
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
        collapseMode,
        base,
        baseModuleProps
    } = props

    if (appMode) {
        setAppMode(appMode)
    } else if (window['__VUE_APP_MODE__']) {
        setAppMode(window['__VUE_APP_MODE__'])
    }

    if (base) {
        setBase(base)
    }

    if (Object.keys(baseModuleProps ?? {})?.length) {
        setBaseModuleProps(baseModuleProps)
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
