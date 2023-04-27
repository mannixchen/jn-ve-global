/**
 * Using Vite
 * @link https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md#using-vite
 */
// 核心
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
// 特性
import './use-features'

// 语法高亮
import 'monaco-editor/esm/vs/language/json/monaco.contribution'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'

export default Monaco
