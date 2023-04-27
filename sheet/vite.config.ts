import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import requireTransform from 'vite-plugin-require-transform'
import dts from 'vite-plugin-dts'
// import { visualizer } from 'rollup-plugin-visualizer'

const port = 3068
const lifecycle = process.env.npm_lifecycle_event

export default defineConfig({
    plugins: [
        vue({
            // reactivityTransform: false // 响应性语法糖
        }),
        vueJsx(),
        vueSetupExtend(), // setup 增强，标签添加 name 属性
        // 生成 .d.ts
        dts({
            outputDir: resolve(__dirname, '@types'),
            copyDtsFiles: false
        }),
        eslintPlugin({
            include: ['src/**/*.{js,jsx,ts,tsx,vue}']
        }),
        requireTransform({})
        // 打包分析
        // lifecycle === 'report'
        //     ? visualizer({ open: true, brotliSize: true, filename: 'report.html' })
        //     : null
    ],
    optimizeDeps: {
        esbuildOptions: {}
    },
    server: {
        port
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'JnSheet',
            fileName: 'index',
            formats: ['es']
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', '@jsjn/utils'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue'
                },
                chunkFileNames: 'chunks/[name]-[hash].js'
            }
        }
    }
})
