# 适配基座2.5+

[[toc]]

:::tip

直接使用脚手架创建的新微应用，已保持最新

:::

升级微应用适配 基座 2.5+，主要更新

* 组件库 umd 资源名称更改，适配组件库 3.0+
* 升级 vue 版本到 3.4+
* 升级组件库 3.0+
* 升级一些依赖版本
* 全局组件的 ts 类型提示支持

:::danger 破坏性

在旧代码中，不少人复制粘贴的如下类似的代码：

 `import { FormProps } from 'jn-ve-global/packages/GForm'`

这行代码引用涉及到了组件库内源码的引用，组件库升级 3.0 后，打包工具及源码目录发生了修改，直接引用源码会导致组件库打包工具与项目打包工具不符，所产生编译错误

注：本身这种引用就是错误的，应该换成

 `import { FormProps } from 'jn-ve-global'`

请注意仔细排查项目中类似的引用 `jn-ve-global/packages/xxxx`

:::

## 1. 修改共享资源引用

 `public/index.html`

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

    <!-- 组件库 -->
    <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/@jsjn/icons-vue/index.min.js"></script>
    <script src="<%= NODE_ENV === 'development' ? VUE_APP_BASE_APP_SERVER : '/basic' %>/lib/jn-ve-global/index.umd.cjs?v=<%= VUE_APP_VE_GLOBAL_V%>"></script>

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

## 2. 升级依赖版本

 `/package.json`

```json
{
    "name": "micro-temp-monorepo",
    "version": "2.4.0",
    "private": true,
    "scripts": {
        "dev:all": "node ./run/dev.js",
        "build:all": "node ./run/build.js",
        "serve:all": "node ./run/serve.js",
        "lint": "eslint --ext .js,.ts",
        "lint:fix": "eslint --ext .js,.ts --fix",
        "prepare": "node ./run/initHusky.js",
        "cm": "git-cz",
        "psh:all": "node ./run/publish.js"
    },
    "resolutions": {
        "element-plus": "2.3.3",
        "vue": "3.4.21"
    },
    "dependencies": {
        "@element-plus/icons-vue": "2.0.10",
        "@jsjn/common-module": "workspace:*",
        "@jsjn/icons-vue": "^1.0.0",
        "@jsjn/micro-core-api": "^2.1.0",
        "@jsjn/micro-core-assets": "^1.0.0",
        "@jsjn/micro-core-components": "^2.6.1",
        "@jsjn/micro-core-constants": "^2.0.0",
        "@jsjn/micro-core-directives": "^1.1.0",
        "@jsjn/micro-core-hooks": "^1.1.2",
        "@jsjn/micro-core-micro-main": "^2.4.1",
        "@jsjn/micro-core-router": "^2.1.1",
        "@jsjn/micro-core-store": "^2.1.0",
        "@jsjn/micro-core-utils": "^2.1.1",
        "@jsjn/micro-core-views": "^2.3.3",
        "@jsjn/types": "^1.4.7",
        "@jsjn/utils": "^1.6.3",
        "@micro-zoe/micro-app": "^0.8.11",
        "async-validator": "^4.2.5",
        "axios": "^1.6.8",
        "core-js": "^3.36.1",
        "dayjs": "^1.11.10",
        "echarts": "^5.5.0",
        "element-plus": "2.3.3",
        "jn-ve-global": "3.4.3",
        "js-base64": "^3.7.7",
        "mitt": "^3.0.1",
        "nprogress": "^0.2.0",
        "qs": "^6.12.0",
        "sortablejs": "^1.15.2",
        "uuid": "^9.0.1",
        "vue": "3.4.21",
        "vue-grid-layout": "3.0.0-beta1",
        "vue-router": "4.3.0",
        "vuedraggable": "^4.1.0",
        "vuex": "^4.1.0",
        "wujie": "1.0.17",
        "wujie-vue3": "1.0.17"
    },
    "devDependencies": {
        "@babel/node": "^7.23.9",
        "@babel/preset-typescript": "^7.24.1",
        "@changesets/cli": "^2.27.1",
        "@commitlint/cli": "^17.8.1",
        "@commitlint/config-conventional": "^17.8.1",
        "@types/inquirer": "8.2.3",
        "@types/lodash": "^4.17.0",
        "@types/node": "^18.19.26",
        "@types/qs": "^6.9.14",
        "@types/uuid": "^8.3.4",
        "@types/webpack-env": "^1.18.4",
        "@typescript-eslint/eslint-plugin": "^5.62.0",
        "@typescript-eslint/parser": "^5.62.0",
        "@vue/cli-plugin-babel": "~5.0.8",
        "@vue/cli-plugin-eslint": "~5.0.8",
        "@vue/cli-plugin-router": "~5.0.8",
        "@vue/cli-plugin-typescript": "~5.0.8",
        "@vue/cli-plugin-vuex": "~5.0.8",
        "@vue/cli-service": "~5.0.8",
        "@vue/eslint-config-typescript": "^11.0.3",
        "circular-dependency-plugin": "^5.2.2",
        "commitizen": "^4.3.0",
        "cz-conventional-changelog": "^3.3.0",
        "cz-customizable": "^7.0.0",
        "eslint": "^8.57.0",
        "eslint-config-prettier": "^8.10.0",
        "eslint-plugin-prettier": "^4.2.1",
        "eslint-plugin-vue": "^9.23.0",
        "figlet": "^1.7.0",
        "filemanager-webpack-plugin": "^7.0.0",
        "husky": "^8.0.3",
        "inquirer": "8.2.4",
        "lint-staged": "^13.3.0",
        "postcss-pxtorem": "^6.1.0",
        "prettier": "^2.8.8",
        "sass": "^1.72.0",
        "sass-loader": "^13.3.3",
        "style-resources-loader": "^1.5.0",
        "typescript": "5.1.6",
        "webpack-dev-server": "4.15.1",
        "yorkie": "^2.0.0"
    },
    "lint-staged": {
        "*.{js,jsx,vue,ts,tsx}": [
            "eslint --fix",
            "git add"
        ]
    },
    "config": {
        "commitizen": {
            "path": "cz-customizable"
        }
    }
}
```

## 3. 修改 main.ts

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
import GlobalComponents, { type VeGlobalSetting } from 'jn-ve-global'
import VE_GLOBAL_CONFIG from '@jsjn/micro-core-micro-main/wujie/constants/VE_GLOBAL_CONFIG'
// element-plus
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
// wujie
import microInit from '@jsjn/micro-core-micro-main'

// TODO: 基座样式文件透传到子应用：主动污染子应用内 [一种优化性能的方式，保留]
// ;[
//     `/basic/lib/jn-ve-global/style.css`,
//     `/basic/lib/jn-ve-global/fonts/iconfont.css`,
//     `/basic/css/app.${window['__BASIC_VERSION__']}.css`,
//     `/basic/css/chunk-vendors.${window['__BASIC_VERSION__']}.css`
// ].forEach((path) => {
//     loadCss(path, window['__MAIN_HOST_PATH__'])
// })

const app = createApp(App)
// 第三方容器
app.config.globalProperties.mittBus = mitt()
// 实例挂载
app.use(ElementPlus, { locale })
    .use(router)
    .use(api)
    .use<VeGlobalSetting>(GlobalComponents, VE_GLOBAL_CONFIG)
    .use<any>(LGlobalComponents)
    .use(store, key)
    .use(directives)
    .use(microInit)
    .mount('#app')
```

## 4. 子项目中的 tsconfig.json

```json
{
    "extends": "../tsconfig.json",
    "compilerOptions": {
        // "outDir": "./dist",
        "composite": false,
        "rootDir": "../",
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@ROOT/*": ["./*"]
        },
        "types": [
            "@types/node",
            "@types/eslint",
            "@types/webpack-env",
            "element-plus/global",
            "jn-ve-global/es/global"
        ]
    },
    "include": [
        "./src/**/*.ts",
        "./src/**/*.tsx",
        "./src/**/*.vue",

        "../global.d.ts",
        "../source.d.ts",
        "../shims-vue.d.ts"
    ]
}
```

## 5. .env

```shell
# 依赖版本
VUE_APP_VUE_V=3.4.21
VUE_APP_ELEP_V=2.3.3
VUE_APP_VE_GLOBAL_V=3.4.3
```
