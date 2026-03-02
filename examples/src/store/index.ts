import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { RootStateTypes, CurrentUserInfo } from './interface'
import VuexPersistence from 'vuex-persist'
import currentUserInfo from './modules/currentUserInfo'

const excludedModules = []

// 模块自动化引入处理
const files = import.meta.glob<any>('./modules/*.ts', { eager: true })
const modules = Object.keys(files).reduce((modules, path) => {
    const name = path.replace(/(.*\/)*([^.]+).*/gi, '$2')

    // 排除部分 module，动态注册，供子应用动态覆盖
    if (!excludedModules.includes(name)) {
        modules[name] = files[path].default
    }

    return modules
}, {})

// 持久化插件
const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    reducer(state: RootStateTypes) {
        return {
            loginInfo: state.loginInfo,
            currentUserInfo: state.currentUserInfo,
            sysDict: state.sysDict,
            currentStatus: state.currentStatus
        }
    }
})

// 实例化
const store = createStore<RootStateTypes>({
    modules,
    plugins: [vuexLocal.plugin]
})

export default store
export const key: InjectionKey<Store<RootStateTypes>> = Symbol('router')
export function useStore() {
    return baseUseStore(key)
}
