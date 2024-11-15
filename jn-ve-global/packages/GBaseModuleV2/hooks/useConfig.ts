/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-10-14 13:48:29
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2024-11-11 16:53:03
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/packages/GBaseModuleV2/hooks/useConfig.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import myAxios from '../../_http/http'
import { BaseModuleProps, SavedConfig, BaseModuleColumnProps } from '../interface'
import { ref, Ref } from 'vue'

interface Info {
    inionId: string
    userId: string
}

export const useConfig = (props: BaseModuleProps, savedConfig: Ref<SavedConfig>) => {
    console.log('useConfig', props, savedConfig)
    const { siteAccountId: userId, siteOrgId: inionId } =
        JSON.parse(localStorage.getItem('vuex') ?? '{}')?.currentUserInfo?.loginInfo ?? {}

    const { id } = props

    const showColumns = ref<BaseModuleColumnProps[]>(props.tableColumns)

    const clientId = window['__SITE_ID__']

    const needGetSavedConfig = ref<boolean>(
        props.needSavedConfig && (!!props?.columnsConfigurable || !!props?.searchFormProps)
        // || (props?.sortable && props?.tableColumns?.some((item) => !item.unsortable))
    )

    const savedConfigResolved = ref<boolean>(!needGetSavedConfig.value)

    const setColumns = () => {
        if (!savedConfig?.value?.columns?.length) return
        const hasOperationColumn = showColumns.value?.some(
            (item) => item.prop === 'opertion' && item.label === '操作'
        )
        const hasExpandColumn = showColumns.value.some((item) => item?.type === 'expand')
        const savedColumns = savedConfig?.value?.columns?.map((item) => {
            const column = showColumns.value?.find((ele) => ele?.prop === item?.prop)
            return {
                ...column,
                ...item
            }
        })

        showColumns.value = hasOperationColumn
            ? [
                ...savedColumns,
                showColumns.value.find(
                    (item) => item.prop === 'opertion' && item.label === '操作'
                )
            ]
            : savedColumns
        showColumns.value = hasExpandColumn
            ? [showColumns.value.find((item) => item?.type === 'expand'), ...showColumns.value]
            : showColumns.value
    }

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
            let { columns = [], searchConditions = [], sortOptions = [] } = JSON.parse((res as any)?.data ?? '{}')
            if (searchConditions?.length > 0) {
                searchConditions[0].render = () => '当'
            }
            savedConfig.value = {
                columns,
                searchConditions,
                sortOptions
            }

            setColumns()
            // savedConfig.columns = columns
            // savedConfig.searchConditions = searchConditions
            // savedConfig.value = JSON.parse((res as any)?.data ?? '{}')
            // return savedConfig
        }
    }

    const setSavedConfig = () => {
        console.log('setSavedConfig')
        if (!props.needSavedConfig) return
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
        showColumns,
        getSavedConfig,
        setSavedConfig
    }
}
