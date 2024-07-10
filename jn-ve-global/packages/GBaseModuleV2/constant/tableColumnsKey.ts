/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-03 10:15:23
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2024-07-10 16:40:12
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/packages/GBaseModuleV2/constant/tableColumnsKey.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { InjectionKey, Ref } from 'vue'
import { type TableColumnProps } from '../../GTable'

export const tableColumnsKey: InjectionKey<Ref<TableColumnProps>> = Symbol('tableColumnsKey')