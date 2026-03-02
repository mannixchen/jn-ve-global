import {
    CurrentUserInfo,
    LoginInfo,
    AppFuncTree,
    CurrentStatus,
    SysDict,
    SystemSafeInfo
} from './index'

export default interface RootStateTypes {
    currentUserInfo: CurrentUserInfo
    loginInfo: LoginInfo
    appFuncTree: AppFuncTree
    currentStatus: CurrentStatus
    sysDict: SysDict
    systemSafeInfo: SystemSafeInfo
}
