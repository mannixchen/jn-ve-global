const childProcess = require('child_process')
const filePath = require('./filePath')

// cd 子应用目录，npm start 启动项目 
function runChild() {
    childProcess.spawn(`cd ${filePath['examples']} && pnpm run dev`, {
        stdio: 'inherit',
        shell: true
    })
}
runChild()
