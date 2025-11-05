/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-10 16:18:45
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-11-03 15:41:59
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\constant\index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
export * from './tableColumnsKey'
export * from './savedConfigKey'

export enum Order {
    ASCENT = '0', // 升序
    DESCENT = '1' // 降序
}

export const orderOptions = [
    { label: '升序', value: Order.ASCENT },
    { label: '降序', value: Order.DESCENT }
]

export const excludedColumnTypes = ['selection', 'expand', 'index']
