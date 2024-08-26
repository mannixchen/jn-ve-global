import { humpObj2PartitionObj, Local } from '@jsjn/utils'

export const vuexCache = Local.get('vuex')

export const token = vuexCache?.loginInfo?.['access_token']
