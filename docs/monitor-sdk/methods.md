# 提供的方法

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
