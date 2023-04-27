import _ from 'lodash'
import { global, getGlobal } from './bom'

/**
 * 获取 dom 的样式值
 * @param element dom 节点
 * @param attr 属性
 * @returns
 */
export function getStyle(element: Element, attr: string) {
    return getComputedStyle(element, null).getPropertyValue(attr)
}

/**
 * 将传递的尺寸进行 rem 的换算
 * @param size
 * @returns
 */
export function size2Rem(size: number) {
    const rootFontSize = (global || getGlobal()).document.querySelector('html')?.style?.fontSize
    if (!rootFontSize) return size
    return (size / 100) * parseFloat(rootFontSize)
}
