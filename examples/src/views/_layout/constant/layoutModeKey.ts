import { InjectionKey, Ref } from 'vue'

const layoutModeKey: InjectionKey<'newcore' | 'regtech' | 'managed-cloud'> = Symbol('layoutModeKey')

export default layoutModeKey
