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

> &#x2139;&#xfe0f;
> **注册时机在router, store之后**

#### 3.vue.config.js排除监控sdk

`externals`中添加配置 **'@jsjn/monitor-sdk': 'JnMonitor'**

#### 4.全局常量

**这些全局常量定义在index.html平级的globalVariable.js中**

`__MONITOR_SDK_CONFIG__`: monitor-sdk的初始化配置  

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

`__MONITOR_SDK_GLOBAL_PROPERTIES__`: monitor-sdk的公共上报属性(该属性会添加到每次上报的内容中)  

### 子应用的使用

子应用如果使用自定义埋点则进行下面的操作,否则不需要进行任何操作

#### 1.安装sdk

``` base
pnpm add @jsjn/monitor-sdk
```

#### 2.vue.config.js排除监控sdk

`externals`中添加配置 **'@jsjn/monitor-sdk': 'JnMonitor'**

> &#x2139;&#xfe0f;
> 这一步一定不要省略, 虽然也可以使用, 但是会导致monitorsdk的实例不一致, 上报的数据丢失一些默认绑定的数据

## 提供的方法

`@jsjn/monitor-sdk`导出了一些函数方法, 可供开发人员进行手工追加自定义上报信息,上报类型

> &#x2139;&#xfe0f;
> 后续如果新增方法可能不在此文档更新, 以具体导出的方法为准.

示例:

``` ts
import { reportEvent, registerSuperProperties, createEventTracker, getMonitorInstance } from '@jsjn/monitor-sdk'
// 该函数会像上报的信息中追加一个全局信息, 后面的上报消息中都会携带该数据
registerSuperProperties({
  custom_prop1: 'xxx',
  custom_prop2: 'xxx',
})

// 该函数可以自定义上报的类型及上报的信息(参数只存在这一次上报中)
reportEvent('$useclick', {
  userName: 'admin',
  useId: 123456
})

// 获取monitor实例
const monitorInstance = getMonitorInstance()

// 自定义链式操作的上报
const trackerInstance = createEventTracker('$user')

trackerInstance.addProperties({
  processId: '12313'
}).addProperties({
  type: 'edit'
}).report()

trackerInstance.addProperties({
  type: 'save'
}).report()
```

## 自定义上报元素

开发者给需要上报的元素添加`data-sensors-click`属性.这时候点击该元素时则会进行一次埋点的上报
如: `<p data-sensors-click>点击我可以发送上报</p>`
