const path = require('path')
const fs = require('fs')
const { exec, spawn } = require('child_process')

const coreDir = path.resolve(__dirname, '../_core')

fs.readdir(coreDir, (err, files) => {
    console.log(files)
    if (err) throw err

    files.forEach((dirName) => {
        const subPath = path.join(coreDir, dirName)
        const scriptStr = `cd ${subPath} && pnpm run psh`
        exec(scriptStr)
    })
})
