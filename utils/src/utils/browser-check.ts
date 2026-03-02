/**
 * 检查浏览器是否支持运行 Vue 3 应用
 * @returns {boolean} 是否支持
 */
export function checkBrowser(): boolean {
    const ua = window.navigator.userAgent.toLowerCase()
    
    // 检测是否为 IE
    if (ua.indexOf('msie') > -1 || ua.indexOf('trident') > -1) {
        return false
    }

    // 检测是否支持关键的 ES6+ 特性
    try {
        // 测试 Promise
        if (typeof Promise === 'undefined') return false
        // 测试 Proxy（Vue 3 的响应式系统依赖这个）
        if (typeof Proxy === 'undefined') return false
        // 测试 Symbol
        if (typeof Symbol === 'undefined') return false
        // 测试 WeakMap
        if (typeof WeakMap === 'undefined') return false
    } catch {
        return false
    }

    // 获取 Chrome 版本（包括基于 Chromium 的浏览器）
    const chromeMatch = ua.match(/(?:chrome|crios)\/(\d+)/)
    if (chromeMatch) {
        // Chrome 64+ 完全支持所需特性
        return parseInt(chromeMatch[1]) >= 64
    }

    // 获取 Firefox 版本
    const firefoxMatch = ua.match(/firefox\/(\d+)/)
    if (firefoxMatch) {
        // Firefox 63+ 完全支持所需特性
        return parseInt(firefoxMatch[1]) >= 63
    }

    // 获取 Safari 版本
    const safariMatch = ua.match(/version\/(\d+).*safari/)
    if (safariMatch) {
        // Safari 12+ 完全支持所需特性
        return parseInt(safariMatch[1]) >= 12
    }

    // 获取 Edge (Chromium) 版本
    const edgeMatch = ua.match(/edg\/(\d+)/)
    if (edgeMatch) {
        // Edge 79+ (Chromium based) 完全支持所需特性
        return parseInt(edgeMatch[1]) >= 79
    }

    // 获取 Opera 版本
    const operaMatch = ua.match(/opr\/(\d+)/)
    if (operaMatch) {
        // Opera 51+ 完全支持所需特性
        return parseInt(operaMatch[1]) >= 51
    }

    // 如果无法识别浏览器，检查一些关键的 Web API
    return checkModernWebAPIs()
}

/**
 * 检查关键的现代 Web API 是否可用
 */
function checkModernWebAPIs(): boolean {
    try {
        // 检查一些 Vue 3 依赖的现代 Web API
        const features = [
            'Promise',
            'Symbol',
            'WeakMap',
            'Proxy',
            'Object.assign',
            'Array.from',
            'Array.prototype.includes',
            'Object.entries',
            'Object.values'
        ]

        return features.every(feature => {
            try {
                return evaluate(feature)
            } catch {
                return false
            }
        })
    } catch {
        return false
    }
}

/**
 * 安全地评估一个特性是否存在
 */
function evaluate(feature: string): boolean {
    try {
        return new Function(`return typeof ${feature} !== 'undefined'`)()
    } catch {
        return false
    }
} 