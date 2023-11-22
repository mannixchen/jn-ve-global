/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-06 15:08:48
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-22 11:08:17
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/index.ts
 * @Description: gulp 启动任务流
 */
import { parallel, series } from 'gulp'
import { buildModules, clean, generateTypes, buildStyle } from './task'

export default series(clean, parallel(buildModules), generateTypes)
