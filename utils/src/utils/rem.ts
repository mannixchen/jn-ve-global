import { getDeviceInfo, DeviceType } from './device'

/**
 * 设备适配配置接口
 */
export interface DeviceRemConfig {
    /** 根字体大小基数 */
    rootValue: number
    /** 设计稿基础尺寸 */
    baseSize: number
    /** 最小适配宽度 */
    minWidth: number
    /** 最大适配宽度 */
    maxWidth: number
    /** 是否启用最大宽度限制 */
    enableMaxWidth: boolean
}

/**
 * 移动端设计稿基础尺寸常量
 * 根据主流设备和设计规范定义
 */
export const MOBILE_DESIGN_SIZES = {
    /** iPhone 6/7/8 标准尺寸 - 最常用 */
    IPHONE_STANDARD: 375,
    /** iPhone 6/7/8 Plus 尺寸 */
    IPHONE_PLUS: 414,
    /** iPhone X/11/12/13 尺寸 */
    IPHONE_X: 390,
    /** iPhone 14 Pro Max 尺寸 */
    IPHONE_PRO_MAX: 430,
    /** Android 主流尺寸 */
    ANDROID_STANDARD: 360,
    /** 2倍图设计稿尺寸（基于375px） */
    RETINA_2X: 750,
    /** 3倍图设计稿尺寸（基于375px） */
    RETINA_3X: 1125
} as const

/**
 * 平板设计稿基础尺寸常量
 */
export const TABLET_DESIGN_SIZES = {
    /** iPad 标准尺寸 */
    IPAD_STANDARD: 768,
    /** iPad Pro 尺寸 */
    IPAD_PRO: 1024,
    /** Android 平板标准尺寸 */
    ANDROID_TABLET: 800
} as const

/**
 * 桌面端设计稿基础尺寸常量
 */
export const DESKTOP_DESIGN_SIZES = {
    /** 标准桌面尺寸 */
    STANDARD: 1920,
    /** 小屏桌面 */
    SMALL: 1366,
    /** 大屏桌面 */
    LARGE: 2560,
    /** 超宽屏 */
    ULTRAWIDE: 3440
} as const

/**
 * 默认设备适配配置
 */
const DEFAULT_CONFIGS: Record<DeviceType, DeviceRemConfig> = {
    [DeviceType.MOBILE]: {
        rootValue: 100, // 1rem = 100px
        baseSize: MOBILE_DESIGN_SIZES.IPHONE_STANDARD, // 375px 设计稿
        minWidth: 320, // 最小支持宽度
        maxWidth: 480, // 移动端最大宽度
        enableMaxWidth: true
    },
    [DeviceType.TABLET]: {
        rootValue: 100,
        baseSize: TABLET_DESIGN_SIZES.IPAD_STANDARD, // 768px 设计稿
        minWidth: 600,
        maxWidth: 1200,
        enableMaxWidth: true
    },
    [DeviceType.DESKTOP]: {
        rootValue: 100,
        baseSize: DESKTOP_DESIGN_SIZES.STANDARD, // 1920px 设计稿
        minWidth: 1200,
        maxWidth: 5120, // 支持5K显示器
        enableMaxWidth: false // 桌面端通常不限制最大宽度
    }
}

/**
 * 自定义配置存储
 */
const customConfigs: Partial<Record<DeviceType, Partial<DeviceRemConfig>>> = {}

/**
 * 当前设备信息缓存
 */
let cachedDeviceInfo: ReturnType<typeof getDeviceInfo> | null = null

/**
 * 获取当前设备信息（带缓存）
 */
function getCurrentDeviceInfo() {
    if (!cachedDeviceInfo) {
        cachedDeviceInfo = getDeviceInfo()
    }
    return cachedDeviceInfo
}

/**
 * 获取设备适配配置
 */
function getDeviceConfig(deviceType: DeviceType): DeviceRemConfig {
    const defaultConfig = DEFAULT_CONFIGS[deviceType]
    const customConfig = customConfigs[deviceType] || {}

    return {
        ...defaultConfig,
        ...customConfig
    }
}

/**
 * 计算 rem 基准值
 */
function calculateRemBase(
    clientWidth: number,
    config: DeviceRemConfig
): { fontSize: number; ratio: number } {
    const { rootValue, baseSize, minWidth, maxWidth, enableMaxWidth } = config

    // 计算屏幕宽度比例
    let ratio = 1
    if (clientWidth >= minWidth && clientWidth <= maxWidth) {
        ratio = clientWidth / baseSize
    } else if (clientWidth < minWidth) {
        ratio = minWidth / baseSize
    } else if (clientWidth > maxWidth) {
        ratio = maxWidth / baseSize
    }

    const fontSize = rootValue * ratio

    // 返回根字体大小和比例
    return { fontSize, ratio }
}

/**
 * 设置根字体大小
 */
function setRootFontSize(fontSize: number): void {
    document.documentElement.style.fontSize = `${fontSize}px`
}

/**
 * 执行 rem 适配计算
 */
function recalculate(): void {
    const deviceInfo = getCurrentDeviceInfo()
    const clientWidth = document.documentElement.clientWidth
    const config = getDeviceConfig(deviceInfo.deviceType)

    const result = calculateRemBase(clientWidth, config)
    setRootFontSize(result.fontSize)

    // 触发自定义事件，通知其他模块
    const event = new CustomEvent('remRecalculated', {
        detail: {
            deviceType: deviceInfo.deviceType,
            clientWidth,
            fontSize: result.fontSize,
            ratio: result.ratio,
            config
        }
    })
    window.dispatchEvent(event)
}

/**
 * 初始化设备 rem 适配
 */
export function initDeviceRem(): void {
    // 立即执行一次计算
    recalculate()

    // 监听窗口大小变化
    const resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize'
    window.addEventListener(resizeEvent, recalculate, false)

    // 监听设备方向变化（移动端）
    if ('orientation' in window) {
        window.addEventListener(
            'orientationchange',
            () => {
                // 延迟执行，等待方向变化完成
                setTimeout(recalculate, 100)
            },
            false
        )
    }
}

/**
 * 设置自定义设备配置
 */
export function setDeviceConfig(deviceType: DeviceType, config: Partial<DeviceRemConfig>): void {
    if (!customConfigs[deviceType]) {
        customConfigs[deviceType] = {}
    }

    Object.assign(customConfigs[deviceType]!, config)

    // 重新计算
    recalculate()
}

/**
 * 设置移动端配置
 */
export function setMobileConfig(config: Partial<DeviceRemConfig>): void {
    setDeviceConfig(DeviceType.MOBILE, config)
}

/**
 * 设置平板配置
 */
export function setTabletConfig(config: Partial<DeviceRemConfig>): void {
    setDeviceConfig(DeviceType.TABLET, config)
}

/**
 * 设置桌面端配置
 */
export function setDesktopConfig(config: Partial<DeviceRemConfig>): void {
    setDeviceConfig(DeviceType.DESKTOP, config)
}

/**
 * 获取当前 rem 信息
 */
export function getCurrentRemInfo() {
    const deviceInfo = getCurrentDeviceInfo()
    const clientWidth = document.documentElement.clientWidth
    const config = getDeviceConfig(deviceInfo.deviceType)
    const result = calculateRemBase(clientWidth, config)

    return {
        deviceType: deviceInfo.deviceType,
        clientWidth,
        fontSize: result.fontSize,
        ratio: result.ratio,
        config,
        deviceInfo
    }
}

/**
 * px 转 rem 工具函数
 */
export function pxToRem(px: number, deviceType?: DeviceType): number {
    const targetDeviceType = deviceType || getCurrentDeviceInfo().deviceType
    const config = getDeviceConfig(targetDeviceType)
    return px / config.rootValue
}

/**
 * rem 转 px 工具函数
 */
export function remToPx(rem: number, deviceType?: DeviceType): number {
    const targetDeviceType = deviceType || getCurrentDeviceInfo().deviceType
    const config = getDeviceConfig(targetDeviceType)
    const currentFontSize = parseFloat(document.documentElement.style.fontSize) || config.rootValue
    return rem * currentFontSize
}

/**
 * 重新计算rem适配
 */
export function recalc(): void {
    recalculate()
}

/**
 * 获取当前屏幕比例
 * 与store中的screenRatio保持同步
 */
export function getScreenRatio(): number {
    const info = getCurrentRemInfo()
    return info.ratio
}

/**
 * 获取推荐的移动端设计稿尺寸
 */
export function getRecommendedMobileDesignSize(): {
    recommended: number
    alternatives: number[]
    description: string
    } {
    return {
        recommended: MOBILE_DESIGN_SIZES.IPHONE_STANDARD,
        alternatives: [
            MOBILE_DESIGN_SIZES.ANDROID_STANDARD,
            MOBILE_DESIGN_SIZES.IPHONE_PLUS,
            MOBILE_DESIGN_SIZES.IPHONE_X
        ],
        description: `推荐使用 ${MOBILE_DESIGN_SIZES.IPHONE_STANDARD}px 作为移动端设计稿基础尺寸，这是 iPhone 6/7/8 的标准尺寸，覆盖了大部分移动设备。如果使用 2倍图设计，可以使用 ${MOBILE_DESIGN_SIZES.RETINA_2X}px。`
    }
}

/**
 * 智能设备适配建议
 */
export function getDeviceAdaptationAdvice() {
    const deviceInfo = getCurrentDeviceInfo()
    const remInfo = getCurrentRemInfo()

    const advice: string[] = []

    // 基于当前设备类型给出建议
    switch (deviceInfo.deviceType) {
    case DeviceType.MOBILE:
        advice.push(`当前是移动设备，建议使用 ${MOBILE_DESIGN_SIZES.IPHONE_STANDARD}px 设计稿`)
        if (deviceInfo.screenWidth > 400) {
            advice.push('检测到较大屏幕移动设备，可考虑使用 414px 设计稿')
        }
        break

    case DeviceType.TABLET:
        advice.push(`当前是平板设备，建议使用 ${TABLET_DESIGN_SIZES.IPAD_STANDARD}px 设计稿`)
        if (deviceInfo.screenWidth > 1000) {
            advice.push('检测到大尺寸平板，可考虑使用桌面端适配方案')
        }
        break

    case DeviceType.DESKTOP:
        advice.push(`当前是桌面设备，建议使用 ${DESKTOP_DESIGN_SIZES.STANDARD}px 设计稿`)
        if (deviceInfo.screenWidth < 1400) {
            advice.push('检测到小屏桌面设备，建议使用 1366px 设计稿')
        }
        break
    }

    // 检查当前配置是否合理
    if (remInfo.ratio < 0.5) {
        advice.push('当前缩放比例过小，建议调整设计稿基础尺寸')
    } else if (remInfo.ratio > 2) {
        advice.push('当前缩放比例过大，建议调整设计稿基础尺寸')
    }

    return {
        deviceInfo,
        remInfo,
        advice
    }
}

/**
 * 直接执行模式
 * 当直接导入此文件时自动执行适配
 */
// if (typeof window !== 'undefined' && typeof document !== 'undefined') {
//     const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
//     // 监听resize事件
//     window.addEventListener(resizeEvt, recalc, false)
//     // 根据文档加载状态决定执行时机
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', recalc, false)
//     } else {
//         recalc()
//     }
// }
