import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import { pathComponents, output } from '../utils/paths'
import { PKG_CAMELCASE_NAME } from '../utils/constants'
import { externalDepMapping } from '../utils/externalDepMapping'

const build = async (minify: boolean) => {
    // 入口
    const input = [path.resolve(pathComponents, 'index.ts')]
    const target = 'es2017'

    // 编译解析
    const bundle = await rollup({
        input,
        plugins: [
            vue() as any,
            vueJsx(),
            esbuild({
                target,
                sourceMap: false,
                treeShaking: true
            }),
            minify // 生成的是否是压缩版本
                ? minifyPlugin({
                      target,
                      sourceMap: false
                  })
                : null
        ],
        treeshake: true,
        external: Object.keys(externalDepMapping)
    })

    // 输出文件
    await Promise.all([
        bundle.write({
            format: 'esm',
            file: path.resolve(output, `index${minify ? '.min' : ''}.mjs`),
            exports: undefined,
            sourcemap: false
        }),
        bundle.write({
            format: 'umd',
            file: path.resolve(output, `index${minify ? '.min' : ''}.js`),
            exports: 'named',
            sourcemap: false,
            name: PKG_CAMELCASE_NAME,
            globals: externalDepMapping
        })
    ])
}

// 合并为一个主任务
export const buildFull = async () => {
    await Promise.all([build(false), build(true)])
}
