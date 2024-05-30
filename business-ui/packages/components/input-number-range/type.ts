/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-21 14:45:03
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-28 16:07:04
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-number-range\type.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { FormItemProps as ElFormItemProps } from 'element-plus'
import { InputValue } from '../input-email'
import { InputNumberProps } from '../input-number'
import { Boundary } from './const'

export interface InputNumberRangeProps
    extends Omit<InputNumberProps, 'modelValue' | 'placeholder' | 'min' | 'max'> {
    /**
     * modelValue 输入框内绑定的值
     */
    modelValue: [InputValue, InputValue]
    /**
     * 起始输入框的占位符
     */
    startPlaceholder?: string
    /**
     * 结束输入框的占位符
     */
    endPlaceholder?: string
    /**
     * 起始设置计数器允许的最小值
     */
    startMin?: number
    /**
     * 起始设置计数器允许的最大值
     */
    startMax?: number
    /**
     * 结束设置计数器允许的最小值
     */
    endMin?: number
    /**
     * 结束设置计数器允许的最大值
     */
    endMax?: number
    /**
     * 分隔符
     */
    rangeSeparator?: string
    /**
     * 清除
     */
    clearable?: boolean
    /**
     * 是否包含边界值可见
     */
    boundaryVisible?: boolean
    /**
     * 边界
     */
    boundary?: Boundary.INCLUDE | Boundary.NOT_INCLUDE
}

export type FiInputNumberRangeProps = InputNumberRangeProps & ElFormItemProps
