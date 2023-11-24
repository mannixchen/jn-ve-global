import _, { reject } from 'lodash'
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

/**
 * 通过 script 加载 umd js 资源，执行并抛出资源
 * @param libPath 资源路径
 * @param globalName umd 挂载 dom 全局名称，如：Vue
 * @param prefix 路径前缀，默认是加载基座中的路径资源
 * @param type script 加载模式
 * @returns
 */
export function loadScript<T>(
    libPath: string,
    globalName: string,
    prefix: string = `${(global || getGlobal()).location.origin}${
        (global || getGlobal()).location.pathname
    }lib`,
    type: 'default' | 'async' | 'defer' = 'default'
): Promise<T> {
    return new Promise((resolve, reject) => {
        const scriptTag = window.document.createElement('script')
        scriptTag.type = 'text/javascript'
        if (type !== 'default') scriptTag[type] = true
        scriptTag.src = prefix + libPath
        window.document.head.appendChild(scriptTag)

        scriptTag.onload = (e) => {
            resolve(globalName ? window[globalName] : e)
        }

        scriptTag.onerror = (err) => {
            reject(err)
        }
    })
}

/**
 * 加载 css 资源
 * @param libPath css 路径
 * @param prefix 路径前缀，默认是加载基座中的路径资源
 */
export function loadCss(
    libPath: string,
    prefix: string = `${(global || getGlobal()).location.origin}${
        (global || getGlobal()).location.pathname
    }lib`
) {
    const linkTag = window.document.createElement('link')
    linkTag.rel = 'stylesheet'
    linkTag.href = prefix + libPath
    window.document.head.appendChild(linkTag)
}
