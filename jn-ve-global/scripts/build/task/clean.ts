/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-06 15:41:14
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-22 10:57:21
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/task/clean.ts
 * @Description: 清理上次打包的内容
 */
import fs from 'fs-extra'
import { output, outputEsm, outputCjs } from '../utils/paths'

export const clean = async () => {
    await Promise.all([
        fs.remove(output),
        fs.remove(outputEsm),
        fs.remove(outputCjs)
        // ...
    ])
}
