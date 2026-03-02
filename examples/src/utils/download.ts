import { apis } from '@/api'

/**
 * 注：后台返回的为流，需要定义 api 的时候声明 responseType: 'blob'
 * 当前方法接收的应为 Blob 类型
 * @param stream 请求响应回的 blob 对象
 */
export function downloadStream(streamBlob: Blob, fileName: string) {
    const src = window.URL.createObjectURL(streamBlob)
    let aDom: HTMLAnchorElement | null = document.createElement('a')
    aDom.href = src
    aDom.setAttribute('download', fileName)
    aDom.click()
    aDom = null
}

/**
 * 根据 fileId 获取文件流，并转换成内存中的 url（以供下载、预览）
 * @param fileId 资源 id
 * @returns
 */
export async function getFileStreamUrl(fileId: string, type?: string) {
    if (!fileId) return
    let blob = await apis.common['getFileStream']({
        fileId
    }) as any

    // 指定 blob 的类型，常见于 pdf、image
    if (type) {
        blob = new Blob([blob], { type })
    }

    return window.URL.createObjectURL(blob)
}
