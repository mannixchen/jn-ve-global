import { execa } from 'execa'
import { src, dest } from 'gulp'
import { root, outputEsm, outputCjs, output } from '../utils/paths'
import consola from 'consola'
import chalk from 'chalk'

export const generateTypes = async () => {
    consola.start(chalk.blue('生成声明文件...'))
    await execa('vue-tsc', ['-p', 'tsconfig.json'], {
        cwd: root
    })

    consola.success(chalk.green('生成声明文件完成...'))

    return src(`${outputEsm}/**/*.d.ts`)
        .pipe(dest(`${outputCjs}`))
        .pipe(dest(`${output}/types`))
}
