import type Node from 'element-plus/es/components/tree/src/model/node'
import type { TreeOptionProps } from 'element-plus/es/components/tree-v2/src/types'
import { UploadFile } from '../../GUpload'

export enum DownloadStatus {
    /**
     * 下载中
     */
    DOWNLOADING = 'downloading',
    /**
     * 下载成功
     */
    SUCCESS = 'success',
    /**
     * 下载失败
     */
    FAIL = 'fail'
}

export interface FolderNodeFile extends UploadFile {
    /**
     * 是否是新文件
     */
    newFile?: boolean
    /**
     * 下载状态
     */
    downloadStatus?: DownloadStatus
    /**
     * 文件夹名称
     */
    folderName?: string
}

export interface FolderNode {
    /**
     * 业务数据
     */
    id?: string
    name?: string
    /**
     * 附件列表
     */
    files: FolderNodeFile[]
    /**
     * 子节点
     */
    children?: FolderNode[]
    /**
     * 禁用节点
     */
    disabled?: boolean
    /**
     * 文件数量
     */
    fileCount?: number
    /**
     * 扩展字段
     */
    [k: string]: any
}
