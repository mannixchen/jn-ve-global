import type { App } from 'vue'
import type { RequestConfig } from '@jsjn/types/Request'
import type { BaseResponse } from '@jsjn/types/Response'
import { createRequestByMapping } from './base'

type Apis = {
    [key: string]: {
        [key: string]: (params?: any) => Promise<BaseResponse>
    }
}

const modules = import.meta.glob<any>('./modules/*.ts', { eager: true })
const allApiMapping: string[] = []
export const apis = Object.keys(modules).reduce((apis: Apis, path: string) => {
    let key = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
    const module: RequestConfig[] = modules[path].default

    // 系统内唯一性校验
    module.forEach((reqConfig) => {
        const onlyKey = `Basic:{${reqConfig.api}}:${reqConfig.method}${
            reqConfig.paramType ? ':' + reqConfig.paramType : ''
        }`

        if (!allApiMapping.some((k) => k === onlyKey)) {
            allApiMapping.push(onlyKey)
        } else {
            throw new Error(`存在相同的配置 ** ${onlyKey}`)
        }
    })

    apis[key] = createRequestByMapping(module)
    return apis
}, {})

export default (app: App) => {
    app.config.globalProperties.$api = apis
}
