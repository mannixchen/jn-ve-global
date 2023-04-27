import { Module } from 'vuex'
import { LoginInfo, RootStateTypes } from '../interface'

const loginInfo: Module<LoginInfo, RootStateTypes> = {
    namespaced: true,
    state() {
        return {
            access_token: ''
        }
    },
    mutations: {
        setLoginInfo(state, loginInfo: LoginInfo) {
            for (const key in state) {
                if (Object.prototype.hasOwnProperty.call(state, key)) {
                    state[key] = loginInfo[key]
                }
            }
        }
    }
}

export default loginInfo
