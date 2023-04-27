import { Module } from 'vuex'
import { SystemSafeInfo, RootStateTypes } from '../interface'
import { VerifyType, LoginVerifySlideType } from '@/login/constant/verifyType'

const systemSafeInfo: Module<SystemSafeInfo, RootStateTypes> = {
    namespaced: true,
    state() {
        return {
            clientId: '-1',
            singleSignOn: false,
            singleSignOnType: '0',
            lastLogin: false,
            loginTimeOut: 100,
            passwordForgetPone: false,
            passwordForgetEmail: false,
            passwordRevisePone: false,
            passwordRevisetEmail: false,
            passwordForceUpdate: false,
            passwordForceUpdateTime: 180,
            passwordForceUpdateRemind: false,
            passwordForceUpdateRemindTime: 3,
            passwordIntensityInterdict: false,
            passwordIntensityInterdictValue: '',
            passwordIntensityInterdictMessage: '',
            passwordIntensityInterdictMinLen: 0,
            passwordIntensityInterdictMinLenB: true,
            passwordIntensityInterdictHasNum: true,
            passwordIntensityInterdictHasXStr: true,
            passwordIntensityInterdictHasDStr: true,
            passwordIntensityInterdictHasChar: true,
            passwordIntensityInterdictNoHasName: false,
            passwordFistUpdate: false,
            loginVerify: false,
            loginVerifyNum: 2,
            loginVerifyType: VerifyType.PASSWORD,
            loginVerifySlideType: LoginVerifySlideType.SLIDER,
            loginDisable: false,
            loginDisableNum: 5,
            loginDisableTime: 60,
            loginDisableType: '0'
        }
    },
    mutations: {
        setSystemSafeInfo(state, data: SystemSafeInfo) {
            Object.keys(data).forEach((key) => {
                state[key] = data[key]
            })
        }
    }
}

export default systemSafeInfo
