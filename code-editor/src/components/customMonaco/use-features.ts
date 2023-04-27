import 'monaco-editor/esm/vs/editor/editor.all.js'

import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js'

// import metadata from 'monaco-editor/esm/metadata'
// const prefix = 'monaco-editor/esm/'
// const autoImport = metadata.features.map((feat) => {
//     let entry =
//         Object.prototype.toString.call(feat.entry) === '[object String]'
//             ? [feat.entry as string]
//             : (feat.entry as string[])
//     entry = entry.map((val) => `import '${prefix}${val}'`)
//     return `${entry.join('\n')}`
// })
// console.log(autoImport.join('\n'))
