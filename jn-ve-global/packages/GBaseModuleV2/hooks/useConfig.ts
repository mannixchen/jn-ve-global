/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-10-14 13:48:29
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2024-10-24 11:18:56
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/packages/GBaseModuleV2/hooks/useConfig.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import myAxios from '../../_http/http'
import { BaseModuleProps, SavedConfig } from '../interface'
import { ref, Ref } from 'vue'

interface Info {
    inionId: string
    userId: string
}

export const useConfig = (props: BaseModuleProps, savedConfig: Ref<SavedConfig>) => {
    console.log('useConfig', savedConfig)
    const { siteAccountId: userId, siteOrgId: inionId } =
        JSON.parse(localStorage.getItem('vuex') ?? '{}')?.currentUserInfo?.loginInfo ?? {}

    const { id } = props

    const clientId = window['__SITE_ID__']

    const needGetSavedConfig = ref<boolean>(
        props.needSavedConfig && (!!props?.columnsConfigurable || !!props?.searchFormProps)
        // || (props?.sortable && props?.tableColumns?.some((item) => !item.unsortable))
    )

    const savedConfigResolved = ref<boolean>(!needGetSavedConfig.value)

    const getSavedConfig = async () => {
        // let savedConfig
        const res = await myAxios('/kinso-manager-server/v1/web/configIndPage/query', {
            method: 'GET',
            params: {
                userId,
                inionId,
                pageId: id,
                clientId
            }
        }).finally(() => {})

        savedConfigResolved.value = true
        if ((res as any).code === '000000') {
            // savedConfig = JSON.parse((res as any)?.data ?? '{}')
            let { columns = [], searchConditions = [] } = JSON.parse((res as any)?.data ?? '{}')
            if (searchConditions?.length > 0) {
                searchConditions[0].render = () => '当'
            }
            savedConfig.value = {
                columns,
                searchConditions
            }
            // savedConfig.columns = columns
            // savedConfig.searchConditions = searchConditions
            // savedConfig.value = JSON.parse((res as any)?.data ?? '{}')
            // return savedConfig
        }
    }

    const setSavedConfig = () => {
        myAxios('/kinso-manager-server/v1/web/configIndPage/update', {
            method: 'PUT',
            data: {
                userId,
                inionId,
                pageId: id,
                clientId,
                configJson: JSON.stringify(savedConfig.value ?? {})
            }
        })
    }

    return {
        needGetSavedConfig,
        savedConfigResolved,
        getSavedConfig,
        setSavedConfig
    }
}
