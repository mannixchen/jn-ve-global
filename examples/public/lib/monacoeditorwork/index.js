// 请求是基于基座请求的
const baseUrl = '/lib/monacoeditorwork'

/**
 * 微应用加载 monaco editor 时的必须方法
 * 适用微应用：scratch
 * 这个是懒加载的，只有当编辑激活时，才会加载文件
 * worker 较大，会导致打包体积增加
 */
window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return `${baseUrl}/json.worker.bundle.js`
        }
        if (label === 'typescript' || label === 'javascript') {
            return `${baseUrl}/ts.worker.bundle.js`
        }
        return `${baseUrl}/editor.worker.bundle.js`
    }
}
