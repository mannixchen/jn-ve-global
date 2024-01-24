import { ref, watch, type Ref } from 'vue'
import { ElUpload } from 'element-plus'

export default ({ emits }): { uploadRef: Ref<any> } => {
    // 控件实例
    const uploadRef = ref<InstanceType<typeof ElUpload> | null>(null)
    watch(
        () => uploadRef.value,
        (instance) => {
            if (instance) {
                emits('getUploadRef', instance)
            }
        }
    )

    watch(
        () => uploadRef.value,
        (instance) => {
            emits('update:instance', instance)
        }
    )

    return { uploadRef }
}
