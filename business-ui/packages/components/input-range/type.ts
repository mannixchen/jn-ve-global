/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-20 17:08:19
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-03-21 18:04:32
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-range\type.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
export type Start = string | number
export type End = string | number

export interface InputRangeProps {
    // modelValue: [Start, End]
    [key: string]: any
    clearable?: boolean
    rangeSeparator?: string
}
