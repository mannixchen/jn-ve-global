import { RequestConfig, REQMethods, REQParamsType } from '@jsjn/types/Request'

// 机构管理
const orgMageMapping: Array<RequestConfig> = [
    {
        // 包含子机构树
        name: 'org_child_tree',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/institutionChildTreeList',
        method: REQMethods.GET
    },
    {
        // 区域树查询
        name: 'areaQuery',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/institutionAndAreaTree',
        method: REQMethods.GET
    },
    {
        // 根据行业查机构
        name: 'industryTreeQuery',
        api: 'kinso-basic-open-server/v1/iam-institution-info/institutionAndIndustryTree',
        method: REQMethods.GET
    },
    {
        // 根据id查询查询子机构树
        name: 'childQuery',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/institutionChildTree',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 通过ID查找具体数据
        name: 'entityQuery',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/entity',
        method: REQMethods.GET
    },
    {
        // 修改
        name: 'entityEdit',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/entityAndExtinfp',
        method: REQMethods.PUT,
        paramType: REQParamsType.JSON
    },
    {
        // 添加机构
        name: 'entityAndEdit',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/entityAndExtinfp',
        method: REQMethods.POST,
        paramType: REQParamsType.JSON
    },
    {
        // 删除机构
        name: 'deleteOrg',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 机构应用功能===选中状态
        name: 'packageActiveQuery',
        api: 'kinso-basic-resources-server/v1/iam-institution-app/list',
        method: REQMethods.GET
    },
    {
        // 查询包(应用)List
        name: 'packageQuery',
        api: 'kinso-basic-resources-server/v1/iam-institution-app/listSpecific',
        method: REQMethods.GET
    },
    {
        // 机构应用功能===批量添加
        name: 'packageAdd',
        api: 'kinso-basic-resources-server/v1/iam-institution-app/entityBatch',
        method: REQMethods.POST
    },
    {
        // 机构应用功能===删除
        name: 'packageDel',
        api: 'kinso-basic-resources-server/v1/iam-institution-app/batch',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    }
]

// 用户管理
const userMageMapping: Array<RequestConfig> = [
    {
        // 分页查询
        name: 'usermage_listPage',
        api: 'kinso-basic-resources-server/v1/iam-user-base-info/listPage',
        method: REQMethods.GET
    },
    {
        // 根据机构查用户
        name: 'org_user_list',
        api: 'kinso-basic-resources-server/v1/iam-user-base-info/listForInstitu',
        method: REQMethods.GET
    },
    {
        // 根据机构查角色(单/多)
        name: 'org_role_list',
        api: 'kinso-basic-resources-server/v1/iam-roles/listByInstituIds',
        method: REQMethods.GET
    },
    {
        // 机构角色关联用户分页查询
        name: 'usermage_role_listPage',
        api: 'kinso-basic-resources-server/v1/iam-user-role/listPageByRoleForUsers',
        method: REQMethods.GET
    },
    {
        // 通过指定参数查找对象列表
        name: 'usermage_list',
        api: 'kinso-basic-resources-server/v1/iam-user-base-info/list',
        method: REQMethods.GET
    },
    {
        // 添加数据
        name: 'usermage_add',
        api: 'kinso-basic-resources-server/v1/user/entity',
        method: REQMethods.POST
    },
    {
        // 修改数据
        name: 'usermage_update',
        api: 'kinso-basic-resources-server/v1/user/entity',
        method: REQMethods.PUT
    },
    {
        // 删除数据
        name: 'usermage_del',
        api: 'kinso-basic-resources-server/v1/user/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 通过ID查找具体数据
        name: 'usermage_query',
        api: 'kinso-basic-resources-server/v1/user/entity',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 修改密码
        name: 'usermage_reset_password',
        api: 'kinso-basic-resources-server/v1/user/resetPassword',
        method: REQMethods.POST
    },
    {
        // 重置密码
        name: 'usermage_reset_password_for_mager',
        api: 'kinso-basic-resources-server/v1/iam-user-cert/resetPasswordForManager',
        method: REQMethods.POST
    },
    {
        // 用户关联角色（机构）添加关联
        name: 'usermage_relevance_role_add',
        api: 'kinso-basic-resources-server/v1/iam-user-role/entity',
        method: REQMethods.POST
    },
    {
        // 用户关联角色（机构）删除关联
        name: 'usermage_relevance_role_del',
        api: 'kinso-basic-resources-server/v1/iam-user-role/unEntity',
        method: REQMethods.POST
    },
    {
        // 用户关联部门（添加）
        name: 'usermage_relevance_depart_add',
        api: 'kinso-basic-resources-server/v1/iam-user-base-info/addDepart',
        method: REQMethods.PUT
    },
    {
        // 用户关联部门（删除）
        name: 'usermage_relevance_depart_del',
        api: 'kinso-basic-resources-server/v1/iam-user-base-info/delDepart',
        method: REQMethods.PUT
    },
    {
        // 用户关联职务（添加）
        name: 'user_relevance_post_add',
        api: 'kinso-basic-resources-server/v1/iam-user-base-info/addPost',
        method: REQMethods.PUT
    },
    {
        // 用户关联职务（删除）
        name: 'user_relevance_post_del',
        api: 'kinso-basic-resources-server/v1/iam-user-base-info/delPost',
        method: REQMethods.PUT
    },
    {
        // 用户的权限机构列表（当前用户机构的下属机构）
        name: 'institution_auth_list',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/listForSelfAndChild',
        method: REQMethods.GET
    }
]

// 部门管理
const departMageMapping: Array<RequestConfig> = [
    // 查用户权限（我的部门） tree
    {
        name: 'depart_tree_byauth',
        api: 'kinso-basic-resources-server/v1/iam-depart/listAndChildrenByAuthTree',
        method: REQMethods.GET
    },
    {
        // 查全量
        name: 'depart_list',
        api: 'kinso-basic-resources-server/v1/depart/list',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    }, 
    {
        // 信息改
        name: 'depart_update',
        api: 'kinso-basic-resources-server/v1/iam-depart/entity',
        method: REQMethods.PUT
    },
    {
        // 部门树查询
        name: 'depTreeQuery',
        api: 'kinso-basic-resources-server/v1/iam-depart-role/listDepartForTree',
        method: REQMethods.GET
    },
    {
        // 通过ID查找具体数据(基本信息)
        name: 'depselectDataQuery',
        api: 'kinso-basic-resources-server/v1/iam-depart/entity',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 基本信息添加
        name: 'depInfoaddSave',
        api: 'kinso-basic-resources-server/v1/iam-depart/entity',
        method: REQMethods.POST
    },
    {
        // 基本信息删除
        name: 'depInfoDelete',
        api: 'kinso-basic-resources-server/v1/iam-depart/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 部门权限树
        name: 'depPermissionsQuery',
        api: 'kinso-basic-resources-server/v1/iam-app-func/funcTree',
        method: REQMethods.GET
    },
    {
        // 部门权限树选中状态
        name: 'depPermissionsActiveQuery',
        api: 'kinso-basic-resources-server/v1/iam-depart-permission/list',
        method: REQMethods.GET
    },
    {
        // 部门权限批量添加
        name: 'depPermissionsAdd',
        api: 'kinso-basic-resources-server/v1/iam-depart-permission/entityBatch',
        method: REQMethods.POST
    },
    {
        // 部门权限删除
        name: 'depPermissionsDelete',
        api: 'kinso-basic-resources-server/v1/iam-depart-permission/batch',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    }
]

// 角色管理
const roleMageMapping: Array<RequestConfig> = [
    // 部门角色
    {
        //  查全量
        name: 'depart_role_list',
        api: 'kinso-basic-resources-server/v1/iam-depart-role/list',
        method: REQMethods.GET
    },
    {
        // 分页查
        name: 'depart_role_listPage',
        api: 'kinso-basic-resources-server/v1/iam-depart-role/listPage',
        method: REQMethods.GET
    },
    {
        // 添加
        name: 'depart_role_add',
        api: 'kinso-basic-resources-server/v1/iam-depart-role/entity',
        method: REQMethods.POST
    },
    {
        // 编辑
        name: 'depart_role_update',
        api: 'kinso-basic-resources-server/v1/iam-depart-role/entity',
        method: REQMethods.PUT
    },
    {
        // 删
        name: 'depart_role_del',
        api: 'kinso-basic-resources-server/v1/iam-depart-role/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 查询角色（部门）关联的功能列表
        name: 'depart_role_relevance_func_list',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-permission/list',
        method: REQMethods.GET
    },
    {
        // 角色（部门）关联功能 - 批量添加
        name: 'depart_role_relevance_func_addBatch',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-permission/entityBatch',
        method: REQMethods.POST
    },
    {
        // 角色（部门）关联功能 - 删除
        name: 'depart_role_relevance_func_del',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-permission/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 部门角色关联的用户
        name: 'depart_role_user_listPage',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-user/listPageByRoleForUsers',
        method: REQMethods.GET
    },
    {
        // 用户关联角色（部门）删除关联
        name: 'usermage_relevance_depart_role_del',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-user/unEntity',
        method: REQMethods.POST
    },
    {
        // 用户关联角色（部门）添加关联
        name: 'usermage_relevance_depart_role_add',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-user/entity',
        method: REQMethods.POST
    },

    // 机构角色
    {
        // 查询机构角色树和用户拥有的角色
        name: 'usermage_query_institutionRoleTree',
        api: 'kinso-basic-resources-server/v1/iam-user-role/institutionRoleTree',
        method: REQMethods.GET
    },
    {
        // 分页查询
        name: 'rolemage_listPage',
        api: 'kinso-basic-resources-server/v1/iam-roles/listPage',
        method: REQMethods.GET
    },
    {
        // 通过id查找数据
        name: 'rolemage_query',
        api: 'kinso-basic-resources-server/v1/iam-roles/entity',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 通过指定参数查找对象列表
        name: 'rolemage_list',
        api: 'kinso-basic-resources-server/v1/iam-roles/list',
        method: REQMethods.GET
    },
    {
        // 修改数据
        name: 'rolemage_update',
        api: 'kinso-basic-resources-server/v1/iam-roles/entity',
        method: REQMethods.PUT
    },
    {
        // 添加数据
        name: 'rolemage_add',
        api: 'kinso-basic-resources-server/v1/iam-roles/entity',
        method: REQMethods.POST
    },
    {
        // 删除数据
        name: 'rolemage_delete',
        api: 'kinso-basic-resources-server/v1/iam-roles/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 获取角色拥有的权限
        name: 'rolemage_permisson_funcTree_quert',
        api: 'kinso-basic-resources-server/v1/iam-roles-permisson/list',
        method: REQMethods.GET
    },
    {
        // 授权批量添加
        name: 'rolemage_permisson_add',
        api: 'kinso-basic-resources-server/v1/iam-roles-permisson/entityBatch',
        method: REQMethods.POST
    },
    {
        // 授权删除
        name: 'rolemage_permisson_delete',
        api: 'kinso-basic-resources-server/v1/iam-roles-permisson/batch',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    }
]

// 角色模板
const roleTemplateMageMapping: Array<RequestConfig> = [
    {
        // 分页查询
        name: 'role_temp_mage_listPage',
        api: 'kinso-basic-resources-server/v1/iam-role-model/listPage',
        method: REQMethods.GET
    },
    {
        // 全量查
        name: 'role_temp_mage_list',
        api: 'kinso-basic-resources-server/v1/iam-role-model/list',
        method: REQMethods.GET
    },
    {
        // 修改数据
        name: 'role_temp_mage_update',
        api: 'kinso-basic-resources-server/v1/iam-role-model/entity',
        method: REQMethods.PUT
    },
    {
        // 添加数据
        name: 'role_temp_mage_add',
        api: 'kinso-basic-resources-server/v1/iam-role-model/entity',
        method: REQMethods.POST
    },
    {
        // 删除数据
        name: 'role_temp_mage_delete',
        api: 'kinso-basic-resources-server/v1/iam-role-model/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 获取角色拥有的权限
        name: 'role_temp_mage_permisson_funcTree_quert',
        api: 'kinso-basic-resources-server/v1/iam-role-model-permisson/list',
        method: REQMethods.GET
    },
    {
        // 授权批量添加
        name: 'role_temp_mage_permisson_add',
        api: 'kinso-basic-resources-server/v1/iam-role-model-permisson/entityBatch',
        method: REQMethods.POST
    },
    {
        // 授权删除
        name: 'role_temp_mage_permisson_delete',
        api: 'kinso-basic-resources-server/v1/iam-role-model-permisson/batch',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 同步
        name: 'role_temp_mage_sync',
        api: 'kinso-basic-resources-server/v1/iam-role-model/synchronization',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    }
]

export default [
    ...userMageMapping,
    ...departMageMapping,
    ...orgMageMapping,
    ...roleMageMapping,
    ...roleTemplateMageMapping
]
