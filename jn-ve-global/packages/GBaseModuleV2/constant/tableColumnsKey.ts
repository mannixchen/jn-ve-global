/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-03 10:15:23
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-07-03 10:29:04
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\constant.ts\tableColumnsKey.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { InjectionKey, Ref } from 'vue'
import { TableColumnProps } from '@component/GTable'

export const tableColumnsKey: InjectionKey<Ref<TableColumnProps>> = Symbol('tableColumnsKey')