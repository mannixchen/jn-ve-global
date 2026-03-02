import UserInfo from '@jsjn/types/entity/UserInfo'
import ClientChannel from '@jsjn/types/entity/ClientChannel'
import Department from '@jsjn/types/entity/Department'
import OrgInfo from '@jsjn/types/entity/OrgInfo'
import Post from '@jsjn/types/entity/Post'
import RoleInfo from '@jsjn/types/entity/RoleInfo'

export default interface CurrentUserInfo {
    /**
     * 账户信息
     */
    accountInfo: UserInfo
    /**
     * 客户端信息
     */
    clientInfo: ClientChannel
    /**
     * 部门列表
     */
    departList: Department[]
    device: string
    /**
     * 机构信息
     */
    instituInfo: OrgInfo
    /**
     * 登录信息
     */
    loginInfo: any
    /**
     * 职务列表
     */
    postList: Post[]
    /**
     * 角色列表
     */
    roleList: RoleInfo[]
    /**
     * 角色模板列表
     */
    roleModelList: any
    /**
     * 角色部门列表
     */
    roleDepartList: any
    /**
     * 是否需要更改密码，基于首次登录
     */
    passwordNeedEdit: boolean
    /**
     * 是否需要提醒修改密码
     */
    passwordNeedEditRemind: boolean
}
