import prefix from '@/api/prefix'

/**
 * 文件上传地址
 */
export const FILE_UPLOAD_URL = `${prefix}/kinso-basic-open-server/v1/document/file/upload`

/**
 * 文件下载地址，拼接文件 id
 */
export const FILE_DOWNLOAD_URL = `${prefix}/kinso-basic-open-server/v1/document/file/download`

/**
 * 图片上传地址，需要限制图片格式 .jpg,.png
 */
export const IMG_UPLOAD_URL = `${prefix}/kinso-basic-open-server/v1/document/image/upload`

/**
 * 图片下载地址，拼接文件 id
 */
export const IMG_DOWNLOAD_URL = `${prefix}/kinso-basic-open-server/v1/document/image/download`
