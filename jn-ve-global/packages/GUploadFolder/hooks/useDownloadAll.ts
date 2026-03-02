import { watch, ref, computed, nextTick, Ref, ComputedRef, reactive } from 'vue'
import { BtnProps, TreeV2Props } from '../../index'
import { type FolderNodeFile, type FolderNode, DownloadStatus } from '../interface/FolderNode'
import { ElMessageBox } from 'element-plus'
import { getFileBlobUrlByRequest } from '../../GUpload/utils'

export interface Params {
    localSourceMapping: ComputedRef<TreeV2Props>
    props: {
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
    }
}

export default ({
    localSourceMapping,
    props
}: Params): {
    downloadAll: () => void
    percentage: ComputedRef<number>
    handleDModalClosed: () => void
    allDownloadFiles: Ref<FolderNodeFile[]>
    downloadAllModalShow: Ref<boolean>
    modalBtns: BtnProps[]
    percentageLabelFormat: () => string
} => {
    // 下载文件进度
    const percentage = computed<number>(() => {
        const successCount = allDownloadFiles.value.filter(
            (file) => file.downloadStatus === DownloadStatus.SUCCESS
        ).length
        const totalCount = allDownloadFiles.value.length
        const decimal = (successCount / totalCount) * 100
        return (decimal.toFixed(2) as any) - 0
    })

    // 进度条 label
    const percentageLabelFormat = () =>
        `${
            allDownloadFiles.value.filter((file) => file.downloadStatus === DownloadStatus.SUCCESS)
                .length
        }/${allDownloadFiles.value.length}`

    // 供下载的所有文件
    const allDownloadFiles = ref<FolderNodeFile[]>([])

    // 弹框
    const downloadAllModalShow = ref<boolean>(false)
    const modalBtns = reactive<BtnProps[]>([
        {
            label: '关闭',
            hide: true,
            type: 'default',
            onClick() {
                downloadAllModalShow.value = false
            }
        }
    ])

    // 下载方法
    function downloadAll() {
        const allFiles = _getAllFiles(props.data)

        ElMessageBox.confirm(`当前共 ${allFiles.length} 个文件提供下载，是否全部下载`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            allDownloadFiles.value = allFiles
            downloadAllModalShow.value = true

            // 阻塞下载每一个文件
            for (const file of allFiles) {
                file.downloadStatus = DownloadStatus.DOWNLOADING
                const url = `${props.downloadUrl}/${file.fileId}`

                const blobUrl = await getFileBlobUrlByRequest(url, undefined, props.timeout).catch(
                    (err) => {
                        file.downloadStatus = DownloadStatus.FAIL
                        return ''
                    }
                )

                if (blobUrl) {
                    let aDom: HTMLAnchorElement | null = document.createElement('a')
                    aDom.href = blobUrl
                    aDom.setAttribute('download', file.name)
                    aDom.click()
                    aDom = null
                    file.downloadStatus = DownloadStatus.SUCCESS
                }
            }

            modalBtns[0].hide = false
        })
    }

    function _getAllFiles(data: FolderNode[]): FolderNodeFile[] {
        let files: FolderNodeFile[] = []

        function _recursion(data: FolderNode[]) {
            data.forEach((node) => {
                if (node.children?.length) {
                    _recursion(node.children)
                }
                if (node.files) {
                    files = files.concat(
                        node.files.map((item) =>
                            reactive({
                                downloadSucess: undefined,
                                folderName: node[localSourceMapping.value['label'] as string],
                                ...item
                            })
                        )
                    )
                }
            })
        }
        _recursion(data)
        return files
    }

    function handleDModalClosed() {
        modalBtns[0].hide = true
    }

    return {
        downloadAll,
        percentage,
        handleDModalClosed,
        allDownloadFiles,
        downloadAllModalShow,
        modalBtns,
        percentageLabelFormat
    }
}
