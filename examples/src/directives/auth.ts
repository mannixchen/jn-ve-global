import type { App } from 'vue'
import store from '@/store'

export default (app: App) => {
    app.directive('auth', {
        mounted(el: HTMLElement, binding) {}
    })
}
