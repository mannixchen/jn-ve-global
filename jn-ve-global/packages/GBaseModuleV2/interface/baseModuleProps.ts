/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-01 09:51:56
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-07-10 10:54:58
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\interface\baseModuleProps.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import {
    GTable as LGTable,
    type TableColumnProps,
    type BaseTableDataItem,
    type TableConfig,
    type PaginationProps
} from '../../GTable'
import type { FormProps } from '../../GForm'
import { type BtnProps } from '../../GButtonGroup'

export interface OperationProps {
    /**
     * 按钮名称
     */
    label: '显示列' | '刷新' | '下载' | '导入' | '导出'
    /**
     * 是否隐藏
     */
    hide?: boolean
    /**
     * 按钮事件, 会覆盖内置行为
     */
    onClick?: (params?: any) => void
    /**
     * 执行完内置事件的回调，onClick存在时，callback不生效
     */
    callback?: (params?: any) => void
}

export interface ExtraInfo {
    appId?: string
    funcId?: string
    pageId?: string
    tableId?: string
}

export interface BaseModuleProps {
    /**
     * 表格列
     */
    tableColumns?: TableColumnProps[]
    /**
     * 表格数据
     */
    tableData?: BaseTableDataItem[]
    /**
     * 搜索条件表单配置
     */
    searchFormProps?: FormProps
    /**
     * 分页数据
     */
    tablePagination?: PaginationProps
    /**
     * 按钮组
     */
    btns?: BtnProps[]

    /**
     * 主要查询字段
     */
    // mainKey: string

    /**
     * 搜索按钮是否独占一行
     */
    // searchBtnHorizontal?: boolean

    /**
     * 核心加载 table 数据的方法
     */
    // loadTableMethods?: (page?: number) => void
    loadTableService?: (params?: any) => Promise<any>

    /**
     * 下载表格
     */
    downloadMethod?: (params?: any) => void
    /**
     * 下载表格
     */
    exportMethod?: (params?: any) => void
    /**
     * 表格 loading flag
     */
    tableLoading?: boolean

    /**
     * 多用途 api 去除 label，包括
     *  - “查询条件”
     *  - “查询结果”
     */
    // noSearchLabel?: boolean

    /**
     * 搜索按钮的鉴权 code
     */
    searchBtnAuthCode?: string

    /**
     * 更多查询展示方式
     * pullDown：下拉
     * popup：弹出
     */
    // moreSearchMode?: 'pull-down' | 'popup'

    /**
     * 表格操作列
     */
    rowBtnConfig?: TableConfig<any>['rowBtnConfig']
    /**
     * tab 切换
     */
    tabs?: Array<{ label: string; value: string }>
    /**
     * 激活的 tab
     */
    activeTab?: string
    /**
     * 选中行的维护数组
     */
    selectedRows?: TableConfig<any>['selectedRows']
    /**
     * 内置操作项可见设置以及行为设置
     */
    operationGroupProps?: OperationProps[]
    /**
     * 导入（上传）的url
     */
    action?: string
    /**
     * 导入（上传）携带的额外参数
     */
    actionParams?: Record<string, any>
    /**
     * 额外信息
     */
    extraInfo?: ExtraInfo
}
