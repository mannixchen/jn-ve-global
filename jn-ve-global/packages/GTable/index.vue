<template>
    <div
        class="g-table-root"
        :class="{
            'hide-pagination': !localConfig.pagination || localConfig.pagination.show === false,
            'data-empty': localConfig.data && localConfig.data.length === 0
        }"
    >
        <template v-if="localConfig && refreshLoad">
            <!-- 表格 -->
            <div class="g-table-main">
                <ElTable
                    ref="localInstance"
                    :tooltip-options="{
                        popperClass: 'table-tooltip-popper max-h-200'
                    }"
                    scrollbar-always-on
                    v-bind="tableProps"
                    :height="
                        tableProps.height !== undefined
                            ? tableProps.height === false
                                ? undefined
                                : tableProps.height
                            : '100%'
                    "
                    @select="localSelect"
                    @select-all="localSelectAll"
                >
                    <!-- 一键开启多选 -->
                    <ElTableColumn
                        v-if="localConfig.showSelection"
                        :width="size2Rem(55)"
                        v-bind="localConfig.selectionColumns as any"
                        type="selection"
                        class-name="table-selection-column"
                    />

                    <template
                        v-for="(columnConfig, index) in localConfig.columns"
                        :key="`${columnConfig.label}-${index}`"
                    >
                        <!-- 排除多选 + 隐藏列 -->
                        <TableColumn
                            v-if="
                                !(localConfig.showSelection && columnConfig.type === 'selection') &&
                                    !columnConfig.hide
                            "
                            :column-config="columnConfig"
                        />
                    </template>

                    <template #empty>
                        <LGIcon icon="ali-icon-wushuju" />
                        <p>
                            <span>暂无数据</span>
                            <LGIcon
                                v-if="props.config.onRefresh"
                                icon="el-Refresh"
                                :class="{ 'is-refresh': isRefresh }"
                                @click="handleEmptyRefresh"
                            />
                        </p>
                    </template>
                </ElTable>
            </div>

            <!-- 分页 -->
            <div
                v-if="
                    localConfig.pagination &&
                        (localConfig.pagination.show === true ||
                            localConfig.pagination.show === undefined)
                "
                class="g-table-pagination"
            >
                <ElPagination
                    v-if="isCreatePagination"
                    v-model:page-size="localConfig.pagination.pageSize"
                    v-model:current-page="localConfig.pagination.currentPage"
                    :total="localConfig.pagination.total"
                    :page-sizes="localConfig.pagination.pageSizes || [10, 20, 50]"
                    prev-text="上一页"
                    next-text="下一页"
                    background
                    layout="prev, pager, next, jumper, total, sizes"
                />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
export default {
    name: 'GTable'
}
</script>

<script lang="ts" setup>
import { watch, nextTick, computed, ref, provide } from 'vue'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import { size2Rem } from '@jsjn/utils'
import { GIcon as LGIcon } from '../GIcon'

import type { TableConfig, TableMethods as TableInstance } from './interface'
import { getTableProps } from './utils'
import { onCellEditKey, tableInstanceKey } from './constant/InjectionKeys'
import useLoadTriggerValidator from './hooks/useLoadTriggerValidator'
import useTimeoutCreate from './hooks/useTimeoutCreate'
import TableColumn from './component/TableColumn.vue'
import useAddOperationColumn from './component/OperationColumn/index'

const props = withDefaults(
    defineProps<{
        config: TableConfig
    }>(),
    {
        config: null
    }
)

const { isCreate: isCreatePagination } = useTimeoutCreate()

const localInstance = ref<TableInstance | null>(null)
const refreshLoad = ref(true)
// 提取 TbaleProps
const tableProps = computed(() => getTableProps(props.config))
// 本地关联 Config，关联引用
const localConfig = computed(() => props.config)

// 追加操作按钮列
useAddOperationColumn(localConfig.value)

// 提供表格的 onCellEdited 事件
provide(onCellEditKey, props.config?.onCellEdited)
// 表格实例
provide(tableInstanceKey, localInstance)

// 收集表格所有单元格的校验器
useLoadTriggerValidator({ props, localInstance })

// 监听配置对象的 !"引用"! 更改，重建表格
watch(
    () => props.config,
    () => {
        // 追加操作按钮列
        useAddOperationColumn(localConfig.value)

        // 重构 dom
        refreshLoad.value = false
        nextTick(() => {
            refreshLoad.value = true
        })
    }
)

// 将实例赋值给当前的配置对象
watch(
    () => localInstance.value,
    (instance) => {
        if (!instance) return
        localConfig.value.instance = instance
        /**
         * 较少情况下会有布局错乱，使用 ele 提供的方法重新布局
         */
        nextTick(() => {
            instance.doLayout()
        })
    }
)

// 监听分页部分的变化，向外抛出
if (localConfig.value.pagination) {
    watch(
        () => [localConfig.value.pagination.currentPage, localConfig.value.pagination.pageSize],
        ([currentPage, pageSize]) => {
            localConfig.value.pagination.onChange?.(currentPage, pageSize)
            toggleTableRowSelection()
        }
    )
}

const isRefresh = ref<boolean>(false)
const handleEmptyRefresh = () => {
    isRefresh.value = true
    setTimeout(() => {
        isRefresh.value = false
    }, 1000)
    props.config.onRefresh()
}

// *********************↓ 表格多选，跨页多选 ↓**************************************************************************************
/**
 * 如果表格没有传递 config.selectedRows 将被理解为不维护所选行
 */
function setSelectRow(selectedRows: any[]) {
    if (!localConfig.value.showSelection || !selectedRows) {
        return
    }

    // 在设置表格的选中行时，传递的 row 需要是当前 data 中同一数据的引用，这里比对数据，获取新数据的引用
    const newSelectRows = selectedRows
        .map((oldRow) => {
            return localConfig.value.data.find(
                (newRow) => JSON.stringify(newRow) === JSON.stringify(oldRow)
            )
        })
        .filter((newRow) => newRow)

    nextTick(() => {
        localInstance.value?.clearSelection()
        nextTick(() => {
            newSelectRows.forEach((row) => {
                localInstance.value?.toggleRowSelection(row, true)
            })
        })
    })
}

watch(
    () => localConfig.value.selectedRows,
    (rows) => {
        setSelectRow(rows)
    },
    {
        // 外部可能会有数组的 push、splice 等不改引用改原数组的操作
        deep: true,
        immediate: true
    }
)

watch(
    () => localConfig.value.data,
    (data) => {
        if (data && data.length) {
            setSelectRow(localConfig.value.selectedRows)
        }
    }
)

/**
 * 点击复选框，向外抛出已选数组
 */
const localSelect = (selection: any[], row: any) => {
    if (!localConfig.value.showSelection || !localConfig.value.selectedRows) {
        return
    }
    localConfig.value.selectedRows = selection
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
 * 切换分页情况下：依据所有已选行进行表格行选中状态的切换
 */
const toggleTableRowSelection = () => {
    setSelectRow(localConfig.value.selectedRows)
}
// *********************↑ 表格多选，跨页多选 ↑**************************************************************************************

defineExpose({
    instance: localInstance,
    config: localConfig
})
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
