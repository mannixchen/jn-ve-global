# 升级指南

框架 V2 版本底层重构，更多的工作在基础建设层面完成。

框架整体使用 [无界](https://wujie-micro.github.io/doc/) 重构。

底层通过方案替换、代码优化、机制优化，使系统的运行速度得到了指数级的提升。

对比视频已发到前端群里

## 基座升级

基座升级方式不变，由架构组发出升级包，部署即可

## 微应用升级

:::tip

此次升级并不复杂，就是覆盖范围较广

:::

### 旧项目升级

:::tip

对于没有经历过上次升级(monorepo)的项目，直接使用 [micro-cli](../micro-cli/index.md) 升级即可

micro-cli 需要更新，执行

 `npm i jn-micro-cli@1.2.0 -g --registry=http://172.31.71.159/repository/npm-public/`

:::

### monorepo 项目升级

本次升级总共涉及到 6 个文件

![v12v2](/images/micro/v1tov2-files.png)

#### 文件替换

* 根目录下

  + `/global.d.ts`
  + `global.wujie.d.ts`
  + `package.json`
  + `pnpm-lock.yaml`

* 子目录下

    - `/子项目目录/public/index.html`
    - `/子项目目录/src/main.ts`

:::tip 

如果各自的项目有自己项目独有的依赖，请在覆盖 package.json 后，自行安装特有依赖

:::

### Home 升级

home 升级方式不变，参考 [首页开发](./homeDev.md)

## 二次性能优化

:::tip 结合

2.3.0 + 2.4.0

:::

### 问题分析

#### 问题1. 微应用菜单切换，转圈时间长，加载慢

:::tip

这个问题存在两个优化点：

1. 降低共享资源的请求频率，加载缓存，降低网络传输所占用的时间
2. 组件按需加载

:::

目前，微应用的共享资源（如：vue、vue-router、jn-ve-global）采用了 umd 方式引入使用，为了避免缓存，引用资源时添加了时间戳

如：

![Alt text](/images/micro/source-time.png)

时间戳是以微应用的打包时间确定的，这样一来，每个微应用（包括基座）的资源时间戳都不一致，导致每次微应用首次加载浏览器都会去加载新的资源，这些资源其实基座都已经加载过了；

其实，每个微应用的这个时间戳，在本次发包时间范围内，时间戳不变的情况下，第二次加载（包括关闭浏览器）由于该次时间戳已经加载过资源，浏览器也就不会再去请求新的了，而是加载缓存；

简而言之：微应用会在首次加载时，请求共享资源，这个行为在网络良好的情况下，不会产生什么影响。<strong style="color: #ff3040; ">但是如果涉及到网络较差、服务器处理慢等情况时</strong>  ，就会导致浏览器加载缓慢，造成切换菜单转圈时间长。即在网络传输层浪费了大量的时间

:::tip 解决方案

除去 jn-ve-global 会经常更换版本外，其他一些资源，估计很长时间不会变动，现采用版本号控制依赖缓存，原理：

基座和微应用以相同的版本号加载资源，这样基座在加载完依赖后，后续微应用加载的只是浏览器的缓存，能够有效降低传输层的耗费时间

:::

##### 方案落地：

微应用升级

1. 以下内容更替 `/public/index.html` 内容

```html
<!DOCTYPE html>
<html lang="">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <!-- 基座 & 子 共享依赖 -->
    <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/vue/<%= NODE_ENV === 'development' ? 'vue.global' : 'vue.runtime.global.prod' %>.js?v=<%= VUE_APP_VUE_V%>"></script>
    <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/vue-router/vue-router.global<%= NODE_ENV === 'development' ? '' : '.prod' %>.js"></script>
    <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/vuex/vuex.global<%= NODE_ENV === 'development' ? '' : '.prod' %>.js"></script>
    <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/@element-plus/icons-vue/index.iife.min.js"></script>
    <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/element-plus/index.full<%= NODE_ENV === 'development' ? '' : '.min' %>.js?v=<%= VUE_APP_ELEP_V%>"></script>
    <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/jn-ve-global/jn-ve-global.umd.js?v=<%= VUE_APP_VE_GLOBAL_V%>"></script>
    <!-- 如果微应用中有使用到 echarts 请把这一行注释打开 -->
    <!-- <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/echarts/echarts.min.js"></script> -->

    <!-- 项目自定义依赖 -->
    <script src="<%= BASE_URL %>microApps/index.js"></script>
</head>

<body>
    <noscript>
        <strong>
            We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without
            JavaScript enabled. Please enable it to continue.
        </strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
</body>

</html>
```

2. 以下内容追加到 `.env` 中，依赖版本以环境变量的方式注入到请求中

```shell
# 依赖版本，需要随版本更新而修改
VUE_APP_VUE_V=3.2.37
VUE_APP_ELEP_V=2.3.3
VUE_APP_VE_GLOBAL_V=2.11.0
```

3. 更新子应用的依赖，对比子应用的依赖版本，更新到如下版本

:::tip

[参考依赖最新版本](./updateLog/dependence.md)

:::

4. 以下内容更替 `/微应用项目/src/main.ts`，如有自定义内容，请自行处理

```ts
import { loadCss } from '@jsjn/utils'
// workspaace
import LGlobalComponents from '@jsjn/micro-core-components/global'
import App from '@jsjn/micro-core-views/App.vue'
import '@jsjn/micro-core-assets/styles/index.scss'
// 外部模块
import { createApp } from 'vue'
import mitt from 'mitt'
// 本地模块
import api from '@/api'
import store, { key } from '@/store'
import router from '@/router'
import directives from '@/directives'
import '@/assets/styles/index.scss'
// 组件库
import GlobalComponents from 'jn-ve-global'
import VE_GLOBAL_CONFIG from '@jsjn/micro-core-micro-main/wujie/constants/VE_GLOBAL_CONFIG'
// element-plus
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
// wujie
import microInit from '@jsjn/micro-core-micro-main'

// 基座样式文件透传到子应用：主动污染子应用内
;[
    `/basic/lib/jn-ve-global/style.css`,
    `/basic/css/app.${window['__BASIC_VERSION__']}.css`,
    `/basic/css/chunk-vendors.${window['__BASIC_VERSION__']}.css`
].forEach((path) => {
    loadCss(path, window['__MAIN_HOST_PATH__'])
})

const app = createApp(App)
// 第三方容器
app.config.globalProperties.mittBus = mitt()
// 实例挂载
app.use(ElementPlus, { locale })
    .use(router)
    .use(api)
    .use(GlobalComponents, VE_GLOBAL_CONFIG)
    .use(LGlobalComponents)
    .use(store, key)
    .use(directives)
    .use(microInit)
    .mount('#app')
```

#### 问题2. 微应用一直转圈

:::tip

需要升级 getway，具体操作请联系虞鹏飞

:::

这个涉及到 “无界” 执行原理，可以参考这个 [issues](https://github.com/Tencent/wujie/issues/54)

简单解释下：微应用初始化时，需要请求一次服务器 host，以此路径创建一个 iframe dom，在请求主 host 的时候，这个行为被服务器配置拦截了，导致框架创建不了 dom，继而无法执行初始化动作，导致转圈

解决方案：

1. 网关增加配置，如下：

![网关配置](/images/micro/getwayconfig.jpg)

2. Nginx 配置路径

![无界ng配置](/images/micro/wujie-iframe-ng-config.png)
