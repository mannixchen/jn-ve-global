/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-12 13:54:53
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-22 11:23:56
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { BiInputNumber } from './input-number'
import { BiInputNumberRange } from './input-number-range'
import { BiInputYearRange } from './input-year-range'
import { BiInputCard } from './input-card'
import { BiInputSocialCode } from './input-social-code'
import { BiInputPhone } from './input-phone'
import { BiInputEmail } from './input-email'
import { BiCheckbox } from './checkbox'
import { BiRadio } from './radio'
import { BiSelectDepartment } from './select-department'


export * from './input-number'
export * from './input-number-range'
export * from './input-year-range'
export * from './input-email'
export * from './input-card'
export * from './input-social-code'
export * from './input-phone'
export * from './checkbox'
export * from './radio'
export * from './select-department'


export const components = [
    BiInputNumber,
    BiInputNumberRange,
    BiInputYearRange,
    BiInputCard,
    BiInputSocialCode,
    BiInputPhone,
    BiInputEmail,
    BiCheckbox,
    BiRadio,
    BiSelectDepartment
]