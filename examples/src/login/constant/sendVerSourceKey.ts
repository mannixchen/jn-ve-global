import { InjectionKey } from 'vue'

/**
 * 发送验证码为公用组件，但是同时应用于
 *  - 登录发送验证码
 *  - 忘记密码发送验证码
 *
 * 验证码采用 localstorage 存储，二者需要唯一的 key
 * 通过 Inject，针对不同的使用者（父级），进行设置不同的 key
 */
const sendVerSourceKey: InjectionKey<string> = Symbol('SEND_VER_SOURCE')

export default sendVerSourceKey
