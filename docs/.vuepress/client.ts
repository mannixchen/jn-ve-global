import { defineClientConfig } from 'vuepress/client'
import ElementPlus from 'element-plus'
import zhCn from './zh-cn'
import 'element-plus/dist/index.css'
// import GlobalComponent from 'jn-ve-global/packages/register'
// import GlobalComponent from 'jn-ve-global'
// import 'jn-ve-global/style.css'
// import 'jn-ve-global/es/css/index.css'
import 'jn-ve-global/packages/assets/icons/ali/iconfont.css'

export default defineClientConfig({
    async enhance({ app, router, siteData }) {
        // app.directive('auth', {})
        // app.use(ElementPlus, { locale: zhCn })
        // app.use(GlobalComponent)

        if (!__VUEPRESS_SSR__) {
            const GlobalComponent = await import('jn-ve-global/packages/index')
            app.directive('auth', {})
            app.use(ElementPlus, { locale: zhCn })
            app.use(GlobalComponent.default)
            // app.use(GlobalComponent)
        }
    },
    setup() {},
    rootComponents: []
})
