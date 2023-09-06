import { getGlobal, global } from '@jsjn/utils'

export function loadSource() {
    if (window.luckysheet) return
    const rootLocation = global.location
    const prefix: string = `${rootLocation.origin}${rootLocation.pathname}lib/luckysheet`

    const cssList = [
        '/plugins/css/pluginsCss.css',
        '/plugins/plugins.css',
        '/css/luckysheet.css',
        '/assets/iconfont/iconfont.css'
    ]

    return new Promise((rootResolve) => {
        setTimeout(() => {
            cssList.forEach((file) => {
                const linkTag = window.document.createElement('link')
                linkTag.rel = 'stylesheet'
                linkTag.href = `${prefix}${file}`
                window.document.head.appendChild(linkTag)
            })

            new Promise((resolve, reject) => {
                const scriptTag = window.document.createElement('script')
                scriptTag.type = 'text/javascript'
                // scriptTag.async = false
                scriptTag.src = `${prefix}/plugins/js/plugin.js`
                window.document.head.appendChild(scriptTag)
                scriptTag.onload = (e) => {
                    resolve(e)
                }
            }).then(() => {
                const scriptTag = window.document.createElement('script')
                scriptTag.type = 'text/javascript'
                // scriptTag.async = false
                scriptTag.src = `${prefix}/luckysheet.umd.js`
                window.document.head.appendChild(scriptTag)
                scriptTag.onload = (e) => {
                    rootResolve(e)
                }
            })
        }, 10)
    })
}
