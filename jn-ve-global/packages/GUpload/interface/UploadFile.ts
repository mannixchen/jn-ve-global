export type ListType = 'text' | 'picture' | 'picture-card'

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'fail'

interface ElFile extends File {
    uid: number
}

export interface UploadFile {
    /**
     * 预览 or 下载时的 loading
     */
    isLoading?: boolean
    /**
     * 文件名称
     */
    name: string
    /**
     * 文件地址：
     *  - 预览
     *  - 下载
     */
    url?: string
    /**
     * 业务中的文件服务器的文件 id
     */
    fileId?: string
    percentage?: number
    status?: UploadStatus
    size?: number
    response?: unknown
    uid?: number
    raw?: ElFile
    type?: string
    [k: string]: any
}
