import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve, normalize } from 'path'

export default defineConfig({
    plugins: [
        // 生成 .d.ts
        dts({
            outputDir: resolve(__dirname, '@types'),
            copyDtsFiles: false,
            beforeWriteFile(filePath: string, content: string) {
                return {
                    filePath: filePath.replace(normalize('/utils/@types/utils'), normalize('/utils/@types/')),
                    content: content.replace(/\.\/utils/g, '.')
                }
            }
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'JnUtils',
            fileName: 'index',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['lodash'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    lodash: '_'
                },
                chunkFileNames: 'chunks/[name]-[hash].js'
            }
        }
    }
})