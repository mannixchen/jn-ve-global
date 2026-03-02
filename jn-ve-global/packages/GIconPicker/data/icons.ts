import * as elIcons from '@element-plus/icons-vue'
import * as jnIcons from '@jsjn/icons-vue'
import AliIconfontsData from '../../assets/icons/ali/iconfont.json'

/**
 * el icon 组件名字 list
 */
export const elIconKeys: string[] = Object.keys(elIcons)

/**
 * 阿里图标类名 list
 */
export const aliIcons: string[] = getAliIconNames()

/**
 * 本地 svg list
 */
export const localIcons: string[] = Object.keys(jnIcons)

/**
 * 获取 ali 图标库下载的本地项目的类名
 * @returns
 */
function getAliIconNames(): string[] {
    const { css_prefix_text: prefix, glyphs } = AliIconfontsData
    return glyphs.map((item) => `${prefix}${item.font_class}`)
}
