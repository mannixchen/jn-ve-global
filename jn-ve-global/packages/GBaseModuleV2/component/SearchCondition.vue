<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-08 14:17:52
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-08-07 09:15:19
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\component\SearchCondition.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-popover
        placement="bottom-start"
        trigger="click"
        width="8.5rem"
        :visible="popoverVisible"
        :popper-options="options"
    >
        <template #reference>
            <!-- <el-button type="primary" text @click="openPopover">
                {{ selectedQueryList.length > 0 ? `筛选${selectedQueryList.length}` : '筛选' }}
            </el-button> -->
            <div class="filter-btn-wrapper" @click="openPopover">
                <g-icon custom-color icon="filter" />
                <div class="label">
                    {{ selectedQueryList.length > 0 ? `${selectedQueryList.length}项` : '筛选' }}
                </div>
            </div>
        </template>
        <div class="search-conditions-wrapper">
            <div class="header-wrapper">
                <div class="title-wrapper">
                    <div class="title">
                        筛选
                    </div>
                    <el-tooltip
                        effect="dark"
                        content="选择不同的查询条件查询列表"
                        placement="top-start"
                    >
                        <el-icon class="tip-icon" color="#C1C1C1">
                            <QuestionFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
            </div>
            <div class="btns-wrapper">
                <el-popover placement="left-start" trigger="click" :teleported="false" :width="340">
                    <template #reference>
                        <el-button class="add-btn-wrapper" type="primary" plain :icon="Plus">
                            添加条件
                        </el-button>
                    </template>
                    <div class="all-conditions-wrapper">
                        <el-input
                            v-model.trim="keyword"
                            class="search-wrapper"
                            placeholder="搜索字段"
                            clearable
                            :suffix-icon="Search"
                            @change="search"
                        />
                        <div class="condition-list-wrapper">
                            <div
                                v-for="(condition, index) in searchResults"
                                :key="condition.value ?? index"
                                class="condition-item-wrapper"
                                :class="[
                                    condition.disabled ? 'disabled' : '',
                                    condition.isCurrent ? 'is-current' : ''
                                ]"
                                @click="selectCondition(condition)"
                            >
                                <div>{{ condition.label }}</div>
                                <el-icon v-if="condition.isCurrent" class="selected-icon">
                                    <Select />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </el-popover>

                <el-button
                    class="clear-btn-wrapper"
                    type="danger"
                    plain
                    :icon="Delete"
                    @click="clear"
                >
                    全部清空
                </el-button>
            </div>
            <div class="condition-detail-list-wrapper">
                <div
                    v-for="(form, index) in selectedConditions"
                    :key="form.prop ?? index"
                    class="selected-condition-item-wrapper"
                >
                    <div class="condition-form-wrapper">
                        <g-form :config="form" />
                    </div>

                    <el-icon class="delete-rule-btn" @click="deleteCondition(form.prop)">
                        <Delete />
                    </el-icon>
                </div>
            </div>
            <div class="confirm-btn-wrapper">
                <el-button type="primary" @click="confirm">
                    确定
                </el-button>
            </div>
        </div>
    </el-popover>
</template>

<script lang="tsx" setup>
import { onMounted, watch, ref, computed, reactive, toRefs } from 'vue'
import { Delete, QuestionFilled, Plus, Search, Select } from '@element-plus/icons-vue'
import { FunctionalComponent, SelectOptionProps } from 'jn-ve-global'
import useBetweenFormItem from '../hooks/useBetweenFormItem'
import type { FormProps, FormItemProps } from '../../GForm'
import type { ConditionProps, QueryProps } from '../interface'
// import { global } from '@jsjn/utils'


const COMPONENT_NAME = 'SearchCondition'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(
    defineProps<{
        formConfig: FormProps | null
    }>(),
    {
        formConfig: null
    }
)

const emits = defineEmits<{
    'confirm': [queryList: QueryProps[], isOr: boolean]
}>()

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

const popoverVisible = ref<boolean>(false)

const keyword = ref<string>('')

const allSearchConditions = ref<ConditionProps[]>(
    (props.formConfig as FormProps).formItems.map((item) => ({
        value: item.prop,
        label: item.label as string,
        disabled: false,
        isCurrent: false
    }))
)

const searchResults = ref<ConditionProps[]>(allSearchConditions.value)

const selectedConditions = ref<FormProps[]>([])

const selectedQueryList = ref<QueryProps[]>([])

const openPopover = () => {
    popoverVisible.value = true
}

const search = (val) => {
    console.log('search', val)
    if (val) {
        searchResults.value = allSearchConditions.value.filter((item) => item?.label?.includes(val))
    } else {
        searchResults.value = allSearchConditions.value
    }
}

const clear = () => {
    selectedConditions.value = selectedConditions.value.map((item) => {
        item.model.value = props.formConfig.model[item.prop]
        return item
    })
    emits('confirm', [], false)
}

// 获取运算类型
const getTypeOptions = (type: string, childType?: string) => {
    let typeOptions: SelectOptionProps[]
    if (
        [
            'select',
            // 'radio',
            // 'checkBox',
            // 'infoSelectAll',
            // 'infoSelect',
            'selectTree',
            'selectTreeV2'
        ].includes(type)
    ) {
        typeOptions = [
            { label: '包含', value: 'in' },
            { label: '等于', value: 'eq' }
        ]
    } else if (
        [
            // 'rate',
            'figureInput',
            'inputNumber',
            // 'slider',
            'datePicker',
            'dateTimePicker',
            'timePicker'
        ].includes(type)
    ) {
        typeOptions = [
            { label: '大于', value: 'gt' },
            { label: '等于', value: 'eq' },
            { label: '小于', value: 'lt' },
            { label: '介于', value: 'between' },
            { label: '小于等于', value: 'ge' },
            { label: '大于等于', value: 'le' }
        ]
    } else if (
        [
            'input'
            // 'infoAutocomplete'
        ].includes(type)
    ) {
        typeOptions = [
            { label: '匹配', value: 'like' },
            { label: '等于', value: 'eq' }
        ]
    } else if (
        [
            'colorPicker'
            // 'switch'
        ].includes(type)
    ) {
        typeOptions = [{ label: '等于', value: 'eq' }]
    } else {
        typeOptions = [{ label: '等于', value: 'eq' }]
    }
    return typeOptions
    // ['select', 'radio', 'checkBox', 'infoSelectAll', 'infoSelect', 'selectTree', 'selectTreeV2']
    // ['rate', 'figureInput', 'inputNumber', 'slider']

    // ['colorPicker', 'switch']
    // ['input', 'infoAutocomplete']
}

const changeConditionStatus = (
    mode: 'add' | 'delete',
    conditions: ConditionProps[],
    prop: string
) => {
    return conditions.map((item) => {
        if (item.value === prop) {
            item.disabled = mode === 'add' ? true : false
            item.isCurrent = mode === 'add' ? true : false
        } else {
            item.isCurrent = false
        }
        return item
    })
}

const getValueFormItem = (logicType: string, prop: string) => {
    const formItem = props.formConfig?.formItems.find((item) => item.prop === prop)
    const controlType = formItem?.render ? 'unknown' : formItem.controlConfig.type
    const controlChildType = formItem?.render
        ? undefined
        : (formItem.controlConfig?.props as any)?.type
    if (logicType === 'between') {
        return useBetweenFormItem({ formItem, controlType, controlChildType })
    } else {
        return {
            ...formItem,
            prop: 'value',
            label: '',
            span: 9
        }
    }
}

const getConditionForm = (prop: string): FormProps => {
    const isFirst = selectedConditions.value.length === 0
    const isOr = !isFirst && selectedConditions.value[0].model.isOr
    const formItem = props.formConfig?.formItems.find((item) => item.prop === prop)
    const valueModel = props.formConfig?.model[prop]
    const controlType = formItem?.render ? 'unknown' : formItem.controlConfig.type
    // const controlChildType = formItem?.render
    //     ? undefined
    //     : (formItem.controlConfig?.props as any)?.type
    const typeOptions = getTypeOptions(controlType)

    const form: FormProps = {
        instance: null,
        prop: prop,
        model: {
            isOr,
            prop: prop,
            type: typeOptions[0].value ?? '',
            value: valueModel
        },
        formItems: [
            isFirst
                ? {
                    prop: 'isOr',
                    label: '',
                    span: 3,
                    isFirst,
                    class: 'when',
                    render: () => '当'
                }
                : {
                    prop: 'isOr',
                    label: '',
                    span: 3,
                    isFirst,
                    controlConfig: {
                        type: 'select',
                        options: [
                            {
                                value: false,
                                label: '且'
                            },
                            {
                                value: true,
                                label: '或'
                            }
                        ],
                        props: {
                            onChange: (val) => {
                                selectedConditions.value = selectedConditions.value.map(
                                    (item) => {
                                        item.model.isOr = val
                                        return item
                                    }
                                )
                            }
                        }
                    }
                },
            {
                prop: 'prop',
                label: '',
                span: 6,
                controlConfig: {
                    type: 'select',
                    options: allSearchConditions.value,
                    props: {
                        onChange: (...args) => {
                            changeCondition((args as any)[1].prop, (args as any)[0])
                        }
                    }
                }
            },
            {
                prop: 'type',
                label: '',
                span: 6,
                controlConfig: {
                    type: 'select',
                    options: typeOptions,
                    props: {
                        onChange: (...args) => {
                            console.log('change-logicType', args)
                            // ;(args as any)[1].model.value = ''
                            const prop = (args as any)[1].prop
                            ;(args as any)[1].model.value = props?.formConfig?.model?.[prop] ?? null
                            ;(args as any)[1].formItems[3] = getValueFormItem(
                                (args as any)[0],
                                prop
                            )
                        }
                    }
                }
            },
            getValueFormItem(typeOptions[0].value as string, prop) as any
            // {
            //     ...formItem,
            //     prop: 'value',
            //     label: '',
            //     span: 9
            // }
        ]
    }

    return form
}

const selectCondition = (condition: ConditionProps) => {
    console.log('selectCondition')
    if (condition.disabled) return
    allSearchConditions.value = changeConditionStatus(
        'add',
        allSearchConditions.value,
        condition.value
    )
    searchResults.value = changeConditionStatus('add', searchResults.value, condition.value)

    selectedConditions.value.push(getConditionForm(condition.value))
}

const deleteCondition = (prop: string) => {
    selectedConditions.value = selectedConditions.value?.filter((item) => item.prop !== prop)
    if (selectedConditions.value.length > 0 && !selectedConditions.value[0].formItems[0].isFirst) {
        selectedConditions.value[0].formItems[0] = {
            prop: 'isOr',
            label: '',
            isFirst: true,
            span: 3,
            class: 'when',
            render: () => '当'
        }
    }
    // const index = allSearchConditions.value.findIndex((item) => item.value === form.prop)
    allSearchConditions.value = changeConditionStatus('delete', allSearchConditions.value, prop)
    searchResults.value = changeConditionStatus('delete', searchResults.value, prop)
}

const changeCondition = (oldProp: string, newProp: string) => {
    const index = selectedConditions.value.findIndex((item) => item.prop === oldProp)
    selectedConditions.value.splice(index, 0, getConditionForm(newProp))
    allSearchConditions.value = changeConditionStatus('add', allSearchConditions.value, newProp)
    searchResults.value = changeConditionStatus('add', searchResults.value, newProp)

    deleteCondition(oldProp)
}

const confirm = () => {
    popoverVisible.value = false
    const queryList: QueryProps[] = selectedConditions.value.map((item) => {
        const { isOr, type, prop, value } = item.model
        return {
            column: prop,
            isAuto: true,
            isHump: true,
            type,
            // value: type === 'between' ? value?.join() : value,
            value: Array.isArray(value) ? value?.join() : value,
            valueType: 'String'
        }
    })
    selectedQueryList.value = queryList.filter(
        (item) => !['', null, undefined].includes(item.value)
    )
    emits('confirm', queryList, selectedConditions.value?.[0]?.model?.isOr)
}
</script>

<style lang="scss" scoped>
.filter-btn-wrapper {
    display: flex;
    border: 1px solid rgba(213, 213, 213, 1);
    border-radius: 4px;
    font-size: 16px;
    color: #989898;
    text-align: center;
    font-weight: 400;
    cursor: pointer;
    align-items: center;
    padding: 7px 10px;
    margin-right: 18px;

    .label {
        margin-left: 5px;
    }

    &:hover {
        border-color: #409eff;
        color: #409eff;

        .custom-color {
            :deep(.custom-svg-icon) {
                color: #409eff;
            }
        }
    }
}

.search-conditions-wrapper {
    padding: 5px 10px 0 10px;

    .header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
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

    .btns-wrapper {
        margin-bottom: 18px;
        .clear-btn-wrapper {
            margin-left: 10px;
        }
    }
}

.all-conditions-wrapper {
    max-height: 450px;

    .condition-list-wrapper {
        padding-left: 8px;
        overflow-y: scroll;
        scroll-behavior: smooth;
        max-height: 410px;
    }

    .condition-item-wrapper {
        padding: 5px 11px;
        font-size: 16px;
        font-weight: 400;
        color: #606266;
        cursor: pointer;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
            background-color: var(--el-fill-color-light);
            border-radius: 4px;
            color: #333333;
            font-weight: 600;
        }

        &.disabled {
            color: var(--el-text-color-placeholder);
            cursor: not-allowed;
            background-color: unset;
            &:hover {
                color: var(--el-text-color-placeholder);
                font-weight: 400;
            }
        }
    }
    .search-wrapper {
        padding: 8px 8px 0 8px;
        margin-bottom: 5px;
    }
}

.condition-detail-list-wrapper {
    max-height: 350px;
    overflow-y: auto;
    scroll-behavior: smooth;

    .selected-condition-item-wrapper {
        display: flex;
        font-size: 16px;
        color: #606266;
        align-items: center;
        justify-content: space-between;
        margin-top: 2px;

        --jn-ve-g-form-item-margin-b: 10px;

        .condition-form-wrapper {
            width: 100%;
            :deep(.form-item-row) {
                width: 100%;

                .g-form-item.when {
                    margin-left: 10px;
                    margin-top: 10px;
                }
                .form-item-col {
                    padding-right: 0 !important;
                }
            }
        }

        .delete-rule-btn {
            position: relative;
            bottom: 5px;
            cursor: pointer;
        }
    }
}
.confirm-btn-wrapper {
    text-align: center;
    margin: 10px 0;
}
</style>
