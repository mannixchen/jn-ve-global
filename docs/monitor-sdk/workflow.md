# 工作流底部功能按钮数据埋点

注意：**此功能只针对于系统内置的的功能按钮，自定义按钮需自己手动上报**

发送的上报事件类型为`$overflow-`开头

```ts
/** workflow-demo.vue */

import { forParent } from '@jsjn/micro-core-micro-main'

/**
 * 发送上报的数据到基座
 */
function sendReportData2b() {
  // 上报的数据必须包裹在overflowData中
  forParent({
    overflowData: {
      // 上报的数据
      userName: '坤坤',
      age: 18
      hobby: ['唱', '跳', 'Rap', '篮球']
    }
  })
}
```

注意发送数据的时机，必须在点击内置的功能按钮之前。否则不会发送埋点请求
