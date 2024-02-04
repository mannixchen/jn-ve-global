# 组件库 jn-ve-global 更新日志 

<!-- ================== 3.3.0-beta.3 ======================================================================== -->

<update-log-block>

<template #version>

3.3.0-beta.3

</template>

<template #date>

2024-02-04

</template>

<h3>New</h3>

<h4>Upload</h4>

1. 文件列表的操作按钮（预览、下载、删除）增加文本 与 图标的切换api（监管默认文字）

<h4>Table</h4>

表格的滚动条始终显示且加粗加重

</update-log-block>

<!-- ================== 3.3.0-beta.2 ======================================================================== -->

<update-log-block>

<template #version>

3.3.0-beta.2

</template>

<template #date>

2024-01-24

</template>

<h3>New</h3>

<h4>Upload</h4>

1. 预览集成 wps 预览功能（监管）
2. 普通预览优化
    - 图片可缩放、旋转
    - pdf 预览优化、兼容性调整
3. 预览增加全屏（默认）预览功能

<h4>FilePreview</h4>

1. 集成 wps 预览功能（监管）

</update-log-block>

<!-- ================== 3.0.0 ======================================-->

<update-log-block>

<template #version>

3.1.0

</template>

<template #date>

2023-12-14

</template>

<h3>New</h3>

<h4>Modal</h4>

默认取消 点击遮罩、Esc 关闭弹框行为

<h4>Collapse</h4>

1. 锚点默认收起
2. 样式优化（整体缩小）

<h4>FigureInput</h4>

增加进制 api，用来格式化单位 tip

<h4>UploadFolder</h4>

增加文件夹组件（未全局抛出）

</update-log-block>

<!-- ================== 3.0.0 ======================================-->

<update-log-block>

<template #version>

3.0.0

</template>

<template #date>

2023-12-04

</template>

:::danger

项目结构优化，打包方式重构
* 整体打包
* 分包打包

:::

<h3>New</h3>

1. 分包打包，可在项目中按需加载，按需加载方式与 element-plus 同步
2. 更完备的组件类型，编辑器全局组件类型提示等
3. svg 图标等抽离组件库，形成独立项目 `@jsjn/icons-vue`

<h3>BugFix</h3>

<h4>GCollapse</h4>

导航条针对运行时动态增减的 CollapseItem 维护问题；

</update-log-block>
