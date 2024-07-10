/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-09 16:50:10
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-07-09 17:33:06
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\hooks\useBetweenFormItem.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import type { FigureInputControlConfig, FormItemProps } from '../../GForm'


const formats = {
    'year': 'YYYY',
    'month': 'YYYY-MM',
    'date': 'YYYY-MM',
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
    let controlConfig: FormItemProps['controlConfig'] | Array<FormItemProps['controlConfig']>
    // if (controlType === 'dateTimePicker' || controlType === 'datePicker' && controlChildType !== 'year') {
    if (['dateTimePicker', 'datePicker'].includes(controlType)) {
        if (!['year', 'dates', 'week'].includes(controlChildType)) {
            controlConfig = {
                type: controlType as any,
                props: {
                    type: controlChildType + 'range',
                    format: formats[controlChildType],
                    valueFormat: formats[controlChildType]
                }
            }
        } else if (controlChildType === 'year') {
            controlConfig = [
                {
                    type: controlType as any,
                    props: {
                        type: controlChildType,
                        format: 'YYYY',
                        valueFormat: 'YYYY'
                    },
                    after: '-'
                } as any,
                {
                    type: controlType as any,
                    props: {
                        type: controlChildType,
                        format: formats[controlChildType],
                        valueFormat: formats[controlChildType]
                    },
                    after: ''
                } as any
            ]
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
