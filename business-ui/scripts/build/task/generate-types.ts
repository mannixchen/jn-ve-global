/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-07 10:38:41
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-27 15:25:23
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/task/generate-types.ts
 * @Description: 使用 vue-tsc 生成组件的 .d.ts
 */
import { execa } from 'execa'
import { src, dest } from 'gulp'
import { root, outputEsm, outputCjs } from '../utils/paths'

export const generateTypes = async () => {
    await execa('vue-tsc', ['-p', 'tsconfig.declaration.json'], {
        cwd: root
    })
    return src(`${outputEsm}/**/*.d.ts`).pipe(dest(`${outputCjs}`))
}
