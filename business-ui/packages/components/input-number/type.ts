/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-11 10:56:09
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-30 15:36:26
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-number\type.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { FormItemProps as ElFormItemProps } from 'element-plus'
import { InputNumberDisplayTypes, Currency } from './const'
import { AmountUnits } from '../../constants/index'

export type InputNumberDisplayType = InputNumberDisplayTypes | AmountUnits

export type InputNumberValue = string | number | null | undefined

export interface BiInputNumberData {
    currentValue: InputNumberValue
    userInput: null | number | string
}

export interface InputNumberProps {
    /**
     * modelValue 输入框内绑定的值
     */
    modelValue: string | number
    /**
     * 未输入时的默认值（占位符）
     */
    placeholder?: string
    /**
     * 设置计数器允许的最小值
     */
    min?: number
    /**
     * 设置计数器允许的最大值
     */
    max?: number
    /**
     * 精度
     */
    precision?: number
    /**
     * 是否使用控制按钮
     */
    // controls: boolean
    /**
     * 是否禁用
     */
    disabled?: boolean
    /**
     * 是否只读
     */
    readonly?: boolean
    /**
     * 展示类型：数值 百分比 千分比 万分比 元 万元 亿元
     */
    type?: InputNumberDisplayType
    /**
     * 是否是金额
     */
    isAmount?: boolean
    /**
     * 是否以千分位分隔符展示
     */
    toThousands?: boolean
    /**
     * 是否转成中文大写金额
     */
    toCapitalAmount?: boolean
    /**
     * 币种是否可见，当isAmount为true时生效,
     */
    currencyVisible?: boolean
    /**
     * 币种，当isAmount为true且currencyVisible为true时生效,
     */
    currency?: Currency
}


export type FiInputNumberProps = InputNumberProps & ElFormItemProps
