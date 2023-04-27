const childProcess = require('child_process')
const filePath = require('./filePatch')

// cd 子应用目录，npm start 启动项目 
function runChild() {
    Object.values(filePath).forEach((item) => {
        childProcess.spawn(`cd ${item} && pnpm run build`, {
            stdio: 'inherit',
            shell: true
        })
    })
}
runChild()
