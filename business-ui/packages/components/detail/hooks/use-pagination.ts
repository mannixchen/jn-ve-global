/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-18 14:59:31
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-27 13:41:05
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\hooks\use-pagination.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { reactive, toRefs, nextTick } from 'vue'
import type { PaginationProps } from 'element-plus'
import type { DetailProps } from '../type'
import { FormProps } from '../../form'

export const usePagination = (props: DetailProps, forms: FormProps[]) => {
    // console.log('usePagination', props)
    interface LocalState {
        currentPage: number
        pageSize: number
        paginationProps: Partial<PaginationProps>
        currentRecords: FormProps[]
    }
    const { pageSize, max } = props
    const state = reactive<LocalState>({
        currentPage: 1,
        pageSize,
        paginationProps: {
            total: forms?.length ?? 0,
            // pageSizes: [5, 10, 20],
            layout: 'total, prev, pager, next, jumper',
            hideOnSinglePage: true
        },
        currentRecords: []
    })

    const getCurrentRecords = () => {
        // console.log('getCurrentRecords')
        const { currentPage, pageSize } = state
        state.currentRecords = forms
            ?.map((item, index) => ({
                ...item,
                serialNo: index + 1
            }))
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)

        // 由于页面渲染的数据是state.currentRecords, 导致全量forms中每个元素的instance都为null,需要在页面渲染成功后，手动更改forms元素上instance
        nextTick(() => {
            // console.log('next-tick-getCurrentRecords')
            state?.currentRecords?.forEach((item) => {
                for (let i = 0; i < forms.length; i++) {
                    if (forms[i]?.id === item?.id) {
                        forms[i].instance = item.instance
                    }
                }
            })
        })
    }

    getCurrentRecords()

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
    const change = (value: number) => {
        // console.log('change')
        getCurrentRecords()
    }

    const prevClick = (value: number) => {
        // console.log('preClick', value)
        getCurrentRecords()
    }

    const nextClick = (value: number) => {
        getCurrentRecords()
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
