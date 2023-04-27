import { InjectionKey, Ref } from 'vue'

const loginedKey: InjectionKey<Ref<number>> = Symbol('loginedKey')

export default loginedKey
