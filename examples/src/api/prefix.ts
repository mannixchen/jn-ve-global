const prefix = '/proxy'
/**
 * 默认代理
 */
export default prefix

// 模拟基座代理配置
window['__BASE_PREFIX__'] = prefix

/**
 * 多个代理情况在这里统一定义及引用，统一维护，避免出现魔法字符串现象
 */
export const OtherPrefixs = {}
