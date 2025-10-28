import { reactive, watch, nextTick, computed, useAttrs, ref, Ref } from 'vue'
import { assignOwnProp, partitionObj2HumpObj } from '@jsjn/utils'
import type { TableConfig, TableColumnProps } from '../../GTable'
import { BaseModuleColumnProps } from '../../GBaseModuleV2/interface'
import { getBaseModuleProps } from '../../_globalConstant/baseModuleProps'

export default ({
    props,
    emits
}): {
    localTableConfig: TableConfig<any>
    showColumns: Ref<BaseModuleColumnProps[]>
    sortColumns: Ref<TableColumnProps[]>
    exportedColumns: Ref<BaseModuleColumnProps[]>
} => {
    const attrs = useAttrs()
    const _humpAttrs = computed(() => partitionObj2HumpObj(attrs, ['onReset', 'onSearch']))
    const sortColumns = ref<TableColumnProps[]>([])
    const showColumns = ref<BaseModuleColumnProps[]>([])
    const exportedColumns = ref<BaseModuleColumnProps[]>([])

    // const showColumns = ref<BaseModuleColumnProps[]>(props.tableColumns)
    // const exportedColumns = ref<BaseModuleColumnProps[]>(
    //     props.tableColumns.filter(
    //         (item) =>
    //             !item.hide &&
    //             item?.type !== 'expand' &&
    //             !(item?.prop === 'opertion' && item?.label === '操作')
    //     )
    // )

    const localTableConfig = reactive<TableConfig<any>>({
        instance: null,
        rowKey: 'id',
        stripe: true,
        border: getBaseModuleProps().border,
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
    watch(
        () => props.tableData,
        (data) => {
            localTableConfig.data = data
        }
    )

    // 列
    watch(
        () => props.tableColumns,
        (columns) => {
            // localTableConfig.columns = columns
            showColumns.value = columns.filter((item) => !item?.hide)
            sortColumns.value = columns.filter((item) => !item?.hide)
        },
        {
            immediate: true,
            deep: true
        }
    )

    watch(
        () => showColumns.value,
        (columns) => {
            // console.log('showColumns', columns)

            localTableConfig.columns = columns

            exportedColumns.value = columns.filter(
                (item) =>
                    !item.hide &&
                    item?.type !== 'expand' &&
                    !(item?.prop === 'opertion' && item?.label === '操作')
            )
        },
        {
            immediate: true,
            deep: true
        }
    )

    // 分页
    let watchPagination = null
    let isOnChangeFlag = false
    watch(
        () => props.tablePagination,
        (val) => {
            if (watchPagination) {
                watchPagination()
            }

            localTableConfig.pagination = val
            if (val && !localTableConfig.pagination['onChange']) {
                localTableConfig.pagination['onChange'] = () => {
                    isOnChangeFlag = true
                    props.loadTableMethods?.()
                }
            }

            /**
             * 20250729 fix: 由于 gtable 内部的分页交给了事件驱动，导致外部直接改变 currentPage 时，未能直接触发 onChange
             * 因此需要监听 currentPage 的变化，并手动触发 loadTableMethods
             */
            watchPagination = watch(
                () => props.tablePagination?.currentPage,
                (val) => {
                    if (isOnChangeFlag) {
                        isOnChangeFlag = false
                        return
                    }
                    if (!val) {
                        return
                    }
                    props.loadTableMethods?.()
                }
            )
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
        showColumns,
        sortColumns,
        exportedColumns,
        localTableConfig
    }
}
