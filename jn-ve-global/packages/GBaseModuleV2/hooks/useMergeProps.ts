import { reactive, watch, nextTick, computed, useAttrs } from 'vue'
import { assignOwnProp, partitionObj2HumpObj } from '@jsjn/utils'
import type { TableConfig } from '../../GTable'

export default ({
    props,
    emits,
    showColumns,
    loadTable
    // savedConfig,
    // setSavedConfig
}): {
    localTableConfig: TableConfig
} => {
    const attrs = useAttrs()
    const _humpAttrs = computed(() => partitionObj2HumpObj(attrs, ['onReset', 'onSearch']))

    const localTableConfig = reactive<TableConfig<any>>({
        instance: null,
        rowKey: 'id',
        stripe: true,
        // columns: props.tableColumns,
        columns: showColumns.value,
        data: props.tableData,
        pagination: props.tablePagination,
        rowBtnConfig: props.rowBtnConfig,
        selectedRows: props.selectedRows,
        ..._humpAttrs.value
    })

    /* --------------- 向外抛出 ------------------------------------------------------------------- */
    watch(
        () => localTableConfig.instance,
        (instance) => {
            emits('getTableInstance', instance)
        }
    )
    // 选中行
    watch(
        () => localTableConfig.selectedRows,
        (list) => {
            emits('update:selectedRows', list)
        }
    )

    /* --------------- 向内关联 ------------------------------------------------------------------- */
    watch(
        () => _humpAttrs.value,
        (obj) => {
            assignOwnProp(localTableConfig, obj, ['instance', 'columns', 'data'])
            nextTick(() => {
                localTableConfig.instance?.doLayout()
            })
        }
    )

    // 数据
    // watch(
    //     () => props.tableData,
    //     (data) => {
    //         localTableConfig.data = data
    //     }
    // )
    watch(
        () => localTableConfig.data,
        (data) => {
            emits('update:tableData', data)
        }
    )

    // 列
    // watch(
    //     () => props.tableColumns,
    //     (columns) => {
    //         localTableConfig.columns = columns
    //     }
    // )
    watch(
        () => showColumns,
        (columns) => {
            console.log('showColumns', columns)
            localTableConfig.columns = columns.value
            // savedConfig.value = {
            //     columns: columns.value,
            //     searchConditions: savedConfig.value?.searchConditions ?? []
            // }

            // setSavedConfig()
            // nextTick(() => {
            //     localTableConfig.instance?.doLayout()
            // })
        },
        {
            deep: true
        }
    )

    // 分页
    watch(
        () => props.tablePagination,
        (val) => {
            localTableConfig.pagination = val
            if (val && !localTableConfig.pagination['onChange']) {
                localTableConfig.pagination['onChange'] = () => {
                    // props.loadTableMethods?.()
                    loadTable()
                }
            }
        },
        {
            immediate: true,
            deep: false
        }
    )

    // 选中行的状态数组
    watch(
        () => props.selectedRows,
        (list) => {
            localTableConfig.selectedRows = list
        }
    )

    return {
        localTableConfig
    }
}
