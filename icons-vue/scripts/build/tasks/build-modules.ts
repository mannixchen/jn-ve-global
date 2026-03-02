import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import { svgRoot, compRoot, outputEsm, outputCjs } from '../utils/paths'
import { externalDepMapping } from '../utils/externalDepMapping'

export async function buildModules() {
    const input = [path.resolve(compRoot, 'index.ts')]

    // 编译解析
    const bundle = await rollup({
        input,
        plugins: [
            vue(),
            vueJsx() as any,
            esbuild({
                target: 'es2017',
                sourceMap: false
            }),
            minifyPlugin()
        ],
        treeshake: false,
        external: Object.keys(externalDepMapping)
    })

    // 输出文件
    await Promise.all([
        bundle.write({
            format: 'esm', // 模块格式
            dir: outputEsm, // 输出目录
            exports: undefined, // 导出模式
            preserveModules: false, // 与原始模块创建相同的文件
            preserveModulesRoot: 'src',
            sourcemap: false, // 生成 sourcemap
            entryFileNames: `[name].mjs` // 生成文件名
        }),
        bundle.write({
            format: 'cjs',
            dir: outputCjs,
            exports: 'named',
            preserveModules: false,
            preserveModulesRoot: 'src',
            sourcemap: false,
            entryFileNames: `[name].js`
        })
    ])
}
