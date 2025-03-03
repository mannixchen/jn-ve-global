import path from 'path'
import { readFileSync } from 'fs'
import { compRoot, root } from '../utils/paths'
import { version } from '../../../package.json'

export default function RollupPluginSetV() {
    return {
        name: 'rollup-plugin-setv',
        version: '1.0.0',
        transform(code: string, id: string) {
            if (id.includes(`${compRoot}/register`)) {
                return {
                    code: code.replace(/__VERSION__/g, version),
                    map: { mappings: '' }
                }
            }
        }
    }
}
