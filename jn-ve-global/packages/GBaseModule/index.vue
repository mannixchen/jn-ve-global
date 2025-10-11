<template>
    <div
        :class="[
            'base-module-root',
            $attrs.class,
            `${localMode}-mode`,
            {
                'no-padding': (noSearchLabel && !moreSearchMode) || !searchFormProps,
                'tabs-layout': !!tabs.length
            }
        ]"
    >
        <!-- 搜索 -->
        <TableSearch
            v-if="searchFormProps"
            ref="tableSearchRef"
            :mode="localMode"
            :search-form-props="searchFormProps"
            :search-btns-config="searchBtnsConfig"
            :no-search-label="noSearchLabel"
            :search-btn-horizontal="searchBtnHorizontal"
            :more-search-mode="moreSearchMode"
        />

        <!-- 中间操作区域 -->
        <div class="middle-area">
            <span v-if="localMode === 'tabular' && !noSearchLabel" class="title">查询结果</span>

            <div
                v-if="(btns && btns.length) || $slots['middle-right'] || $slots['middle-left']"
                class="middle-opertion-wrapper"
            >
                <!-- 左 按钮组-->
                <div class="middle-left-wrapper">
                    <slot name="middle-left">
                        <LGButtonGroup
                            v-if="btns && btns.length > 0"
                            class="btns-wrapper"
                            :btns="btns"
                        />
                    </slot>
                </div>

                <!-- 右 -->
                <div v-if="$slots['middle-right']" class="middle-right-wrapper">
                    <slot name="middle-right" />
                </div>

                <div class="end-wrapper">
                    <!-- 展示列 -->
                    <ShowColumns
                        v-if="columnsConfigurable && !isTreeStructureColumns(showColumns)"
                        v-model="showColumns"
                        class="show-column-wrapper"
                    />

                    <!-- 排序 -->
                    <Sort
                        v-if="sortable"
                        class="sort-wrapper"
                        :columns="tableColumns"
                        @confirm="confirmSort"
                    />
                </div>
            </div>
        </div>

        <!-- 表格 -->
        <div class="core-wrapper">
            <slot name="core">
                <!-- tab页 -->
                <div v-if="!!tabs.length" :class="isRegtech ? '' : 'core-tab-wrapper'">
                    <ElTabs v-model="localActiveTab">
                        <template v-for="(tab, index) in tabs" :key="`${tab.value}-${index}`">
                            <ElTabPane :label="tab.label" :name="tab.value" />
                        </template>
                    </ElTabs>
                </div>

                <!-- 表格 -->
                <div class="core-table-wrapper">
                    <LGTable v-loading="tableLoading" :config="localTableConfig" />
                </div>
            </slot>
        </div>
    </div>
</template>

<script lang="tsx">
export default {
    name: 'GBaseModule',
    inheritAttrs: false
}
</script>

<script lang="tsx" setup>
import { ref, computed, Ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import type { FormProps } from '../GForm'
import TableSearch from './component/TableSearch.vue'
import {
    GTable as LGTable,
    type TableColumnProps,
    type BaseTableDataItem,
    type TableConfig,
    type PaginationProps,
    type TableRowBtnConfig
} from '../GTable'
import { GButtonGroup as LGButtonGroup, type BtnProps } from '../GButtonGroup'
import { getBaseModuleMode } from '../_globalConstant/baseModuleMode'
import type { BaseModuleMode } from '../_globalConstant/baseModuleMode'
import useSearchBtnConfig from './hooks/useSearchBtnConfig'
import useMergeProps from './hooks/useMergeProps'
import { Bases } from '../setting'
import { getBaseModuleProps } from '../_globalConstant/baseModuleProps'
import { getBase } from '../_globalConstant/base'
import ShowColumns from '../GBaseModuleV2/component/ShowColumns.vue'
import Sort from '../GBaseModuleV2/component/Sort.vue'
import { RuleOption, OrderProps } from '../GBaseModuleV2/interface/sort'
import { isTreeStructureColumns } from '../GBaseModuleV2/hooks/useConfig'
import { BaseModuleColumnProps } from '../GBaseModuleV2/interface'

export interface Props {
    /**
     * 表格列
     */
    tableColumns?: TableColumnProps[]
    /**
     * 表格数据
     */
    tableData?: BaseTableDataItem[]
    /**
     * 搜索条件表单配置
     */
    searchFormProps?: FormProps
    /**
     * 分页数据
     */
    tablePagination?: PaginationProps
    /**
     * 按钮组
     */
    btns?: BtnProps[]
    /**
     * 搜索按钮是否独占一行
     */
    searchBtnHorizontal?: boolean
    /**
     * 是否支持设置显示列和冻结列
     */
    columnsConfigurable?: boolean
    /**
     * 是否支持排序
     */
    sortable?: boolean
    /**
     * 核心加载 table 数据的方法
     */
    loadTableMethods?: (page?: number) => void
    /**
     * 表格 loading flag
     */
    tableLoading?: boolean
    /**
     * 多用途 api 去除 label，包括
     *  - “查询条件”
     *  - “查询结果”
     */
    noSearchLabel?: boolean
    /**
     * 搜索按钮的鉴权 code
     */
    searchBtnAuthCode?: string
    /**
     * 更多查询展示方式
     * pullDown：下拉
     * popup：弹出
     */
    moreSearchMode?: 'pull-down' | 'popup'
    /**
     * 表格操作列
     */
    rowBtnConfig?: TableRowBtnConfig
    /**
     * tab 切换
     */
    tabs?: Array<{ label: string; value: string }>
    /**
     * 激活的 tab
     */
    activeTab?: string
    /**
     * 选中行的维护数组
     */
    selectedRows?: TableConfig<any>['selectedRows']
    /**
     * 布局模式，现支持两种
     */
    mode?: BaseModuleMode
}

const props = withDefaults(defineProps<Props>(), {
    searchBtnsConfig: null,
    tableColumns: () => [],
    tableData: () => [],
    tablePagination: null,
    btns: () => [],
    searchBtnHorizontal: false,
    tableLoading: false,
    noSearchLabel: false,
    searchBtnAuthCode: '',
    moreSearchMode: undefined,
    rowBtnConfig: null,
    tabs: () => [],
    activeTab: '',
    selectedRows: null,
    // columnsConfigurable: defaultColumnsConfigurable,
    columnsConfigurable: () => getBaseModuleProps().columnsConfigurable,
    sortable: false,
    mode: undefined
})

const emits = defineEmits(['getTableInstance', 'update:activeTab', 'update:selectedRows', 'sort'])
const tableSearchRef = ref<InstanceType<typeof TableSearch> | null>(null)

// 是否监管基座
const isRegtech = getBase() === Bases.REGTECH

/**
 * 期望运行的 baseModule 的模式
 */
const localMode = computed(() => props.mode || getBaseModuleMode())

// 激活的 tab 页
const localActiveTab = computed({
    get: () => {
        if (props.activeTab) return props.activeTab
        if (!!props.tabs.length && props.tabs?.[0].value) {
            emits('update:activeTab', props.tabs?.[0].value)
        }
        return ''
    },
    set: (val) => {
        emits('update:activeTab', val)
    }
})

// 搜索按钮的配置
const { searchBtnsConfig } = useSearchBtnConfig({
    props,
    emits,
    tableSearchRef
})

// 包装本地表格配置（中转站）
const { localTableConfig, showColumns, exportedColumns } = useMergeProps({ props, emits })

const confirmSort = (order: OrderProps, sortOptions: RuleOption[]) => {
    emits('sort', order, sortOptions)
}

// 抛出
defineExpose({
    tableConfig: localTableConfig,
    tableInstance: localTableConfig.instance,
    exportedColumns,
    tableSearchRef
} as {
    tableConfig: TableConfig
    tableInstance: TableConfig['instance']
    exportedColumns: Ref<BaseModuleColumnProps[]>
    tableSearchRef: Ref<any>
})
</script>

<style lang="scss">
@import './styles/classic-mode/index.scss';
@import './styles/tabular-mode/index.scss';
</style>
