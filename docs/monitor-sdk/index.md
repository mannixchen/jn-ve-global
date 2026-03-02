# MonitorSDK

## 介绍

该插件使用[神策数据](https://manual.sensorsdata.cn/sa/docs/tech_sdk_client_web_use/v0300)提供的sa-javascript-sdk提供底层支持

monitor-sdk在基座应用中注册和监听进行基础的埋点上报, 子应用无需注册, 只需要调用提供的一些方法进行自定义上报即可.

## 开始

### 基座应用初始化

#### 1.index.html中引入打包后的sdk文件

```**html**
<script src="<%= BASE_URL %>lib/jn-monitor/index.global.js"></script>
```

#### 2.main.ts中进行注册

```ts
import monitorSDK from '@jsjn/monitor-sdk'

// 注册
app.use(monitorSdk(window.__MONITOR_SDK_CONFIG__, window.__MONITOR_SDK_GLOBAL_PROPERTIES__) as any)
```

:::warning 注意
注册时机在router, store之后
:::

#### 3.vue.config.js排除监控sdk

`externals`中添加配置 **'@jsjn/monitor-sdk': 'JnMonitor'**

#### 4.全局常量

**将全局常量定义在index.html平级的globalVariable.js中**

```js

// globalVariable.js
const pro_monitor_server_url = `${location.origin}/supervision-publicuse-server/v1/trackingEvent/track`
/**
 * 监控 SDK 配置
 */
window.__MONITOR_SDK_CONFIG__ = {
    enable_sdk: true,
    enable_page_leave: false,
    enable_page_view: true,
    enable_app_load: true,
    show_log: false,
    send_type: 'ajax', // beacon  image  ajax
    server_url: pro_monitor_server_url,
    heatmap: {
        clickmap: 'not_collect'
    }
}

/**
 * 监控 SDK 全局属性
 */
window.__MONITOR_SDK_GLOBAL_PROPERTIES__ = {}
```

**以下是全部都配置项**(正常来说上面的配置项就足够了)

```js
// 默认配置
const default = {
    enable_sdk: false, // 开启sdk
    server_url: '', // 数据接收地址
    batch_send: {
      datasend_timeout: 10000, // 一次请求超过多少毫秒的话自动取消，防止请求无响应。
      send_interval: 10000, // 间隔多少毫秒发一次数据。
      storage_length: 200, // 存储 localStorage 条数最大值，默认：200 。如 localStorage 条数超过该值，则使用 image 方式立即发送数据。v1.24.8 以上支持。
    },
    send_type: 'ajax',
    use_base64: true,
    use_client_time: true,
    is_track_single_page: true, // 单页应用页面浏览事件采集(url改变就触发)
    use_app_track: true,
    encrypt_cookie: true,
    show_log: true, // 控制台显示数据开
    heatmap: {
      // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
      // 默认只有点击 a input button textarea 四种元素时，才会触发 $WebClick 元素点击事件
      clickmap: 'default',
      // 是否开启触达图，default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭。
      // 需要 Web JS SDK 版本号大于 1.9.1
      // https://manual.sensorsdata.cn/sa/docs/tech_sdk_client_web_all_use/v0300#Web_%E5%85%83%E7%B4%A0%E7%82%B9%E5%87%BB($WebClick)
      scroll_notice_map: 'default'
    }
}
```
### 子应用的使用

子应用如果使用自定义埋点则进行下面的操作,否则不需要进行任何操作

#### 1.安装sdk

``` base
pnpm add @jsjn/monitor-sdk
```

#### 2.vue.config.js排除监控sdk

`externals`中添加配置 **'@jsjn/monitor-sdk': 'JnMonitor'**

:::warning 注意
这一步一定不要省略, 虽然也可以使用, 但是会导致monitorsdk的实例不一致, 上报的数据丢失一些默认绑定的数据
:::

## 自定义上报元素

开发者给需要上报的元素添加`data-sensors-click`属性.这时候点击该元素时则会进行一次埋点的上报
如: `<p data-sensors-click>点击我可以发送上报</p>`
