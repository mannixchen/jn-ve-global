import { AxiosResponse } from 'axios'
import excludeApis from '../constant/excludeApis'
import { isBusinessReq, printErrorMsg } from '../utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { initLoginInfo } from '@/login/utils/initCurrenLoginUserInfo'
import router from '@/router'
import { apis } from '@/api'
import { toLoginPage } from '@/login/utils/login'
import { Session } from '@jsjn/utils'
import { REPLACE_CODE, INVALID_RES_CODES } from '@jsjn/types/Response'
import store from '@/store'

const FIRST_OPEN_KEY = 'FIRST_OPEN_KEY'
let createCount = 0
/**
 * 响应拦截处理函数
 * @param res 响应结果
 * @returns
 */
export default async function interceptorsResHandle(res: AxiosResponse) {
    // 非登录请求响应
    if (isBusinessReq(res.config.url as string, excludeApis)) {
        /**
         * 接口不成功响应会有多种情况：
         *  - 登录超时，token 失效：应跳转登录页
         *  - 接口无授权：跳转首页，并提示
         *
         * INVALID_RES_CODES 列表内都属于不成功
         */
        if (INVALID_RES_CODES.includes(res.data.code)) {
            // 校验登录是否失效
            const isDevitalize = await apis.common['checkLogin']()

            // 响应结果的 data 只有 === true 时，才是登录有效的
            if (isDevitalize.data !== true) {
                // 首次打开系统，会加载 '/' 首页，如果登录无效，会在登录页弹出消息提醒，这里判断是否是浏览器首次打开系统
                if (Session.get(FIRST_OPEN_KEY) !== null) {
                    /**
                     * 被挤掉线，弹出警告框，只能退出到登录页
                     */
                    if (res.data.code === REPLACE_CODE) {
                        /**
                         * 这里针对并发的多个请求，如果有一个已经弹出了确认框，后续请求不需要再弹出
                         * 当然最好的方式是一旦有哪个请求返回被挤掉，后续应该不再发送请求了（这里的处理依然会发送请求）
                         * 如果基于 store.isReplaced 操作的话，会受到仓库持久化的影响，导致刷新后，所有的请求都发不出去
                         * 没有请求发送，也就不会弹出被挤掉的确认框
                         * 
                         * 这里属于偷懒行为，如果有更好的方案，请替换
                         */
                        if (createCount++ >= 1) {
                            // 这个 reject 掉，避免走用户的 .then，产生数据安全隐患；
                            return Promise.reject(res.data.msg)
                        }

                        store.commit('currentStatus/setIsReplaced', true)

                        let adverseInfo = null
                        try {
                            adverseInfo = JSON.parse(res.data.msg)
                        } catch (error) {
                            console.log(`%c 解析 json 出错: `, 'color: #f56c6c;', error)
                        }

                        /**
                         * 这里要阻塞住请求，避免用户刷新页面
                         * 如果用户刷新了页面，系统请求 menuTree 接口时，接口非正常返回会定位到 500 页面
                         * 这里阻塞请求的话，会阻塞住 menuTree 接口，防止重定向到 500 页面
                         * 同时，也可以防止多个并发的请求，首个请求响应后，后续继续请求的问题
                         */
                        await ElMessageBox.confirm(
                            `<p>${adverseInfo?.message}</p>
                             <p>地址: ${adverseInfo?.address}</p>
                             <p>ip: ${adverseInfo?.ip}</p>`,
                            '警告',
                            {
                                confirmButtonText: '确认',
                                type: 'error',
                                center: true,
                                lockScroll: true,
                                dangerouslyUseHTMLString: true,
                                showCancelButton: false,
                                closeOnClickModal: false,
                                closeOnPressEscape: false,
                                showClose: false
                            }
                        ).then(async () => {
                            createCount = 0
                            /**
                             * ********** 客观跳转 *********************
                             * 登录失效（被挤掉）情况下
                             * 初始化登录信息
                             * 可能存在会登录其他账户的情况，不需要清空用户信息
                             */
                            initLoginInfo()
                            // 跳转登录页
                            const fromPath = router.currentRoute.value.path
                            if (fromPath !== '/login') {
                                await toLoginPage()
                                Session.set(FIRST_OPEN_KEY, false)
                            }
                        })

                        return res.data
                    }

                    ElMessage.warning('登录失效，请重新登录！')
                }

                /**
                 * ********** 被动跳转 *********************
                 * 登录失效（被挤掉）情况下
                 * 初始化登录信息
                 * 可能存在会登录其他账户的情况，不需要清空用户信息
                 */
                initLoginInfo()
                // 跳转登录页
                const fromPath = router.currentRoute.value.path
                if (fromPath !== '/login') {
                    await toLoginPage()
                    Session.set(FIRST_OPEN_KEY, false)
                }

                return res.data
            } else {
                ElMessage.warning('无有效授权，请联系管理员')
                router.replace('/')
                return res.data
            }
        }

        // 非成功，消息提示
        if (res.data.code && res.data.code !== '000000') {
            printErrorMsg(res.data?.msg)
            if (res.status === 200) return res.data
            return res
        }
    }

    if (res.status === 200) return res.data
    return res
}
