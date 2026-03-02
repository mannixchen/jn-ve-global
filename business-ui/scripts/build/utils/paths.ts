/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-06 15:12:33
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-22 10:58:52
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/utils/paths.ts
 * @Description: 路径常量化
 */
import { resolve } from 'path'

// root
export const root = resolve(__dirname, '..', '..', '..')
export const compRoot = resolve(root, 'packages')

// output
export const output = resolve(root, 'dist')
export const outputEsm = resolve(root, 'es')
export const outputCjs = resolve(root, 'lib')

// package
export const compPackage = resolve(root, 'package.json')
