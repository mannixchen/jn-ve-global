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
                        v-bind="(localConfig.selectionColumns as any)"
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
        </template>

        <!-- 分页 -->
        <div
            v-if="
                localConfig.pagination &&
                    (localConfig.pagination.show === true || localConfig.pagination.show === undefined)
            "
            class="g-table-pagination"
        >
            <ElPagination
                v-if="isCreatePagination"
                v-model:page-size="localConfig.pagination.pageSize"
                v-model:current-page="localConfig.pagination.currentPage"
                :total="localConfig.pagination.total"
                :page-sizes="localConfig.pagination.pageSizes || [10, 20, 50]"
                :prev-text="prevText"
                :next-text="nextText"
                background
                :layout="layout"
                @current-change="currentChange"
                @size-change="sizeChange"
            />
        </div>
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
import _ from 'lodash'

import type { TableConfig, TableMethods as TableInstance } from './interface'
import { getTableProps } from './utils'
import { onCellEditKey, tableInstanceKey } from './constant/InjectionKeys'
import useLoadTriggerValidator from './hooks/useLoadTriggerValidator'
import useTimeoutCreate from './hooks/useTimeoutCreate'
import TableColumn from './component/TableColumn.vue'
import useAddOperationColumn from './component/OperationColumn/index'
import useSelector from './hooks/useSelector'
import { Bases } from '../setting'
import { getBase } from '../_globalConstant/base'

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

// 分页布局（当前监管表格分页布局需要客制化）
const layout = computed(() => {
    if (getBase() === Bases.REGTECH) {
        return 'total, sizes, prev, pager, next, jumper'
    }
    return 'prev, pager, next, jumper, total, sizes'
})
const prevText = computed(() => (getBase() === Bases.REGTECH ? '' : '上一页'))
const nextText = computed(() => (getBase() === Bases.REGTECH ? '' : '下一页'))

const { localSelect, localSelectAll } = useSelector({
    localConfig,
    localInstance
})

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

        if (localConfig.value.instance === null) {
            localConfig.value.instance = instance
        } else if (
            _.isObject(localConfig.value.instance) &&
            _.isEmpty(localConfig.value.instance)
        ) {
            _.assign(localConfig.value.instance, instance)
        }

        /**
         * 较少情况下会有布局错乱，使用 ele 提供的方法重新布局
         */
        nextTick(() => {
            instance.doLayout()
        })
    }
)

//监听列变化
watch(
    () => localConfig.value.columns,
    (val) => {
        refreshLoad.value = false
        nextTick(() => {
            refreshLoad.value = true
            // setSelectRow(localConfig.value.selectedRows)
        })
    },
    { deep: true }
)

const isRefresh = ref<boolean>(false)
const handleEmptyRefresh = () => {
    isRefresh.value = true
    setTimeout(() => {
        isRefresh.value = false
    }, 1000)
    props.config.onRefresh()
}

const currentChange = (page: number) => {
    localConfig.value.pagination.onChange(page, localConfig.value.pagination.pageSize)
}

const sizeChange = (size: number) => {
    localConfig.value.pagination.onChange(
        localConfig.value.pagination.currentPage,
        size
    )
}

defineExpose({
    instance: localInstance,
    config: localConfig
})
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
