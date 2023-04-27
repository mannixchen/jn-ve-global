const childProcess = require('child_process')
const filePath = require('./filePath')

const buildLibs = ['utils', 'jn-ve-global' /* , 'sheet', 'code-editor' */]

function runChild() {
    buildLibs.forEach((name) => {
        childProcess.spawn(`cd ${filePath[name]} && pnpm run build`, {
            stdio: 'inherit',
            shell: true
        })
    })
}
runChild()
