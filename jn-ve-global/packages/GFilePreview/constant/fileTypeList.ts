/**
 * 图片类型
 */
export const IMG_EXT = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
/**
 * 本地能支持预览的 office 类型
 */
export const LOCAL_OFFICE_EXT = ['pdf', 'docx', /* 'doc', */ 'xls', 'xlsx']

/**
 * wps 服务端支持预览的 office 类型
 */
export const WORD_EXT = ['doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm', 'rtf', 'txt']
export const EXCEL_EXT = ['xls', 'xlt', 'et', 'xlsx', 'xltx', 'xlsm', 'xltm', 'csv']
export const PPT_EXT = ['ppt', 'pptx', 'pptm', 'ppsx', 'ppsm', 'pps', 'potx', 'potm', 'dpt', 'dps']
export const PDF_EXT = ['pdf', 'ofd']
export const WPS_PREVIEW_EXT = [...WORD_EXT, ...EXCEL_EXT, ...PPT_EXT, ...PDF_EXT]
/**
 * wps 服务端排除预览的类型
 */
export const X_EXT = [
    'jpeg',
    'jpg',
    'png',
    'gif',
    'bmp',
    'tif',
    'tiff',
    'svg',
    'psd',
    'tar',
    'zip',
    '7z',
    'gz',
    'rar',
    'md',
    'c',
    'cpp',
    'java',
    'js',
    'css',
    'lrc',
    'h',
    'asm',
    's',
    'asp',
    'bat',
    'bas',
    'prg',
    'cmd',
    'xml',
    ...IMG_EXT
]
