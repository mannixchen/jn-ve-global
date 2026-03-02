<template>
    <div class="g-upload-folder__wrapper">
        <div class="folder__wrapper">
            <el-tree
                ref="this$elTree"
                :data="data"
                :props="localSourceMapping"
                :node-key="localSourceMapping.value"
                :default-expand-all="defaultExpandAll"
                :expand-on-click-node="false"
                :highlight-current="true"
                @current-change="handleCurrentChange"
            >
                <template #default="{ data: nodeData }">
                    <div class="folder__item">
                        <span
                            class="label"
                            :title="(nodeData as FolderNode)[localSourceMapping['label'] as string]"
                        >
                            {{ (nodeData as FolderNode)[localSourceMapping['label'] as string] }}
                        </span>

                        <!-- 文件数量 -->
                        <span v-if="(nodeData as FolderNode).files?.length" class="file-num">
                            （{{ (nodeData as FolderNode).files?.length }}）
                        </span>
                    </div>
                </template>
            </el-tree>
        </div>

        <div v-if="currentFolder" :class="['files__wrapper', { 'is-disabled': disabled }]">
            <div
                class="folder-name"
                :title="currentFolder?.[localSourceMapping['label'] as string]"
            >
                {{ currentFolder?.[localSourceMapping['label'] as string] }}
            </div>

            <div class="files-content">
                <span class="label"> 附件材料：</span>
                <LGUpload
                    v-model="currentFolderFileIds"
                    v-model:file-list="currentFolderFiles"
                    :action="uploadUrl"
                    :download-url="downloadUrl"
                    :timeout="timeout"
                    :size="size"
                    list-type="text"
                    :disabled="disabled"
                    :chunk-upload="chunkUpload"
                    v-bind="$attrs"
                />
            </div>
        </div>
    </div>

    <LGModal
        v-model="downloadAllModalShow"
        title="下载进度"
        :btns="modalBtns"
        :show-close="false"
        :vertical-center="true"
        custom-class="download-all-modal"
        width="50%"
        @closed="handleDModalClosed"
    >
        <el-progress
            :percentage="percentage"
            :stroke-width="15"
            striped
            striped-flow
            :duration="50"
            :format="percentageLabelFormat"
        />

        <ul class="download-files__wrapper">
            <li v-for="file in allDownloadFiles" :key="file.fileId">
                <span class="file-label">{{ `${file.folderName} / ${file.name}` }}</span>
                <LGIcon
                    v-if="file.downloadStatus === DownloadStatus.SUCCESS"
                    icon="el-CircleCheck"
                    class="success"
                />
                <LGIcon
                    v-if="file.downloadStatus === DownloadStatus.FAIL"
                    icon="el-CircleClose"
                    class="error"
                />
                <LGIcon
                    v-if="file.downloadStatus === DownloadStatus.DOWNLOADING"
                    icon="el-Loading"
                    class="loading"
                />
            </li>
        </ul>
    </LGModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { chunk } from 'lodash'
export default defineComponent({
    name: 'GUploadFolder',
    inheritAttrs: false
})
</script>

<script lang="ts" setup>
import { watch, computed, type Ref } from 'vue'
import { GUpload as LGUpload } from '../GUpload'
import { GModal as LGModal } from '../GModal'
import { GIcon as LGIcon } from '../GIcon'
import type { TreeV2Props } from '../index'
import { type FolderNode, type FolderNodeFile, DownloadStatus } from './interface/FolderNode'
import useTreeContext from './hooks/useTreeContext'
import useUploadContext from './hooks/useUploadContext'
import useDownloadAll from './hooks/useDownloadAll'

const props = withDefaults(
    defineProps<{
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
         * 树的源数据映射字段
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

        /**
         * 是否启用分片上传
         */
        chunkUpload?: boolean
    }>(),
    {
        size: 10,
        downloadUrl: '/kinso-basic-open-server/v1/document/file/download',
        uploadUrl: '/kinso-basic-open-server/v1/document/file/upload',
        timeout: 1000 * 60 * 10,
        defaultExpandAll: true,
        chunkUpload: true
    }
)

const emits = defineEmits(['folder-content-change'])

const localSourceMapping = computed<TreeV2Props>(() => ({
    label: 'name',
    value: 'id',
    children: 'children',
    disabled: 'disabled',
    ...props.sourceMapping
}))

const { currentFolder, handleCurrentChange, this$elTree } = useTreeContext({ props })
const { currentFolderFiles, currentFolderFileIds } = useUploadContext()
const {
    downloadAll,
    percentage,
    handleDModalClosed,
    allDownloadFiles,
    downloadAllModalShow,
    modalBtns,
    percentageLabelFormat
} = useDownloadAll({
    localSourceMapping,
    props
})

/**
 * 文件夹活跃，同步其内部文件
 */
watch(
    () => currentFolder.value,
    (folder) => {
        if (!folder) {
            currentFolderFiles.value = []
            return
        }
        currentFolderFiles.value = folder.files
    }
)

/**
 * 上传文件后，抛出事件，参数：
 *  - 当前文件夹
 *  - 当前活跃的文件列表
 */
watch(
    () => currentFolderFileIds.value,
    (ids) => {
        currentFolder.value!.files = currentFolderFiles.value.map((file) => ({
            name: file.name,
            fileId: file.fileId
        }))

        emits('folder-content-change', currentFolder.value, currentFolderFiles.value)
    }
)

defineExpose({
    currentFolder,
    currentFolderFiles,
    elTreeRef: this$elTree,
    downloadAll
} as {
    /**
     * 当前活跃的文件夹节点
     */
    currentFolder: Ref<FolderNode>
    /**
     * 活跃文件夹下的文件
     */
    currentFolderFiles: Ref<FolderNodeFile[]>
    /**
     * 文件夹树的 ref
     */
    elTreeRef: Ref<any>
    /**
     * 下载全部方法
     */
    downloadAll: () => void
})
</script>

<style lang="scss">
.g-upload-folder__wrapper {
    --folder-w: 460px;
    --folder-node-h: 30px;
    --folder-node-font-size: 16px;
    --folder-max-h: 300px;
    --base-space: 10px;
    --base-space-num: 3;

    display: flex;
    flex-wrap: nowrap;
    font-family: PingFangSC-Regular;

    .folder__wrapper {
        width: var(--folder-w);
        max-height: var(--folder-max-h);
        overflow-y: auto;
        min-height: 100px;

        .el-tree-node {
            &.is-current {
                > .el-tree-node__content {
                    background-color: #f4f7f9;

                    .folder__item {
                        color: #333;
                        font-weight: 600;
                    }
                }
            }

            .el-tree-node__content {
                height: var(--folder-node-h);

                &:hover {
                    background-color: var(--el-color-primary-light-9);
                }

                .el-tree-node__expand-icon {
                    font-size: 24px;
                    padding: 4px;

                    &.expand {
                        color: #999999;
                    }
                }
            }
        }

        .folder__item {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding-right: 20px;
            overflow: hidden;
            font-size: var(--folder-node-font-size);
            color: #606266;

            .label {
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .file-num {
                width: 30px;
                flex: none;
            }
        }
    }

    .files__wrapper {
        --wrapper-mr: 40px;
        --files-content-label-h: var(--jn-ve-g-btn-height);

        width: calc(100% - var(--folder-w) - var(--wrapper-mr));
        padding-top: var(--folder-node-h);
        margin-left: var(--wrapper-mr);
        padding-right: var(--folder-node-h);
        padding-bottom: var(--base-space);

        .folder-name {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 16px;
            font-weight: 600;
            color: #000;
            height: var(--folder-node-h);
            line-height: var(--folder-node-h);
            margin-bottom: var(--base-space);
        }

        .files-content {
            display: flex;
            width: 100%;

            .label {
                line-height: var(--files-content-label-h);
                height: var(--files-content-label-h);
                font-size: 16px;
                color: #606266;
                letter-spacing: 0;
                text-align: right;
                font-weight: 400;
            }

            .g-upload {
                flex: 1;
            }
        }

        &.is-disabled {
            --files-content-label-h: 24px;
            --base-space-num: 2;

            .el-upload-list {
                margin: 0;
            }
        }

        .el-upload-list {
            /* --base-space-num 代表的是布局的间隔，在这里包括
                - 1. 文件夹标题下边距
                - 2. 展示文件夹内容区域的底内边距
                - 3. 真实文件列表的上边距（禁用时则无，所以禁用状态为 2）
            */
            max-height: calc(
                var(--folder-max-h) - var(--folder-node-h) * 2 - var(--files-content-label-h) - var(
                        --base-space
                    ) * var(--base-space-num)
            );

            overflow-y: auto;
        }
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.download-all-modal {
    .download-files__wrapper {
        margin-top: 10px;
        max-height: 500px;
        overflow-y: auto;

        li {
            line-height: 24px;
            display: flex;
            align-items: center;
            overflow: hidden;

            .g-icon {
                font-size: 18px;
                margin-left: 10px;

                &.success {
                    color: var(--el-color-success);
                }

                &.error {
                    color: var(--el-color-danger);
                }

                &.loading {
                    color: var(--el-color-primary);
                    animation: rotate 1.5s linear infinite;
                }
            }
        }
    }
}
</style>
