import fs from 'fs-extra'
import { pathComponents, outputCjs, outputEsm, output } from '../utils/paths'

export async function clean() {
    await Promise.all([
        fs.remove(pathComponents),
        fs.remove(outputCjs),
        fs.remove(outputEsm),
        fs.remove(output)
    ])
}
