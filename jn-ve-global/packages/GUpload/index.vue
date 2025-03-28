<template>
    <ElUpload
        ref="uploadRef"
        :class="[{ 'g-upload': true, 'is-disabled': disabled }, attrs['list-type']]"
        :file-list="localFileList"
        v-bind="_getUploadProps()"
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

                    <el-button v-else size="small" type="primary" :disabled="disabled">
                        上传附件
                    </el-button>
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
            <div
                v-loading="file.isLoading"
                :class="['file-list-item', uploadListType, `btntype-${localFileListBtnType}`]"
            >
                <!-- 略缩 -->
                <div class="info">
                    <img class="preview" :src="getFileTypeIcon(file)">
                    <span class="file-name">
                        {{ file.name }}
                    </span>
                </div>

                <!-- 按钮 -->
                <div :class="['btns']">
                    <!-- 显示预览按钮：wps可预览文件类型 & 本地文件预览类型不一致 -->
                    <span
                        v-if="
                            typeIsValid(
                                localPreviewMode === PreviewMode.WPS
                                    ? [...IMG_EXT, ...WPS_PREVIEW_EXT]
                                    : [...IMG_EXT, ...LOCAL_OFFICE_EXT],
                                file.name
                            )
                        "
                        @click="filePreview(file)"
                    >
                        <LGIcon
                            v-if="localFileListBtnType === FileListBtnType.ICON"
                            icon="el-View"
                        />
                        <span v-else class="preview">预览</span>
                    </span>

                    <span
                        v-if="!downloadHide && file.status !== 'uploading'"
                        @click="fileDownload(file)"
                    >
                        <LGIcon
                            v-if="localFileListBtnType === FileListBtnType.ICON"
                            icon="el-Bottom"
                        />
                        <span v-else class="download">下载</span>
                    </span>

                    <span v-if="!delHide" @click="delFile(file)">
                        <LGIcon
                            v-if="localFileListBtnType === FileListBtnType.ICON"
                            icon="el-Delete"
                            class="del-btn-icon"
                        />
                        <span v-else class="del">删除</span>
                    </span>
                </div>

                <!-- 进度条 -->
                <el-progress
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
        :fullscreen="isFullscreen"
        :show-close="true"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        :modal="!typeIsValid(IMG_EXT, currentFile.name)"
        :custom-class="`upload-preview-modal 
        ${typeIsValid(IMG_EXT, currentFile.name) ? 'img-modal' : ''} 
        ${typeIsValid(WPS_PREVIEW_EXT, currentFile.name) ? 'office-modal' : ''}
        ${isFullscreen ? 'is-fullscreen' : ''}`"
    >
        <!-- 带有全屏操作 -->
        <template #title>
            <div class="preview-modal-title__wrapper">
                <span>{{ currentFile.name }}</span>
                <LGIcon
                    :icon="isFullscreen ? 'ali-icon-quxiaoquanping_o' : 'ali-icon-quanping_o'"
                    @click="isFullscreen = !isFullscreen"
                />
            </div>
        </template>

        <!-- 预览组件 -->
        <LGFilePreview
            :file-name="currentFile.name"
            :source="currentFile.url"
            :file-id="currentFile.url ? undefined : currentFile.fileId"
            :download-url="localDownloadUrl"
            :timeout="timeout"
            :content-height="isFullscreen ? `calc(100vh - ${size2Rem(57)}px)` : '90vh'"
            :wps-preview-url="currentFile.wpsPreviewUrl"
            :preview-mode="localPreviewMode"
            :get-wps-edit-link-api="localGetWpsEditLinkApi"
            @close="modalShow = false"
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

<script lang="ts" setup>
import { computed, ref, watch, Ref } from 'vue'
import { getFileTypeIcon } from './utils'
import { UploadFile } from './interface/UploadFile'
import {
    useHooks,
    useMethods,
    useRefStore,
    useFileStore,
    useConstant,
    useContinuousPreview
} from './hooks'
import { ElUpload, ElButton, ElProgress, ElMessage } from 'element-plus'
import {
    GFilePreview as LGFilePreview,
    IMG_EXT,
    WPS_PREVIEW_EXT,
    LOCAL_OFFICE_EXT,
    PreviewMode,
    FileListBtnType
} from '../GFilePreview'
import { GIcon as LGIcon } from '../GIcon'
import { GModal as LGModal } from '../GModal'
import { global, size2Rem } from '@jsjn/utils'
import useLocalPreviewMode from '../GFilePreview/hooks/useLocalPreviewMode'
import { typeIsValid } from '../GFilePreview/utils'

defineOptions({
    name: 'GUpload',
    inheritAttrs: false
})

export interface UploadCustomProps {
    instance?: any
    /**
     * 抛出的值
     */
    modelValue?: string | Array<string>
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
     * 删除按钮的钩子
     * @param file 
     */
    onDelete?: (file: UploadFile) => void
    /**
     * 下载 & 预览文件的 url
     */
    downloadUrl?: string
    /**
     * 下载的请求超时时间
     */
    timeout?: number
    /**
     * 使用 wps 预览的接口 url
     */
    getWpsEditLinkApi?: string
    /**
     * 预览模式
     */
    previewMode?: PreviewMode
    /**
     * 文件列表的按钮展示形式
     *  - text：文本
     *  - icon：图标
     */
    fileListBtnType?: FileListBtnType

    /**
     * 是否采用分片上传
     */
    chunkUpload?: boolean
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
    getWpsEditLinkApi: '/supervision-publicuse-server/v1/wps/preview',
    timeout: 1000 * 20,
    chunkUpload: false
})

const emits = defineEmits([
    'update:modelValue',
    'update:fileList',
    'getUploadRef',
    'update:instance'
])

const isFullscreen = ref<boolean>(true)
const { localPreviewMode, isWpsPreview, localFileListBtnType } = useLocalPreviewMode({ props })
const { uploadRef } = useRefStore({ emits })

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
    localDownloadUrl,
    localGetWpsEditLinkApi
} = useConstant(props)

// 文件、文件列表（回填）
const { currentFile, localFileList } = useFileStore({
    props,
    emits,
    attrs,
    uploadRef,
    localDownloadUrl
})

// 钩子
const { beforeUpload, onExceed, onSuccess, onError, onChange, onRemove } = useHooks({
    attrs,
    emits,
    localReqHeaders,
    localFileList,
    currentFile,
    props,
    uploadRef,
    localLimit
})

// 方法
const { filePreview, fileDownload, delAvatar, delFile, loadFile, wpsPreview } = useMethods({
    attrs,
    emits,
    uploadRef,
    currentFile,
    props,
    modalShow,
    localDownloadUrl,
    isWpsPreview,
    localGetWpsEditLinkApi
})

// 连续预览
const { preImgHandle, nextImgHandle } = useContinuousPreview({
    currentFile,
    localFileList,
    isWpsPreview,
    wpsPreview,
    loadFile
})

/**
 * 过滤自定义参数
 */
function _getUploadProps() {
    let props = {}
    Object.keys(attrs.value).forEach((key) => {
        if (
            ![
                'accept',
                'list-type',
                'limit',
                'size',
                'imgUrl',
                'show-file-list',
                'on-success',
                'on-error',
                'before-upload',
                'on-exceed',
                'on-change',
                'on-remove',
                'headers'
            ].includes(key)
        ) {
            props[key] = attrs.value[key]
        }
    })

    return props
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
        background-color: #606266;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.8;
        transition: all 0.2s;
        position: fixed;
        top: calc(50% - var(--btn-size));
        left: 100px;
        z-index: 29999;
        color: #fff;

        &:hover {
            opacity: 1;
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .next-trigger {
        left: initial;
        right: 100px;
    }
}

.preview-modal-title__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 40px;

    span {
        font-size: 24px;
        color: #333333;
        font-weight: 600;
        letter-spacing: 1px;
        line-height: var(--el-dialog-font-line-height);
    }

    i {
        cursor: pointer;
        font-size: 22px;
    }
}
</style>
