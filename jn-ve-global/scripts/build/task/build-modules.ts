/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-06 15:17:09
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-11-22 17:13:40
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/task/build-modules.ts
 * @Description: 组件库模块分包编译
 */
import path from 'path'
import { readFileSync } from 'fs'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { compRoot, outputEsm, outputCjs } from '../utils/paths'
import { externalDepMapping } from '../utils/externalDepMapping'
import commonjs from '@rollup/plugin-commonjs'
import requireContext from 'rollup-plugin-require-context'
import copy from 'rollup-plugin-copy'
import cssnano from 'cssnano'
import image from '@rollup/plugin-image'

export const buildModules = async () => {
    // 入口
    const input = [path.resolve(compRoot, 'index.ts')]
    const sourcemapCreate = true

    // 编译解析
    const bundle = await rollup({
        input,
        plugins: [
            vue(),
            commonjs(),
            nodeResolve(),
            vueJsx() as any,
            requireContext(),
            image(),
            esbuild({
                target: 'es2017',
                sourceMap: sourcemapCreate
            }),
            postcss({
                plugins: [
                    cssnano()
                    // autoprefixer(),
                    // postcssSelectorNot(),
                    // postcssPxtorem({
                    //     rootValue: 100,
                    //     propList: ['*'],
                    //     unitPrecision: 5
                    // })
                ],
                extract: 'css/index.css'
            }),
            // 阿里图标文件直接拷贝输出到包中
            copy({
                targets: [
                    {
                        src: [
                            `${compRoot}/assets/icons/ali/*.ttf`,
                            `${compRoot}/assets/icons/ali/*.woff`,
                            `${compRoot}/assets/icons/ali/*.woff2`,
                            `${compRoot}/assets/icons/ali/*.css`
                        ],
                        dest: [`${outputEsm}/fonts`, `${outputCjs}/fonts`]
                    }
                ]
            }),
            // 图标选择器，获取 ali 的资源列表（源文件）
            {
                name: 'rollup-plugin-raw',
                resolveId(importee, importer) {
                    const prefix = /^\.\.?\//
                    const suffix = /\?raw$/
                    if (suffix.test(importee)) {
                        if (prefix.test(importee)) {
                            return path.resolve(
                                <string>importer,
                                '..',
                                importee.replace(suffix, '')
                            )
                        } else {
                            return path.resolve(process.cwd(), importee.replace(suffix, ''))
                        }
                    }
                },
                transform(_, id) {
                    if (id.includes('/icons/ali/iconfont.txt')) {
                        const filePath = path.resolve(process.cwd(), id)
                        const fileContent = readFileSync(filePath, 'utf-8')
                        return {
                            code: `export default ${JSON.stringify(fileContent)};`,
                            map: { mappings: '' }
                        }
                    }
                }
            }
        ],
        treeshake: false,
        external: [...Object.keys(externalDepMapping)]
    })

    // 输出文件
    await Promise.all([
        bundle.write({
            format: 'esm', // 模块格式
            dir: outputEsm, // 输出目录
            exports: undefined, // 导出模式
            preserveModules: true, // 与原始模块创建相同的文件
            preserveModulesRoot: 'src',
            sourcemap: sourcemapCreate, // 生成 sourcemap
            entryFileNames: `[name].mjs` // 生成文件名
        }),
        bundle.write({
            format: 'cjs',
            dir: outputCjs,
            exports: 'named',
            preserveModules: true,
            preserveModulesRoot: 'src',
            sourcemap: sourcemapCreate,
            entryFileNames: `[name].js`
        })
    ])
}
