/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-18 14:59:31
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-08-13 15:26:39
 * @FilePath: /@jsjn-librar-monorepo/business-ui/packages/components/detail/hooks/use-pagination.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { reactive, toRefs, nextTick, ref, Ref } from 'vue'
import type { PaginationProps } from 'element-plus'
import type { DetailProps, TableRowForm } from '../type'
import { FormProps } from '../../form'

export const usePagination = (props: DetailProps, forms: Ref<FormProps[]>, emits) => {
    // console.log('usePagination', props)
    interface LocalState {
        currentPage: number
        pageSize: number
        paginationProps: Partial<PaginationProps>
        currentRecords: TableRowForm[]
    }
    const { pageSize, max, display, multiple } = props
    const state = reactive<LocalState>({
        currentPage: 1,
        pageSize,
        paginationProps: {
            total: forms.value?.length ?? 0,
            // pageSizes: [5, 10, 20],
            layout: 'total, prev, pager, next, jumper',
            hideOnSinglePage: true
        },
        currentRecords: []
    })

    const getCurrentRecords = (selectedRows: TableRowForm[] = []) => {
        // console.log('getCurrentRecords', selectedRows)
        const { currentPage, pageSize } = state
        const selectedIds = selectedRows?.map((item) => item?.id) ?? []
        state.currentRecords = forms.value
            ?.map((item, index) => {
                let checked
                if (display === 'table' && multiple) {
                    checked = selectedIds?.includes(item?.id) ? true : false
                }
                return {
                    ...item,
                    serialNo: index + 1,
                    checked
                }
            })
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)

        // 由于页面渲染的数据是state.currentRecords, 导致全量forms中每个元素的instance都为null,需要在页面渲染成功后，手动更改forms元素上instance
        setTimeout(() => {
            state?.currentRecords?.forEach((item) => {
                for (let i = 0; i < forms.value.length; i++) {
                    if (forms.value[i]?.id === item?.id) {
                        forms.value[i].instance = item.instance
                    }
                }
            })

            // console.log('getCurrentRecords-forms', state.currentRecords)
        }, 0)
    }

    // getCurrentRecords()

    const getCurrentPage = (currentIndex) => {
        // console.log('getCurrentPage', state, currentIndex)
        const currentSerial = currentIndex + 1
        let currentPage: number
        // const total = state?.paginationProps?.total ?? 0
        const result = `${currentSerial / state.pageSize}`.split('.')
        if (result.length === 1) {
            currentPage = Number(result[0]) < 1 ? 1 : Number(result[0])
        } else {
            currentPage = Number(result[0]) + 1
        }

        state.currentPage = currentPage
    }

    // const change = (currentPage: number, pageSize: number) => {
    const change = (value: number, selectedRow: Ref<TableRowForm[]>) => {
        selectedRow.value = []
        getCurrentRecords(selectedRow.value)
        emits('update:selectedRows', selectedRow.value)
    }

    const prevClick = (value: number, selectedRow: Ref<TableRowForm[]>) => {
        // console.log('preClick', value)
        selectedRow.value = []
        getCurrentRecords(selectedRow.value)
        emits('update:selectedRows', selectedRow.value)
    }

    const nextClick = (value: number, selectedRow: Ref<TableRowForm[]>) => {
        selectedRow.value = []
        getCurrentRecords(selectedRow.value)
        emits('update:selectedRows', selectedRow.value)
    }

    return {
        ...toRefs(state),
        getCurrentPage,
        getCurrentRecords,
        change,
        prevClick,
        nextClick
    }
}
