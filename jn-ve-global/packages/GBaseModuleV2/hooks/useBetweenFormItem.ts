/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-09 16:50:10
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-10-08 11:26:54
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\hooks\useBetweenFormItem.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import type { FigureInputControlConfig, FormItemProps } from '../../GForm'

const formats = {
    'year': 'YYYY',
    'month': 'YYYY-MM',
    'date': 'YYYY-MM-DD',
    'datetime': 'YYYY-MM-DD HH:mm:ss'
}

export default ({
    formItem,
    controlType,
    controlChildType
}: {
    formItem: FormItemProps
    controlType: string
    controlChildType: string
}) => {
    console.log('use-between')
    let controlConfig: FormItemProps['controlConfig'] | Array<FormItemProps['controlConfig']>
    // if (controlType === 'dateTimePicker' || controlType === 'datePicker' && controlChildType !== 'year') {
    if (controlType === 'datePicker') {
        // if (!['year', 'dates', 'week'].includes(controlChildType)) {
        const childType = controlChildType ?? 'date'
        if (!['years', 'months', 'dates', 'week'].includes(childType)) {
            controlConfig = {
                type: controlType as any,
                props: {
                    type: childType?.includes('range')
                        ? childType
                        : `${childType}range`,
                    format: formats[childType],
                    valueFormat: formats[childType]
                }
            }
        }
        // else if (controlChildType === 'year') {
        //     controlConfig = [
        //         {
        //             type: controlType as any,
        //             props: {
        //                 type: controlChildType,
        //                 format: 'YYYY',
        //                 valueFormat: 'YYYY'
        //             },
        //             after: '-'
        //         } as any,
        //         {
        //             type: controlType as any,
        //             props: {
        //                 type: controlChildType,
        //                 format: formats[controlChildType],
        //                 valueFormat: formats[controlChildType]
        //             },
        //             after: ''
        //         } as any
        //     ]
        // }
    } else if (controlType === 'dateTimePicker') {
        const childType = controlChildType ?? 'datetime'

        if (!['year', 'month', 'date', 'week'].includes(childType)) {
            controlConfig = {
                type: controlType as any,
                props: {
                    type: childType?.includes('range')
                        ? childType
                        : `${childType}range`,
                    format: formats[childType],
                    valueFormat: formats[childType]
                }
            }
        }
    } else if (controlType === 'timePicker') {
        controlConfig = {
            type: controlType,
            props: {
                isRange: true
            }
        }
    } else if (controlType === 'figureInput') {
        const format = (formItem.controlConfig as FigureInputControlConfig)?.props?.format
        controlConfig = [
            {
                type: 'figureInput',
                after: '-',
                props: {
                    showUnitTip: false,
                    format
                }
            } as any,
            {
                type: 'figureInput',
                after: '',
                props: {
                    showUnitTip: false,
                    format
                }
            } as any
        ]
    } else if (controlType === 'inputNumber') {
        controlConfig = [
            {
                type: 'inputNumber',
                after: '-',
                props: {
                    controls: false
                }
            } as any,
            {
                type: 'inputNumber',
                after: '',
                props: {
                    controls: false
                }
            } as any
        ]
    }

    const obj = Array.isArray(controlConfig)
        ? { controlConfig: undefined, controlConfigs: controlConfig }
        : { controlConfig }

    return {
        ...formItem,
        prop: 'value',
        label: '',
        span: 9,
        ...obj
    }
}
