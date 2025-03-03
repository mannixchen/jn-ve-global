/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-08 15:48:32
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2025-02-27 19:35:19
 * @FilePath: /@jsjn-librar-monorepo/business-ui/packages/components/detail/const.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { InjectionKey } from 'vue'

export const modelKey: InjectionKey<Record<string, any>> = Symbol('modelKey')

export const DEFAULT_SERIAL_COLUMN_WIDTH = '60px'
export const DEFAULT_OPERATION_COLUMN_WIDTH = '80px'
export const DEFAULT_COLUMN_WIDTH = '200px'
export const DEFAULT_MIN_COLUMN_WIDTH = '80px'
