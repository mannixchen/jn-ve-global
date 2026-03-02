import { RequestConfig, REQMethods, REQParamsType } from '@jsjn/types/Request'
import { Base64 } from 'js-base64'

const clientId = import.meta.env.VITE_CLIENT_ID
const clientSECRET = import.meta.env.VITE_CLIENT_SECRET

const Authorization = 'Basic ' + Base64.encode(`${clientId}:${clientSECRET}`)

// 登录 || 密码服务
const loginMapping: Array<RequestConfig> = [
    {
        // 登录
        name: 'login',
        api: 'kinso-auth-webmvc-login-server/login',
        method: REQMethods.POST,
        headers: {
            Authorization
        }
    },
    {
        // 刷新登录
        name: 'refresh',
        api: 'kinso-auth-webmvc-oauth2-server/oauth2/refresh',
        method: REQMethods.GET,
        paramType: REQParamsType.KEY_VALUE,
        headers: {
            Authorization
        }
    },
    {
        /**
         * 验证登录是否过期
         *  - 可能是部分接口无权限
         *  - 可能是登录过期
         */
        name: 'checkLogin',
        api: 'kinso-auth-webmvc-login-server/check/login',
        method: REQMethods.GET
    },
    {
        //c端新用户注册
        name: 'user_register',
        api: 'kinso-auth-webmvc-login-server/account/logon/personal',
        method: REQMethods.POST
    },
    {
        // 获取用户信息
        name: 'getUserInfo',
        api: 'kinso-auth-webmvc-login-server/info/userInfo',
        method: REQMethods.GET
    },
    // {
    //     // 退出
    //     name: 'logout',
    //     api: 'kinso-auth-webmvc-login-server/online/offlineByLoginId',
    //     method: REQMethods.DELETE,
    //     paramType: REQParamsType.QUERY
    // },
    {
        // c端开发时调整退出接口
        name: 'logout',
        api: 'kinso-auth-webmvc-login-server/online/logout',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 获取登录验证码（字符）
        name: 'getValidateCode',
        api: 'kinso-auth-webmvc-login-server/code/getVerificationCode',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 获取登录验证码（图片）
        name: 'getValidateCodeImg',
        api: 'kinso-auth-webmvc-login-server/code/getVerificationCodeImage',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 获取当前系统应用的密码复杂度
        name: 'getPasClass',
        api: 'kinso-basic-resources-server/v1/home/getPasswordClass',
        method: REQMethods.GET
    },
    {
        // 忘记密码
        name: 'forget_password',
        api: 'kinso-basic-resources-server/v1/iam-user-cert/resetPasswordForForget',
        method: REQMethods.POST
    },
    {
        // 发送验证码（依据手机号）
        name: 'send_verification_code',
        api: 'kinso-basic-resources-server/v1/iam-user-cert/sendVerificationCode',
        method: REQMethods.GET
    },
    {
        // 发送验证码（依据登录账号）
        name: 'send_verification_phone_code',
        api: 'kinso-auth-webmvc-login-server/code/getPhoneCodeByLogin',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 发送验证码（注册账号）
        name: 'send_verification_phone_register_code',
        api: 'kinso-auth-webmvc-login-server/code/getPhoneMsgCodeByLogin',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 是否显示验证码
        name: 'switch_verification_code',
        api: 'kinso-basic-resources-server/v1/home/paramValue/SWITCH_VERIFICATION_CODE',
        method: REQMethods.GET
    },
    {
        // 登录失效跳转指定页
        name: 'get_login_url',
        api: 'kinso-auth-webmvc-login-server/sso/loginUrl',
        method: REQMethods.GET
    },
    {
        // 退出时，获取登录指定页
        name: 'logout_get_login_url',
        api: 'kinso-auth-webmvc-login-server/ssoClient/homeUrl',
        method: REQMethods.GET
    },
    {
        // 获取图形验证码的图片资源
        name: 'get_capcha_source',
        api: 'kinso-auth-webmvc-login-server/code/getSlide',
        method: REQMethods.GET
    },
    {
        // 获取系统的安全设置信息
        name: 'get_system_safe_info',
        api: 'kinso-basic-resources-server/v1/safe/info',
        method: REQMethods.GET
    }
]

// 消息服务
const msgMapping: Array<RequestConfig> = [
    {
        // 轮询通知
        name: 'msgPoll',
        api: 'notice-pc/v1/pc-msg-query/listMsg',
        method: REQMethods.GET
    },
    {
        // 消息列表（分页）
        name: 'msgPollPage',
        api: 'notice-pc/v1/pc-msg-query/listMsgPage',
        method: REQMethods.GET
    },
    {
        // 读取消息（删除）
        name: 'msgRead',
        api: 'notice-pc/v1/pc-msg-query/read',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 获取各消息来源对应的消息数量
        name: 'listCountByFrom',
        api: 'notice-pc/v1/pc-msg-query/listGroup',
        method: REQMethods.GET
    },
    {
        // 改变用户的消息的提醒状态 0显示，1不显示
        name: 'changeTipStatus',
        api: 'notice-pc/v1/pc-msg-query/changeTipStatus',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    }
    // {
    //     // 全部已读
    //     name: 'allRead',
    //     api: 'notice-pc/v1/pc-msg-query/read',
    //     method: REQMethods.DELETE,
    //     paramType: REQParamsType.QUERY
    // },
]

// 公用
const commonMapping: Array<RequestConfig> = [
    {
        // 获取图片流
        name: 'getImgStream',
        api: 'kinso-basic-open-server/v1/document/image/download',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY,
        axiosRequestConfig: {
            responseType: 'blob'
        }
    },
    {
        // 获取文件流
        name: 'getFileStream',
        api: 'kinso-basic-open-server/v1/document/file/download',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY,
        axiosRequestConfig: {
            responseType: 'blob'
        }
    }
]

export default [...loginMapping, ...msgMapping, ...commonMapping]
