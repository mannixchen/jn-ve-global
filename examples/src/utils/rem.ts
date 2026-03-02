/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2022-11-29 17:18:47
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-04-26 11:36:55
 * @FilePath: /@jsjn-librar-monorepo/examples/src/utils/rem.ts
 * @Description: 系统自适应模式下的 rem 根字体设置
 */
import store from '@/store'

const rootValue = 100 // 根数值  1rem = 100px
const baseSize = 1920 // 设计稿基础尺寸 1920 基准
const minClientWidth = 1920
/**
 * 适配最大屏幕，注：市场上更多的高分辨率屏幕，如果宽度过大，同样会导致基准过大，暂时先最高适配到 1920
 * c 端存在版心，保持 1920 最大适配
 */
const maxClientWidth = 1920

let docEl = document.documentElement
let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

function recalc() {
    let clientWidth = docEl.clientWidth

    let ratio = 1
    if (clientWidth >= minClientWidth && clientWidth <= maxClientWidth) {
        ratio = clientWidth / baseSize
    } else if (clientWidth < minClientWidth) {
        ratio = minClientWidth / baseSize
    } else if (clientWidth > maxClientWidth) {
        ratio = maxClientWidth / baseSize
    }

    // rem
    docEl.style.fontSize = `${rootValue * ratio}px`

    // 比例
    store.commit('currentStatus/setScreenRatio', ratio)
}

window.addEventListener(resizeEvt, recalc, false)
document.addEventListener('DOMContentLoaded', recalc, false)
