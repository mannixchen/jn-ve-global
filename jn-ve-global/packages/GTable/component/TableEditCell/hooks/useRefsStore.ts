/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-02-01 10:02:50
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-23 16:46:21
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/packages/GTable/component/TableEditCell/hooks/useRefsStore.ts
 * @Description: 存储组件 dom ref 引用常量
 */
import { ref, type Ref } from 'vue'

export default (): {
    editCellContentRef: Ref<any>
    controlRef: Ref<any>
} => {
    // 组件 ref 引用
    const editCellContentRef = ref<HTMLElement>(null)
    const controlRef = ref(null)

    return {
        editCellContentRef,
        controlRef
    }
}
