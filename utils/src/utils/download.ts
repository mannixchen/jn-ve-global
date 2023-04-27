import { global, getGlobal } from './bom'

/**
 * 将字符串下载到本地
 * @param content 要下载的内容
 * @param fileName 文件名称
 */
export function downloadString(content: string, fileName: string) {
    const blob = new Blob([content])
    downloadStream(blob, fileName)
}

/**
 * 注：后台返回的为流，需要定义 api 的时候声明 responseType: 'blob'
 * 当前方法接收的应为 Blob 类型
 * @param stream 请求响应回的 blob 对象
 */
export function downloadStream(streamBlob: Blob, fileName: string) {
    const src = (global || getGlobal()).URL.createObjectURL(streamBlob)
    let trigger: HTMLAnchorElement | null = document.createElement('a')
    trigger.href = src
    trigger.setAttribute('download', fileName)
    trigger.click()
    trigger = null
}
