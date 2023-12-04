/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-12-01 15:59:28
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-12-04 12:05:27
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/task/build-full-vite.ts
 * @Description: 使用 vite 打包全量组件
 */
import { execa } from 'execa'
import { root } from '../utils/paths'

export const buildFullVite = async () => {
    await execa('vite', ['build'], {
        cwd: root
    })
}
