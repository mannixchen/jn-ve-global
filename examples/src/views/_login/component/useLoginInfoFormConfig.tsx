import { reactive, Ref, ref, watch } from 'vue'
import type { FormProps } from 'jn-ve-global'
import { apis } from '@/api'
import { ElMessage } from 'element-plus'
import { VerifyType } from '@/login/constant/verifyType'
import CONDITION_CREATE from '@/login/constant/CONDITION_CREATE_KEY'
import ValidateCode from '@/login/components/validateCode.vue'
import SendVerification from '@/login/components/sendVerification.vue'
import { v4 as uuidV4 } from 'uuid'
import {
    CaptchaConcat,
    CaptchaRotate,
    CaptchaSlider,
    CaptchaWordClick,
    CurrentCaptchaConfig
} from '@/components/business/captcha'

interface Params {
    captchaValid?: (id: string, data: CurrentCaptchaConfig) => void
}

export default (p: Params) => {
    const SendVerificationAny = SendVerification as any

    const _currentCaptchaRef = ref<InstanceType<typeof CaptchaConcat>>(null)

    const loginInfoFormConfig = reactive<FormProps>({
        instance: null,
        model: {
            account: '',
            password: '',
            smsVerificationCode: '',
            verificationCode: '',
            codeKey: '',
            imageCaptchaTrack: null
        },
        formItems: [
            {
                prop: 'account',
                span: 24,
                rules: [{ required: true, message: '请输入用户名' }],
                render(prop) {
                    return (
                        <el-input
                            v-model_trim={prop.value}
                            placeholder='请输入用户名'
                            clearable
                            onFocus={(e: FocusEvent) => {
                                ;(e.target as any).select()
                            }}>
                            {{
                                prefix: () => <g-icon icon='user' customColor={true} />
                            }}
                        </el-input>
                    )
                }
            },
            {
                prop: 'password',
                span: 24,
                rules: [{ required: true, message: '请输入密码' }],
                render(prop) {
                    return (
                        <el-input
                            type='password'
                            v-model_trim={prop.value}
                            placeholder='请输入密码'
                            clearable
                            onFocus={(e: FocusEvent) => {
                                ;(e.target as any).select()
                            }}>
                            {{
                                prefix: () => <g-icon icon='password' customColor={true} />
                            }}
                        </el-input>
                    )
                }
            },
            {
                prop: 'smsVerificationCode',
                span: 24,
                rules: [{ required: true, message: '请输入短信验证码' }],
                class: 'phone-ver-code',
                hide: true,
                group: [CONDITION_CREATE, VerifyType.VER_PHONE_CODE],
                render(prop) {
                    return (
                        <>
                            <el-input
                                v-model_trim={prop.value}
                                placeholder='请输入短信验证码'
                                clearable
                                onFocus={(e: FocusEvent) => {
                                    ;(e.target as any).select()
                                }}>
                                {{
                                    prefix: () => (
                                        <g-icon icon='dongtaikouling' customColor={true} />
                                    )
                                }}
                            </el-input>

                            {/* 手机验证码 */}
                            <SendVerificationAny
                                phoneValue={loginInfoFormConfig.model.account}
                                msg='请输入账号'
                                isValidate={false}
                                onSend={() => {
                                    loginInfoFormConfig.model.codeKey = uuidV4().replace(/-/g, '')
                                    apis.common['send_verification_phone_code']({
                                        accountName: loginInfoFormConfig.model.account,
                                        key: loginInfoFormConfig.model.codeKey
                                    }).then((res) => {
                                        if (res.code === '000000') {
                                            ElMessage.success('发送验证码成功')
                                        }
                                    })
                                }}
                            />
                        </>
                    )
                }
            },
            {
                prop: 'verificationCode',
                span: 24,
                rules: [{ required: true, message: '请输入验证码' }],
                class: 'picture-ver-code',
                hide: true,
                group: [CONDITION_CREATE, VerifyType.VER_CODE],
                render(prop) {
                    return (
                        <>
                            <el-input
                                v-model_trim={prop.value}
                                placeholder='请输入验证码'
                                clearable
                                onFocus={(e: FocusEvent) => {
                                    ;(e.target as any).select()
                                }}>
                                {{
                                    prefix: () => (
                                        <g-icon icon='dongtaikouling' customColor={true} />
                                    )
                                }}
                            </el-input>

                            {/* 图形验证码 */}
                            <ValidateCode v-model={loginInfoFormConfig.model.codeKey} />
                        </>
                    )
                }
            },

            {
                prop: 'imageCaptchaTrack',
                span: 24,
                hide: true,
                group: [CONDITION_CREATE, VerifyType.VER_SLIDE_ACCOUNT_CONCAT],
                class: {
                    'login-captcha-form-item': true,
                    'is-show': false,
                    'before-hide': false
                } as any,
                render(prop: Ref<string>) {
                    return (
                        <div class='login-captcha-wrapper' onAnimationend={handleAnimationend}>
                            <CaptchaConcat
                                ref={_currentCaptchaRef}
                                v-model={[loginInfoFormConfig.model.codeKey, 'codeKey']}
                                {...{
                                    onClose: handleCaptchaClose,
                                    onValid: p.captchaValid
                                }}
                            />
                        </div>
                    )
                }
            },
            {
                prop: 'imageCaptchaTrack',
                span: 24,
                hide: true,
                group: [CONDITION_CREATE, VerifyType.VER_SLIDE_ACCOUNT_ROTATE],
                class: {
                    'login-captcha-form-item': true,
                    'is-show': false,
                    'before-hide': false
                } as any,
                render(prop: Ref<string>) {
                    return (
                        <div class='login-captcha-wrapper' onAnimationend={handleAnimationend}>
                            <CaptchaRotate
                                ref={_currentCaptchaRef}
                                v-model={[loginInfoFormConfig.model.codeKey, 'codeKey']}
                                {...{
                                    onClose: handleCaptchaClose,
                                    onValid: p.captchaValid
                                }}
                            />
                        </div>
                    )
                }
            },
            {
                prop: 'imageCaptchaTrack',
                span: 24,
                hide: true,
                group: [CONDITION_CREATE, VerifyType.VER_SLIDE_ACCOUNT_SLIDER],
                class: {
                    'login-captcha-form-item': true,
                    'is-show': false,
                    'before-hide': false
                } as any,
                render(prop: Ref<string>) {
                    return (
                        <div class='login-captcha-wrapper' onAnimationend={handleAnimationend}>
                            <CaptchaSlider
                                ref={_currentCaptchaRef}
                                v-model={[loginInfoFormConfig.model.codeKey, 'codeKey']}
                                {...{
                                    onClose: handleCaptchaClose,
                                    onValid: p.captchaValid
                                }}
                            />
                        </div>
                    )
                }
            },
            {
                prop: 'imageCaptchaTrack',
                span: 24,
                hide: true,
                group: [CONDITION_CREATE, VerifyType.VER_SLIDE_ACCOUNT_WORD_CLICK],
                class: {
                    'login-captcha-form-item': true,
                    'is-show': false,
                    'before-hide': false
                } as any,
                render(prop: Ref<string>) {
                    return (
                        <div class='login-captcha-wrapper' onAnimationend={handleAnimationend}>
                            <CaptchaWordClick
                                ref={_currentCaptchaRef}
                                v-model={[loginInfoFormConfig.model.codeKey, 'codeKey']}
                                {...{
                                    onClose: handleCaptchaClose,
                                    onValid: p.captchaValid
                                }}
                            />
                        </div>
                    )
                }
            }
        ]
    })

    const _isShowCaptcha = ref<boolean>(false)
    const capchaItems = loginInfoFormConfig.formItems.filter(
        (item) => item.prop === 'imageCaptchaTrack'
    )

    watch(
        () => _isShowCaptcha.value,
        (show) => {
            if (show) {
                capchaItems.forEach((item) => (item.class['is-show'] = true))
            } else {
                capchaItems.forEach((item) => (item.class['is-show'] = false))
            }
        }
    )

    function handleCaptchaClose() {
        capchaItems.forEach((item) => (item.class['before-hide'] = true))
    }

    function handleAnimationend(e: AnimationEvent) {
        if (e.animationName.includes('departure')) {
            capchaItems.forEach((item) => (item.class['before-hide'] = false))
            _isShowCaptcha.value = false
        }
    }

    function setCaptchaShow(show: boolean) {
        if (show) {
            _isShowCaptcha.value = true
        } else {
            handleCaptchaClose()
        }
    }

    function refreshCaptcha() {
        ;(_currentCaptchaRef.value as any)?.refreshCaptcha()
    }

    return {
        /**
         * 表单配置对象
         */
        loginInfoFormConfig: loginInfoFormConfig as FormProps,
        /**
         * 设置滑动验证码显示状态
         * @param type 需要改变的类型
         * @param show 显示 or 隐藏
         */
        setCaptchaShow,
        /**
         * 刷新滑动验证码
         */
        refreshCaptcha
    }
}
