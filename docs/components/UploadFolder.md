# GUploadFolder

以树形文件夹形式上传&展示文件列表的组件

:::tip 注意：
1. 需要按照组件需要的数据规范传入
2. 组件仅提供纯粹的通用文件夹行为，其他业务自行实现，提供了 `@folder-content-change` 事件，供上传完成后，处理业务逻辑
3. 组件提供了下载全部的方法，需要获取组件 ref 调用
4. 在上传完成后，不需要再次获取整个文件夹的数据，上传的文件，会自动同步到前端内存中的这个 “文件夹” 下
5. 获取整个文件夹数据，只存在初始化 or 详情
6. 不需要上传只查看，传递 `disabled` 即可
7. 组件自适应高度，最高适配 300px
8. 查看 `FolderNode` 接口，节点下 `files` 字段存在两种情况
    - 假值类：不予展示右侧文件列表，不能上传
    - 数组：为空，可以上传。有文件，回填文件信息
:::

## 1. 涉及到的类型

### 1.1 组件参数列表

预置的参数列表，如果想要传递一些 `GUpload` 的参数，可直接添加到 `GUploadFolder` 标签上

```typescript
interface GuploadFolderProps {
        data: FolderNode[]
        /**
         * 单个文件上传最大大小(单位：MB)
         */
        size?: number
        /**
         * 下载 & 预览文件的 url
         */
        downloadUrl?: string
        /**
         * 上传地址
         */
        uploadUrl?: string
        /**
         * 下载的请求超时时间
         */
        timeout?: number
        /**
         * 树的源数据映射字段，默认以 id 为 node-key，name 为 label 展示
         */
        sourceMapping?: TreeV2Props
        /**
         * 是否默认展开所有节点
         */
        defaultExpandAll?: boolean
        /**
         * 禁用上传，只查看列表
         */
        disabled?: boolean
    }
```

###  1.2 文件夹树节点数据类型

```typescript
interface FolderNode {
    /**
     * 业务数据
     */
    id?: string
    name?: string
    /**
     * 附件列表
     */
    files: UploadFile[]
    /**
     * 子节点
     */
    children?: FolderNode[]
    /**
     * 禁用节点
     */
    disabled?: boolean
    /**
     * 扩展字段
     */
    [k: string]: any
}

```

### 1.3 文件夹内的文件类型

name && fileId 必须Ï

```typescript
interface UploadFile {
    /**
     * 预览 or 下载时的 loading
     */
    isLoading?: boolean
    /**
     * 文件名称
     */
    name: string
    /**
     * 文件地址：
     *  - 预览
     *  - 下载
     */
    url?: string
    /**
     * 业务中的文件服务器的文件 id
     */
    fileId?: string
    percentage?: number
    status?: UploadStatus
    size?: number
    response?: unknown
    uid?: number
    raw?: ElFile
    type?: string
    [k: string]: any
}
```

## 2. 示例代码

```vue
<template>
    <div class="test-box">
        <g-button-group :btns="btns" />
        <GUploadFolder
            ref="this$GUploadFolder"
            :data="filesData"
            :upload-url="FILE_UPLOAD_URL"
            :download-url="FILE_DOWNLOAD_URL"
            :disabled="false"
            @folder-content-change="handleFolderContentChange"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FolderTest'
})
</script>

<script lang="ts" setup>
import { watch, ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
// 详见：下方的模拟数据
import mockFolder from './folder.json'
// 视项目内的常量目录为准
import { FILE_UPLOAD_URL, FILE_DOWNLOAD_URL } from '@/constants/commonApiUrl'
import { BtnProps } from 'jn-ve-global'

const filesData = ref(mockFolder)
const this$GUploadFolder = ref<any>(null)

const btns = reactive<BtnProps[]>([
    {
        label: '下载全部',
        onClick() {
            this$GUploadFolder.value.downloadAll()
        }
    }
])

function handleFolderContentChange(currentFolder, currentFiles) {
    console.log(`%c 1. 当前文件夹 === `, 'color: #67c23a;', currentFolder)
    console.log(`%c 2. 当前活跃的文件列表 === `, 'color: #f56c6c;', currentFiles)
}
</script>

<style lang="scss" scoped>
.test-box {
    background-color: #fff;
}
</style>

```

### 2.1 示例数据结构

 `import mockFolder from './folder.json'`

```json
[
    {
        "name": "合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案",
        "id": "1",
        "children": [
            {
                "name": "合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同1",
                "id": "1-1",
                "disabled": false,
                "files": [
                    {
                        "id": "3",
                        "name": "李雷雷-前端-金农-百力奥推荐4.20.pdf",
                        "fileId": "7,393c9b833275"
                    },
                    {
                        "id": "4",
                        "name": "docxjs.docx",
                        "fileId": "3,393d97a114f9"
                    }
                ]
            },
            {
                "name": "合同2",
                "id": "1-2",
                "disabled": false,
                "files": [
                    {
                        "id": "5",
                        "name": "工作簿1.xlsx",
                        "fileId": "7,393e70c684fe"
                    }
                ]
            },
            {
                "name": "合同3",
                "id": "1-3",
                "disabled": false,
                "files": [
                    {
                        "id": "1",
                        "name": "sun3.webp",
                        "fileId": "7,393a8da0dedb"
                    },
                    {
                        "id": "2",
                        "name": "sun2.webp",
                        "fileId": "6,393b2bfbebe9"
                    }
                ]
            }
        ],
        "disabled": false
    },
    {
        "name": "合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案",
        "id": "1",
        "children": [
            {
                "name": "合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同1",
                "id": "1-1",
                "disabled": false,
                "files": [
                    {
                        "id": "3",
                        "name": "李雷雷-前端-金农-百力奥推荐4.20.pdf",
                        "fileId": "7,393c9b833275"
                    },
                    {
                        "id": "4",
                        "name": "docxjs.docx",
                        "fileId": "3,393d97a114f9"
                    }
                ]
            },
            {
                "name": "合同2",
                "id": "1-2",
                "disabled": false,
                "files": [
                    {
                        "id": "5",
                        "name": "工作簿1.xlsx",
                        "fileId": "7,393e70c684fe"
                    }
                ]
            },
            {
                "name": "合同3",
                "id": "1-3",
                "disabled": false,
                "files": [
                    {
                        "id": "1",
                        "name": "sun3.webp",
                        "fileId": "7,393a8da0dedb"
                    },
                    {
                        "id": "2",
                        "name": "sun2.webp",
                        "fileId": "6,393b2bfbebe9"
                    }
                ]
            }
        ],
        "disabled": false
    },
    {
        "name": "合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案",
        "id": "1",
        "children": [
            {
                "name": "合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同档案合同1",
                "id": "1-1",
                "disabled": false,
                "files": [
                    {
                        "id": "3",
                        "name": "李雷雷-前端-金农-百力奥推荐4.20.pdf",
                        "fileId": "7,393c9b833275"
                    },
                    {
                        "id": "4",
                        "name": "docxjs.docx",
                        "fileId": "3,393d97a114f9"
                    }
                ]
            },
            {
                "name": "合同2",
                "id": "1-2",
                "disabled": false,
                "files": [
                    {
                        "id": "5",
                        "name": "工作簿1.xlsx",
                        "fileId": "7,393e70c684fe"
                    }
                ]
            },
            {
                "name": "合同3",
                "id": "1-3",
                "disabled": false,
                "files": [
                    {
                        "id": "1",
                        "name": "sun3.webp",
                        "fileId": "7,393a8da0dedb"
                    },
                    {
                        "id": "2",
                        "name": "sun2.webp",
                        "fileId": "6,393b2bfbebe9"
                    }
                ]
            }
        ],
        "disabled": false
    }
]
```
