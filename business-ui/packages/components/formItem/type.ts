/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-08 16:59:10
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-09 10:41:32
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\formItem\type.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { FormItemProps as ElFormItemProps } from 'element-plus'
import {
    BiInputProps,
    BiCheckboxProps,
    BiRadioProps,
    InputNumberProps,
    InputNumberRangeProps,
    InputYearRangeProps
} from '../index'

export type BiFormItemProps = (
    | BiInputProps
    | BiCheckboxProps
    | BiRadioProps
    | InputNumberProps
    | InputNumberRangeProps
    | InputYearRangeProps
) &
    ElFormItemProps
