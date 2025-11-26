/**
 * 设备信息检测工具
 * 用于检测当前设备类型（移动端/PC端）及相关信息
 */

/**
 * 设备类型枚举
 */
export enum DeviceType {
    MOBILE = 'mobile',
    TABLET = 'tablet',
    DESKTOP = 'desktop'
}

/**
 * 操作系统类型枚举
 */
export enum OSType {
    IOS = 'ios',
    ANDROID = 'android',
    WINDOWS = 'windows',
    MACOS = 'macos',
    LINUX = 'linux',
    UNKNOWN = 'unknown'
}

/**
 * 浏览器类型枚举
 */
export enum BrowserType {
    CHROME = 'chrome',
    FIREFOX = 'firefox',
    SAFARI = 'safari',
    EDGE = 'edge',
    IE = 'ie',
    OPERA = 'opera',
    WECHAT = 'wechat',
    QQ = 'qq',
    UC = 'uc',
    UNKNOWN = 'unknown'
}

/**
 * 设备信息接口
 */
export interface DeviceInfo {
    /** 设备类型 */
    deviceType: DeviceType
    /** 操作系统类型 */
    osType: OSType
    /** 操作系统版本 */
    osVersion: string
    /** 浏览器类型 */
    browserType: BrowserType
    /** 浏览器版本 */
    browserVersion: string
    /** 是否为移动设备 */
    isMobile: boolean
    /** 是否为平板设备 */
    isTablet: boolean
    /** 是否为桌面设备 */
    isDesktop: boolean
    /** 是否为微信浏览器 */
    isWechat: boolean
    /** 是否为iOS设备 */
    isIOS: boolean
    /** 是否为Android设备 */
    isAndroid: boolean
    /** 屏幕宽度 */
    screenWidth: number
    /** 屏幕高度 */
    screenHeight: number
    /** 用户代理字符串 */
    userAgent: string
}

/**
 * 获取用户代理字符串
 */
function getUserAgent(): string {
    return navigator.userAgent || ''
}

/**
 * 检测设备类型
 */
function detectDeviceType(userAgent: string): DeviceType {
    const ua = userAgent.toLowerCase()

    // console.log('userAgent', ua)

    // 移动设备关键词
    const mobileKeywords = [
        'mobile',
        'android',
        'iphone',
        'ipod',
        'blackberry',
        'windows phone',
        'symbian',
        'palm',
        'webos'
    ]

    // 平板设备关键词
    const tabletKeywords = ['ipad', 'tablet', 'kindle', 'silk', 'playbook']

    // 检测平板
    if (tabletKeywords.some((keyword) => ua.includes(keyword))) {
        return DeviceType.TABLET
    }

    // 检测手机
    if (mobileKeywords.some((keyword) => ua.includes(keyword))) {
        return DeviceType.MOBILE
    }

    // 通过屏幕尺寸辅助判断
    // if (window.screen) {
    //     const { width, height } = window.screen
    //     const maxDimension = Math.max(width, height)
    //     const minDimension = Math.min(width, height)

    //     // 平板尺寸范围（7-13英寸，按常见分辨率判断）
    //     if (maxDimension >= 768 && maxDimension <= 1366 && minDimension >= 600) {
    //         return DeviceType.TABLET
    //     }

    //     // 手机尺寸范围
    //     if (maxDimension <= 768 && minDimension <= 414) {
    //         return DeviceType.MOBILE
    //     }
    // }

    return DeviceType.DESKTOP
}

/**
 * 检测操作系统类型和版本
 */
function detectOS(userAgent: string): { osType: OSType; osVersion: string } {
    const ua = userAgent.toLowerCase()

    // iOS
    const iosMatch = ua.match(/(?:iphone|ipad|ipod).*?os ([\d_]+)/)
    if (iosMatch) {
        return {
            osType: OSType.IOS,
            osVersion: iosMatch[1].replace(/_/g, '.')
        }
    }

    // Android
    const androidMatch = ua.match(/android ([\d.]+)/)
    if (androidMatch) {
        return {
            osType: OSType.ANDROID,
            osVersion: androidMatch[1]
        }
    }

    // Windows
    const windowsMatch = ua.match(/windows nt ([\d.]+)/)
    if (windowsMatch) {
        return {
            osType: OSType.WINDOWS,
            osVersion: windowsMatch[1]
        }
    }

    // macOS
    const macMatch = ua.match(/mac os x ([\d_]+)/)
    if (macMatch) {
        return {
            osType: OSType.MACOS,
            osVersion: macMatch[1].replace(/_/g, '.')
        }
    }

    // Linux
    if (ua.includes('linux')) {
        return {
            osType: OSType.LINUX,
            osVersion: 'unknown'
        }
    }

    return {
        osType: OSType.UNKNOWN,
        osVersion: 'unknown'
    }
}

/**
 * 检测浏览器类型和版本
 */
function detectBrowser(userAgent: string): { browserType: BrowserType; browserVersion: string } {
    const ua = userAgent.toLowerCase()

    // 微信浏览器
    if (ua.includes('micromessenger')) {
        const versionMatch = ua.match(/micromessenger\/([\d.]+)/)
        return {
            browserType: BrowserType.WECHAT,
            browserVersion: versionMatch ? versionMatch[1] : 'unknown'
        }
    }

    // QQ浏览器
    if (ua.includes('qqbrowser')) {
        const versionMatch = ua.match(/qqbrowser\/([\d.]+)/)
        return {
            browserType: BrowserType.QQ,
            browserVersion: versionMatch ? versionMatch[1] : 'unknown'
        }
    }

    // UC浏览器
    if (ua.includes('ucbrowser')) {
        const versionMatch = ua.match(/ucbrowser\/([\d.]+)/)
        return {
            browserType: BrowserType.UC,
            browserVersion: versionMatch ? versionMatch[1] : 'unknown'
        }
    }

    // Edge
    const edgeMatch = ua.match(/(?:edge|edg)\/([\d.]+)/)
    if (edgeMatch) {
        return {
            browserType: BrowserType.EDGE,
            browserVersion: edgeMatch[1]
        }
    }

    // Chrome (需要在Safari之前检测，因为Chrome也包含Safari标识)
    const chromeMatch = ua.match(/(?:chrome|crios)\/([\d.]+)/)
    if (chromeMatch && !ua.includes('edg')) {
        return {
            browserType: BrowserType.CHROME,
            browserVersion: chromeMatch[1]
        }
    }

    // Safari
    const safariMatch = ua.match(/version\/([\d.]+).*safari/)
    if (safariMatch && ua.includes('safari') && !ua.includes('chrome')) {
        return {
            browserType: BrowserType.SAFARI,
            browserVersion: safariMatch[1]
        }
    }

    // Firefox
    const firefoxMatch = ua.match(/firefox\/([\d.]+)/)
    if (firefoxMatch) {
        return {
            browserType: BrowserType.FIREFOX,
            browserVersion: firefoxMatch[1]
        }
    }

    // Opera
    const operaMatch = ua.match(/(?:opera|opr)\/([\d.]+)/)
    if (operaMatch) {
        return {
            browserType: BrowserType.OPERA,
            browserVersion: operaMatch[1]
        }
    }

    // IE
    const ieMatch = ua.match(/(?:msie |trident.*rv:)([\d.]+)/)
    if (ieMatch) {
        return {
            browserType: BrowserType.IE,
            browserVersion: ieMatch[1]
        }
    }

    return {
        browserType: BrowserType.UNKNOWN,
        browserVersion: 'unknown'
    }
}

/**
 * 获取完整的设备信息
 */
export function getDeviceInfo(): DeviceInfo {
    const userAgent = getUserAgent()
    const deviceType = detectDeviceType(userAgent)
    const { osType, osVersion } = detectOS(userAgent)
    const { browserType, browserVersion } = detectBrowser(userAgent)

    const isMobile = deviceType === DeviceType.MOBILE
    const isTablet = deviceType === DeviceType.TABLET
    const isDesktop = deviceType === DeviceType.DESKTOP
    const isWechat = browserType === BrowserType.WECHAT
    const isIOS = osType === OSType.IOS
    const isAndroid = osType === OSType.ANDROID

    const screenWidth = window.screen ? window.screen.width : 0
    const screenHeight = window.screen ? window.screen.height : 0

    return {
        deviceType,
        osType,
        osVersion,
        browserType,
        browserVersion,
        isMobile,
        isTablet,
        isDesktop,
        isWechat,
        isIOS,
        isAndroid,
        screenWidth,
        screenHeight,
        userAgent
    }
}

/**
 * 判断是否为移动设备（包括手机和平板）
 */
export function isMobileDevice(): boolean {
    const deviceInfo = getDeviceInfo()
    return deviceInfo.isMobile || deviceInfo.isTablet
}

/**
 * 判断是否为PC设备
 */
export function isDesktopDevice(): boolean {
    const deviceInfo = getDeviceInfo()
    return deviceInfo.isDesktop
}

/**
 * 判断是否为手机设备
 */
export function isPhoneDevice(): boolean {
    const deviceInfo = getDeviceInfo()
    return deviceInfo.isMobile
}

/**
 * 判断是否为平板设备
 */
export function isTabletDevice(): boolean {
    const deviceInfo = getDeviceInfo()
    return deviceInfo.isTablet
}

/**
 * 判断是否为iOS设备
 */
export function isIOSDevice(): boolean {
    const deviceInfo = getDeviceInfo()
    return deviceInfo.isIOS
}

/**
 * 判断是否为Android设备
 */
export function isAndroidDevice(): boolean {
    const deviceInfo = getDeviceInfo()
    return deviceInfo.isAndroid
}

/**
 * 判断是否为微信浏览器
 */
export function isWechatBrowser(): boolean {
    const deviceInfo = getDeviceInfo()
    return deviceInfo.isWechat
}

/**
 * 获取设备类型字符串
 */
export function getDeviceTypeString(): string {
    const deviceInfo = getDeviceInfo()
    return deviceInfo.deviceType
}

/**
 * 获取操作系统信息字符串
 */
export function getOSString(): string {
    const deviceInfo = getDeviceInfo()
    return `${deviceInfo.osType} ${deviceInfo.osVersion}`
}

/**
 * 获取浏览器信息字符串
 */
export function getBrowserString(): string {
    const deviceInfo = getDeviceInfo()
    return `${deviceInfo.browserType} ${deviceInfo.browserVersion}`
}

/**
 * 获取屏幕尺寸信息
 */
export function getScreenInfo(): { width: number; height: number } {
    const deviceInfo = getDeviceInfo()
    return {
        width: deviceInfo.screenWidth,
        height: deviceInfo.screenHeight
    }
}
