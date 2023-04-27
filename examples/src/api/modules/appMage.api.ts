import { RequestConfig, REQMethods, REQParamsType } from '@jsjn/types/Request'

// 应用功能
const appFuncMapping: Array<RequestConfig> = [
    {
        // 查功能树（应用功能管理）
        name: 'app_func_funcTree',
        api: 'kinso-basic-resources-server/v1/iam-app-func/appAndFuncTree',
        method: REQMethods.GET
    },
    {
        // 查功能树（用户权限树）
        name: 'app_func_menuTree',
        api: 'kinso-basic-resources-server/v1/home/menuTree',
        method: REQMethods.GET
    },
    {
        // 查list
        name: 'app_func_list',
        api: 'kinso-basic-resources-server/v1/iam-app-func/list',
        method: REQMethods.GET
    },
    {
        // 分页查
        name: 'app_func_listPage',
        api: 'kinso-basic-resources-server/v1/iam-app-func/list/listPage',
        method: REQMethods.GET
    },
    {
        // 添加
        name: 'app_func_add',
        api: 'kinso-basic-resources-server/v1/iam-app-func/entity',
        method: REQMethods.POST
    },
    {
        // 修改
        name: 'app_func_update',
        api: 'kinso-basic-resources-server/v1/iam-app-func/entity',
        method: REQMethods.PUT
    },
    {
        // 删除
        name: 'app_func_delete',
        api: 'kinso-basic-resources-server/v1/iam-app-func/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 查单个
        name: 'app_func_query',
        api: 'kinso-basic-resources-server/v1/iam-app-func/entity',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    }
]

// 应用数据权限
const appFuncDataRuleMapping: Array<RequestConfig> = [
    {
        // 分页
        name: 'af_data_rule​_listPage',
        api: 'kinso-basic-resources-server/v1/iam-app-func-data-rule/listPage',
        method: REQMethods.GET
    },
    {
        // 全量
        name: 'af_data_rule​_list',
        api: 'kinso-basic-resources-server/v1/iam-app-func-data-rule/list',
        method: REQMethods.GET
    },
    {
        // 删除
        name: 'af_data_rule​_del',
        api: 'kinso-basic-resources-server/v1/iam-app-func-data-rule/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 添加
        name: 'af_data_rule​_add',
        api: 'kinso-basic-resources-server/v1/iam-app-func-data-rule/entity',
        method: REQMethods.POST
    },
    {
        // 修改
        name: 'af_data_rule​_update',
        api: 'kinso-basic-resources-server/v1/iam-app-func-data-rule/entity',
        method: REQMethods.PUT
    },
    {
        // 部门 已绑定数据权限列表
        name: 'depart_dataRule_listPage',
        api: 'kinso-basic-resources-server/v1/iam-depart-permission/listRules',
        method: REQMethods.GET
    },
    {
        // 部门 数据权限（添加）
        name: 'depart_dataRule_add',
        api: 'kinso-basic-resources-server/v1/iam-depart-permission/addRule',
        method: REQMethods.PUT
    },
    {
        // 部门 数据权限（删除）
        name: 'depart_dataRule_del',
        api: 'kinso-basic-resources-server/v1/iam-depart-permission/delRule',
        method: REQMethods.PUT
    },
    {
        // 部门角色 已绑定数据权限列表
        name: 'depart_role_dataRule_listPage',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-permission/listRules',
        method: REQMethods.GET
    },
    {
        // 部门角色 数据权限（添加）
        name: 'depart_role_dataRule_add',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-permission/addRule',
        method: REQMethods.PUT
    },
    {
        // 部门角色 数据权限（删除）
        name: 'depart_role_dataRule_del',
        api: 'kinso-basic-resources-server/v1/iam-depart-role-permission/delRule',
        method: REQMethods.PUT
    },
    {
        // 机构角色 已绑定数据权限列表
        name: 'institu_role_dataRule_listPage',
        api: 'kinso-basic-resources-server/v1/iam-roles-permisson/listRules',
        method: REQMethods.GET
    },
    {
        // 机构角色 数据权限（添加）
        name: 'institu_role_dataRule_add',
        api: 'kinso-basic-resources-server/v1/iam-roles-permisson/addRule',
        method: REQMethods.PUT
    },
    {
        // 机构角色 数据权限（删除）
        name: 'institu_role_dataRule_del',
        api: 'kinso-basic-resources-server/v1/iam-roles-permisson/delRule',
        method: REQMethods.PUT
    },
    {
        // 应用功能的数据规则列表
        name: 'app_func_dateRoule_listPage',
        api: 'kinso-basic-resources-server/v1/iam-app-func-data-rule/listForFuncPage',
        method: REQMethods.GET
    },
    {
        // 机构角色模板 已绑定数据权限列表
        name: 'institu_role_model_dataRule_listPage',
        api: 'kinso-basic-resources-server/v1/iam-role-model-permisson/listRule',
        method: REQMethods.GET
    },
    {
        // 机构角色模板 数据权限（添加）
        name: 'institu_role_model_dataRule_add',
        api: 'kinso-basic-resources-server/v1/iam-role-model-permisson/addRule',
        method: REQMethods.PUT
    },
    {
        // 机构角色模板 数据权限（删除）
        name: 'institu_role_model_dataRule_del',
        api: 'kinso-basic-resources-server/v1/iam-role-model-permisson/delRule',
        method: REQMethods.PUT
    }
]

// 应用注册（应用管理）
const appMageMapping: Array<RequestConfig> = [
    // app 全量 list
    {
        name: 'app_list',
        api: 'kinso-basic-resources-server/v1/iam-app/list',
        method: REQMethods.GET
    },
    //查询列表分页数据
    {
        name: 'app_listPage',
        api: 'kinso-basic-resources-server/v1/iam-app/listPage',
        method: REQMethods.GET
    },
    //新增数据
    {
        name: 'app_add',
        api: 'kinso-basic-resources-server/v1/iam-app/entity',
        method: REQMethods.POST
    },
    //修改数据
    {
        name: 'app_mod',
        api: 'kinso-basic-resources-server/v1/iam-app/entity',
        method: REQMethods.PUT
    },
    //删除数据
    {
        name: 'app_del',
        api: 'kinso-basic-resources-server/v1/iam-app/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    // 应用类型查询
    {
        name: 'app_type_query',
        api: 'kinso-basic-resources-server/v1/iam-client/list',
        method: REQMethods.GET
    }
]

// 应用包（应用包管理）
const appPackageMapping: Array<RequestConfig> = [
    //查询列表分页数据
    {
        name: 'app_listPage_package',
        api: 'kinso-basic-resources-server/v1/iam-app-package/listPage',
        method: REQMethods.GET
    },
    // 查询：全量列表
    {
        name: 'app_package_list',
        api: 'kinso-basic-open-server/v1/iam-app-package/list',
        method: REQMethods.GET
    },
    //新增
    {
        name: 'app_package_add',
        api: 'kinso-basic-resources-server/v1/iam-app-package/entity',
        method: REQMethods.POST
    },
    //修改
    {
        name: 'app_package_update',
        api: 'kinso-basic-resources-server/v1/iam-app-package/entity',
        method: REQMethods.PUT
    },
    // 删除
    {
        name: 'app_package_delete',
        api: 'kinso-basic-resources-server/v1/iam-app-package/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    //授权查询列表分页数据
    {
        name: 'app_listPage_auth',
        api: 'kinso-basic-resources-server/v1/iam-app-package-relationship/listPageForUsed',
        method: REQMethods.GET
    },
    //授权列表单个添加关联
    {
        name: 'app_auth_add',
        api: 'kinso-basic-resources-server/v1/iam-app-package-relationship/entity',
        method: REQMethods.POST
    },
    //授权列表单个删除关联
    {
        name: 'app_auth_del',
        api: 'kinso-basic-resources-server/v1/iam-app-package-relationship/unEntity',
        method: REQMethods.POST
    },
    //授权新增 查询列表
    {
        name: 'app_listPage_add_auth',
        api: 'kinso-basic-resources-server/v1/iam-app-package-relationship/listPageForUnUsed',
        method: REQMethods.GET
    }
]

export default [
    ...appFuncMapping,
    ...appMageMapping,
    ...appFuncDataRuleMapping,
    ...appPackageMapping
]
