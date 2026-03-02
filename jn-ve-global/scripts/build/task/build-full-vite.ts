/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-12-01 15:59:28
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-12-06 11:35:49
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/task/build-full-vite.ts
 * @Description: 使用 vite 打包全量组件
 */
import { execa } from 'execa'
import { root } from '../utils/paths'

export const buildFullVite = async () => {
    const isPx = process.argv.includes('--px')
    const pxBuildArgs = isPx ? ['--', '--px'] : []

    await execa('vite', ['build', ...pxBuildArgs], {
        cwd: root
    })
}
