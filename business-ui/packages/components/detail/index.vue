<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-06 15:32:03
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-24 14:21:46
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div class="bi-detail">
        <template v-if="isSimulator">
            <div v-if="display === 'form'" class="form-display-wrapper">
                <g-collapse v-model="activeNames">
                    <g-collapse-item
                        :title="`${serialName}1`"
                        :name="`${serialName}1`"
                        class="form-item-wrapper"
                    >
                        <el-button-group v-if="showOperation" class="operation-wrapper">
                            <el-button
                                v-for="(btnProps, index) in btns"
                                :key="index"
                                class="operate-btn"
                                text
                                link
                                disabled
                                :type="btnProps.type"
                            >
                                {{ btnProps.label }}
                            </el-button>
                        </el-button-group>
                        <bi-form :config="formConfig">
                            <slot />
                        </bi-form>
                    </g-collapse-item>
                </g-collapse>
            </div>
            <div v-else class="table-field-is-simulator">
                <div ref="scrollWrapRef" class="table-wrapper-is-simulator">
                    <!-- <bi-form label-position="top" :config="formConfig">
                    </bi-form> -->
                    <div ref="tableRef" class="form-items-wrapper">
                        <el-form-item
                            v-if="showSerial"
                            label="序号"
                            class="serial-column"
                            style="left: 0"
                        >
                            1
                        </el-form-item>
                        <slot />
                        <el-form-item
                            v-if="showOperation"
                            label="操作"
                            class="operation-column"
                            style="right: 0"
                        >
                            <el-button-group class="operation-wrapper">
                                <el-button
                                    v-for="(btnProps, index) in btns"
                                    :key="index"
                                    class="operate-btn"
                                    text
                                    link
                                    type="default"
                                    disabled
                                >
                                    {{ btnProps.label }}
                                </el-button>
                            </el-button-group>
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="foot-wrapper">
                <el-button v-if="addBtnVisible" :icon="Plus" class="add-btn-wrapper" type="primary">
                    {{ addButtonLabel }}
                </el-button>
            </div>
        </template>
        <template v-else>
            <div v-if="display === 'form'" class="form-display-wrapper">
                <g-collapse v-model="activeNames">
                    <!-- <g-collapse-item
                        v-for="(form, formIndex) in formConfigs"
                        :key="form?.id ?? formIndex"
                        class="form-item-wrapper"
                        :title="`${form?.name}${formIndex + 1}`"
                        :name="`${form?.name}${formIndex + 1}`"
                    > -->
                    <g-collapse-item
                        v-for="form in currentRecords"
                        :key="form?.id ?? form?.serialNo"
                        class="form-item-wrapper"
                        :title="`${form?.name}${form?.serialNo}`"
                        :name="`${form?.name}${form?.serialNo}`"
                    >
                        <el-button-group v-if="showOperation" class="operation-wrapper">
                            <el-button
                                v-for="(btnProps, index) in btns"
                                :key="index"
                                class="operate-btn"
                                text
                                link
                                :type="btnProps.type"
                                :loading="btnProps.loading"
                                :disabled="btnProps.disabled as boolean"
                                @click.stop="
                                    () => {
                                        btnProps.onClick({
                                            forms: formConfigs,
                                            form,
                                            index: form.serialNo - 1
                                        })
                                    }
                                "
                            >
                                {{ btnProps.label }}
                            </el-button>
                        </el-button-group>
                        <bi-form :config="form">
                            <slot class="eeee" />
                        </bi-form>
                    </g-collapse-item>
                </g-collapse>
            </div>
            <div v-else ref="scrollWrapRef" class="table-field">
                <div ref="tableRef" :class="getTableClass(['table-display-wrapper'])">
                    <!-- <div v-if="showTableHeader" class="table-header"> -->
                    <div class="table-header">
                        <div
                            v-for="(column, labelIndex) in columns"
                            :key="labelIndex"
                            :class="
                                getTableCellClass(
                                    column.type,
                                    ['table-head-item'],
                                    labelIndex,
                                    column.prop
                                )
                            "
                            :style="column.style"
                        >
                            <span v-if="column?.required" style="color: #f56c6c"> *</span>
                            {{ column.label }}
                        </div>
                    </div>
                    <!-- <bi-form
                        v-for="(form, formIndex) in formConfigs"
                        :key="form?.id ?? formIndex"
                        class="table-row-form"
                        :config="form"
                    > -->
                    <bi-form
                        v-for="(form, index) in currentRecords"
                        :key="form?.id ?? form?.serialNo"
                        :class="getTableRowClass(index, ['table-row-form'])"
                        :config="form"
                    >
                        <div
                            v-if="showSerial"
                            :class="getTableCellClass('serial', ['serial-column'], index)"
                            style="left: 0"
                        >
                            {{ form?.serialNo }}
                        </div>

                        <!-- <slot /> -->
                        <template v-for="(slot, slotIndex) in slots" :key="slotIndex">
                            <div
                                :class="
                                    getTableCellClass(
                                        'form',
                                        ['form-item-column'],
                                        index,
                                        getFormItemProp(slot)
                                    )
                                "
                                :style="getTableCellStyle(getFormItemProp(slot), columns)"
                            >
                                <component :is="slot" />
                            </div>
                        </template>

                        <div
                            v-if="showOperation"
                            :class="
                                getTableCellClass(
                                    'operation',
                                    ['operation-column'],
                                    index,
                                    'operation'
                                )
                            "
                            style="right: 0"
                        >
                            <el-button-group class="operation-wrapper">
                                <el-button
                                    v-for="(btnProps, index) in btns"
                                    :key="index"
                                    class="operate-btn"
                                    text
                                    link
                                    :type="btnProps.type"
                                    :loading="btnProps.loading"
                                    :disabled="btnProps.disabled as boolean"
                                    @click.stop="
                                        () => {
                                            btnProps.onClick({
                                                forms: formConfigs,
                                                form,
                                                index: form.serialNo - 1
                                            })
                                        }
                                    "
                                >
                                    {{ btnProps.label }}
                                </el-button>
                            </el-button-group>
                        </div>
                    </bi-form>
                </div>
            </div>
            <div class="foot-wrapper">
                <el-button
                    v-if="addBtnVisible"
                    :icon="Plus"
                    class="add-btn-wrapper"
                    type="primary"
                    @click="add"
                >
                    {{ addButtonLabel }}
                </el-button>
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    class="foot-pagination-wrapper"
                    v-bind="paginationProps"
                    @change="change"
                    @prev-click="prevClick"
                    @next-click="nextClick"
                />
            </div>
        </template>
        <!-- <slot /> -->
        <!-- <slot name="head" />

        <template v-for="item in slots.default()" :key="item">
            <el-form-item>
                <component :is="item" />
            </el-form-item>
        </template> -->

        <!-- <div class="add-btn-wrapper">
            <el-button :icon="Plus" @click="add">
                {{ addButtonLabel }}
            </el-button>
        </div> -->
    </div>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs, useSlots, onMounted, nextTick } from 'vue'
import { ElButton, ElButtonGroup, ElMessage, ElFormItem } from 'element-plus'
import type { DetailProps, OperationParams } from './type'
import { GCollapse, GCollapseItem } from 'jn-ve-global'
// import { ElForm } from 'element-plus'
import { BiForm, FormProps as BiFormProps } from '../form'
import { Plus } from '@element-plus/icons-vue'
import { __is_simulator_env__ } from '../../constants'
import { useFormProps, useClearModel } from '../../hooks'
import {
    useBtns,
    useDefaultProps,
    // useTableHeader,
    useTableColumns,
    // useTableHeaderStyle,
    // useTableCellStyle,
    // useTableCellClassNames,
    useSimulatorTableStyle,
    useTableScrollClass,
    usePagination
} from './hooks'
import { assignOwnProp } from '@jsjn/micro-core-utils/utils'
import { cloneDeep } from 'lodash'
import { v4 as uuidV4 } from 'uuid'

const COMPONENT_NAME = 'BiDetail'
defineOptions({
    name: COMPONENT_NAME
})

// console.log('COMPONENT_NAME', COMPONENT_NAME)

// let __is_simulator_env__ = false

const props = withDefaults(defineProps<DetailProps>(), useDefaultProps())

// console.log('BiDetail', props)

//TODO:添加操作emits
const emits = defineEmits<{
    'update:modelValue': [val: Array<Record<string, any>>]
    add: [param: Omit<OperationParams, 'emits' | 'index'>]
    delete: [param: Omit<OperationParams, 'emits' | 'index'>]
    copy: [param: Omit<OperationParams, 'emits' | 'index'>]
    upMove: [param: Omit<OperationParams, 'emits' | 'index'>]
    downMove: [param: Omit<OperationParams, 'emits' | 'index'>]
}>()

// const detailRef = ref()

const isSimulator = computed<boolean>(() => __is_simulator_env__)
// const isSimulator = ref<boolean>(__is_simulator_env__)

const slots = computed(() => {
    const defaultSlots = useSlots()?.default()
    const biDetailChildren = props.slotFromParent ? defaultSlots?.[0]?.children : defaultSlots
    return (biDetailChildren as any)?.filter((item) => !item.children)
})

const showSerial = computed<boolean>(() => props?.showSerial && slots.value?.length > 0)
// console.log('slots', useSlots().default())
// console.log('active-slots', slots.value)

// const activeNames = ref<string[]>(props.expand ? [`${props.serialName}1`] : [])
const activeNames = computed<string[]>(() => {
    let names: string[] = []

    if (__is_simulator_env__) {
        names = props.expand ? [`${props.serialName}1`] : []
    } else {
        const allNames = formConfigs.value?.map((item, index) => props.serialName + (index + 1))
        names = props.expand ? allNames : activeNames.value
    }
    return names
})

// 新增按钮可见
const addBtnVisible = computed<boolean>(() => !props.disabled && !props.hideAddBtn)

// 获取表头内联样式
// const getTableHeaderStyle = (label: string) => {

// }

const formConfig = computed<BiFormProps>(() => {
    const { labelPosition, labelWidth } = props
    return {
        labelPosition,
        labelWidth
    } as BiFormProps
})

const baseForm = useFormProps(formConfig.value, slots.value, {
    name: `${props.serialName}`
})

const formConfigs = ref(
    props.modelValue?.length > 0
        ? props.modelValue?.map((item) => {
            const form = cloneDeep(baseForm)
            form.id = uuidV4()
            assignOwnProp(form.model, item)
            return form
        })
        : [cloneDeep(baseForm)]
)
// [
//     // useFormProps(formConfig.value, slots.default(), {
//     //     name: `${props.serialName}`
//     // })
//     cloneDeep(baseForm)
// ]

const {
    currentPage,
    pageSize,
    paginationProps,
    currentRecords,
    getCurrentRecords,
    getCurrentPage,
    change,
    prevClick,
    nextClick
} = usePagination(props, formConfigs.value)

// console.log('slots', slots.default())

// 操作按钮
const btns = useBtns(props, emits, getCurrentPage)
const showOperation = computed<boolean>(
    () => props.showOperation && btns.value?.length > 0 && slots.value?.length > 0
)

// 表头
// const simulatorScrollRef = ref()
// const tableRef = ref()

const scrollWrapRef = ref()
const tableRef = ref()
// const tableHeader = useTableHeader(props, btns.value, slots)
const {
    columns,
    getFormItemProp,
    getTableCellStyle,
    getTableCellClass,
    getTableRowClass,
    getTableClass
} = useTableColumns(props, showOperation.value, slots.value)

// let index = 1
const add = () => {
    // console.log('add', __is_simulator_env__)
    // __is_simulator_env__ = false
    // isSimulator.value = false
    if (__is_simulator_env__) return
    if (props.max && formConfigs.value.length === props.max) {
        ElMessage.warning(`最多可添加${props.max}项`)
        return
    }
    // index++
    // const form = cloneDeep(formConfigs.value[0])
    const form = cloneDeep(baseForm)
    // useClearModel(form)
    form.id = uuidV4()
    // form.instance = null
    // form.id = form.id.split('-')?.[0] + '-' + index
    // form.activeName = `${props.serialName}${index}`
    // form.index = `${index}`
    formConfigs.value.push(form)
    getCurrentPage(formConfigs.value?.length - 1)
    emits('add', {
        forms: formConfigs.value,
        form
    })
    // formConfigs.value = [...formConfigs.value, form]?.map((item, index) => ({
    //     ...item,
    //     name: `${props.serialName}${index + 1}`
    // }))
    // activeNames.value.push(`${props.serialName}${index}`)
    // activeNames.value = formConfigs.value?.map((item, index) => `${props.serialName}${index + 1}`)
}

onMounted(async () => {
    // if(props.display !== 'table' || __is_simulator_env__) return
    // console.log('onMounted')
    if (props.display === 'form') return
    await nextTick()
    if (__is_simulator_env__) {
        useSimulatorTableStyle(props, tableRef.value)
    }
    const bindScrollEvent = useTableScrollClass(scrollWrapRef.value, tableRef.value, columns.value)
    bindScrollEvent()
})

watch(
    () => formConfigs.value,
    (value) => {
        ;(paginationProps.value.total as any) = value.length
        getCurrentRecords()
        emits(
            'update:modelValue',
            value.map((item) => item?.model ?? {})
        )

        // console.log('watch-formConfigs', value)
    },
    {
        deep: true
    }
)

// watch(
//     () => currentRecords.value,
//     (value) => {
//         console.log('currentRecords', value)
//     },
//     {
//         deep: true
//     }
// )

defineExpose({
    forms: formConfigs.value
})
</script>

<style lang="scss" scoped>
.bi-detail {
    width: 100%;
    overflow-x: auto;
    background-color: #fff;
    //padding: 10px 10px 0 10px;
}

.form-item-wrapper {
    position: relative;
    .operation-wrapper {
        position: absolute;
        top: 2px;
        right: 13px;
    }
}

.table-field-is-simulator {
    overflow-x: auto;

    &::-webkit-scrollbar {
        margin-top: 10px;
        width: 16px;
        border: 5px solid #fff;
    }
}

.table-wrapper-is-simulator {
    //display: flex;
    //flex-direction: row;
    //align-items: stretch;
    margin-bottom: 10px;
    max-width: 100%;
    overflow-x: auto;
    //table-layout: fixed;
    width: 100%;

    .form-items-wrapper {
        display: inline-flex;
        flex-direction: row;
        align-items: stretch;
        // width: 100%;
        margin-bottom: 10px;
        //max-width: 100%;
    }
    :deep(.el-form-item) {
        flex-direction: column;
        border-bottom: solid 1px #dcdfe6;
        margin-bottom: 0 !important;

        .el-form-item__label {
            justify-content: flex-start;
            background-color: #e9ebef;
            padding: 0 10px;
            font-size: 12px !important;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.6);
        }

        .el-form-item__content {
            background-color: #fff;
            padding: 10px;
        }

        &.form-item-border {
            border-right: solid 1px #dcdfe6;
        }
    }
}

.operate-btn {
    padding: 0px !important;
    margin-right: 8px !important;
}

.table-field {
    overflow-x: auto;
    margin-bottom: 16px;

    &::-webkit-scrollbar {
        width: 16px;
        border: 5px solid #fff;
    }
}

.table-display-wrapper {
    position: relative;
    display: table;
    table-layout: fixed;
    width: 100%;
    min-height: 84px;
    margin-bottom: 10px;

    .table-header {
        display: table-row;
        background-color: #e9ebef;
        height: 30px;
        line-height: 30px;
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.6);
        overflow: hidden;

        .table-head-item {
            background-color: #e9ebef;
        }
    }

    .table-cell {
        display: table-cell;
        padding: 10px 8px;
    }

    .table-cell-border {
        border-right: solid 1px #dcdfe6;
    }

    .is-first-column-cell {
        border-left: solid 1px #dcdfe6;
    }

    .table-row-form {
        display: table-row;
        overflow: hidden;
        font-size: 12px;
        overflow: hidden;

        .serial-column {
            border-bottom: solid 1px #dcdfe6;
            background-color: #fff;
            text-align: center;
        }

        .operation-column {
            border-bottom: solid 1px #dcdfe6;
            background-color: #fff;
        }

        .form-item-column {
            //display: none !important;
            display: table-cell !important;
            padding: 10px 8px;
            border-bottom: solid 1px #dcdfe6;
            background-color: #fff;

            :deep(.el-form-item) {
                margin-bottom: 0 !important;
                .el-form-item__label-wrap {
                    display: none !important;
                }
            }
        }

        .table-cell-striped {
            background-color: #fafafa;
        }
    }
}

.sticky-start,
.sticky-end {
    position: sticky;
    z-index: 2;
}

.is-scrolling-middle {
    :deep(.sticky-start, .sticky-end) {
        position: sticky;
        z-index: 2;
    }
    :deep(.sticky-end-shadow) {
        //border-left: none !important;
        &::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            box-shadow: -2px 0 3px rgba(0, 0, 0, 0.15);
            width: 1px;
            transition:
                box-shadow 0.2s ease-in-out,
                -webkit-box-shadow 0.2s ease-in-out;
        }
    }

    :deep(.sticky-start-shadow) {
        border-right: none !important;
        &::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            box-shadow: 2px 0 3px rgba(0, 0, 0, 0.15);
            width: 1px;
            transition:
                box-shadow 0.2s ease-in-out,
                -webkit-box-shadow 0.2s ease-in-out;
        }
    }
}

.is-scrolling-none {
    :deep(.sticky-start, .sticky-end) {
        position: sticky;
        z-index: 2;
    }
    :deep(.sticky-start-shadow, .sticky-end-shadow) {
        &::after {
            box-shadow: none;
        }
    }
}

.is-scrolling-left {
    :deep(.sticky-start, .sticky-end) {
        position: sticky;
        z-index: 2;
    }
    :deep(.sticky-start-shadow) {
        box-shadow: none;
    }
    :deep(.sticky-end-shadow) {
        //border-left: none !important;
        &::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            box-shadow: -2px 0 3px rgba(0, 0, 0, 0.15);
            width: 1px;
            transition:
                box-shadow 0.2s ease-in-out,
                -webkit-box-shadow 0.2s ease-in-out;
        }
    }
}

.is-scrolling-right {
    :deep(.sticky-start, .sticky-end) {
        position: sticky;
        z-index: 2;
    }
    :deep(.sticky-end-shadow) {
        box-shadow: none;
    }
    :deep(.sticky-start-shadow) {
        border-right: none !important;
        &::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            box-shadow: 2px 0 3px rgba(0, 0, 0, 0.15);
            width: 1px;
            transition:
                box-shadow 0.2s ease-in-out,
                -webkit-box-shadow 0.2s ease-in-out;
        }
    }
}

.foot-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 14px;
}
</style>
