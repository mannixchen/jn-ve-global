<template>
    <div class="bi-detail">
        <FormMode
            v-if="display === 'form'"
            v-bind="props"
            :form-configs="(formConfigs as any)"
            :current-records="currentRecords"
        >
            <slot />
        </FormMode>

        <template v-else>
            <div v-if="__is_simulator_env__" class="table-field-is-simulator">
                <div ref="scrollWrapRef" class="table-wrapper-is-simulator">
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

            <div v-else ref="scrollWrapRef" class="table-field">
                <div ref="tableRef" :class="getTableClass(['table-display-wrapper'])">
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
        </template>

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
                @current-change="change"
                @prev-click="prevClick"
                @next-click="nextClick"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs, useSlots, onMounted, nextTick } from 'vue'
import { ElButton, ElButtonGroup, ElMessage, ElFormItem, ElPagination } from 'element-plus'
import type { DetailProps, OperationParams } from './type'
import { GCollapse, GCollapseItem } from 'jn-ve-global'
import { BiForm, FormProps as BiFormProps } from '../form'
import { Plus } from '@element-plus/icons-vue'
import { __is_simulator_env__ } from '../../constants'
import { useFormProps, useClearModel, useNamespace } from '../../hooks'
import {
    useBtns,
    useDefaultProps,
    useTableColumns,
    useSimulatorTableStyle,
    useTableScrollClass,
    usePagination
} from './hooks'
import { assignOwnProp } from '@jsjn/micro-core-utils/utils'
import { cloneDeep } from 'lodash'
import { v4 as uuidV4 } from 'uuid'
import FormMode from './components/formMode.vue'

const COMPONENT_NAME = 'BiDetail'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<DetailProps>(), useDefaultProps())

// TODO: 添加操作emits
const emits = defineEmits<{
    'update:modelValue': [val: Array<Record<string, any>>]
    add: [param: Omit<OperationParams, 'emits' | 'index'>]
    delete: [param: Omit<OperationParams, 'emits' | 'index'>]
    copy: [param: Omit<OperationParams, 'emits' | 'index'>]
    upMove: [param: Omit<OperationParams, 'emits' | 'index'>]
    downMove: [param: Omit<OperationParams, 'emits' | 'index'>]
}>()

const slots = computed(() => {
    const defaultSlots = useSlots()?.default()
    const biDetailChildren = props.slotFromParent ? defaultSlots?.[0]?.children : defaultSlots
    return (biDetailChildren as any[])?.some((item) => item?.props?.__schema)
        ? biDetailChildren
        : (biDetailChildren as any)?.filter((item) => !item.children)
    // return biDetailChildren
})
console.log('slots', useSlots(), useSlots()?.default(), slots)

// const showSerial = computed<boolean>(() => props?.showSerial && slots.value?.length > 0)

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

// 操作按钮
const btns = useBtns(props, emits, getCurrentPage)
const showOperation = computed<boolean>(() => props.showOperation && btns.value?.length > 0)

// 表头
const scrollWrapRef = ref()
const tableRef = ref()
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
    if (__is_simulator_env__) return
    if (props.max && formConfigs.value.length === props.max) {
        ElMessage.warning(`最多可添加${props.max}项`)
        return
    }
    // index++
    const form = cloneDeep(baseForm)
    // useClearModel(form)
    form.id = uuidV4()
    formConfigs.value.push(form)
    getCurrentPage(formConfigs.value?.length - 1)
    emits('add', {
        forms: formConfigs.value,
        form
    })
}

onMounted(async () => {
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
    },
    {
        deep: true
    }
)

// function createFormConfig(data?: any): GFormProps {
//     const { labelPosition, labelWidth } = props

//     const model = slots.value.reduce((acc, vnode) => {
//         const prop = findPropDeep(vnode, 'prop')
//         if (prop) {
//             acc[prop] = data?.[prop] ?? ''
//         }
//         return acc
//     }, {})

//     const form: GFormProps = {
//         id: uuidV4(),
//         instance: null,
//         model,
//         labelPosition,
//         labelWidth: labelWidth as string
//     }
//     return form
// }

// const formConfigs2 = computed(() =>
//     currentDataModel.value?.length
//         ? currentDataModel.value.map((item) => {
//               return createFormConfig(item)
//           })
//         : [createFormConfig()]
// )
// console.log(`%c formConfigs2 === `, 'color: #67c23a;', formConfigs2.value)

defineExpose({
    forms: formConfigs.value
})
</script>

<style lang="scss" scoped>
@import './styles.scss';
</style>
