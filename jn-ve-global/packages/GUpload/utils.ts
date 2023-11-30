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
import { imgSuffix } from './constant/fileTypeList'
import { UploadFile } from './interface/UploadFile'

/**
 * 根据文件名称获取文件类型，转换小写
 * @param fileName 文件 name
 * @returns
 */
export function getFileType(fileName: string) {
    return fileName ? fileName.replace(/.+\./, '').toLowerCase() : ''
}

/**
 * 根据文件名获取对应的文件略缩图
 * @param fileName 文件 name
 * @param url 文件 url
 * @returns 文件略缩图
 */
export function getFileTypeIcon(fileName: string, url?: string) {
    const fileType = getFileType(fileName)

    // 图片取原url
    if (imgSuffix.includes(fileType)) return url

    // word
    if (['rtf', 'doc', 'docx'].includes(fileType)) return WordFileTypeImg

    // excel
    if (['xls', 'xlsx'].includes(fileType)) return ExcelFileTypeImg

    // pdf
    if (['pdf'].includes(fileType)) return PDFFileTypeImg

    // txt
    if (['txt', 'text'].includes(fileType)) return TXTFileTypeImg

    // ppt
    if (['ppt', 'pptx'].includes(fileType)) return PPTFileTypeImg

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

            /**
             * 这里的测试样例的 axios 实例未处理响应体，基座的拦截器是处理过响应数据结构的
             */
            // if (res.status === 200) {
            //     blob = res.data
            //     if (fileType === 'pdf') {
            //         blob = new Blob([res.data], { type: 'application/pdf;' })
            //     }
            // }

            // 实际的基座响应数据
            if (res) {
                blob = res as any
                if (fileType && fileType === 'pdf') {
                    blob = new Blob([blob], { type: 'application/pdf;' })
                }
            }
            return blob ? window.URL.createObjectURL(blob) : url
        })
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

    const url = `${downloadUrl}/${proxyFile.fileId}`
    const fileType = getFileType(proxyFile.name)

    // 得到内存 url
    const memoryFileUrl = await getFileBlobUrlByRequest(url, fileType, timeout)
        .catch(() => {
            // 超时返回错误，下次进行相同操作时，会再次请求处理
            return undefined
        })
        .finally(() => {
            proxyFile.isLoading = false
        })

    proxyFile.url = memoryFileUrl

    return proxyFile
}
