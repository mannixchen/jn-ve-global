/**
 * 用于微应用的 window 获取
 */
export let global: Window & typeof globalThis = null
export function getGlobal(win: Window & typeof globalThis = window): Window & typeof globalThis {
    if (global) return global

    // 顶层保险
    if (win === win.top) {
        global = win
        return global
    }

    // 寻找名称带有 basic 的 window
    if (win.name.includes('basic')) {
        global = win
        return global
    }

    // 递归寻找
    getGlobal(win.parent as Window & typeof globalThis)

    return global
}

/**
 * 获取 url 中的参数，并转换为对象
 * @returns
 */
export function getUrlParams(queryString: string = (global || getGlobal()).location.href): any {
    let result = {}
    let reg = /[?&][^?&]+=[^?&]+/g
    let newSearch = queryString.match(reg)
    if (newSearch) {
        newSearch.forEach((item) => {
            let temp = item.substring(1).split('=')
            let key = temp[0]
            let value = temp[1] || ''
            
            // 对参数名和参数值进行解码，处理中文字符
            try {
                key = decodeURIComponent(key)
                value = decodeURIComponent(value)
            } catch (e) {
                // 如果解码失败，使用原始值
                console.warn('URL 参数解码失败:', e)
            }
            
            result[key] = value
        })
    }
    return result
}

/**
 * 浏览器嗅探，获取浏览器信息
 * @param navigator
 * @returns
 */
export function detectBrowser(navigator: Window['navigator'] = (global || getGlobal()).navigator) {
    let ua = navigator.userAgent
    let platform = navigator.platform
    let os: { [k: string]: any } = {},
        browser: { [k: string]: any } = {}

    let webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        osx = !!ua.match(/\(Macintosh\; Intel /),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        win = /Win\d{2}|Windows/.test(platform),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
        rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
        playbook = ua.match(/PlayBook/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
        ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
        weixin = ua.match(/MicroMessenger/i)

    // if (browser.webkit = !!webkit) browser.version = webkit[1]
    if (webkit) {
        browser.webkit = !!webkit
        browser.version = webkit[1]
    }

    if (android) (os.android = true), (os.version = android[2])
    if (iphone && !ipod) (os.ios = os.iphone = true), (os.version = iphone[2].replace(/_/g, '.'))
    if (ipad) (os.ios = os.ipad = true), (os.version = ipad[2].replace(/_/g, '.'))
    if (ipod) (os.ios = os.ipod = true), (os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null)
    if (wp) (os.wp = true), (os.version = wp[1])
    if (webos) (os.webos = true), (os.version = webos[2])
    if (touchpad) os.touchpad = true
    if (blackberry) (os.blackberry = true), (os.version = blackberry[2])
    if (bb10) (os.bb10 = true), (os.version = bb10[2])
    if (rimtabletos) (os.rimtabletos = true), (os.version = rimtabletos[2])
    if (playbook) browser.playbook = true
    if (kindle) (os.kindle = true), (os.version = kindle[1])
    if (silk) (browser.silk = true), (browser.version = silk[1])
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) (browser.chrome = true), (browser.version = chrome[1])
    if (firefox) (browser.firefox = true), (browser.version = firefox[1])
    if (firefoxos) (os.firefoxos = true), (os.version = firefoxos[1])
    if (ie) (browser.ie = true), (browser.version = ie[1])
    if (safari && (osx || os.ios || win)) {
        browser.safari = true
        if (!os.ios) browser.version = safari[1]
    }
    if (webview) browser.webview = true
    if (weixin) browser.wx = true // 微信浏览器

    os.tablet = !!(
        ipad ||
        playbook ||
        (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)) ||
        (ie && !ua.match(/Phone/) && ua.match(/Touch/))
    )

    os.phone = !!(
        !os.tablet &&
        !os.ipod &&
        (android ||
            iphone ||
            webos ||
            blackberry ||
            bb10 ||
            (chrome && ua.match(/Android/)) ||
            (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
            (firefox && ua.match(/Mobile/)) ||
            (ie && ua.match(/Touch/)))
    )
    return { os, browser }
}

export function browser() {
    // 获取浏览器UA标识
    var u = navigator.userAgent
    console.log(u)
    // Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36
    return {
        trident: u.indexOf('Trident') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
        iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, // 是否iPad
        webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1 // 是否微信 （2015-01-22新增）
        // qq: u.match(/\sQQ/i) === ' qq' // 是否QQ
    }
}
