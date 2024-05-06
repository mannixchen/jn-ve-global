/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-30 15:58:17
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-30 17:12:29
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/task/generate-global-types.ts
 * @Description: GlobalComponents for Volar
 */
import { resolve } from 'path'
import { outputEsm, outputCjs, root } from '../utils/paths'
import { format } from 'prettier'
import { PKG_NAME } from '../utils/constants'
import { readFile, writeFile } from 'node:fs/promises'

export async function generateGlobalTypes() {
    const entryContent = await readFile(resolve(outputEsm, 'register.mjs'), 'utf-8')
    // TODO: 正则不会写
    const start = entryContent.indexOf('[')
    const end = entryContent.indexOf(']')
    const components: string[] = entryContent
        .substring(start + 2, end - 1)
        .replace(/\,/g, '')
        .replace(/ /g, '')
        .split('\n')

    const template = await readFile(
        resolve(root, 'scripts', 'build', 'utils', 'global.d.ts.temp'),
        'utf-8'
    )

    const declareItems = components
        .map((name) => `${name}: typeof import('${PKG_NAME}')['${name}']`)
        .join('\n')

    let code = template.replace('__PLACEHOLDER__', `${declareItems}`)
    code = await format(code, { parser: 'typescript', semi: false, singleQuote: true })

    await Promise.all([
        writeFile(resolve(outputEsm, 'global.d.ts'), code, 'utf-8'),
        writeFile(resolve(outputCjs, 'global.d.ts'), code, 'utf-8')
    ])
}
