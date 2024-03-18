import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import esbuild from 'rollup-plugin-esbuild'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
    plugins: [
        commonjs() as any,
        vue(),
        vueJsx(),
        // vite eslint 集成
        eslintPlugin({
            include: ['src/**/*.{js,jsx,ts,tsx,vue}']
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
        } as any,

        /**
         * 使用外部库，类似webpack的externals，但现在只支持浏览器环境。
         * https://github.com/crcong/vite-plugin-externals/blob/HEAD/README.zh-CN.md
         */
        viteExternalsPlugin({
            vue: 'Vue'
        })
    ],

    // 别名
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@component': resolve(__dirname, '../jn-ve-global/packages'),
            '@ROOT': resolve(__dirname, '../')
        }
    },

    // 开发服务器
    server: {
        // open: '/index.html',
        port: 3066,
        host: '0.0.0.0',
        proxy: {
            '/proxy': {
                // target: 'http://172.31.33.70',
                target: 'http://172.31.33.84',
                // target: 'https://dfjr.jsjngf.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy/, '')
            }
        }
    }
})
