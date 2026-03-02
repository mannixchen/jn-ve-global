import { App } from 'vue'
import Editor from './components/Editor.vue'
import packageInfo from '../package.json'
// import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&inline'
// import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&inline'
// import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker&inline'
export { Editor }

/**
 * 编辑器：组件仅支持 ts、json
 *  - 注册组件：JnCodeEditor
 *  - 注册获取语言文件的方法：getWorker
 * 这里 editor 作为库模式在打包时，转换了 worker 的路径
 * 方法在异步获取时，获取的是转换过后的地址，导致获取出错（这里虽然可以选择内联 worker）
 *
 * 内联 worker 问题：
 *  - 优点：用户无需关心 worker 的引用、用户无需安装 monaco-editor
 *  - 缺点：打的包过大（约大出来 10M）
 *
 * 因此，这里选择用户获取自己的 worker 文件，传递给组件
 *  - 优点：组件库不用打包 worker 了，体积大幅减少
 *  - 缺点：用户需要关心 worker 的引用，用户需要安装 monaco-editor
 */
export default (app: App) => {
    // self.MonacoEnvironment = {
    //     getWorker(_: string, label: string) {
    //         if (label === 'json') return new JsonWorker()
    //         if (label === 'typescript' || label === 'javascript') return new TSWorker()
    //         return new EditorWorker()
    //     }
    // }
    app.component('JnCodeEditor', Editor)
}

console.log(`[${packageInfo.name}] v${packageInfo.version}`)
