<template>
    <ElUpload
        ref="uploadRef"
        :class="[{ 'g-upload': true, 'is-disabled': disabled }, attrs['list-type']]"
        :file-list="localFileList"
        v-bind="getUploadProps()"
        :action="localUploadUrl"
        :headers="localReqHeaders"
        :disabled="disabled"
        :accept="localAccept"
        :list-type="(uploadListType as any)"
        :limit="localLimit"
        :show-file-list="localShowFileList"
        :on-success="onSuccess"
        :on-error="onError"
        :before-upload="beforeUpload"
        :on-exceed="(onExceed as any)"
        :on-change="onChange"
        :on-remove="onRemove"
    >
        <!-- 触发器 -->
        <template #default>
            <slot v-if="attrs['list-type'] !== 'avatar'">
                <div :class="['upload-btn', uploadListType]">
                    <LGIcon v-if="['picture-card'].includes(uploadListType)" icon="el-Plus" />

                    <ElButton v-else size="small" type="primary" :disabled="disabled">
                        上传附件
                    </ElButton>
                </div>
            </slot>
            <div v-else class="avatar-upload">
                <LGIcon icon="el-Plus" />
                <img v-if="currentFile && currentFile.url" :src="currentFile.url" alt="">
                <div v-if="currentFile && currentFile.url" class="operation" @click.stop="">
                    <LGIcon icon="el-View" @click="modalShow = true" />
                    <LGIcon
                        v-if="!disabled"
                        icon="el-Delete"
                        class="del-btn-icon"
                        @click="delAvatar"
                    />
                </div>
            </div>
        </template>

        <!-- 文件列表 -->
        <template #file="{ file }">
            <div v-loading="file.isLoading" :class="['file-list-item', uploadListType]">
                <!-- 略缩 -->
                <div class="info">
                    <img class="preview" :src="getFileTypeIcon(file.name, file.url)">
                    <span class="file-name">
                        {{ file.name }}
                    </span>
                </div>

                <!-- 按钮 -->
                <div class="btns">
                    <LGIcon
                        v-if="showPreview(file.name)"
                        icon="el-View"
                        @click="filePreview(file)"
                    />
                    <LGIcon v-if="!downloadHide" icon="el-Bottom" @click="fileDownload(file)" />
                    <LGIcon
                        v-if="!delHide"
                        icon="el-Delete"
                        class="del-btn-icon"
                        @click="delFile(file)"
                    />
                </div>

                <!-- 进度条 -->
                <ElProgress
                    v-if="file.status === 'uploading'"
                    :percentage="+file.percentage"
                    type="line"
                    :stroke-width="strokeWidth"
                    :show-text="['picture', 'text'].includes(uploadListType)"
                />

                <!-- 成功角标 -->
                <label v-if="file.status === 'success'" class="status-label">
                    <LGIcon icon="el-Check" />
                </label>
            </div>
        </template>
    </ElUpload>

    <!-- 预览 -->
    <LGModal
        v-if="currentFile"
        v-model="modalShow"
        vertical-center
        :title="currentFile.name"
        :show-close="true"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        :custom-class="`upload-preview-modal 
        ${imgSuffix.includes(getFileType(currentFile.name)) ? 'img-modal' : ''} 
        ${officeSuffix.includes(getFileType(currentFile.name)) ? 'office-modal' : ''}`"
    >
        <!-- 预览组件 -->
        <LGFilePreview
            :file-name="currentFile.name"
            :source="currentFile.url"
            :file-id="currentFile.url ? undefined : currentFile.fileId"
            :download-url="localDownloadUrl"
            :timeout="timeout"
        />

        <!-- 连续预览 -->
        <div v-if="attrs['list-type'] !== 'avatar'" class="pre-trigger" @click="preImgHandle">
            <LGIcon icon="el-ArrowLeftBold" />
        </div>

        <div v-if="attrs['list-type'] !== 'avatar'" class="next-trigger" @click="nextImgHandle">
            <LGIcon icon="el-ArrowRightBold" />
        </div>
    </LGModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GUpload',
    inheritAttrs: false
})
</script>

<script lang="ts" setup>
import { type Ref } from 'vue'
import { getFileType, getFileTypeIcon } from './utils'
import { imgSuffix, officeSuffix } from './constant/fileTypeList'
import type { UploadFile } from './interface/UploadFile'
import { getHooks, getMethods, getUtils, getRefStore, getFileStore, getConstant } from './mixins'
import { ElUpload, ElButton, ElProgress, ElMessage } from 'element-plus'
import { GFilePreview as LGFilePreview } from '../GFilePreview'
import { GIcon as LGIcon } from '../GIcon'
import { GModal as LGModal } from '../GModal'

export interface UploadCustomProps {
    instance?: any
    /**
     * 抛出的值
     */
    modelValue: string | Array<string>
    /**
     * 文件列表（双向绑定）
     */
    fileList?: UploadFile[]
    /**
     * 禁用
     */
    disabled?: boolean
    /**
     * 单个文件上传最大大小(单位：MB)
     */
    size?: number
    /**
     * 上传头像回显的 img url
     */
    imgUrl?: string | object
    /**
     * 隐藏下载按钮
     */
    downloadHide?: boolean
    /**
     * 隐藏删除按钮
     */
    delHide?: boolean
    /**
     * 上传成功后不显示消息
     */
    successNoMsg?: boolean
    /**
     * 下载的钩子，将会覆盖本地操作
     */
    onDownload?: (file: UploadFile) => void
    /**
     * 预览的钩子，将会覆盖本地操作
     */
    onMagnify?: (file: UploadFile) => void
    /**
     * 下载 & 预览文件的 url
     */
    downloadUrl?: string
    /**
     * 下载的请求超时时间
     */
    timeout?: number
}

const props = withDefaults(defineProps<UploadCustomProps>(), {
    instance: null,
    modelValue: '',
    fileList: () => [],
    disabled: false,
    size: 5,
    imgUrl: null,
    onDownload: null,
    onMagnify: null,
    downloadHide: false,
    delHide: false,
    successNoMsg: false,
    downloadUrl: '/kinso-basic-open-server/v1/document/file/download',
    timeout: 1000 * 20
})

const emits = defineEmits([
    'update:modelValue',
    'update:fileList',
    'getUploadRef',
    'update:instance'
])

const {
    modalShow,
    attrs,
    uploadListType,
    strokeWidth,
    localReqHeaders,
    localShowFileList,
    localLimit,
    localAccept,
    localUploadUrl,
    localDownloadUrl
} = getConstant(props)

// elUpload ref
const { uploadRef } = getRefStore({ emits })

// 文件、文件列表（回填）
const { currentFile, localFileList } = getFileStore({
    props,
    emits,
    attrs,
    uploadRef,
    localDownloadUrl
})

// 钩子
const { beforeUpload, onExceed, onSuccess, onError, onChange, onRemove } = getHooks({
    attrs,
    emits,
    localFileList,
    currentFile,
    props,
    uploadRef,
    localLimit
})

// 方法
const { filePreview, fileDownload, delAvatar, delFile } = getMethods({
    attrs,
    emits,
    uploadRef,
    currentFile,
    props,
    modalShow,
    localDownloadUrl
})

// 工具
const { getUploadProps, showPreview } = getUtils({ attrs })

// 连续预览
const preImgHandle = () => {
    const tIndex = _findTargetFileIndex(currentFile.value, localFileList.value)
    const preIndex = tIndex - 1
    if (preIndex < 0) {
        ElMessage.warning('没有了!')
        return
    }
    currentFile.value = localFileList.value[preIndex]
}
const nextImgHandle = () => {
    const tIndex = _findTargetFileIndex(currentFile.value, localFileList.value)
    const preIndex = tIndex + 1
    if (preIndex >= localFileList.value.length) {
        ElMessage.warning('到底了!')
        return
    }
    currentFile.value = localFileList.value[preIndex]
}

function _findTargetFileIndex(file: UploadFile, fileList: UploadFile[]) {
    return fileList.findIndex((item) => item.fileId === file.fileId)
}

defineExpose({
    uploadRef
} as {
    uploadRef: Ref<any>
})
</script>

<style lang="scss">
@import './styles';
@import './styles/preview.scss';

.upload-preview-modal {
    --btn-size: 40px;

    overflow: initial !important;

    .pre-trigger,
    .next-trigger {
        width: var(--btn-size);
        height: var(--btn-size);
        border-radius: 50%;
        background-color: rgba($color: #fff, $alpha: 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.5;
        transition: all 0.2s;
        position: absolute;
        top: calc(50% - var(--btn-size));
        left: -50px;
        z-index: 29999;

        &:hover {
            opacity: 1;
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .next-trigger {
        left: initial;
        right: -50px;
    }
}
</style>
