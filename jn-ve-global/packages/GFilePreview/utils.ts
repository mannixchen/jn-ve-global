/**
 * 根据文件名称获取文件类型，转换小写
 * @param fileName 文件 name
 * @returns
 */
export function getFileType(fileName: string) {
    return fileName ? fileName.replace(/.+\./, '').toLowerCase() : ''
}

/**
 * 验证文件类型是否有效，基于传入的适用类型数组
 * @param ext
 * @param fileName
 * @returns
 */
export function typeIsValid(ext: string[], fileName: string) {
    const fileType = getFileType(fileName)
    return ext.includes(fileType)
}
