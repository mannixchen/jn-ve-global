import { watch, ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import { FolderNodeFile } from '../interface/FolderNode'

interface Params {}

export default (): {
    currentFolderFiles: Ref<FolderNodeFile[]>
    currentFolderFileIds: Ref<string[]>
} => {
    const currentFolderFiles = ref<FolderNodeFile[]>([])
    const currentFolderFileIds = ref<string[]>([])

    return {
        currentFolderFiles,
        currentFolderFileIds
    }
}
