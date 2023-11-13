import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))

export const pathRoot = resolve(dir, '..', '..', '..')
export const pathSrc = resolve(pathRoot, 'vue', 'src')
export const pathComponents = resolve(pathSrc, 'components')
export const svgRoot = resolve(pathRoot, 'svg')

export const output = resolve(pathRoot, 'dist')
export const outputEsm = resolve(pathRoot, 'es')
export const outputCjs = resolve(pathRoot, 'lib')
