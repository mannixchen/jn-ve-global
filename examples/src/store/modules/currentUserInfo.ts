import { Module } from 'vuex'
import UserInfo from '@jsjn/types/entity/UserInfo'
import ClientChannel from '@jsjn/types/entity/ClientChannel'
import OrgInfo from '@jsjn/types/entity/OrgInfo'
import { assignOwnProp } from '@jsjn/utils'
import { CurrentUserInfo, RootStateTypes } from '../interface'

const currentUserInfo: Module<CurrentUserInfo, RootStateTypes> = {
    namespaced: true,
    state() {
        return {
            device: '',
            accountInfo: {} as UserInfo,
            clientInfo: {} as ClientChannel,
            instituInfo: {} as OrgInfo,
            loginInfo: {},
            departList: [],
            postList: [],
            roleList: [],
            roleModelList: [],
            roleDepartList: [],
            passwordNeedEdit: false,
            passwordNeedEditRemind: false
        }
    },
    mutations: {
        setCurrentUserInfo(state, data) {
            assignOwnProp(state, data)
        },
        /**
         * 加工处理过源数据后，赋值给 state
         * @param state
         * @param data
         */
        setCurrentUserInfoProcessed(state, data) {
            /**
             * 分别从新接口字段account、org拼接loginInfo
             */
            const loginNewInfo = {
                instituId: data.org?.instituId,
                instituName: data.org?.name,
                loginName: data.account?.loginName,
                userId: data.account?.userId,
                userName: data.account?.name
            }

            const temp: CurrentUserInfo = {
                accountInfo: data.account,
                /**
                 * 客户端信息
                 */
                clientInfo: data.client,
                /**
                 * 部门列表
                 */
                departList: data.departList,
                device: data.device,
                /**
                 * 机构信息
                 */
                instituInfo: data.org,
                /**
                 * 登录信息
                 */
                loginInfo: loginNewInfo,
                /**
                 * 职务列表
                 */
                postList: data.postList,
                roleList: data.roleList,
                roleModelList: data.roleModelList,
                roleDepartList: data.roleDepartList,
                passwordNeedEdit: data.passwordNeedEdit,
                passwordNeedEditRemind: data.passwordNeedEditRemind
            }

            assignOwnProp(state, temp)
        }
    },
    actions: {}
}

export default currentUserInfo
