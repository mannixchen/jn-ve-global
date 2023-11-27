/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-07 10:38:41
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-23 17:40:51
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/task/generate-types.ts
 * @Description: 使用 vue-tsc 生成组件的 .d.ts
 */
import { execa } from 'execa'
import { src, dest } from 'gulp'
import { root, outputEsm, outputCjs } from '../utils/paths'

export const generateTypes = async () => {
    return await execa('vue-tsc', ['-p', 'tsconfig.declaration.json'], {
        cwd: root
    })
    
    // TODO: 系统目前用不到 cjs 减小打包体积
    // return src(`${outputEsm}/**/*.d.ts`).pipe(dest(`${outputCjs}`))
}
