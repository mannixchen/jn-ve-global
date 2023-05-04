import { defineClientConfig } from '@vuepress/client'
import ElementPlus from 'element-plus'
import zhCn from './zh-cn'
import 'element-plus/dist/index.css'
import GlobalComponent from 'jn-ve-global/packages/register'
import { getGlobal } from '@jsjn/utils'

export default defineClientConfig({
    enhance({ app, router, siteData }) {
        app.directive('auth', {})
        app.use(ElementPlus, { locale: zhCn })
        app.use(GlobalComponent)

        if (!__VUEPRESS_SSR__) {
            getGlobal()
        }
    },
    setup() {},
    rootComponents: []
})
