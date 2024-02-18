const { resolve, join } = require('path')
const fs = require('fs')

const projects = ['utils', 'code-editor', 'sheet', 'examples', 'jn-ve-global', 'icons-vue']

module.exports = projects.reduce((obj, name) => {
    obj[name] = resolve(__dirname, '../', name)
    return obj
}, {})
