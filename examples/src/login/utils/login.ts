/*
 * @Author: Zyunchao 18651805393@163.com
 * @Date: 2022-11-16 17:05:44
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2023-08-04 11:22:24
 * @FilePath: /@jsjn-librar-monorepo/examples/src/login/utils/login.ts
 * @Description: 登录的核心逻辑：
 *  - 登录过期验证
 *  - 登录请求
 *  - 设置登录信息
 *  - 登录重定向
 *  - 获取后台设置的登录页方向
 */
import { BaseResponse } from '@jsjn/types/Response'
import store from '@/store'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { apis } from '@/api'
import { Base64 } from 'js-base64'
import initCurrenLoginUserInfo from './initCurrenLoginUserInfo'
import prefix from '@/api/prefix'
import { nextTick } from 'vue'

export interface LoginParams {
    account: string
    address: string
    clientId: string
    clientSecret: string
    codeKey: string
    imageCaptchaTrack: object | null
    ip: string
    loginType: string
    password: string
    smsVerificationCode: string
    verificationCode: string
}

export interface LoginUrlQuery {
    from?: string
    appKey?: string
    token?: string
}

/**
 * 登录是否有效，有 token 就认为登录有效
 * @returns 是否超时
 */
export function isTimeout(): boolean {
    const { access_token } = store.state.loginInfo
    return !access_token
}

export type LoginType = {
    type: 'login'
    params: LoginParams
    target?: string
}

/**
 * 登录请求主体
 * @param type 登录
 * @param params 登录时需要传入参数
 * @param target 要跳转的初始页面，默认 '/'
 * @returns
 */
export default async function (props: LoginType) {
    /**
     * 判断是同一用户重新登录（登录超时），还是新用户登录
     * 获取之前未清空的用户信息
     *  1. undefind 未登录过用户，不做处理
     *  2. string 已存在登录用户，比对
     */
    const preUserLoginName = store.state.currentUserInfo.accountInfo.loginName
    const currentUserLoginName = (props as LoginType).params.account

    const params = props.params
    const urlQuery: LoginUrlQuery = router.currentRoute.value.query

    // 发送登录请求
    const loginRes = await apis.common.login(params)

    // 错误阻断
    if (loginRes.code !== '000000') {
        ElMessage.error(loginRes.msg ? loginRes.msg : 'login error from login.ts:142')
        return loginRes
    }

    // 缓存此次登录：access_token
    store.commit('loginInfo/setLoginInfo', {
        'access_token': loginRes.data.token
    })

    // 缓存登录用户信息：2023-3-21 新增
    if (loginRes.data.vo && Object.keys(loginRes.data.vo).length > 0) {
        store.commit('currentUserInfo/setCurrentUserInfoProcessed', loginRes.data.vo)
        store.commit('currentStatus/setUserInfoUpdated', true)
    }

    // 获取字典表
    store.dispatch('sysDict/updateSysDictList')

    // 登录成功，初始化系统的被顶掉的状态值
    store.commit('currentStatus/setIsReplaced', false)

    /**
     * 初始页面：
     * 登录成功后要前往的初始页面，取决于 login 是否传递了 target 参数
     *  - 首页：'/'
     */
    const rootPath = '/'
    const homePath = '/home'
    const initPath = props.target || rootPath

    /**
     * 登录成功后存在两种情况：
     *  - 用户登录超时：需要返回之前的业务操作页
     *  - 首次登录或主动退出：这种情况 login 页都是不带 from 参数的，需要跳转到初始页，如上
     *
     * 依据登录页的路由参数是否带有 from 判定
     */
    const fromPath = urlQuery.from
    let decodePath = fromPath ? Base64.decode(fromPath) : initPath

    /**
     * 页面初始进入时，是进入首页 '/' 的，这时如果登录失效，返回登录时，也会携带 from 参数
     * 这样就导致，进入系统，永远会在 '/' 与 login 页之间切换
     * 而监管期望的是，进入首页之前，进入选择系统页，也就是说监管的系统进入首页的唯一途径是通过选择系统页
     * 这里可以大胆的改变 decodePath
     *  - 如果是首页，就选取 initPath
     *  - 上方流程已经判断 如果未传递 target，initPath 依旧是 '/'
     */
    decodePath = decodePath === rootPath || decodePath === homePath ? initPath : decodePath

    // 如果与上一登录用户不同，清空信息，且跳转到初始页面
    if (preUserLoginName) {
        if (preUserLoginName !== currentUserLoginName) {
            initCurrenLoginUserInfo()
            decodePath = initPath
        }
    } else {
        // 无登录信息，首次登录
        decodePath = initPath
    }

    // 这里延迟跳转是为了保证外部在接口响应之后的处理能够正常处理完成；
    nextTick(() => {
        router.replace(decodePath)
    })

    return loginRes
}

/**
 * 前往登录页的方法，异步的
 *  - '/login'
 *  - 第三方登录
 * 注意：退出时，需要跳转回主系统
 * @param source
 */
export const localLoginPath = '/login'
export async function toLoginPage() {
    let loginUrl: string = localLoginPath
    const fromPath = '/'

    let replaceParams = {}
    if (loginUrl === localLoginPath) {
        replaceParams = {
            path: loginUrl,
            query: {
                from: Base64.encode(fromPath)
            }
        }
    } else if (loginUrl) {
        replaceParams = {
            path: loginUrl
        }
    } else {
        replaceParams = {
            path: localLoginPath,
            query: {
                from: Base64.encode(fromPath)
            }
        }
    }

    router.replace(replaceParams)
}
