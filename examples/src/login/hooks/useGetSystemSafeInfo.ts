import { apis } from '@/api'
import { useStore } from '@/store'
import { LoginVerifySlideType, VerifyType } from '../constant/verifyType'

export default () => {
    const store = useStore()

    apis.common['get_system_safe_info']().then((res) => {
        if (res.code === '000000') {
            // // 测试
            // res.data.loginVerify = true
            // res.data.loginVerifyNum = 2
            // res.data.loginVerifyType = VerifyType.VER_CODE
            // res.data.loginVerifySlideType = LoginVerifySlideType.WORD_CLICK

            store.commit('systemSafeInfo/setSystemSafeInfo', res.data)
        }
    })
}
