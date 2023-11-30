import path from 'path'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import cssnano from 'cssnano'
import image from '@rollup/plugin-image'
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json'
import myIconfontRaw from '../plugins/rollup-plugin-raw'
import setVersion from '../plugins/rollup-plugin-setv'

import { compRoot, output } from '../utils/paths'
import { PKG_CAMELCASE_NAME, target } from '../utils/constants'
import { externalDepMapping } from '../utils/externalDepMapping'

const build = async (minify: boolean) => {
    // 入口
    const input = [path.resolve(compRoot, 'index.ts')]

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
                sourceMap: minify,
                treeShaking: true
            }),
            minify // 生成的是否是压缩版本
                ? minifyPlugin({
                      target,
                      sourceMap: minify
                  })
                : null,
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
                extract: 'index.css'
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
                        dest: [`${output}/fonts`]
                    }
                ]
            }),
            myIconfontRaw(),
            setVersion()
        ],
        treeshake: true,
        external: [...Object.keys(externalDepMapping)]
    })

    // 输出文件
    await Promise.all([
        // TODO: 全量包 ESM 暂不需要，esm 走分包即可
        // bundle.write({
        //     format: 'esm',
        //     file: path.resolve(output, `index${minify ? '.min' : ''}.mjs`),
        //     exports: undefined,
        //     sourcemap: minify
        // }),
        bundle.write({
            format: 'umd',
            file: path.resolve(output, `index${minify ? '.min' : ''}.js`),
            exports: 'named',
            sourcemap: minify,
            name: PKG_CAMELCASE_NAME, // 组件全局名称
            globals: externalDepMapping
        })
    ])
}

// 合并为一个主任务
export const buildFull = async () => {
    await Promise.all([build(false), build(true)])
}
