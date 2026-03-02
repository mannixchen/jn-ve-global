import type { App } from 'vue'

export default (app: App) => {
    app.directive('blurry', (el: HTMLElement, binding) => {
        if (!binding.value) {
            el.classList.add('my-blurry__dom')
            el.classList.add('my-blurry__show')
        } else {
            el.classList.remove('my-blurry__show')
        }
    })
}
