import { watch, ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import type { TableConfig, TableMethods as TableInstance } from '../interface'

interface Params {
    localConfig: ComputedRef<TableConfig<any>>
    localInstance: Ref<TableInstance>
}

export default ({ localConfig, localInstance }: Params) => {
    watch(
        () => localConfig.value.data,
        (data) => {
            if (data && data.length) {
                _setSelectRow(localConfig.value.selectedRows)
            }
        }
    )

    watch(
        () => localConfig.value.selectedRows,
        (rows) => {
            _setSelectRow(rows)
        },
        {
            deep: true,
            immediate: true
        }
    )

    function _setSelectRow(selectedRows: any[]) {
        if (!localConfig.value.showSelection || !selectedRows) {
            return
        }

        // 在设置表格的选中行时，传递的 row 需要是当前 data 中同一数据的引用，这里比对数据，获取新数据的引用
        const newSelectRows = selectedRows
            .map((oldRow) => {
                return localConfig.value.data.find(
                    (newRow) => JSON.stringify(newRow) === JSON.stringify(oldRow)
                ) ?? oldRow
            })
            .filter(Boolean)

        nextTick(() => {
            localInstance.value?.clearSelection()
            nextTick(() => {
                newSelectRows.forEach((row) => {
                    localInstance.value?.toggleRowSelection(row, true)
                })
            })
        })
    }

    /**
     * 要理解两个概念：
     *  1. 全局维护的选中数组：外部传递的 selectedRows
     *  2. 事件维护的选中数组：table实例.toggleRowSelection(row, true) 的数组
     *
     * 在 watch 中，将这两者进行的等效设置
     *
     * 在内部选中行发生变化时，将选中数据抛出，实际由外部维护了选中行
     * 在内部无论当前页中的 data 是否存在这个选中的数据，！选中维护数组！都包含了这一项
     *  - 当前页 data 中存在于 选中数组，就选中
     *  - 不存在，就无显示
     *
     * 而在外部维护的这个状态数组，会传递给组件的任意事件，（select、select-all）
     * 事件会对这个数组进行维护，无论谁（单选框 or 全选框）维护这个这个数组，都只能基于当前页面的 data 中的数据进行维护
     * 也就是说，非当前页的数据，事件是维护不到的
     * 故，能够实现当前页的勾选数据，只能在他自己的页码（data）中维护
     */
    const localSelectAll = (selection: any[], row) => {
        if (!localConfig.value.showSelection || !localConfig.value.selectedRows) return
        localConfig.value.selectedRows = selection
    }

    /**
     * 点击复选框，向外抛出已选数组
     */
    const localSelect = (selection: any[], row: any, ...args) => {
        if (!localConfig.value.showSelection || !localConfig.value.selectedRows) {
            return
        }
        localConfig.value.selectedRows = selection
    }

    return {
        localSelect,
        localSelectAll
    }
}
