const util = require('util')
const fs = require('fs')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

// 路径
const huskyPath = path.resolve(__dirname, '../.husky')
const preCommitFilePath = path.resolve(huskyPath, 'pre-commit')
const commitMsgFilePath = path.resolve(huskyPath, 'commit-msg')

// 脚本内容
const initHuskyStr = `npx husky install`
const createPreCommitShStr = `npx husky add .husky/pre-commit`
const createCommitMsgShStr = `npx husky add .husky/commit-msg`

async function runFlow() {
    await rmDir(huskyPath)

    /**
     * 这里通过脚本，初始化 husky
     * 然后创建 pre-commit、commit-msg 脚本
     * 但是 win 和 mac 平台行为不一致，详见：https://blog.csdn.net/qq_41308489/article/details/121734786
     * 所以这里先使用命令行初始化脚本文件，再通过 node 脚本填写文件内容
     */
    await exec(initHuskyStr)
    await exec(createPreCommitShStr)
    await exec(createCommitMsgShStr)

    // 替换内容
    replaceFile(preCommitFilePath, 'undefined', 'npx lint-staged')
    replaceFile(commitMsgFilePath, 'undefined', 'npx --no -- commitlint --edit ')
}

runFlow()

/**
 * 删除整个文件夹
 * @param {*} path
 */
function rmDir(path) {
    return new Promise(async (resolve) => {
        if (fs.existsSync(path)) {
            const dirs = []

            const files = await fs.readdirSync(path)

            files.forEach(async (file) => {
                const childPath = path + '/' + file
                if (fs.statSync(childPath).isDirectory()) {
                    await rmDir(childPath)
                    dirs.push(childPath)
                } else {
                    await fs.unlinkSync(childPath)
                }
            })

            dirs.forEach((fir) => fs.rmdirSync(fir))
            resolve()
        } else {
            resolve()
        }
    })
}

/**
 * 替换文件内容
 * @param {*} filePath 文件路径
 * @param {*} sourceRegx 被替换的内容
 * @param {*} targetStr 目标内容
 */
function replaceFile(filePath, sourceRegx, targetStr) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return err
        }

        let str = data.toString()
        str = str.replace(sourceRegx, targetStr)

        fs.writeFile(filePath, str, function (err) {
            if (err) return err
        })
    })
}
