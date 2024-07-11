import path from 'path'
import { readFileSync } from 'fs'
const os = require('os');

// 判断操作系统类型
const platform = os.platform();
let filePath = ''
if (platform === 'darwin') {
    filePath = '/icons/ali/iconfont.txt'

} else if (platform === 'win32') {
    filePath = '\\icons\\ali\\iconfont.txt'
}

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
            if (id.includes(filePath)) {
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
