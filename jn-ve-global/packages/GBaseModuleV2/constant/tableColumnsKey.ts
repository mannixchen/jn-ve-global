/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-03 10:15:23
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-09-23 17:00:49
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\constant\tableColumnsKey.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { InjectionKey, Ref } from 'vue'
// import { type TableColumnProps } from '../../GTable'
import type { BaseModuleColumnProps } from '../interface'

export const tableColumnsKey: InjectionKey<Ref<BaseModuleColumnProps>> = Symbol('tableColumnsKey')