import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import esbuild from 'rollup-plugin-esbuild'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { compRoot, output } from './scripts/build/utils/paths'
import { PKG_CAMELCASE_NAME, target } from './scripts/build/utils/constants'
import RollupPluginSetV from './scripts/build/plugins/rollup-plugin-setv'

const externals = {
    vue: 'Vue',
    'element-plus': 'ElementPlus',
    '@element-plus/icons-vue': 'ElementPlusIconsVue',
    lodash: '_',
    'resize-observer-polyfill': 'ResizeObserver',
    'echarts': 'echarts',
    '@vue-office/excel': 'vue-office-excel',
    '@vue-office/docx': 'vue-office-docx',
    '@vue-office/pdf': 'vue-office-pdf',
    '@jsjn/icons-vue': 'JnIconsVue',
    sortablejs: 'Sortable'
    // 'simple-uploader.js': 'Uploader',
    // 'crypto-js': 'CryptoJS'
    // '@jsjn/utils': 'JnUtils',
    // '@vueuse/core': 'VueUse',
    // 'axios': 'axios',
    // 'async-validator': 'Schema'
}

function getIconsFilePath(fileex) {
    return normalizePath(resolve(compRoot, 'assets', 'icons', 'ali', fileex))
}

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
                        getIconsFilePath('*.ttf'),
                        getIconsFilePath('*.woff'),
                        getIconsFilePath('*.woff2'),
                        getIconsFilePath('*.css')
                    ],
                    dest: normalizePath(resolve(output, 'fonts'))
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
            plugins: [RollupPluginSetV() as any],
            external: Object.keys(externals),
            output: {
                globals: externals
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
