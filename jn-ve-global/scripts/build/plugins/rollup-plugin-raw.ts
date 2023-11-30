import path from 'path'
import { readFileSync } from 'fs'

export default function RollupPluginRaw() {
    return {
        name: 'rollup-plugin-raw',
        version: '1.0.0',
        resolveId(importee, importer) {
            const prefix = /^\.\.?\//
            const suffix = /\?raw$/
            if (suffix.test(importee)) {
                if (prefix.test(importee)) {
                    return path.resolve(<string>importer, '..', importee.replace(suffix, ''))
                } else {
                    return path.resolve(process.cwd(), importee.replace(suffix, ''))
                }
            }
        },
        transform(_, id) {
            if (id.includes('/icons/ali/iconfont.txt')) {
                const filePath = path.resolve(process.cwd(), id)
                const fileContent = readFileSync(filePath, 'utf-8')
                return {
                    code: `export default ${JSON.stringify(fileContent)};`,
                    map: { mappings: '' }
                }
            }
        }
    }
}
