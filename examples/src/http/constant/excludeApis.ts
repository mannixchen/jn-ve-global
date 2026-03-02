import commonApi from '@/api/modules/common.api'
import { getApisByNames } from '../utils'

/**
 * 不需要 请求 & 响应 拦截的 api 名称
 */
const excludeNames = [
    'login',
    // 'logout',
    'refresh',
    'getValidateCode',
    'getValidateCodeImg',
    'forget_password',
    'send_verification_code',
    'switch_verification_code',
    'getPasClass',
    'checkLogin',
    'send_verification_phone_code',
    'get_login_url',
    'logout_get_login_url',
    'user_register',
    'get_capcha_source',
    'get_system_safe_info'
]

// 不需要登录（拦截）的 api name（基于 commonApi）
export default getApisByNames(commonApi, excludeNames)
