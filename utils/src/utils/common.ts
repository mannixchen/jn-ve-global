import _ from 'lodash'

/**
 * 判断有效值，包含空字符串
 * @param val 目标值
 */
export function validValue(val) {
    if (val === undefined || val === null || val === false) return false
    return true
}
