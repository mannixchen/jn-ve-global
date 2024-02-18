const childProcess = require('child_process')
const filePath = require('./filePath')

const buildLibs = ['utils', 'sheet', 'code-editor', 'icons-vue' /* , 'jn-ve-global' */]

function runChild() {
    buildLibs.forEach((name) => {
        childProcess.spawn(`cd ${filePath[name]} && pnpm run build`, {
            stdio: 'inherit',
            shell: true
        })
    })
}
runChild()
