<template>
    <div
        :class="[
            'base-module-root',
            'classic-mode',
            $attrs.class,
            {
                'no-padding': false,
                'tabs-layout': !!tabs.length
            }
        ]"
    >
        <!-- 搜索 -->
        <!-- <TableSearch
            v-if="searchFormProps"
            ref="tableSearchRef"
            :search-form-props="searchFormProps"
            :search-btns-config="searchBtnsConfig"
            :no-search-label="noSearchLabel"
            :search-btn-horizontal="searchBtnHorizontal"
            :more-search-mode="moreSearchMode"
        /> -->

        <!-- 中间操作区域 -->
        <div class="middle-area">
            <div class="middle-opertion-wrapper">
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

                <!-- 右 按钮组-->
                <!-- <div v-if="$slots['middle-right']" class="middle-right-wrapper">
                    <slot name="middle-right" />
                </div> -->
                <div class="middle-right-wrapper">
                    <g-advance-input
                        v-model.trim="keyword"
                        class="search-input-wrapper"
                        placeholder="请输入关键字"
                        clearable
                        suffix="jg-public-dingbu-sousuo"
                        @change="loadTable"
                    />
                    <SearchCondition
                        v-if="props?.searchFormProps"
                        :form-config="props.searchFormProps"
                        @confirm="confirmCondition"
                    />
                    <ShowColumns v-if="columnsConfigurable" v-model="showColumns" />
                    <Sort v-if="sortable" :columns="props.tableColumns" @confirm="confirmSort" />
                    <el-icon class="icon-wrapper" @click="loadTable">
                        <RefreshRight />
                    </el-icon>
                </div>
            </div>
        </div>

        <!-- 表格 -->
        <div class="core-wrapper">
            <slot name="core">
                <!-- tab页 -->
                <div v-if="!!tabs.length" class="core-tab-wrapper">
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

    <!-- 导入相关 -->
    <GUpload
        ref="importRef"
        class="base-module-import-wrapper"
        list-type="text"
        :data="actionParams"
        :action="action"
    />
</template>

<script lang="tsx">
export default {
    name: 'GBaseModuleV2',
    inheritAttrs: false
}
</script>

<script lang="tsx" setup>
import { ref, computed, Ref, provide, toRef, watch, onBeforeMount } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import TableSearch from './component/TableSearch.vue'
import { GTable as LGTable, type TableConfig } from '../GTable'
import { GButtonGroup as LGButtonGroup } from '../GButtonGroup'
import { GUpload } from '../GUpload'
import useSearchBtnConfig from './hooks/useSearchBtnConfig'
import useMergeProps from './hooks/useMergeProps'
import type {
    BaseModuleProps,
    QueryProps,
    OrderProps,
    QueryParams,
    BaseModuleColumnProps
} from './interface'
import { tableColumnsKey } from './constant'
import ShowColumns from './component/ShowColumns.vue'
import Sort from './component/Sort.vue'
import SearchCondition from './component/SearchCondition.vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'

onBeforeMount(() => {
    loadTable()
})

const props = withDefaults(defineProps<BaseModuleProps>(), {
    searchBtnsConfig: null,
    // filterable: true,
    sortable: true,
    columnsConfigurable: true,
    tableColumns: () => [],
    tableData: () => [],
    tablePagination: null,
    btns: () => [],
    searchBtnHorizontal: false,
    // tableLoading: false,
    noSearchLabel: false,
    searchBtnAuthCode: '',
    moreSearchMode: undefined,
    rowBtnConfig: null,
    tabs: () => [],
    activeTab: '',
    selectedRows: null,
    operationGroupProps: null,
    action: '',
    actionParams: null
})

const emits = defineEmits([
    'getTableInstance',
    'update:activeTab',
    'update:selectedRows',
    'update:tableData'
])
const tableSearchRef = ref<InstanceType<typeof TableSearch> | null>(null)

const tableLoading = ref<boolean>(false)

const showColumns = ref<BaseModuleColumnProps[]>(props.tableColumns)

const sortable = computed<boolean>(
    () => props?.sortable && props?.tableColumns?.some((item) => !item.unsortable)
)

const keyword = ref<string>('')

// provide(tableColumnsKey, toRef(props, 'tableColumns'))

/**
 * 期望运行的 baseModule 的模式
 */
// const localMode = computed(() => props.mode || getBaseModuleMode())

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

// 导入相关
const importRef = ref()

// 内置右侧按钮配置
// const rightBtns = compp

// 包装本地表格配置（中转站）
const { localTableConfig } = useMergeProps({ props, emits, showColumns, loadTable })

// const resetColumns = () => {
//     console.log('reset', props.tableColumns)
//     showColumns.value = props.tableColumns
// }

// watch(
//     () => showColumns,
//     (val) => {
//         console.log('showColumns', val)

//     },
//     {
//         deep: true
//         // immediate: true
//     }
// )
let params: QueryParams = {
    order: {},
    isOr: false,
    queryList: []
}
const confirmCondition = (queryList: QueryProps[], isOr: boolean) => {
    params.isOr = isOr
    params.queryList = queryList
    // loadTable({ queryList, isOr })
    loadTable()
}
const confirmSort = (order: OrderProps) => {
    params.order = order
    // loadTable({ order })
    loadTable()
}

// function loadTable(params?: QueryParams) {
function loadTable(cb?: (data?: Record<string, any>[]) => void) {
    if (props?.loadTableService) {
        tableLoading.value = true
    }
    const { clientId, funcId, pageId, tableId } = props?.extraInfo ?? {}
    const { order = {}, isOr = false, queryList = [] } = params ?? {}
    const req = {
        extInfo: { clientId, funcId, pageId, tableId },
        order,
        isOr,
        paging: {
            current: localTableConfig.pagination.currentPage ?? 1,
            size: localTableConfig.pagination.pageSize ?? 10
        },
        queryList: queryList?.filter((item) => !['', null, undefined].includes(item.value)),
        allQuery: keyword.value
    }

    console.log('req', req)
    props?.loadTableService &&
        props
            .loadTableService(req, props?.replace)
            .then((res) => {
                tableLoading.value = false
                if (res?.code === '000000') {
                    localTableConfig.data = res?.data?.records ?? []
                    localTableConfig.pagination.total = res?.data?.total ?? 0

                    cb?.(res?.data?.records ?? [])
                }
            })
            .catch(() => {
                tableLoading.value = false
            })
}

// 抛出
defineExpose({
    tableConfig: localTableConfig,
    tableInstance: localTableConfig.instance,
    tableSearchRef,
    loadTable
} as {
    tableConfig: TableConfig
    tableInstance: TableConfig['instance']
    tableSearchRef: Ref<any>
    loadTable: Function
})
</script>

<style lang="scss">
@import './styles/classic-mode/index.scss';
@import './styles/tabular-mode/index.scss';
</style>
