import { humpObj2PartitionObj, Local } from '@jsjn/utils'

export function getVuexCache() {
    return Local.get('vuex')
}

export function getToken() {
    const token = getVuexCache()?.loginInfo?.['access_token']
    return token
}
