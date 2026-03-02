import type { App } from 'vue'
import JnSheet from './components/Sheet.vue'

export { default as JnSheet } from './components/Sheet.vue'

export default function (app: App) {
    app.component('JnSheet', JnSheet)
}
