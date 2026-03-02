/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-10-14 15:56:01
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-10-15 10:48:44
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\constant\savedConfigKey.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { InjectionKey, Ref } from 'vue'
// import { type TableColumnProps } from '../../GTable'
import type { SavedConfig } from '../interface'

export const savedConfigKey: InjectionKey<Ref<SavedConfig>> = Symbol('savedConfigKey')