import { VerifyType, LoginVerifySlideType } from '@/login/constant/verifyType'

export default interface SystemSafeInfo {
    /**
     * 客户端编号
     */
    clientId?: string
    //单一登录设置
    /**
     * 是否单一登录 默认不启用
     */
    singleSignOn?: boolean
    /**
     * 单一登录排除方式 默认0 后登录踢出先登录 , 1 已登录禁止再登录
     */
    singleSignOnType?: string
    //上次登录信息提示设置
    /**
     * 上次登录信息提示
     */
    lastLogin?: boolean
    //登录超时设置
    /**
     * 登录超时时间 默认10分钟
     */
    loginTimeOut?: number

    //密码策略设置
    /**
     * 忘记密码 手机
     */
    passwordForgetPone?: boolean
    /**
     * 忘记密码 邮件
     */
    passwordForgetEmail?: boolean

    /**
     * 修改密码 手机
     */
    passwordRevisePone?: boolean
    /**
     * 修改密码 邮件
     */
    passwordRevisetEmail?: boolean
    /**
     * 是否密码定期更新 默认不启用
     */
    passwordForceUpdate?: boolean
    /**
     * 密码定期更新周期 默认180天
     */
    passwordForceUpdateTime?: number
    /**
     * 密码强度限制 默认false
     */
    passwordIntensityInterdict?: boolean
    /**
     * 密码强度限制
     */
    passwordIntensityInterdictValue?: string
    /**
     * 密码验证文案
     */
    passwordIntensityInterdictMessage?: string
    /**
     * 密码强度限制 最小长度 默认6
     */
    passwordIntensityInterdictMinLen?: number
    /**
     * 密码强度限制 最小长度 默认6
     */
    passwordIntensityInterdictMinLenB?: boolean
    /**
     * 密码强度限制 是否包含数字 true
     */
    passwordIntensityInterdictHasNum?: boolean
    /**
     * 密码强度限制 是否包数小写字母 true
     */
    passwordIntensityInterdictHasXStr?: boolean
    /**
     * 密码强度限制 是否包数大写字母 true
     */
    passwordIntensityInterdictHasDStr?: boolean
    /**
     * 密码强度限制 是否包含符号 true
     */
    passwordIntensityInterdictHasChar?: boolean
    /**
     * 密码强度限制 不包含用户名 false
     */
    passwordIntensityInterdictNoHasName?: boolean
    /**
     *  是否密码首次需要更新 默认不启用
     */
    passwordFistUpdate?: boolean
    /**
     * 密码是否定期更新提醒
     */
    passwordForceUpdateRemind?: boolean
    /**
     * 密码定期更新提醒 默认3天
     */
    passwordForceUpdateRemindTime?: number
    /**
     * 是否开启登录验证 默认不开启
     */
    loginVerify?: boolean

    /**
     * 几次登录失败后开启登录验证
     */
    loginVerifyNum?: number
    /**
     * 类型验证类型 0 滑动验证  1 字符验证 2 短信验证 3 邮件验证
     */
    loginVerifyType?: VerifyType
    /**
     * 滑动验证方式
     */
    loginVerifySlideType?: LoginVerifySlideType
    /**
     * 是否开启登录锁定 默认不开启
     */
    loginDisable?: boolean

    /**
     * 登录锁定次数 5
     */
    loginDisableNum?: number
    /**
     * 登录锁定时间 60
     */
    loginDisableTime?: number
    /**
     * 登录锁定类型
     */
    loginDisableType?: string
}