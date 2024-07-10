import PPTFileTypeImg from './assets/images/PPT.png'
import ExcelFileTypeImg from './assets/images/Excel.png'
import PDFFileTypeImg from './assets/images/PDF.png'
import RadioFileTypeImg from './assets/images/Radio.png'
import TXTFileTypeImg from './assets/images/TXT.png'
import VideoFileTypeImg from './assets/images/Video.png'
import WordFileTypeImg from './assets/images/Word.png'
import ZARFileTypeImg from './assets/images/ZAR.png'
import DefaulrFileLogo from './assets/images/Other.png'
import myAxios from '../_http/http'
import { UploadFile } from './interface/UploadFile'
import { global } from '@jsjn/utils'
import { IMG_EXT, PDF_EXT, WORD_EXT, EXCEL_EXT, PPT_EXT } from '../GFilePreview/constant/fileTypeList'
import { getFileType } from '../GFilePreview/utils'

/**
 * 根据文件名获取对应的文件略缩图
 * @param fileName 文件 name
 * @param url 文件 url
 * @returns 文件略缩图
 */
export function getFileTypeIcon(fileName: string, url?: string) {
    const fileType = getFileType(fileName)

    // 图片取原url
    if (IMG_EXT.includes(fileType)) return url

    // word
    if (WORD_EXT.includes(fileType)) return WordFileTypeImg

    // excel
    if (EXCEL_EXT.includes(fileType)) return ExcelFileTypeImg

    // pdf
    if (PDF_EXT.includes(fileType)) return PDFFileTypeImg

    // ppt
    if (PPT_EXT.includes(fileType)) return PPTFileTypeImg

    // txt
    if (['txt', 'text'].includes(fileType)) return TXTFileTypeImg

    // 压缩包
    if (['rar', 'zip', 'arj', 'z', '7z'].includes(fileType)) return ZARFileTypeImg

    return DefaulrFileLogo
}

/**
 * 依据 url 获取文件服务器资源，并返回本地 blob 协议的地址
 * @param url 资源服务器地址：用户传递下载地址 + fileId
 * @param fileType 文件类型，包装 pdf 类型的数据
 * @returns
 */
export function getFileBlobUrlByRequest(url: string, fileType?: string, timeout?: number) {
    return myAxios
        .get(url, {
            responseType: 'blob',
            timeout
        })
        .then((res) => {
            let blob: Blob

            // 实际的基座响应数据
            if (res) {
                blob = res as any
                if (fileType && fileType === 'pdf') {
                    blob = new Blob([blob], { type: 'application/pdf;' })
                }
            }
            return blob ? global.URL.createObjectURL(blob) : url
        })
        .catch(() => undefined)
}

/**
 * 获取 wps 在线编辑的地址
 * @param url
 * @param timeout
 * @returns
 */
export async function getFileWpsPreviewUrl(url: string, timeout: number) {
    return await myAxios
        .get(url, {
            timeout
        })
        .then((res) => res.data.link)
        .catch(() => undefined)
}

/**
 * 根据文件信息，填充文件的 url 信息，文件需要是一个 proxy 响应式对象，通过引用进行修改字段
 * @param proxyFile 响应式的文件对象
 * @param downloadUrl 下载地址拼接
 * @param timeout 超时时间
 * @returns 处理完 url 的响应式文件对象
 */
export async function fillFileMemoryUrl(
    proxyFile: UploadFile,
    downloadUrl: string,
    timeout: number
): Promise<UploadFile> {
    proxyFile.isLoading = true
    const fileType = getFileType(proxyFile.name)
    const reqUrl = `${downloadUrl}/${proxyFile.fileId}`
    const resUrl = await getFileBlobUrlByRequest(reqUrl, fileType, timeout)
    proxyFile.isLoading = false
    proxyFile.url = resUrl
    return proxyFile
}

/**
 * 获取 wps 的在线编辑链接, 并填充到文件对象中
 * @param proxyFile 代理 url
 * @param wpsService wps 的部署服务地址
 * @param timeout 超时时间
 * @returns
 */
export async function fillFileWpsPreviewUrl(
    proxyFile: UploadFile,
    wpsService: string,
    timeout: number
) {
    proxyFile.isLoading = true
    const reqUrl = `${wpsService}?fileName=${proxyFile.name}&fileId=${proxyFile.fileId}`
    const resUrl = await getFileWpsPreviewUrl(reqUrl, timeout)
    proxyFile.isLoading = false
    proxyFile.wpsPreviewUrl = resUrl
    return proxyFile
}
