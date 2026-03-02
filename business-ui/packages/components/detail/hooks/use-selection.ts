/*
 * @Author: zhujin zhujin@jsjngf.com
 * @Date: 2025-07-28 16:28:28
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-08-13 15:28:14
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\hooks\use-selection.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { reactive, toRefs, nextTick, ref, Ref } from 'vue'
import type { PaginationProps } from 'element-plus'
import type { DetailProps, TableRowForm } from '../type'
import { FormProps } from '../../form'

interface LocalState {
    checkAll: boolean
    indeterminate: boolean
    selectedRows: TableRowForm[]
}

export const useSelection = (props: DetailProps, currentRecords: Ref<TableRowForm[]>, emits) => {
    const { selectable } = props
    const state = reactive<LocalState>({
        selectedRows: [],
        checkAll: false,
        indeterminate: false
    })
    // 多选变化时触发
    const selectChange = ({
        form,
        forms,
        index
    }: {
        form: TableRowForm
        forms?: TableRowForm[]
        index?: number
    }) => {
        // console.log('selectChange')
        const selectableForms = forms?.filter((form, index, forms) =>
            selectable({ form, index, forms })
        )

        state.checkAll = selectableForms?.every((item) => item?.checked)

        state.indeterminate =
            selectableForms?.some((item) => item.checked) &&
            selectableForms.some((item) => !item.checked)

        state.selectedRows = forms.filter((item) => item?.checked)

        emits(
            'select',
            state.selectedRows,
            form
        )
        // console.log('selectChange-selectedRows', state.selectedRows)
        emits('update:selectedRows', state.selectedRows)
    }


    const selectAllChange = (val) => {
        // console.log('selectAllChange')
        // const selectableForms = forms?.filter((form, index, forms) =>
        //     selectable({ form, index, forms })
        // )
        state.checkAll = val
        state.indeterminate = false

        currentRecords.value = currentRecords.value.map((form, index, forms) => {
            form.checked = selectable({ form, index, forms }) ? val : form.checked
            return form
        })

        const selection = currentRecords.value?.filter(
            (form, index, forms) => selectable({ form, index, forms }) && form.checked
        )

        state.selectedRows = selection

        emits('selectAll', selection)
        emits('update:selectedRows', selection)
    }

    return {
        ...toRefs(state),
        selectChange,
        selectAllChange
    }
}
