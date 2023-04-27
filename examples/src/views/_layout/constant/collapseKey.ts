import { InjectionKey, Ref } from 'vue'

const collapseKey: InjectionKey<Ref<boolean>> = Symbol('collapseKey')

export default collapseKey
