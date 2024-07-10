/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-13 13:57:52
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2024-07-10 17:03:31
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/utils/externalDepMapping.ts
 * @Description: 组件库依赖排除打包列表 https://rollup.nodejs.cn/configuration-options/#external
 */
export const externalDepMapping = {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'element-plus': 'ElementPlus',
    '@element-plus/icons-vue': 'ElementPlusIconsVue',
    lodash: '_',
    'resize-observer-polyfill': 'ResizeObserver',
    'echarts': 'echarts',
    '@vue-office/excel': 'vue-office-excel',
    '@vue-office/docx': 'vue-office-docx',
    '@vue-office/pdf': 'vue-office-pdf',
    '@vueuse/core': 'VueUse',
    'axios': 'axios',
    '@jsjn/icons-vue': 'JnIconsVue',
    '@jsjn/utils': 'JnUtils',
    'async-validator': 'Schema',
    sortablejs: 'Sortable'
}
