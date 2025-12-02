<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-03 10:10:29
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-12-02 09:49:51
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\component\ShowColumns.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-popover
        ref="popoverRef"
        placement="bottom-start"
        trigger="click"
        :popper-options="options"
        popper-class="show-columns__popover"
        @show="show"
    >
        <template #reference>
            <!-- <el-button type="primary" text>
                显示列
            </el-button> -->
            <div :class="['show-column-icon-wrapper', $attrs.class ?? '']">
                <g-icon icon="show-column" custom-color />
            </div>
        </template>
        <div class="set-columns-wrapper">
            <div class="header-wrapper">
                <div class="title-wrapper">
                    <div class="title">
                        显示列
                    </div>
                    <el-tooltip effect="dark" content="设置显示列和冻结列" placement="top-start">
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
                v-if="visible"
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
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="冻结列"
                                placement="top-start"
                            >
                                <div class="fix-column" @click.stop.prevent="fixColumn(column)">
                                    <g-icon v-if="column.fixed" icon="affix-filled" />
                                    <g-icon v-else icon="affix" />
                                </div>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                content="拖动改变字段顺序"
                                placement="top-start"
                                :popper-options="options"
                            >
                                <div v-show="showAll" class="last-icon">
                                    <g-icon icon="drag" custom-color />
                                </div>
                            </el-tooltip>
                        </div>
                    </div>
                </el-checkbox>
            </el-checkbox-group>
            <!-- <div class="confirm-btn-wrapper">
                <el-button type="primary" @click="confirm">
                    确认
                </el-button>
            </div> -->
        </div>
    </el-popover>
</template>

<script lang="ts" setup>
import { nextTick, watch, ref, computed, reactive, toRefs, inject, onMounted } from 'vue'
import { getPopoverOptions } from '../../_globalConstant/popoverOptions'
// import { type TableColumnProps } from '../../GTable'
import { tableColumnsKey, savedConfigKey, tableConfigKey, excludedColumnTypes } from '../constant'
import { isExcludedColumn } from '../hooks/useConfig'
import { Search, QuestionFilled, Refresh } from '@element-plus/icons-vue'
import type { BaseModuleColumnProps } from '../interface'
import { cloneDeep } from 'lodash'
import Sortable from 'sortablejs'
import useMaxheight from '../hooks/useMaxheight'
// import { global } from '@jsjn/utils'

const COMPONENT_NAME = 'ShowColumns'
defineOptions({
    name: COMPONENT_NAME
})

// const props = withDefaults(
//     defineProps<{
//         modelValue: TableColumnProps[]
//     }>(),
//     {
//         modelValue: () => []
//     }
// )

// const emits = defineEmits<{
//     'reset': [val?: TableColumnProps[]]
// }>()

const popoverRef = ref()

const savedConfig = inject(savedConfigKey)

const tableConfig = inject(tableConfigKey)

const options = getPopoverOptions()

const columns = defineModel<BaseModuleColumnProps[]>({ default: [] })

const emits = defineEmits<{
    'columnChange': [val?: BaseModuleColumnProps[]]
}>()

const visible = ref<boolean>(true)

const { calculateAndSetMaxHeight } = useMaxheight({
    popoverRef,
    tableConfig,
    targeClassName: 'column-checkbox-group-wrapper'
})

const show = () => {
    calculateAndSetMaxHeight()
}

let isInnerUpdate = false
let isOuterUpdate = false
let timer

const finishInnerUpdate = () => {
    isInnerUpdate = true
    timer = setTimeout(() => {
        isInnerUpdate = false
        timer = null
    }, 0)
}

const finishOuterUpdate = () => {
    isOuterUpdate = true
    timer = setTimeout(() => {
        isOuterUpdate = false
        timer = null
    }, 0)
}

// const columns = inject(tableColumnsKey)
// console.log('tableColumnsKey', columns.value)
// console.log('tableColumns', columns)
// const defaultColumns = cloneDeep(columns.value).map(({ prop, hide, fixed }) => ({
//     prop,
//     hide: hide ?? false,
//     fixed: hide ?? false
// }))
// const operationColumn = columns.value.find(
//     (item) => item.prop === 'opertion' && item.label === '操作'
// )
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
//     return (prop === 'opertion' && label === '操作') || excludedColumnTypes.includes(type)
// }

const init = (columns: BaseModuleColumnProps[]) => {
    // console.log('init', columns)
    const copyColumns = cloneDeep(columns)
    allColumns = cloneDeep(copyColumns.filter((item) => !isExcludedColumn(item)) ?? [])
    checkedColumns.value = allColumns?.map((item) => item.prop)
    // checkedColumns.value = allColumns?.map((item) => item.prop)?.filter((item) => !item.hide)
    localColumns.value = cloneDeep(allColumns ?? [])
    keyword.value = ''
    checkAll.value = true
    isIndeterminate.value = false
    showAll.value = true
}

// if (savedConfig.value?.columns?.length > 0) {
//     const savedColumns = savedConfig.value?.columns
//     sortColumns(savedColumns?.map((item) => item.prop))
//     columns.value = columns.value.map((item) => {
//         const { hide = false, fixed = false } = savedColumns.find((ele) => ele.prop === item.prop)
//         return {
//             ...item,
//             hide,
//             fixed
//         }
//     })
// }

// init(columns.value)

const handleCheckAllChange = (val: boolean) => {
    // console.log('handleCheckAllChange', val)
    checkedColumns.value = val ? allColumns?.map((item) => item.prop) : []
    isIndeterminate.value = false
}
const handleCheckedColumnsChange = (value: string[]) => {
    // console.log('handleCheckedColumnsChange', value)
    const checkedCount = value.length
    checkAll.value = checkedCount === allColumns.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allColumns.length

    // console.log('checkedColumns', val, columns)
    // if (value?.length === 0) {
    //     columns.value.forEach((item) => {
    //         item.hide = true
    //     })
    //     return
    // }
    // columns.value.forEach((item) => {
    //     if (!(item.prop === 'opertion' && item.label === '操作')) {
    //         item.hide = !value?.includes(item.prop)
    //     }
    // })
    // columns.value.forEach((item) => {
    //     item.hide = !value?.includes(item.prop)
    // })
    // updateColumns()
}

const fixColumn = (column: BaseModuleColumnProps) => {
    column.fixed = !column.fixed
    // columns.value.find((item) => item.prop === column.prop && item?.type !== 'expand').fixed = column.fixed
    columns.value.find(
        (item) => item.prop === column.prop && !excludedColumnTypes.includes(item?.type)
    ).fixed = column.fixed
    finishInnerUpdate()
    saveColumns()

    // updateColumns()
    // const targetProp =
    // const lastFixedColumnIndex = allColumns.filter(item => item)
}

// const updateColumns = () => {
//     console.log('update', columns.value, defaultColumns)
//     columns.value = operationColumn ? [...allColumns, operationColumn] : allColumns
//     console.log('update1', columns.value)

//     // emits('update:modelValue', operationColumn ? [...allColumns, operationColumn] : allColumns)
// }

// const swapColumn = (sourceProp: string, targetProp: string) => {
//     const index1 = allColumns.findIndex((item) => item.prop === sourceProp)
//     const index2 = allColumns.findIndex((item) => item.prop === targetProp)
//     const temp = allColumns[index1]
//     allColumns[index1] = allColumns[index2]
//     allColumns[index2] = temp
// }

const sortableOption = {
    animation: 150,
    disabled: false,
    dataIdAttr: 'data-prop',
    // 拖拽时预览图样式
    // ghostClass: 'drag-background-class'
    onEnd: (event) => {
        // columns.value = sortableInstance
        //     .toArray()
        //     .map((prop) => columns.value.find((item) => item.prop === prop))
        const operationColumnProp = columns.value.find(
            (item) => item.prop === 'opertion' && item.label === '操作'
        )?.prop
        // const hasExpandColumn = columns.value.some(item => item?.type === 'expand')
        const order = operationColumnProp
            ? [...sortableInstance.toArray(), operationColumnProp]
            : sortableInstance.toArray()
        // columns.value = sortByOrder(columns.value, order)
        const orderedColumns = order.map((prop) => columns.value.find((item) => item.prop === prop))
        // columns.value = order.map((prop) => columns.value.find((item) => item.prop === prop))
        // columns.value = hasExpandColumn ? [columns.value.find(item => item?.type === 'expand'), ...orderedColumns] : orderedColumns
        columns.value = [
            ...(columns.value?.filter((item) => excludedColumnTypes.includes(item?.type)) ?? []),
            ...orderedColumns
        ]
        // sortColumns(sortableInstance.toArray())
        finishInnerUpdate()
        saveColumns()
        // console.log('onEnd', event, columns)
        // updateColumns()
    }
}

// function sortColumns(props: string[]) {
//     const operationColumnProp = columns.value.find(
//         (item) => item.prop === 'opertion' && item.label === '操作'
//     )?.prop
//     const order = operationColumnProp ? [...props, operationColumnProp] : props
//     // columns.value = sortByOrder(columns.value, order)
//     columns.value = order.map((prop) => columns.value.find((item) => item.prop === prop))
// }

// const sortByOrder = (arr, order) => {
//     // 使用 reduce 复制数组
//     return order.reduce((sortedArr, prop) => {
//         let item = arr.find((item) => item.prop === prop)
//         if (item) {
//             sortedArr.push(item)
//         }
//         return sortedArr
//     }, [])
// }

const search = (val) => {
    if (val) {
        localColumns.value = columns.value.filter((item) => item?.label?.includes(val))
    } else {
        localColumns.value = columns.value.filter((item) => !isExcludedColumn(item))
    }
    showAll.value = localColumns.value.length === allColumns.length
    sortableInstance.option('disabled', !showAll.value)
}

const reset = () => {
    // console.log('reset', defaultColumns)
    // const defaultColumnsCopy = cloneDeep(defaultColumns)
    init(defaultColumns)
    columns.value = cloneDeep(defaultColumns)
    finishInnerUpdate()
    visible.value = false
    nextTick(() => {
        visible.value = true
        nextTick(() => {
            sortableOption.disabled = false
            sortableInstance = new Sortable(checkboxGroupRef.value.$el, sortableOption)
        })
    })
    // emits('reset')

    // columns.value.forEach(item => {
    //     const target = defaultColumns.find(ele => ele.prop === item.prop)
    //     Object.hasOwn(item, 'hide') && (item.hide = target.hide)
    //     Object.hasOwn(item, 'fixed') && (item.fixed = target.fixed)
    // })
    console.log('reset11', columns.value)
}

const confirm = () => {}

const saveColumns = () => {
    nextTick(() => {
        emits(
            'columnChange',
            columns.value
                ?.filter((item) => !isExcludedColumn(item))
                ?.map(({ prop, label, fixed, hide }) => ({
                    prop,
                    label,
                    fixed,
                    hide
                })) ?? []
        )
    })
}
// const getHandledColumns = () => {
//     // return
// }

let sortableInstance
onMounted(() => {
    // defaultColumns = cloneDeep(columns.value)
    // console.log('defaultColumns', defaultColumns)
    sortableInstance = new Sortable(checkboxGroupRef.value.$el, sortableOption)
})

watch(
    () => checkedColumns.value,
    (val) => {
        // console.log('checkedColumns', val, columns)
        finishInnerUpdate()
        if (val?.length === 0) {
            columns.value.forEach((item) => {
                item.hide = true
            })
            return
        }
        columns.value.forEach((item) => {
            if (!isExcludedColumn(item)) {
                item.hide = !val?.includes(item.prop)
            } else {
                item.hide = false
            }
        })
        // updateColumns()
    },
    {
        deep: true
        // immediate: true
    }
)

watch(
    () => columns.value,
    (val) => {
        // console.log('columns', val)
        if (isInnerUpdate) return
        defaultColumns = cloneDeep(val)
        init(val)
        finishOuterUpdate()
    },
    {
        deep: true,
        immediate: true
    }
)

// selectRuleModalVisible

watch(
    () => checkedColumns.value,
    (val) => {
        saveColumns()
    }
)
</script>

<style lang="scss">
.show-columns__popover {
    width: 400px !important;
}

.show-column-icon-wrapper {
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
