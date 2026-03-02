import { ref, provide, InjectionKey, Ref } from 'vue'
import useRememberLogin from './useRememberLogin'
import useCheckVerifyType from './useCheckVerifyType'
import { CurrentCaptchaConfig } from '@/components/business/captcha'
import useLoginHandle from './useLoginHandle'
import { BaseResponse } from '@jsjn/types/Response'
import { Local } from '@jsjn/utils'
import { VerifyType } from '..//constant/verifyType'
import loginedKey from '../constant/injectionKey'
import sendVerSourceKey from '../constant/sendVerSourceKey'
import type { FormProps } from 'jn-ve-global'

interface Params {
    /**
     * 表单配置
     * @param p
     * @returns
     */
    useLoginInfoFormConfig: (p: {
        captchaValid?: (id: string, data: CurrentCaptchaConfig) => void
    }) => {
        /**
         * 表单配置对象
         */
        loginInfoFormConfig: FormProps
        /**
         * 设置滑动验证码显示状态
         * @param type 需要改变的类型
         * @param show 显示 or 隐藏
         */
        setCaptchaShow: (show: boolean) => void
        /**
         * 刷新滑动验证码
         */
        refreshCaptcha: () => void
    }
}

export default ({ useLoginInfoFormConfig }: Params) => {
    // 表单
    const { loginInfoFormConfig, setCaptchaShow, refreshCaptcha } = useLoginInfoFormConfig({
        captchaValid: _handleCaptchaValid
    })

    // 记住账号
    const { rememberFlag, rememberHandler } = useRememberLogin(loginInfoFormConfig)

    // 忘记密码弹框 flag
    const retrievePasModalShow = ref<boolean>(false)

    // 登录校验方式码
    const { verifyTypeCode, increaseErrCount, initErrCount, isBerth } =
        useCheckVerifyType(loginInfoFormConfig)

    // 发送验证码存储时间的 key
    const loginSendVerStorageKey = 'SEND_VER_FROM_LOGIN'
    provide(sendVerSourceKey, loginSendVerStorageKey)

    // 刷新图形验证码的标识
    const isLogined = ref<number>(+new Date())
    provide(loginedKey, isLogined)

    /**
     * 登录按钮处理函数
     */
    const { handle: handleLogin, btnLoading } = useLoginHandle(
        loginInfoFormConfig,
        verifyTypeCode,
        isLogined,
        null,
        _loginSuccess
    )

    /**
     * 登录分为三种
     *  - 滑动验证码（需要主动调出人机交互，校验通过后，登录+校验信息一起发送给后台）
     *  - 数字验证码（直接平铺展示验证，直接发送登录请求）
     *  - 无人机交互
     */
    const localHandleLogin = () => {
        loginInfoFormConfig.instance.validate().then(() => {
            if (
                [
                    VerifyType.VER_SLIDE_ACCOUNT_CONCAT,
                    VerifyType.VER_SLIDE_ACCOUNT_ROTATE,
                    VerifyType.VER_SLIDE_ACCOUNT_SLIDER,
                    VerifyType.VER_SLIDE_ACCOUNT_WORD_CLICK
                ].includes(verifyTypeCode.value)
            ) {
                setCaptchaShow(true)
            } else {
                handleLogin()
            }
        })
    }

    /**
     * 登录成功后的回调，下面的也是登录请求接口的响应回调，但是 _handleCaptchaValid 只适配人机交互验证的登录响应
     * 这里的登录回调，是针对所有登录方式的
     *  - 清理短信验证码的计时缓存
     *  - 刷新验证码
     *  - 执行记住密码
     *  - 累加错误次数 or 初始化错误次数
     */
    function _loginSuccess(result: BaseResponse) {
        if (result.success && Local.get(loginSendVerStorageKey)) {
            Local.remove(loginSendVerStorageKey)
        }

        if (result.success) {
            rememberHandler()
            initErrCount()
        } else {
            increaseErrCount()
        }
    }

    /**
     * 人机交互验证+登录请求
     * @param id
     * @param data
     */
    function _handleCaptchaValid(id: string, data: CurrentCaptchaConfig) {
        loginInfoFormConfig.model['imageCaptchaTrack'] = data
        handleLogin().then((res) => {
            /**
             * 非成功的接口刷新验证码
             */
            if (res.code !== '000000') {
                refreshCaptcha()

                /**
                 * 区分是账号错误，还是交互错误
                 *  - 5000000：账号错误
                 *  - 5000001：人机交互错误
                 */
                if ((res.code as string) === '5000000') {
                    setCaptchaShow(false)
                }
            }
        })
    }

    return {
        /**
         * 记住账号 flag
         */
        rememberFlag,
        /**
         * 忘记密码弹框 showFlag
         */
        retrievePasModalShow,
        /**
         * 登录表单核心配置
         */
        loginInfoFormConfig,
        /**
         * 是否为验证码提供展示位置（视系统登录页排版区别使用）
         *  - 数字、短信验证码需要
         *  - 滑动类的人机交互则不需要
         */
        isBerth,
        /**
         * 登录函数
         */
        localHandleLogin,
        /**
         * 登录按钮加载中
         */
        btnLoading
    }
}
