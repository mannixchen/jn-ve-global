import path from 'node:path'
import { src, dest } from 'gulp'
import { svgRoot, compRoot } from '../utils/paths'
import through2 from 'through2'
import consola from 'consola'
import chalk from 'chalk'
import camelcase from 'camelcase'
import { type BuiltInParserName, format } from 'prettier'
import Vinyl from 'vinyl'
import { writeFile } from 'node:fs/promises'

/**
 * 格式化代码
 * @param code
 * @param parser
 * @returns
 */
const formatCode = (code: string, parser: BuiltInParserName = 'typescript') => {
    return format(code, {
        parser,
        semi: false,
        singleQuote: true
    })
}

/**
 * svg 的内容转换成 vue 模版
 * @param content
 * @param componentName
 * @returns
 */
const svgContent2VueComponent = async (content: string, componentName: string) => {
    content = content.replace(/<title>.*<\/title>/, '')
    return await formatCode(
        `
<template>
${content}
</template>
<script lang="ts">
import type { DefineComponent } from 'vue'
export default ({
  name: "${componentName}",
}) as DefineComponent
</script>`,
        'vue'
    )
}

export async function generateVue() {
    const entryFileContent: string[] = []

    await new Promise((resolve) => {
        src(`${svgRoot}/*.svg`)
            .pipe(
                through2.obj(function (file, _, cb) {
                    const { contents, stem: filename } = file

                    // TODO: ui 给的 svg 里有多余的标签，需要去掉
                    const svgStr = (contents.toString() as string)?.replace(
                        `<?xml version="1.0" encoding="UTF-8"?>`,
                        ''
                    )

                    cb(null, {
                        filename,
                        componentName: camelcase(filename, { pascalCase: true }),
                        contents: svgStr
                    })
                })
            )
            .pipe(
                through2.obj(function (file, _, cb) {
                    const { componentName, filename } = file
                    entryFileContent.push(
                        `export { default as ${componentName} } from './${filename}.vue'`
                    )
                    cb(null, file)
                })
            )
            .pipe(
                through2.obj(async function (file, _, cb) {
                    const { contents, componentName, filename } = file
                    const vue = await svgContent2VueComponent(contents, componentName)
                    const vueFile = new Vinyl({
                        path: `${filename}.vue`,
                        contents: Buffer.from(vue, 'utf-8')
                    })

                    cb(null, vueFile)
                })
            )
            .pipe(dest(compRoot))
            .on('end', () => {
                resolve(true)
            })
    })

    const code = entryFileContent.join('\n')
    await writeFile(path.resolve(compRoot, 'index.ts'), code, 'utf-8')

    consola.success(chalk.green('生产组件完成...'))
}
