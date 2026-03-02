import { ref, reactive, watch } from 'vue'
import { Local, Cookie } from '@jsjn/utils'
import { FormProps } from 'jn-ve-global'

export const USER_LOGIN_NAME_CACHE_KEY = 'USER_LOGIN_NAME_CACHE_KEY'

export default (formConfig: FormProps) => {
    const rememberFlag = ref<boolean>(true)

    if (Cookie.get(USER_LOGIN_NAME_CACHE_KEY)) {
        formConfig.model.account = Cookie.get(USER_LOGIN_NAME_CACHE_KEY)
        rememberFlag.value = true
    } else {
        rememberFlag.value = false
    }

    const rememberHandler = () => {
        const loginInfo = formConfig.model
        const userName = loginInfo.account
        if (rememberFlag.value) {
            Cookie.set(USER_LOGIN_NAME_CACHE_KEY, userName, 7)
        } else {
            Cookie.del(USER_LOGIN_NAME_CACHE_KEY)
        }
    }

    return {
        rememberFlag,
        rememberHandler
    }
}
