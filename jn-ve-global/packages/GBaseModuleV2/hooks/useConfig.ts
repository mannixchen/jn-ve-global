/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-10-14 13:48:29
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-12-22 15:43:30
 * @FilePath: /@jsjn-librar-monorepo/jn-ve-global/packages/GBaseModuleV2/hooks/useConfig.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import myAxios from '../../_http/http'
import { BaseModuleProps, SavedConfig, BaseModuleColumnProps } from '../interface'
import { ref, Ref } from 'vue'
import { cloneDeep } from 'lodash'
import { excludedColumnTypes } from '../constant'

interface Info {
    inionId: string
    userId: string
}

export const isExcludedColumn = (columnProps: BaseModuleColumnProps) => {
    const { prop = '', label = '', type } = columnProps
    return (prop === 'opertion' && label === '操作') || (type && excludedColumnTypes.includes(type))
}

// 判断是否多级表头
export const isTreeStructureColumns = (columns: BaseModuleColumnProps[]): boolean => {
    // 使用递归函数检查是否存在嵌套的children属性
    function hasNestedChildren(items) {
        for (const item of items) {
            // 判断当前元素是否有children属性且为数组
            if (item?.children && Array.isArray(item?.children)) {
                // 如果children数组不为空，或者其中还包含有children的元素，则认为是树形结构
                if (
                    item?.children?.length > 0 ||
                    item?.children?.some(
                        (child) => child?.children && Array.isArray(child?.children)
                    )
                ) {
                    return true
                }
            }
        }
        return false
    }

    return hasNestedChildren(columns)
}

export const useConfig = (props: BaseModuleProps, savedConfig: Ref<SavedConfig>) => {
    // console.log('useConfig', props, savedConfig)
    const { siteAccountId: userId, siteOrgId: inionId } =
        JSON.parse(localStorage.getItem('vuex') ?? '{}')?.currentUserInfo?.loginInfo ?? {}

    const { id } = props

    const showColumns = ref<BaseModuleColumnProps[]>(props.tableColumns)

    // 导出列
    const exportedColumns = ref<BaseModuleColumnProps[]>(
        props.exportedColumns ??
            cloneDeep(props.tableColumns?.filter((item) => !isExcludedColumn(item))) ??
            []
    )
    const exporting = ref<boolean>(false)

    const clientId = window['__SITE_ID__']

    const needGetSavedConfig = ref<boolean>(
        props.needSavedConfig &&
            ((!!props?.columnsConfigurable && !isTreeStructureColumns(showColumns.value)) ||
                !!props?.searchFormProps)
        // || (props?.sortable && props?.tableColumns?.some((item) => !item.unsortable))
    )

    const savedConfigResolved = ref<boolean>(!needGetSavedConfig.value)

    const setColumns = () => {
        if (!savedConfig?.value?.columns?.length) return
        const hasOperationColumn = showColumns.value?.some(
            (item) => item.prop === 'opertion' && item.label === '操作'
        )
        // const hasExpandColumn = showColumns.value.some((item) => item?.type === 'expand')
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
        // showColumns.value = hasExpandColumn
        //     ? [showColumns.value.find((item) => item?.type === 'expand'), ...showColumns.value]
        //     : showColumns.value
        showColumns.value = [
            ...(showColumns.value?.filter((item) => excludedColumnTypes.includes(item?.type)) ??
                []),
            ...showColumns.value
        ]
    }

    const setExportColumns = () => {
        if (!savedConfig?.value?.exportColumns?.length) return
        // const hasOperationColumn = exportedColumns.value?.some(
        //     (item) => item.prop === 'opertion' && item.label === '操作'
        // )
        // const hasExpandColumn = exportedColumns.value.some((item) => item?.type === 'expand')
        const savedColumns = savedConfig?.value?.columns?.map((item) => {
            const column = exportedColumns.value?.find((ele) => ele?.prop === item?.prop)
            return {
                ...column,
                ...item
            }
        })

        exportedColumns.value = savedColumns

        // exportedColumns.value = hasOperationColumn
        //     ? [
        //         ...savedColumns,
        //         exportedColumns.value.find(
        //             (item) => item.prop === 'opertion' && item.label === '操作'
        //         )
        //     ]
        //     : savedColumns
        // exportedColumns.value = hasExpandColumn
        //     ? [
        //         exportedColumns.value.find((item) => item?.type === 'expand'),
        //         ...exportedColumns.value
        //     ]
        //     : exportedColumns.value
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
            let {
                columns = [],
                searchConditions = [],
                sortOptions = [],
                exportColumns = []
            } = JSON.parse((res as any)?.data ?? '{}')
            if (searchConditions?.length > 0) {
                searchConditions[0].render = () => '当'
            }
            savedConfig.value = {
                columns,
                searchConditions,
                sortOptions,
                exportColumns
            }

            setColumns()
            setExportColumns()
            // savedConfig.columns = columns
            // savedConfig.searchConditions = searchConditions
            // savedConfig.value = JSON.parse((res as any)?.data ?? '{}')
            // return savedConfig
        }
    }

    const setSavedConfig = (config?: Partial<SavedConfig>) => {
        // console.log('setSavedConfig', config)
        if (!props.needSavedConfig || !config) return
        savedConfig.value = { ...savedConfig.value, ...config }
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
        exportedColumns,
        exporting,
        getSavedConfig,
        setSavedConfig
    }
}
