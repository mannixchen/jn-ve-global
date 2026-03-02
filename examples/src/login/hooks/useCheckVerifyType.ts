import { ref, watch, computed } from 'vue'
import type { FormProps, FormItemProps } from 'jn-ve-global'
import CONDITION_CREATE from '../constant/CONDITION_CREATE_KEY'
import { VerifyType, LoginVerifySlideType } from '../constant/verifyType'
import loginErrCountKey from '../constant/loginErrCountKey'
import { Local } from '@jsjn/utils'
import { useStore } from '@/store'

/**
 * 获取登录校验人机交互的类型
 */
export default (formConfig: FormProps) => {
    const stroe = useStore()

    // 登录是否开启验证
    const loginVerify = ref<boolean>(false)
    // 登录验证方式，默认为 “密码”
    const verifyTypeCode = ref<VerifyType>(VerifyType.PASSWORD)
    /**
     * 组合式函数内部使用，只有在满足显示验证码条件时，才会抛出这个 code 值
     * 否则，外部将保持默认校验方式：PASSWORD
     */
    const _verifyTypeCode = ref<VerifyType>(VerifyType.PASSWORD)
    // 是否显示了验证码
    const isBerth = ref<boolean>(false)
    // 表单控件
    const targetVerFormItem = computed<FormItemProps>(() =>
        formConfig.formItems.find(
            (item) =>
                item.group &&
                item.group.includes(CONDITION_CREATE) &&
                item.group.includes(_verifyTypeCode.value)
        )
    )

    // 容错次数
    const faultToleranceNum = ref<number>(0)
    // 错误次数
    const errCount = ref<number>((Local.get(loginErrCountKey) as number) - 0 || 0)
    watch(
        () => errCount.value,
        (count) => {
            Local.set(loginErrCountKey, count)
        }
    )

    /**
     * 登录会有不同的验证码校验方式，目前已有：
     *  - 手机发送验证码
     *  - 接口获取图形验证码
     *
     * 根据接口返回不同的内容，创建不同的验证方式，不同的验证方式会以不同的控件展示
     * 在这里，需要筛选出
     *  - 有 group 数据
     *  - group 数据包含 CONDITION_CREATE
     *  - 且包含当前状态码（状态码唯一）的，详见：enum VerifyType
     */
    watch(
        () => [loginVerify.value, faultToleranceNum.value, errCount.value, verifyTypeCode.value],
        () => {
            // 不需要登录验证
            if (!loginVerify.value) {
                return
            }

            // 未超容错范围
            if (faultToleranceNum.value !== 0 && errCount.value < faultToleranceNum.value) {
                return
            }

            /**
             * 显示验证码
             *  - 最大容错为 0
             *  - 错误次数已超出
             */
            if (faultToleranceNum.value === 0 || errCount.value >= faultToleranceNum.value) {
                /**
                 * 显示了验证码
                 */
                if (targetVerFormItem.value) {
                    targetVerFormItem.value.hide = false
                    verifyTypeCode.value = _verifyTypeCode.value

                    // 滑动验证码不需要占位
                    if (
                        ![
                            VerifyType.VER_SLIDE_ACCOUNT_CONCAT,
                            VerifyType.VER_SLIDE_ACCOUNT_ROTATE,
                            VerifyType.VER_SLIDE_ACCOUNT_SLIDER,
                            VerifyType.VER_SLIDE_ACCOUNT_WORD_CLICK
                        ].includes(_verifyTypeCode.value)
                    ) {
                        isBerth.value = true
                    }
                }
            }
        }
    )

    // 从仓库中获取登录验证信息
    watch(
        () => stroe.state.systemSafeInfo,
        (safeInfo) => {
            const { loginVerifyNum, loginVerifyType, loginVerifySlideType } = safeInfo

            loginVerify.value = safeInfo.loginVerify
            faultToleranceNum.value = loginVerifyNum

            if (loginVerifyType === VerifyType.VER_SLIDE_ACCOUNT) {
                _verifyTypeCode.value = `${loginVerifyType}_${loginVerifySlideType}` as VerifyType
            } else {
                _verifyTypeCode.value = loginVerifyType
            }
        },
        { immediate: true, deep: true }
    )

    function increaseErrCount() {
        errCount.value++
    }

    function initErrCount() {
        errCount.value = 0
    }

    return {
        /**
         * 是否为验证码提供展示位置
         *  - 数字、短信验证码需要
         *  - 滑动类的人机交互则不需要
         */
        isBerth,
        /**
         * 登录方式
         */
        verifyTypeCode,
        /**
         * 最大容错次数
         */
        faultToleranceNum,
        /**
         * 登录错误计数
         */
        errCount,
        /**
         * 增加错误次数，每次 +1
         */
        increaseErrCount,
        /**
         * 初始化错误次数，通常在登录成功后，初始化错误次数
         */
        initErrCount
    }
}
