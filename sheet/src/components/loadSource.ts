import { getGlobal, global } from '@jsjn/utils'
import { loadCss, loadScript } from '@jsjn/utils'

const luckyDir = '/luckysheet'
const cssList = [
    '/plugins/css/pluginsCss.css',
    '/plugins/plugins.css',
    '/css/luckysheet.css',
    '/assets/iconfont/iconfont.css'
]

export async function loadSource() {
    const sheetGlobalName = 'luckysheet'
    if (window[sheetGlobalName]) return window[sheetGlobalName]

    cssList.forEach((file) => {
        loadCss(`${luckyDir}/${file}`)
    })

    await loadScript(`${luckyDir}/plugins/js/plugin.js`, null)
    const luckysheet = await loadScript(`${luckyDir}/luckysheet.umd.js`, sheetGlobalName)
    return luckysheet
}
