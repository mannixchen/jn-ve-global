const { resolve, join } = require('path')
const fs = require('fs')

const exclude = ['.git', '.husky', '_core', 'common-module', 'node_modules', 'run']
function getDirs(path) {
    const files = fs.readdirSync(path)
    return files.reduce((obj, file) => {
        const childPath = `${path}/${file}`
        if (fs.statSync(childPath).isDirectory()) {
            if (!exclude.includes(file)) {
                obj[file] = childPath
            }
        }
        return obj
    }, {})
}
module.exports = getDirs(resolve(__dirname, '../'))
