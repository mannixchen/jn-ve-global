import _ from 'lodash'

/**
 * 探查字符串是否为组件库的图标
 */
export function stringIsIcon(str: string): boolean {
    if (!str) return false
    const iconPrefix = ['ali-', 'el-', 'jg-']
    const res = iconPrefix.some((item) => str.startsWith(item))
    return res
}
