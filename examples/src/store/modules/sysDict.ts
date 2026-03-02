import { Module } from 'vuex'
import { SysDict, RootStateTypes } from '../interface'
import { default as SysDictEntity } from '@jsjn/types/entity/SysDict'
import { BaseResponse } from '@jsjn/types/Response'
import { ElMessage } from 'element-plus'
import prefix from '@/api/prefix'
import axios from 'axios'
import reqErrorText from '@/constants/reqErrorText'

const loginInfo: Module<SysDict, RootStateTypes> = {
    namespaced: true,
    state() {
        return {
            list: []
        }
    },
    mutations: {
        setSysDictList(state, sysDictLisst: SysDictEntity[]) {
            state.list = sysDictLisst
        }
    },
    actions: {
        /**
         * 注意：在封装好的 axios 实例中，应用了 stroe，导致循环引用，产生不可控错误
         * 故，在 actions 中的一切请求都不能使用封装号的 axios，都需要使用原生的 axios
         * 同时，请求地址应该注意代理前缀的配置
         */
        updateSysDictList({ commit, rootState }, refreshFlag) {
            const access_token = rootState.loginInfo.access_token
            if (!access_token) return

            // 后台网关代理转发
            const headers = {
                Authorization: `Bearer ${access_token}`
            }

            axios
                .get(`${prefix}/kinso-basic-resources-server/v1/dict/list`, {
                    headers
                })
                .then((axiosRes) => {
                    if (axiosRes.status === 200) {
                        if ((axiosRes.data as BaseResponse).code === '000000') {
                            commit('setSysDictList', axiosRes.data.data)
                            // 系统标识字典数据更新完毕
                            commit('currentStatus/setSysdictUpdated', true, { root: true })
                        } else {
                            // ElMessage.error((axiosRes.data as BaseResponse).msg)
                        }
                    }
                })
                .catch((err) => {
                    // ElMessage.error(`${err}`)
                    ElMessage.error(reqErrorText.AXIOS_ERRS)
                })
        }
    }
}

export default loginInfo
