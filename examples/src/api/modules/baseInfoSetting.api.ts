import { RequestConfig, REQMethods, REQParamsType } from '@jsjn/types/Request'

// 职位管理
const postMageMapping: Array<RequestConfig> = [
    {
        // 通过指定参数查找对象列表
        name: 'post_list',
        api: 'kinso-basic-resources-server/v1/post/list',
        method: REQMethods.GET
    },
    {
        // 分页查询
        name: 'post_listPage',
        api: 'kinso-basic-resources-server/v1/post/listPage',
        method: REQMethods.GET
    },
    {
        // 删除数据
        name: 'post_del',
        api: 'kinso-basic-resources-server/v1/post/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 通过ID查找具体数据
        name: 'post_query',
        api: 'kinso-basic-resources-server/v1/post/entity',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 修改数据
        name: 'post_update',
        api: 'kinso-basic-resources-server/v1/post/entity',
        method: REQMethods.PUT
    },
    {
        // 添加数据
        name: 'post_add',
        api: 'kinso-basic-resources-server/v1/post/entity',
        method: REQMethods.POST
    },
    {
        name: 'institution_listAuth',
        api: 'kinso-basic-resources-server/v1/iam-institution-info/listAuth',
        method: REQMethods.GET
    }
]

//字典管理
const dictManagerMapping: Array<RequestConfig> = [
    {
        //查询列表分页数据（树形）
        name: 'dict_listPage',
        api: 'kinso-basic-resources-server/v1/iam-sys-dict/listPageForParent',
        method: REQMethods.GET
    },

    {
        //新增数据
        name: 'dict_add',
        api: 'kinso-basic-resources-server/v1/iam-sys-dict/entity',
        method: REQMethods.POST
    },
    {
        //修改数据
        name: 'dict_mod',
        api: 'kinso-basic-resources-server/v1/iam-sys-dict/entity',
        method: REQMethods.PUT
    },
    {
        //删除数据
        name: 'dict_del',
        api: 'kinso-basic-resources-server/v1/iam-sys-dict/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        //查询实体信息
        name: 'dict_query',
        api: 'kinso-basic-resources-server/v1/iam-sys-dict/entity',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    }
]

// 卡片管理
const cardMageMapping: Array<RequestConfig> = [
    {
        // 分页查
        name: 'card_listPage',
        api: 'kinso-basic-resources-server/v1/iam-dashboard/listPage',
        method: REQMethods.GET
    },
    {
        // 全量
        name: 'card_list',
        api: 'kinso-basic-resources-server/v1/iam-dashboard/list',
        method: REQMethods.GET
    },
    {
        // 通过指定参数查找对象列表
        name: 'card_list_by_choose',
        api: 'kinso-basic-resources-server/v1/iam-dashboard/getListForChoose',
        method: REQMethods.GET
    },
    {
        // 通过ID查找具体数据
        name: 'card_obj',
        api: 'kinso-basic-resources-server/v1/iam-dashboard/entity',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 删除数据
        name: 'card_del',
        api: 'kinso-basic-resources-server/v1/iam-dashboard/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    },
    {
        // 添加数据
        name: 'card_add',
        api: 'kinso-basic-resources-server/v1/iam-dashboard/entity',
        method: REQMethods.POST
    },
    {
        // 修改数据
        name: 'card_update',
        api: 'kinso-basic-resources-server/v1/iam-dashboard/entity',
        method: REQMethods.PUT
    }
]

// 用户个人卡片
const myCardMage: Array<RequestConfig> = [
    {
        // 获取绑定的快捷入口
        name: 'my_card_get_m_list',
        api: 'kinso-basic-resources-server/v1/dashboard/getUListForChoose',
        method: REQMethods.GET
    },
    {
        // 获取绑定的展示卡片
        name: 'my_card_get_d_list',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-user/getDListForChoose',
        method: REQMethods.GET
    },
    {
        // 添加卡片
        name: 'my_card_add',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-user/entity',
        method: REQMethods.POST
    },
    {
        // 修改卡片
        name: 'my_card_update',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-user/entity',
        method: REQMethods.PUT
    },
    {
        // 删除卡片
        name: 'my_card_del',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-user/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    }
]

// 卡片参数管理
const CardParams: Array<RequestConfig> = [
    {
        // 卡片参数 list
        name: 'card_params_list',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-params/list',
        method: REQMethods.GET
    },
    {
        // 通过 id 查单个
        name: 'card_params_obj',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-params/entity',
        method: REQMethods.GET,
        paramType: REQParamsType.QUERY
    },
    {
        // 增
        name: 'card_params_add',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-params/entity',
        method: REQMethods.POST
    },
    {
        // 改
        name: 'card_params_update',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-params/entity',
        method: REQMethods.PUT
    },
    {
        // 删
        name: 'card_params_del',
        api: 'kinso-basic-resources-server/v1/iam-dashboard-params/entity',
        method: REQMethods.DELETE,
        paramType: REQParamsType.QUERY
    }
]

export default [
    ...postMageMapping,
    ...dictManagerMapping,
    ...cardMageMapping,
    ...myCardMage,
    ...CardParams
]
