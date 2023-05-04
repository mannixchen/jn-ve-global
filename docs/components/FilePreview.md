# FilePreview

文件预览组件，目前支持

* img
* pdf
* doc/docx
* xls/xlsx

组件预览文件资源来源方式：

* 网络地址
* fileId（关联业务，内部自动获取资源）
* Bolb

<demo-block>

<Upload-preview />

<template #code>

<CodeGroup>
  <CodeGroupItem title="示例代码" active>

@[code](@demoroot/Upload/preview.vue)

  </CodeGroupItem>

  <CodeGroupItem title="fileList.json" >

@[code](@demoroot/Upload/data/fileList.json)

  </CodeGroupItem>
</CodeGroup>

</template>

</demo-block>

:::tip

传递 `source` 和 `fileId` 都可以获取到资源，优先级：

source > fileId

:::

## FilePreview 属性

参数|说明|类型|默认值
-----|-----|-----|-----
fileName | 文件名称 | string | --
fileId | 文件资源服务器 id（业务） | string | --
source | 用户主动传递的文件地址 or bolb 对象 |  string \| Blob | --
downloadUrl | 下载地址，传递 fileId 自动获取地址时，必须传递 | string | /kinso-basic-open-server/v1/document/file/download
