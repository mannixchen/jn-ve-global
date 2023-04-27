import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import requireTransform from 'vite-plugin-require-transform'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// MonacoEditor 汉化，本地资源
import MonacoEditorNlsPlugin, {
    esbuildPluginMonacoEditorNls,
    Languages
} from './lib/vite-plugin-monaco-editor-nls'
import zh_CN from './lib/vscode-loc.git/i18n/vscode-language-pack-zh-hans/translations/main.i18n.json'
// import monacoEditorPlugin from 'vite-plugin-monaco-editor'

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
        requireTransform({}),
        MonacoEditorNlsPlugin({
            locale: Languages.zh_hans,
            localeData: zh_CN.contents
        })
        // MonacoEditor 加载插件
        // monacoEditorPlugin({
        //     languageWorkers: ['editorWorkerService', 'typescript', 'json']
        // }),
    ],
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                esbuildPluginMonacoEditorNls({
                    locale: Languages.zh_hans,
                    localeData: zh_CN.contents
                })
            ]
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'JnCodeEditor',
            fileName: 'index',
            formats: ['es']
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue'],
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
