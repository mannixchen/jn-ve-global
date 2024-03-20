import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import './assets/styles/index.scss'
import './utils/rem'
import mitt from 'mitt'
import directives from './directives'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 组件库（开发测试时 workspace 引用入口）
import JnVeGlobal from 'jn-ve-global/packages/index'
import { VeGlobalSetting } from 'jn-ve-global'
import 'jn-ve-global/packages/assets/icons/ali/iconfont.css'
// import 'jn-ve-global/es/fonts/iconfont.css'

// 主系统请求拦截器注入组件库
import interceptorsReqHandle from '@/http/interceptors/request'
import interceptorsResHandle from '@/http/interceptors/response'

const app = createApp(App)

// 第三方容器
app.config.globalProperties.mittBus = mitt()

app.use(directives)
    .use(ElementPlus, { locale: zhCn })
    .use(router)
    .use(store, key)
    .use<VeGlobalSetting>(JnVeGlobal, {
        // 基座确定 baseModule 的默认模式
        baseModuleDefaultMode: 'tabular',
        interceptorsReqHandle,
        interceptorsResHandle,
        collapseMode: 'syb'
    })
    .mount('#app')
