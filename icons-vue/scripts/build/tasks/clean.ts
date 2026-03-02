import fs from 'fs-extra'
import { compRoot, outputCjs, outputEsm, output } from '../utils/paths'

export async function clean() {
    await Promise.all([
        fs.remove(compRoot),
        fs.remove(outputCjs),
        fs.remove(outputEsm),
        fs.remove(output)
    ])
}
