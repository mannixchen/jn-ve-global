/*
 * @Author: zhujin zhujin@jsjngf.com
 * @Date: 2025-08-11 10:11:12
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-08-13 11:15:02
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\hooks\use-props.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { DisplayType } from '../type'

export const useDefaultProps = () => ({
    modelValue: () => [],
    display: DisplayType.FORM,
    labelPosition: 'right' as 'right',
    labelWidth: 'auto' as 'auto',
    border: false,
    stripe: false,
    // theme: 'divider',
    // showTableHeader: true,
    showSerial: true,
    layout: 'auto' as 'auto',
    leftFixedColumns: 0,
    fixedOperation: true,
    showOperation: true,
    serialName: '项目',
    operationWidth: '100px',
    // customColumns: true,
    expand: true,
    selectedRows: () => [],
    selectable: () => true,
    showCopyButton: false,
    copyButtonLabel: '复制',
    showDeleteButton: true,
    deleteButtonLabel: '删除',
    confirmDelete: true,
    sortable: false,
    upButtonLabel: '上移',
    downButtonLabel: '下移',
    addButtonLabel: '新增一项',
    slotFromParent: false,
    // addButtonStatus: 'active',
    hideAddBtn: false,
    pageSize: 10,
    max: 50
})
