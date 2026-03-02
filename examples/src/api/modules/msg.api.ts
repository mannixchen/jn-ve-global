import { RequestConfig, REQMethods, REQParamsType } from '@jsjn/types/Request'

// 消息服务
const msgMapping: Array<RequestConfig> = [
    {
        // 紧急通知
        name: 'query_announce_priority',
        api: 'kinso-bulletin-server/v1/web/message/topListPage',
        method: REQMethods.GET
    },
    {
        // 阅读公告
        name: 'read_announce',
        api: 'kinso-bulletin-server/v1/web/sender/read',
        method: REQMethods.PUT,
        paramType: REQParamsType.QUERY
    }
]

export default [...msgMapping]
