import { watch, ref, toRef, nextTick, Ref, ComputedRef } from 'vue'
import { FolderNode, FolderNodeFile } from '../interface/FolderNode'
import { isArray } from 'lodash'
interface Params {
    props: {
        data: FolderNode[]
    }
}

export default ({
    props
}: Params): {
    currentFolder: Ref<FolderNode | null>
    handleCurrentChange: (d: FolderNode) => void
    this$elTree: Ref<any>
} => {
    const currentFolder = ref<FolderNode | null>(null)
    const this$elTree = ref<any>(null)

    function handleCurrentChange(data: FolderNode) {
        /**
         * - 节点如果有 files 字段，但是为空，可以上传
         * - 无 files 字段，不可上传
         */
        if (data.files && isArray(data.files)) {
            currentFolder.value = data
        } else {
            currentFolder.value = null
        }
    }

    return {
        currentFolder,
        handleCurrentChange,
        this$elTree
    }
}
