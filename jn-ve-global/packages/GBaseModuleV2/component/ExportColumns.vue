<template>
    <el-popover
        ref="popoverRef"
        placement="bottom-start"
        trigger="click"
        :popper-options="options"
        popper-class="export-columns__popover"
    >
        <template #reference>
            <div class="export-column-icon-wrapper">
                <g-icon icon="jg-public-xiazai" custom-color style="" />
            </div>
        </template>
        <div class="set-columns-wrapper">
            <div class="header-wrapper">
                <div class="title-wrapper">
                    <div class="title">
                        导出列
                    </div>
                    <el-tooltip effect="dark" content="勾选需要导出的列" placement="top-start">
                        <el-icon class="tip-icon" color="#C1C1C1">
                            <QuestionFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-button
                    class="reset-btn-wrapper"
                    type="primary"
                    plain
                    :icon="Refresh"
                    @click="reset"
                >
                    重置
                </el-button>
                <!-- <div class="reset-btn-wrapper" @click="reset" /> -->
            </div>
            <el-input
                v-model.trim="keyword"
                class="search-wrapper"
                placeholder="搜索字段"
                clearable
                :suffix-icon="Search"
                @change="search"
            />
            <el-checkbox
                v-model="checkAll"
                class="check-all-wrapper"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
            >
                全选 {{ checkedColumns.length }}/{{ localColumns.length }}
            </el-checkbox>
            <el-checkbox-group
                ref="checkboxGroupRef"
                v-model="checkedColumns"
                class="column-checkbox-group-wrapper"
                @change="handleCheckedColumnsChange"
            >
                <el-checkbox
                    v-for="column in localColumns"
                    :key="column.prop"
                    :label="column.prop"
                    :value="column.prop"
                    :data-prop="column.prop"
                >
                    <!-- {{ column.label }} -->
                    <div class="column-checkbox-wrapper">
                        <div class="label">
                            {{ column.label }}
                        </div>
                        <div class="icons-wrapper">
                            <!-- <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="冻结列"
                                placement="top-start"
                            >
                                <div class="fix-column" @click.stop.prevent="fixColumn(column)">
                                    <g-icon v-if="column.fixed" icon="affix-filled" />
                                    <g-icon v-else icon="affix" />
                                </div>
                            </el-tooltip> -->
                            <!-- <el-tooltip
                                effect="dark"
                                content="拖动改变字段顺序"
                                placement="top-start"
                            >
                                <div v-show="showAll" class="last-icon">
                                    <g-icon icon="drag" custom-color />
                                </div>
                            </el-tooltip> -->
                        </div>
                    </div>
                </el-checkbox>
            </el-checkbox-group>
            <div class="confirm-btn-wrapper">
                <el-button type="primary" @click="confirm">
                    确认
                </el-button>
            </div>
        </div>
    </el-popover>
</template>

<script lang="ts" setup>
import { nextTick, watch, ref, computed, reactive, toRefs, inject, onMounted } from 'vue'
// import { type TableColumnProps } from '../../GTable'
// import { tableColumnsKey, savedConfigKey } from '../constant'
import { Search, QuestionFilled, Refresh } from '@element-plus/icons-vue'
import type { BaseModuleColumnProps } from '../interface'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
// import Sortable from 'sortablejs'

const COMPONENT_NAME = 'ExportColumns'
defineOptions({
    name: COMPONENT_NAME
})

const options = {
    modifiers: [
        {
            name: 'preventOverflow',
            options: {
                rootBoundary: document.querySelector('html')
            }
        },
        {
            name: 'flip',
            options: {
                rootBoundary: document.querySelector('html')
            }
        }
    ]
}

const popoverRef = ref<any>()

const columns = defineModel<BaseModuleColumnProps[]>({ default: [] })

const emits = defineEmits<{
    'confirm': [val?: BaseModuleColumnProps[]]
}>()

// const visible = ref<boolean>(true)

// const columns = inject(tableColumnsKey)
// console.log('tableColumnsKey', columns.value)
// console.log('tableColumns', columns)
let defaultColumns = []

let allColumns = []
const checkedColumns = ref<string[]>()
const localColumns = ref<BaseModuleColumnProps[]>()

const keyword = ref<string>('')

const checkAll = ref(true)
const isIndeterminate = ref(false)
const showAll = ref(true)

const checkboxGroupRef = ref()

// 显示列中不参与配置的表格列
// const isExcludedColumn = (columnProps: BaseModuleColumnProps) => {
//     const { prop, label, type } = columnProps
//     return (prop === 'opertion' && label === '操作') || type === 'expand'
// }

const init = (columns: BaseModuleColumnProps[]) => {
    const copyColumns = cloneDeep(columns)
    allColumns = cloneDeep(copyColumns)
    checkedColumns.value = allColumns?.map((item) => item.prop)
    // checkedColumns.value = allColumns?.map((item) => item.prop)?.filter((item) => !item.hide)
    localColumns.value = cloneDeep(allColumns ?? [])
    keyword.value = ''
    checkAll.value = true
    isIndeterminate.value = false
    showAll.value = true
    // console.log('init', localColumns)
}

init(columns.value)

const handleCheckAllChange = (val: boolean) => {
    // console.log('yyy', val)
    checkedColumns.value = val ? allColumns?.map((item) => item.prop) : []
    isIndeterminate.value = false
}
const handleCheckedColumnsChange = (value: string[]) => {
    // console.log('xxx', value)
    const checkedCount = value.length
    checkAll.value = checkedCount === allColumns.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allColumns.length
}

// const sortableOption = {
//     animation: 150,
//     disabled: false,
//     dataIdAttr: 'data-prop',
//     // 拖拽时预览图样式
//     // ghostClass: 'drag-background-class'
//     onEnd: (event) => {
//         // columns.value = sortableInstance
//         //     .toArray()
//         //     .map((prop) => columns.value.find((item) => item.prop === prop))
//         const operationColumnProp = columns.value.find(
//             (item) => item.prop === 'opertion' && item.label === '操作'
//         )?.prop
//         const hasExpandColumn = columns.value.some(item => item?.type === 'expand')
//         const order = operationColumnProp
//             ? [...sortableInstance.toArray(), operationColumnProp]
//             : sortableInstance.toArray()
//         // columns.value = sortByOrder(columns.value, order)
//         const orderedColumns = order.map((prop) => columns.value.find((item) => item.prop === prop))
//         // columns.value = order.map((prop) => columns.value.find((item) => item.prop === prop))
//         columns.value = hasExpandColumn ? [columns.value.find(item => item?.type === 'expand'), ...orderedColumns] : orderedColumns
//         // sortColumns(sortableInstance.toArray())
//         saveColumns()
//         console.log('onEnd', event, columns)
//         // updateColumns()
//     }
// }

const search = (val) => {
    if (val) {
        localColumns.value = columns.value.filter((item) => item?.label?.includes(val))
    } else {
        localColumns.value = columns.value
    }
    showAll.value = localColumns.value.length === allColumns.length
    // sortableInstance.option('disabled', !showAll.value)
}

const reset = () => {
    // console.log('reset', defaultColumns)
    // const defaultColumnsCopy = cloneDeep(defaultColumns)
    init(defaultColumns)
    columns.value = cloneDeep(defaultColumns)
    // visible.value = false
    // nextTick(() => {
    //     visible.value = true
    //     nextTick(() => {
    //         sortableOption.disabled = false
    //         sortableInstance = new Sortable(checkboxGroupRef.value.$el, sortableOption)
    //     })
    // })

    // console.log('reset11', columns.value)
}

const confirm = () => {
    saveColumns()
}

const saveColumns = () => {
    if (checkedColumns.value?.length === 0) {
        ElMessage.warning('请选择需要导出的列')
        return
    }
    popoverRef.value?.hide()
    nextTick(() => {
        emits(
            'confirm',
            columns.value?.map(({ prop, label, hide }) => ({
                prop,
                label,
                hide
            })) ?? []
        )
    })
}

// let sortableInstance
onMounted(() => {
    defaultColumns = cloneDeep(columns.value)
    // console.log('defaultColumns', defaultColumns)
    // sortableInstance = new Sortable(checkboxGroupRef.value.$el, sortableOption)
})

watch(
    () => checkedColumns.value,
    (val) => {
        // console.log('checkedColumns', val, columns)
        if (val?.length === 0) {
            columns.value.forEach((item) => {
                item.hide = true
            })
            return
        }
        columns.value.forEach((item) => {
            item.hide = !val?.includes(item.prop)
        })
        // updateColumns()
    },
    {
        deep: true
        // immediate: true
    }
)

// watch(
//     () => checkedColumns.value,
//     (val) => {
//         saveColumns()
//     }
// )
</script>

<style lang="scss">
.export-columns__popover {
    width: 400px !important;
}

.export-column-icon-wrapper {
    cursor: pointer;
    margin-right: 18px;
    //margin-left: 18px;

    .custom-svg-icon {
        color: #989898;
        &:hover {
            color: #409eff;
        }
    }
}

.set-columns-wrapper {
    padding: 5px 10px 0 10px;

    .header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .reset-btn-wrapper {
            //height: 32px;
            //width: 78px;
            //background-image: url('../../assets/images/base-module-reset.png');
            //background-size: 100% 100%;
        }

        .title-wrapper {
            display: flex;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 600;

            .title {
                margin-right: 5px;
            }
            .tip-icon {
                margin-top: 4px;
            }
        }
    }

    .search-wrapper {
        margin-bottom: 16px;
    }

    .check-all-wrapper {
        margin: 0 0 6px 12px;
    }
}

.column-checkbox-group-wrapper {
    display: flex;
    flex-direction: column;
    max-height: 350px;
    overflow-y: scroll;
    scroll-behavior: smooth;

    .el-checkbox {
        //display: flex;
        padding: 10px 12px;
        margin-right: 0 !important;
        border-radius: 4px;
        border: 1px solid #e5e6e8;
        margin-bottom: 8px;

        .el-checkbox__input.is-checked + .el-checkbox__label {
            color: var(--el-checkbox-text-color);
        }

        .el-checkbox__label {
            flex: 1;
        }

        &:hover {
            border-color: var(--el-color-primary);
        }
    }

    .column-checkbox-wrapper {
        //padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        width: 100%;

        .icons-wrapper {
            display: flex;
        }

        .fix-column {
            padding: 12px 4px;
            margin-right: 4px;
        }

        .last-icon {
            padding: 12px 0;
            :deep(.custom-svg-icon) {
                color: #989898;
                &:hover {
                    color: #409eff;
                }
            }
        }

        .label {
            padding: 12px 0;
        }
    }
}

.confirm-btn-wrapper {
    text-align: center;
    margin: 5px 0;
}
.drag-background-class {
    //background-color:  #C8EBFB!important;
}
</style>
