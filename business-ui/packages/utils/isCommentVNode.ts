/*
 * @Author: zhujin zhujin@jsjngf.com
 * @Date: 2025-08-12 16:44:50
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-08-12 16:49:30
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\utils\xx.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Comment } from 'vue'

/**
 * 检查是否为 Vue 注释节点
 * @param {VNode | any} node 虚拟节点
 * @returns {boolean}
 */
export function isCommentVNode(node) {
    // Vue 3 官方标识符
    if (typeof Comment !== 'undefined' && node?.type === Comment) {
        return true
    }

    // 降级方案（依赖内部实现细节）
    const type = node?.type
    return (
        typeof type === 'symbol' &&
        Symbol.keyFor(type) === undefined && // 排除全局 symbol
        type.toString() === 'Symbol(v-cmt)' // Vue 内部标准描述
    )
}