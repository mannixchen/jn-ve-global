# 工作流底部功能按钮数据埋点

注意：**此功能只针对于系统内置的的功能按钮，自定义按钮需自己手动上报**

发送的上报事件类型为:`$workflow` + `按钮类型` + `按钮参数的key` + `按钮参数的value`。（不可自定义，是内部拼接）
如图：
![上报类型示例](https://s1.imagehub.cc/images/2025/07/17/c5f06fba259f5fd7e804ea68f52ba616.png)

## 发送上报的数据

```ts
/** workflow-demo.vue */

import { forParent } from '@jsjn/micro-core-micro-main'


/**
 * 根据点击的按钮类型获取对应的数据进行上报
 * 如：上报的类型为 $workflow-save-submit 则在取 save-submit 内的数据和其他数据进行上报
 */
function sendReportData2b() {
  // 上报的数据必须包裹在workflowData中
  forParent({
    workflowData: {
      // 这里是根据按钮来区分的上报数据

      // 通过类型按钮对应的参数
      'save-submit': {
        msg: '提交成功'
      },
      // 退回类型按钮对应的参数
      'reject': {
        msg: '退回成功'
      },
      // ...以此类推（对应按钮的数据的key值要严格按照流程按钮的类型的枚举值来定义）


      // 这里是公共的上报数据
      userName: '坤坤',
      age: 18
      hobby: ['唱', '跳', 'Rap', '篮球']
    }
  })
}

/**
 * 此时如果点击了通过按钮（按钮动作为“保存并提交”），上报的数据则为：
 * {
 *   msg: '提交成功',
 *   userName: '坤坤',
 *   age: 18
 *   hobby: ['唱', '跳', 'Rap', '篮球']
 * }
 */

```

:::warning 注意
1、注意发送数据的时机，按钮点击之前就要使用forParent把数据传递出去。
:::

## 流程按钮的类型

```ts

/**
 * 任务操作枚举
 * 定义了任务操作的所有可能的状态和动作，每个操作对应一个特定的任务行为。
 */
export enum TaskAction {
    /**
     * 提交并完成任务
     */
    SaveSubmit = 'save-submit',

    /**
     * 拒绝任务
     */
    Reject = 'reject',

    /**
     * 暂存任务
     */
    Save = 'save',

    /**
     * 催办任务
     */
    Press = 'press',

    /**
     * 转办任务
     */
    Delegate = 'delegate',

    /**
     * 终止任务
     */
    Terminate = 'terminate',

    /**
     * 撤回任务
     */
    Cancel = 'cancel',

    /**
     * 加签任务
     */
    AddParticipant = 'add-participant',

    /**
     * 减签任务
     */
    DeleteParticipant = 'delete-participant',

    /**
     * 挂起任务
     */
    Suspend = 'suspend',

    /**
     * 恢复任务
     */
    Resume = 'resume',

    /**
     * 通知任务
     */
    Notice = 'notice',

    /**
     * 取消任务领取
     */
    SendBack = 'sendback',

    /**
     * 重做任务
     */
    Redo = 'redo',

    /**
     * 拒绝协办任务
     */
    Refuse = 'refuse',

    /**
     * 同意任务
     */
    Agree = 'agree',

    /**
     * 不同意任务
     */
    NotAgree = 'not_agree',

    /**
     * 领取
     */
    Collect = 'collect',

    /**
     * 自定义
     */
    Defined = 'defined'
}
```
