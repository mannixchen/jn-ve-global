/**
 * 滑动验证类型
 */
export enum LoginVerifySlideType {
    /**
     * 滑动
     */
    SLIDER = '0',
    /**
     * 拼接
     */
    CONCAT = '1',
    /**
     * 旋转
     */
    ROTATE = '2',
    /**
     * 文字点击
     */
    WORD_CLICK = '3'
}

/**
 * 登录校验方式编码
 */
export enum VerifyType {
    /**
     * 滑动验证
     */
    VER_SLIDE_ACCOUNT = '0',
    VER_SLIDE_ACCOUNT_SLIDER = '0_0',
    VER_SLIDE_ACCOUNT_CONCAT = '0_1',
    VER_SLIDE_ACCOUNT_ROTATE = '0_2',
    VER_SLIDE_ACCOUNT_WORD_CLICK = '0_3',
    /**
     * 字符验证
     */
    VER_CODE = '1',
    /**
     * 短信验证
     */
    VER_PHONE_CODE = '2',
    /**
     * 邮件验证
     */
    VER_EMAIL = '3',
    /**
     * 仅密码
     */
    PASSWORD = '99'
}

const _ver_slide_account_ = 'ver_slide_account'
/**
 * 登录校验方式标识（登录接口传递给后台的）
 */
export const VerifyTypeMapping = {
    [VerifyType.PASSWORD]: 'password',
    [VerifyType.VER_CODE]: 'ver_code_password',
    [VerifyType.VER_PHONE_CODE]: 'ver_msg_account',
    [VerifyType.VER_SLIDE_ACCOUNT]: _ver_slide_account_,
    [VerifyType.VER_SLIDE_ACCOUNT_SLIDER]: _ver_slide_account_,
    [VerifyType.VER_SLIDE_ACCOUNT_CONCAT]: _ver_slide_account_,
    [VerifyType.VER_SLIDE_ACCOUNT_ROTATE]: _ver_slide_account_,
    [VerifyType.VER_SLIDE_ACCOUNT_WORD_CLICK]: _ver_slide_account_
}