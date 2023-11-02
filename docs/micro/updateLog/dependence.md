# 微应用依赖更新日志

:::tip 最新依赖版本列表

```json
"@jsjn/micro-core-api": "^2.1.0",
"@jsjn/micro-core-assets": "^1.0.0",
"@jsjn/micro-core-components": "^2.6.0",
"@jsjn/micro-core-constants": "^2.0.0",
"@jsjn/micro-core-directives": "^1.1.0",
"@jsjn/micro-core-hooks": "^1.1.2",
"@jsjn/micro-core-micro-main": "^2.4.0",
"@jsjn/micro-core-router": "^2.1.1",
"@jsjn/micro-core-store": "^2.1.0",
"@jsjn/micro-core-utils": "^2.1.1",
"@jsjn/micro-core-views": "^2.3.1",
"@jsjn/types": "^1.4.7",
"@jsjn/utils": "^1.6.1",
"jn-ve-global": "2.11.0",
```

:::

<!-- ================== 20231102 ================================================= -->

<update-log-block>

<template #version>

20231102

</template>

<template #date>

2023-11-02

</template>

<h3>"@jsjn/micro-core-components": "^2.6.0"</h3>

适配缓存的数据抛出；

<h3>"@jsjn/micro-core-views": "^2.3.1"</h3>

页面缓存机制更新；

</update-log-block>

<!-- ================== 20231030 ================================================= -->

<update-log-block>

<template #version>

20231030

</template>

<template #date>

2023-10-30

</template>

<h3>"@jsjn/micro-core-components": "^2.5.4"</h3>

工作流高阶容器增加对再担保基座的 keep-alive 的适配（激活/失活时 数据的抛出）

</update-log-block>

<!-- ================== 20231011 ================================================= -->

<update-log-block>

<template #version>

20231011

</template>

<template #date>

2023-10-11

</template>

<h3>"@jsjn/micro-core-views": "^2.2.0"</h3>

1. 适配基座 keep-alive 配置

</update-log-block>

<!-- ================== 20231007 ================================================= -->

<update-log-block>

<template #version>

20231007

</template>

<template #date>

2023-10-07

</template>

<h3>"@jsjn/micro-core-components": "^2.5.0"</h3>

1. 增加打印（节点信息 + 审批历史）功能，[样例](../workflow.md#打印)

</update-log-block>

<!-- ================== 20230925 ================================================= -->

<update-log-block>

<template #version>

20230925

</template>

<template #date>

2023-09-25

</template>

<h3>"@jsjn/micro-core-micro-main": "^2.4.0"</h3>

1. 统一导出模块内容
2. 增加生命周期函数订阅钩子
    - `onMicroInitialized`：初始化
    - `onMicroActivated`：激活
    - `onMicroDeactivated`：失活

</update-log-block>
