/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2022-03-11 12:14:58
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-30 11:10:48
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/packages/_http/httpInterceptors.ts
 * @Description: 接收父级的请求拦截函数，做到微应用与基座的行为保持一致
 */
import { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export type ReqHandle = (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>
export type ResHandle = (res: AxiosResponse) => Promise<AxiosResponse>

export let interceptorsReqHandle: ReqHandle = null
export let interceptorsResHandle: ResHandle = null

export function setIterceptorsReqHandle(handle: ReqHandle) {
    interceptorsReqHandle = handle
}

export function setIterceptorsResHandle(handle: ResHandle) {
    interceptorsResHandle = handle
}

export const test = 'qweqwrqwasda'