import { ref, Ref } from 'vue'
import { Base64 } from 'js-base64'
import { FormProps } from 'jn-ve-global'
import { VerifyType, VerifyTypeMapping } from '../constant/verifyType'
import { BaseResponse } from '@jsjn/types/Response'
import { getIpsByPconline } from '@/utils/getIPs'
import type { IpsByPconline } from '@/utils/getIPs'
import loginHandle from '../utils/login'
import type { LoginParams } from '../utils/login'
import { myEncryptPwd } from '../utils/encryptionPWD'

/**
 * @param loginInfoFormConfig 登录表单配置对象
 * @param verifyTypeCode 获取当前登录验证码的方式
 * @param isLogined 是否发送过登录请求的标识
 * @param target 要前往的初始页面，一般来说是首页 '/'，默认不填
 * @param successfulCb 登录请求完成后（不知道成功与否）的回调
 * @returns void
 */
export default (
    loginInfoFormConfig: FormProps,
    verifyTypeCode: Ref<VerifyType>,
    isLogined: Ref<number>,
    target?: string,
    successfulCb?: (result: BaseResponse) => void
) => {
    // 获取网络 ip，仅限外网，只有在登录页才需要获取 ip，其他模块不需要
    const ipInfo = ref<IpsByPconline>(null)
    getIpsByPconline((ips) => {
        ipInfo.value = ips
    })

    // 按钮加载
    const btnLoading = ref<boolean>(false)

    // 按钮点击
    const handle = async () => {
        const formValidateRes = await loginInfoFormConfig.instance.validate()

        if (formValidateRes) {
            btnLoading.value = true

            const params = {
                ...loginInfoFormConfig.model,
                password: myEncryptPwd(loginInfoFormConfig.model.password),
                loginType: VerifyTypeMapping[verifyTypeCode.value],
                clientId: import.meta.env.VITE_CLIENT_ID,
                clientSecret: import.meta.env.VITE_CLIENT_SECRET,
                ip: ipInfo.value?.ip || null,
                address: ipInfo.value?.addr || null
            } as LoginParams

            // 登录
            return await loginHandle({
                type: 'login',
                params: params as any,
                target
            })
                .then((res) => {
                    successfulCb?.(res)
                    return res
                })
                .finally(() => {
                    btnLoading.value = false
                    isLogined.value = +new Date()
                })
        }
    }

    return {
        handle,
        btnLoading
    }
}
