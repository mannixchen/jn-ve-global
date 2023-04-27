/**
 * 基础业务模块的公用状态、方法，封装方式源自
 *  - 组合式函数：https://cn.vuejs.org/guide/reusability/composables.html#what-is-a-composable
 * 
 * 等同于 vue2 的 mixins
 * 等同于 react 的自定义 hook
 */

import { nextTick, reactive, toRefs } from 'vue'
import { BaseResponse } from '@jsjn/types/Response'
import { FormProps, FormItemProps } from 'jn-ve-global'

export interface CreateFormItemProps {
    formModel: {
        [k: string]: any
    }
    formItems: FormItemProps[]
    labelWidth?: string
}

/**
 * 泛型：TBD tabldData 的类型
 * 泛型：DRATYPE el-drawer 的状态值
 * @returns
 */
export default function <TBD, DRATYPE>(searchFormCondition?: CreateFormItemProps) {
    interface localState {
        /**
         * 基础表格数据
         */
        tableData: TBD[]
        /**
         * 侧边弹框的状态
         */
        drawerState: {
            type: DRATYPE | ''
            show: boolean
        }
        /**
         * 分页的状态
         */
        pagination: {
            pageSize: number
            currentPage: number
            total: number
        }
        /**
         * 表格请求的 falg
         */
        tableIsLoading: boolean
        /**
         * 搜索表单配置对象
         */
        searchFormConfig: FormProps
        /**
         * 重载 flag
         */
        reloadFlag: boolean
    }

    const state = reactive<localState>({
        tableData: [],
        drawerState: {
            type: '',
            show: false
        },
        pagination: {
            pageSize: 10,
            currentPage: 1,
            total: 0
        },
        tableIsLoading: false,
        searchFormConfig: null,
        reloadFlag: false
    })

    // 动态初始化搜索表单配置
    if (
        searchFormCondition &&
        searchFormCondition.formItems &&
        searchFormCondition.formItems.length &&
        searchFormCondition.formModel
    ) {
        const temp: FormProps = {
            instance: null,
            gutter: 30,
            labelWidth: searchFormCondition.labelWidth || '1.6rem',
            model: searchFormCondition.formModel || {},
            formItems: searchFormCondition.formItems || []
        }
        state.searchFormConfig = temp as any
    }

    // 包装设置 Drawer 的状态
    const setDrawerState = (type: DRATYPE | '', show: boolean) => {
        type && ((state.drawerState.type as DRATYPE | '') = type)
        state.drawerState.show = show
    }

    // 通用的加载表格
    const loadTable = (
        params: any,
        http: (params: any) => Promise<any>,
        page?: number,
        cb?: (res?: BaseResponse) => void
    ) => {
        state.tableIsLoading = true

        // 如果主动传递了页码，则将分页重置到目标页，相当于将请求委托给分页变化
        if (page && state.pagination.currentPage !== page) {
            state.pagination.currentPage = page
            return false
        }

        params = {
            ...params,
            current: state.pagination.currentPage,
            size: state.pagination.pageSize
        }

        http(params)
            .then((res: BaseResponse) => {
                if (res.code === '000000') {
                    // 表格
                    state.tableData = res.data.records || []

                    // 分页
                    state.pagination.total = res.data.total || 0

                    // 额外的回调函数
                    cb?.(res)
                }
            })
            .finally(() => {
                state.tableIsLoading = false
            })
    }

    // 工具
    const filterColumnProps = (config: any) => {
        const { render, ...columnProps } = config
        return columnProps
    }

    // 重载
    const tryReload = () => {
        state.reloadFlag = true
        nextTick(() => {
            state.reloadFlag = false
        })
    }

    return {
        ...toRefs(state),
        setDrawerState,
        filterColumnProps,
        loadTable
    }
}
