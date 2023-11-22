import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import dts from 'vite-plugin-dts'
import eslintPlugin from 'vite-plugin-eslint'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import esbuild from 'rollup-plugin-esbuild'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        // 生成 .d.ts
        dts({
            outputDir: resolve(__dirname, '@types'),
            include: [
                'packages/**/*.ts',
                'packages/**/*.d.ts',
                'packages/**/*.tsx',
                'packages/**/*.vue'
            ],
            exclude: [
                'packages/**/utils/**/*.ts',
                'packages/**/mixins/**/*.ts',
                'packages/**/hooks/**/*.ts',
                'packages/**/utils.ts'
            ],
            beforeWriteFile(filePath: string, content: string) {
                return {
                    filePath: filePath.replace('/packages', ''),
                    content
                }
            },
            insertTypesEntry: false
        }),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [
                resolve(process.cwd(), 'packages/assets/icons/svg/newCore'),
                resolve(process.cwd(), 'packages/assets/icons/svg/old'),
                resolve(process.cwd(), 'packages/assets/icons/svg/regtech')
            ],
            // 指定symbolId格式
            symbolId: 'custom-icon-[dir]-[name]'
        }),
        // setup 增强，标签添加 name 属性
        vueSetupExtend(),
        // vite eslint 集成
        eslintPlugin({
            include: ['packages/**/*.{js,jsx,ts,tsx,vue}']
        }),
        {
            ...esbuild({
                target: 'chrome70',
                include: /[\.vue,\.tsx,\.ts]$/,
                loaders: {
                    '.vue': 'js'
                }
            }),
            enforce: 'post'
        } as any
    ],

    build: {
        target: 'es2015',
        minify: 'esbuild',
        sourcemap: false,
        lib: {
            entry: resolve(__dirname, 'packages/register.ts'),
            name: 'VeGlobal',
            fileName: 'jn-ve-global',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: [
                'vue',
                'vue-router',
                'element-plus',
                '@element-plus/icons-vue',
                'lodash',
                'resize-observer-polyfill',
                'echarts',
                '@vue-office/excel',
                '@vue-office/docx',
                '@vue-office/pdf',
                'axios',
                '@jsjn/icons-vue',
                '@jsjn/utils'
            ],
            output: {
                /**
                 * 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                 * 该库在 umd 构建模式下，需要保证其排除的项目也要以 umd 方式使用，需要提供其依赖的全局名称
                 */
                globals: {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    'element-plus': 'ElementPlus',
                    '@element-plus/icons-vue': 'ElementPlusIconsVue',
                    lodash: '_',
                    'resize-observer-polyfill': 'ResizeObserver',
                    'echarts': 'echarts',
                    '@vue-office/excel': 'vue-office-excel',
                    '@vue-office/docx': 'vue-office-docx',
                    '@vue-office/pdf': 'vue-office-pdf',
                    'axios': 'axios',
                    '@jsjn/icons-vue': 'JnIconsVue',
                    '@jsjn/utils': 'JnUtils'
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
