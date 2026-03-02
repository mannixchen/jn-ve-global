/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-09-24 09:30:33
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-10-15 13:50:32
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\hooks\useFormConditions.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// import { ref } from 'vue'
// import useBetweenFormItem from './useBetweenFormItem'
import type { FormProps, FormItemProps, SelectOptionProps } from '../../GForm'
import { QueryProps, ConditionProps } from '../interface'

// const getValueFormItem = (formConfig: BaseModuleSearchFormProps, logicType: string, prop: string) => {
//     const formItem = formConfig?.formItems.find((item) => item.prop === prop)
//     const controlType = formItem?.render ? 'unknown' : formItem.controlConfig.type
//     const controlChildType = formItem?.render
//         ? undefined
//         : (formItem.controlConfig?.props as any)?.type
//     if (logicType === 'between') {
//         return useBetweenFormItem({ formItem, controlType, controlChildType })
//     } else {
//         return {
//             ...formItem,
//             prop: 'value',
//             label: '',
//             span: 9
//         }
//     }
// }

// // 获取运算类型
// const getTypeOptions = (type: string, childType?: string) => {
//     let typeOptions: SelectOptionProps[]
//     if (
//         [
//             'select',
//             // 'radio',
//             // 'checkBox',
//             // 'infoSelectAll',
//             // 'infoSelect',
//             'selectTree',
//             'selectTreeV2'
//         ].includes(type)
//     ) {
//         typeOptions = [
//             { label: '包含', value: 'in' },
//             { label: '等于', value: 'eq' }
//         ]
//     } else if (
//         [
//             // 'rate',
//             'figureInput',
//             'inputNumber',
//             // 'slider',
//             'datePicker',
//             'dateTimePicker',
//             'timePicker'
//         ].includes(type)
//     ) {
//         typeOptions = [
//             { label: '大于', value: 'gt' },
//             { label: '等于', value: 'eq' },
//             { label: '小于', value: 'lt' },
//             { label: '介于', value: 'between' },
//             { label: '小于等于', value: 'ge' },
//             { label: '大于等于', value: 'le' }
//         ]
//     } else if (
//         [
//             'input'
//             // 'infoAutocomplete'
//         ].includes(type)
//     ) {
//         typeOptions = [
//             { label: '匹配', value: 'like' },
//             { label: '等于', value: 'eq' }
//         ]
//     } else if (
//         [
//             'colorPicker'
//             // 'switch'
//         ].includes(type)
//     ) {
//         typeOptions = [{ label: '等于', value: 'eq' }]
//     } else {
//         typeOptions = [{ label: '等于', value: 'eq' }]
//     }
//     return typeOptions
//     // ['select', 'radio', 'checkBox', 'infoSelectAll', 'infoSelect', 'selectTree', 'selectTreeV2']
//     // ['rate', 'figureInput', 'inputNumber', 'slider']

//     // ['colorPicker', 'switch']
//     // ['input', 'infoAutocomplete']
// }

// export default (props) => {
//     const allSearchConditions = ref<ConditionProps[]>(
//         (props.formConfig as BaseModuleSearchFormProps).formItems
//             // ?.filter((item) => item?.defaultCondition)
//             ?.map((item) => ({
//                 value: item.prop,
//                 label: item.label as string,
//                 disabled: false,
//                 isCurrent: false,
//                 default: item?.defaultCondition
//             }))
//     )

//     /**
//      *  将searchFormConfig查询条件转化成筛选条件
//      * @param condition 当前查询条件
//      * @param conditions searchFormConfig中被转化的查询条件，用户生成queryList用于查询
//      * @param changeCondition 筛选条件prop发生变更后的回调
//      * @returns 返回生效的查询条件
//      */
//     const getConditionForm = (
//         condition: ConditionProps,
//         conditions: FormProps[],
//         changeCondition?: (oldProp: string, newProp: string) => void
//     ): FormProps => {
//         const { value: prop, default: defaultCondition } = condition
//         // const isFirst = selectedConditions.value.length === 0
//         // const isOr = !isFirst && selectedConditions.value[0].model.isOr
//         const isFirst = conditions.length === 0
//         // const isOr = !isFirst && conditions[0].model.isOr
//         const isOr = !isFirst && conditions[0].model.isOr
//         const formItem = props?.formConfig?.formItems.find((item) => item.prop === prop)
//         const valueModel = props?.formConfig?.model[prop]
//         const controlType = formItem?.render ? 'unknown' : formItem.controlConfig.type
//         // const controlChildType = formItem?.render
//         //     ? undefined
//         //     : (formItem.controlConfig?.props as any)?.type
//         const typeOptions = getTypeOptions(controlType)

//         const form: FormProps = {
//             instance: null,
//             prop: prop,
//             model: {
//                 isOr,
//                 prop: prop,
//                 type: typeOptions[0].value ?? '',
//                 value: valueModel
//             },
//             formItems: [
//                 isFirst
//                     ? {
//                         prop: 'isOr',
//                         label: '',
//                         span: 3,
//                         isFirst,
//                         class: 'when',
//                         render: () => '当'
//                     }
//                     : {
//                         prop: 'isOr',
//                         label: '',
//                         span: 3,
//                         isFirst,
//                         controlConfig: {
//                             type: 'select',
//                             options: [
//                                 {
//                                     value: false,
//                                     label: '且'
//                                 },
//                                 {
//                                     value: true,
//                                     label: '或'
//                                 }
//                             ],
//                             props: {
//                                 onChange: (val) => {
//                                     conditions = conditions.map(
//                                         // selectedConditions.value = selectedConditions.value.map(
//                                         (item) => {
//                                             item.model.isOr = val
//                                             return item
//                                         }
//                                     )
//                                 }
//                             }
//                         }
//                     },
//                 {
//                     prop: 'prop',
//                     label: '',
//                     span: 6,
//                     controlConfig: {
//                         type: 'select',
//                         options: defaultCondition
//                             ? allSearchConditions.value?.filter((item) => item?.default)
//                             : allSearchConditions.value?.filter((item) => !item?.default),
//                         props: {
//                             onChange: (...args) => {
//                                 changeCondition &&
//                                     changeCondition((args as any)[1].prop, (args as any)[0])
//                             }
//                         }
//                     }
//                 },
//                 {
//                     prop: 'type',
//                     label: '',
//                     span: 6,
//                     controlConfig: {
//                         type: 'select',
//                         options: typeOptions,
//                         props: {
//                             onChange: (...args) => {
//                                 console.log('change-logicType', args)
//                                 // ;(args as any)[1].model.value = ''
//                                 const prop = (args as any)[1].prop
//                                 ;(args as any)[1].model.value =
//                                     props?.formConfig?.model?.[prop] ?? null
//                                 ;(args as any)[1].formItems[3] = getValueFormItem(
//                                     props?.formConfig,
//                                     (args as any)[0],
//                                     prop
//                                 )
//                             }
//                         }
//                     }
//                 },
//                 getValueFormItem(props?.formConfig, typeOptions[0].value as string, prop) as any
//                 // {
//                 //     ...formItem,
//                 //     prop: 'value',
//                 //     label: '',
//                 //     span: 9
//                 // }
//             ]
//         }

//         return form
//     }

//     /**
//      * 将筛选条件转化成后端接口需要的查询入参
//      * @param conditions 筛选条件
//      * @returns 查询条件
//      */
//     const getQueryList = (conditions: FormProps[]): QueryProps[] => {
//         return conditions.map((item) => {
//             const { type, prop, value } = item.model
//             return {
//                 column: prop,
//                 isAuto: true,
//                 isHump: true,
//                 type,
//                 // value: type === 'between' ? value?.join() : value,
//                 value: Array.isArray(value) ? value?.join() : value,
//                 valueType: 'String'
//             }
//         })
//     }

//     const getDefaultQueryList = () => {
//         let conditions: FormProps[] = []
//         allSearchConditions.value
//             ?.filter((item) => item?.default)
//             ?.forEach((item) => {
//                 conditions.push(getConditionForm(item, conditions))
//             })
//         return getQueryList(conditions)
//     }

//     return {
//         allSearchConditions,
//         getQueryList,
//         getDefaultQueryList,
//         getConditionForm
//     }
// }

/**
 * 将筛选条件转化成后端接口需要的查询入参
 * @param conditions 筛选条件
 * @returns 查询条件
 */
export const getQueryList = (conditions: FormProps[]): QueryProps[] => {
    return conditions?.map((item) => {
        const { type, prop, value } = item.model
        return {
            column: prop,
            isAuto: true,
            isHump: true,
            type,
            // value: type === 'between' ? value?.join() : value,
            value: Array.isArray(value) ? value?.join() : value,
            valueType: 'String'
        }
    }) ?? []
}
