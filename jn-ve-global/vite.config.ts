import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import esbuild from 'rollup-plugin-esbuild'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { compRoot, output } from './scripts/build/utils/paths'
import { PKG_CAMELCASE_NAME, target } from './scripts/build/utils/constants'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        eslintPlugin({
            include: ['packages/**/*.{js,jsx,ts,tsx,vue}']
        }),
        {
            ...esbuild({
                target,
                include: /[\.vue,\.tsx,\.ts]$/,
                loaders: {
                    '.vue': 'js'
                },
                treeShaking: true
            }),
            enforce: 'post'
        } as any,
        viteStaticCopy({
            targets: [
                {
                    src: [
                        `${compRoot}/assets/icons/ali/*.ttf`,
                        `${compRoot}/assets/icons/ali/*.woff`,
                        `${compRoot}/assets/icons/ali/*.woff2`,
                        `${compRoot}/assets/icons/ali/*.css`
                    ],
                    dest: `${output}/fonts`
                }
            ]
        })
    ],

    build: {
        target,
        minify: 'esbuild',
        sourcemap: false,
        lib: {
            entry: resolve(__dirname, 'packages', 'index.ts'),
            name: PKG_CAMELCASE_NAME,
            fileName: 'index',
            formats: [/* 'es', */ 'umd']
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: [
                'vue',
                'element-plus',
                '@element-plus/icons-vue',
                'lodash',
                'resize-observer-polyfill',
                'echarts',
                '@vue-office/excel',
                '@vue-office/docx',
                '@vue-office/pdf',
                '@jsjn/icons-vue'
                // '@jsjn/utils',
                // '@vueuse/core',
                // 'axios',
                // 'async-validator'
            ],
            output: {
                /**
                 * 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                 * 该库在 umd 构建模式下，需要保证其排除的项目也要以 umd 方式使用，需要提供其依赖的全局名称
                 */
                globals: {
                    vue: 'Vue',
                    'element-plus': 'ElementPlus',
                    '@element-plus/icons-vue': 'ElementPlusIconsVue',
                    lodash: '_',
                    'resize-observer-polyfill': 'ResizeObserver',
                    'echarts': 'echarts',
                    '@vue-office/excel': 'vue-office-excel',
                    '@vue-office/docx': 'vue-office-docx',
                    '@vue-office/pdf': 'vue-office-pdf',
                    '@jsjn/icons-vue': 'JnIconsVue'
                    // '@jsjn/utils': 'JnUtils',
                    // '@vueuse/core': 'VueUse',
                    // 'axios': 'axios',
                    // 'async-validator': 'Schema'
                }
            }
        }
    },

    // 别名
    resolve: {
        alias: {
            '@component': resolve(__dirname, 'packages')
        }
    }
})
