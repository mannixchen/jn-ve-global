import { RequestConfig, REQMethods, REQParamsType } from '@jsjn/types/Request'

const personSetting: Array<RequestConfig> = [
    {
        // 当前用户权限机构列表查询
        name: 'setting_org_query',
        api: 'kinso-basic-resources-server/v1/org/relList',
        method: REQMethods.GET
    },
    {
        // 当前用户系统列表查询
        name: 'setting_Pcl_query',
        api: 'kinso-basic-resources-server/v1/client/outsidePcList',
        method: REQMethods.GET
    },
    //切换机构
    {
        name: 'changeInsttu',
        api: 'kinso-auth-webmvc-login-server/changeInsttu',
        method: REQMethods.POST,
        paramType: REQParamsType.QUERY
    }
]

export default [...personSetting]
