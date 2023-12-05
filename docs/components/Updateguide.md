# 升 3.0.0

:::tip 升级目的

组件库打包方式重构，带来了如下功能：

1. 打包重构，提供 esm/umd/cjs 多种使用方式
2. 提供按需加载，提供了 unplugin-vue-components 的解析器
3. 提供了 Volar 全局组件的类型支持
4. svg 抽离组件库，减小了组件库打包体积，本地 svg 图标与组件库分开维护
5. 一些问题修复

后续组件库修改将在此基础上升级
:::

## 基座

基座使用 2.5.0 版本

## 微应用

1. `root/package.json`

```json
"@jsjn/utils": "^1.6.2",
"jn-ve-global": "3.0.0"
```

2. `root/xxx/.env` && `root/xxx/.env.local`

```shell
VUE_APP_VE_GLOBAL_V=3.0.0
```

3. `root/xxx/public/index.html`

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

4. `root/xxx/src/main.ts`

```ts
// 基座样式文件透传到子应用：主动污染子应用内，这里采用异步加载非基座注入时，可以节省 80ms 的微应用加载前的创建脚本时间
;[
    `/basic/lib/jn-ve-global/style.css`,
    `/basic/lib/jn-ve-global/fonts/iconfont.css`, // 3.0.0 新增的
    `/basic/css/app.${window['__BASIC_VERSION__']}.css`,
    `/basic/css/chunk-vendors.${window['__BASIC_VERSION__']}.css`
].forEach((path) => {
    loadCss(path, window['__MAIN_HOST_PATH__'])
})
```

### 5. 升级类型提示（可选）

目的：3.0 之前，所有的组件都是以全局注册使用的，没有组件的类型提示。

比如在组件上写一个属性，没有这个属性的规范提示

升级类型提示之后，可以在编辑器环境下获取到全局组件的类型提示，如下所示

![全局组件类型支持](@imgs/global-com-types-tip.jpg)

支持方式主要通过指定 ts 的 `types` 范围，引用组件库提供的类型文件

<strong style="color: #ff3040; ">注意，这里一共有两个 tsconfig</strong>，可直接覆盖

1. monorepo 根目录下的: `root/tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "strict": true,
        "jsx": "preserve",
        "moduleResolution": "node",
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "forceConsistentCasingInFileNames": true,
        "useDefineForClassFields": true,
        "sourceMap": true,
        "lib": ["esnext", "dom", "dom.iterable", "scripthost"],
        "noImplicitAny": false,
        "noImplicitThis": false,
        "strictNullChecks": false,
        "types": [
            "@types/node",
            "@types/eslint",
            "@types/webpack-env",
            "element-plus/global",
            "jn-ve-global/es/global"
        ]
    },
    "exclude": ["node_modules"]
}
```

2. 具体项目下的: `root/xxx/tsconfig.json`

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
            "jn-ve-global/es/global",
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
