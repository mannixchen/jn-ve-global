import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))

export const root = resolve(dir, '..', '..', '..')
export const srcRoot = resolve(root, 'vue', 'src')
export const compRoot = resolve(srcRoot, 'components')
export const svgRoot = resolve(root, 'svg')

export const output = resolve(root, 'dist')
export const outputEsm = resolve(root, 'es')
export const outputCjs = resolve(root, 'lib')
