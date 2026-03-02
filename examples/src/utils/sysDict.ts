/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2022-10-25 17:00:00
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-02-09 10:42:53
 * @FilePath: /micro-basic-monorepo/basic-core/utils/sysDict.ts
 * @Description: 获取字典数据方法，字典数据会在用户登录时，请求接口并缓存起来，通过该文件提供的方法可以快捷捞取字典表数据
 */
import { SelectOptionProps } from 'jn-ve-global'
import SysDict from '@jsjn/types/entity/SysDict'
import store from '@/store'

/**
 * 获取对应字典的 select options
 * @param code 字典 code
 * @param appCode 系统 code
 * @returns 转换过后的供下拉框使用的列表
 */
export function getDictSelectOptions(code: string, appCode?: string): SelectOptionProps[] {
    const dictList = store.state.sysDict.list
    if (dictList.length === 0) return []

    return dictList
        .filter((dict) => dict.code === code && (appCode ? dict.appCode === appCode : true))
        .map((dict) => ({
            label: dict.itemText,
            value: dict.itemValue
        }))
}

/**
 * 表格内字典 value 转换对应的文本
 * @param code 字典 code
 * @param value 要转换的值
 * @param appCode 系统 code
 * @returns 目标的文本值
 */
export function dictVal2Text(
    code: string,
    value: string | number,
    appCode?: string
): string | number {
    const dictList = store.state.sysDict.list
    if (dictList.length === 0) return value

    const target = dictList
        .filter((dict) => dict.code === code && (appCode ? dict.appCode === appCode : true))
        .find((dict) => dict.itemValue === value)

    return target ? target.itemText : value
}

/**
 * 获取字典数据
 * @param code 字典 code
 * @param appCode 系统 code
 * @returns 字典数据
 */
export function getDictData(code: string, appCode?: string): SysDict[] {
    const dictList = store.state.sysDict.list
    if (dictList.length === 0) return []

    return dictList.filter(
        (dict) => dict.code === code && (appCode ? dict.appCode === appCode : true)
    )
}
