/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2023-11-06 15:17:09
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2025-02-19 16:12:23
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/scripts/build/task/build-modules.ts
 * @Description: 组件库模块分包编译
 */
import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import cssnano from 'cssnano'
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'
import myIconfontRaw from '../plugins/rollup-plugin-raw'
import setVersion from '../plugins/rollup-plugin-setv'

import { compRoot, outputEsm, outputCjs } from '../utils/paths'
import { target, sourcemapCreate } from '../utils/constants'
import { externalDepMapping } from '../utils/externalDepMapping'

export const buildModules = async () => {
    // 入口
    const input = [path.resolve(compRoot, 'index.ts'), path.resolve(compRoot, 'resolver.ts')]

    // 编译解析
    const bundle = await rollup({
        input,
        plugins: [
            vue(),
            vueJsx() as any,
            commonjs(),
            nodeResolve(),
            image(),
            json(),
            esbuild({
                target,
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
                            path.join(compRoot, 'assets', 'icons', 'ali', '*.ttf'),
                            path.join(compRoot, 'assets', 'icons', 'ali', '*.woff'),
                            path.join(compRoot, 'assets', 'icons', 'ali', '*.woff2'),
                            path.join(compRoot, 'assets', 'icons', 'ali', '*.css')
                        ],
                        dest: [
                            path.join(outputEsm, 'fonts'),
                            path.join(outputCjs, 'fonts')
                        ]
                    }
                ]
            }),
            myIconfontRaw(),
            setVersion()
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
            preserveModulesRoot: 'packages',
            sourcemap: sourcemapCreate, // 生成 sourcemap
            entryFileNames: `[name].mjs` // 生成文件名
        }),
        bundle.write({
            format: 'cjs',
            dir: outputCjs,
            exports: 'named',
            preserveModules: true,
            preserveModulesRoot: 'packages',
            sourcemap: sourcemapCreate,
            entryFileNames: `[name].js`
        })
    ])
}
