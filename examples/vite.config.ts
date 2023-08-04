import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import esbuild from 'rollup-plugin-esbuild'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        // setup 增强，标签添加 name 属性
        vueSetupExtend(),
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

        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [
                resolve(process.cwd(), '../jn-ve-global/packages/assets/icons/svg/newCore'),
                resolve(process.cwd(), '../jn-ve-global/packages/assets/icons/svg/old'),
                resolve(process.cwd(), '../jn-ve-global/packages/assets/icons/svg/regtech')
            ],
            // 指定symbolId格式
            symbolId: 'custom-icon-[dir]-[name]'
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
                target: 'http://172.31.33.70/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy/, '')
            }
        }
    }
})
