/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-12 14:49:02
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-03-18 10:57:11
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\register.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import type { App } from 'vue'
// import { elIconKeys, aliIcons, localIcons } from './GIconPicker/data/icons'
// import { setting, type Settings } from './setting'

import { components } from './components'

/**
 * TODO: rollup + esbuild 没找到类似于 import.meta.glob 或 require.context 的功能，只好一个个引入
 */

/**
 * 全局注册
 */
export default {
    version: '__VERSION__',
    // install(app: App, props?: Settings) {
    install(app: App) {
        // vue 模板组件
        components.forEach((item, index) => {
            app.component(item.name, item)
            // console.log('******component-name******', item.name)
        })

        // setting(props)
    }
}

// export const icons = { elIconKeys, aliIcons, localIcons }
