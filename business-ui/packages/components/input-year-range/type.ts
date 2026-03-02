/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-04-02 10:46:24
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-28 16:16:39
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-year-range\type.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { FormItemProps as ElFormItemProps } from 'element-plus'

export type Year = Date | string

export interface InputYearRangeProps {
    /**
     * modelValue 输入框内绑定的值
     */
    modelValue: [Date, Date] | [string, string]
    /**
     * 起始输入框的占位符
     */
    startPlaceholder?: string
    /**
     * 结束输入框的占位符
     */
    endPlaceholder?: string
    /**
     * 分隔符
     */
    rangeSeparator?: string
    /**
     * 是否禁用
     */
    disabled?: boolean
    /**
     * 清除
     */
    clearable?: boolean
    /**
     * 显示在输入框中的格式
     */
    format?: string
    /**
     * 绑定值的格式
     */
    valueFormat?: string
}

export type FiInputYearRangeProps = InputYearRangeProps & ElFormItemProps

