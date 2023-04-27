import type { App } from 'vue'

const files = import.meta.glob<any>('./*.ts', { eager: true })
const registers = Object.keys(files)
    .filter((path) => !path.includes('index'))
    .map((path) => files[path].default)

export default (app: App) => {
    registers.forEach((register) => {
        register(app)
    })
}
