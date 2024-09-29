/* eslint-disable indent */
/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-07-01 10:40:56
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-09-23 15:13:04
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\hooks\useRightOperations.ts
 * @Description: 暂未用到
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { computed } from 'vue'
import { BaseModuleProps } from '../interface/baseModuleProps'

export default ({ props, uploadWrapperRef, loadTable }: { props: BaseModuleProps; uploadWrapperRef: any, loadTable: Function }) => {
    const showColumns = (cb?) => {
    }

    const refresh = (cb?) => {
        // props.loadTableMethods?.()
        loadTable()
        cb && cb()
    }

    const importMethod = (cb?) => {
      console.log('uploadWrapperRef', uploadWrapperRef.value)
    }

    return computed(() => {
        const operations = [
            {
                label: '显示列',
                hide: false,
                onClick: (cb?) => {
                    showColumns(cb)
                }
            },
            {
                label: '刷新',
                hide: false,
                onClick: (cb?) => {
                    refresh(cb)
                }
            },
            {
                label: '下载',
                hide: false,
                onClick: () => {
                    props?.downloadMethod && props.downloadMethod()
                }
            },
            {
                label: '导入',
                hide: false,
                onClick: (cb?) => {
                    importMethod(cb)
                }
            },
            {
                label: '导出',
                hide: false,
                onClick: () => {
                    props?.exportMethod && props.exportMethod()
                }
            }
        ]

        // for (let i = 0; i < operations.length; i++) {
        //     if (props?.operationGroupProps?.length) {
        //         break
        //     } else {
        //         for (let j = 0; j < props?.operationGroupProps.length; j++) {
        //             if (operations[i].label === props.operationGroupProps[j].label) {
        //                 operations[i].hide = props.operationGroupProps[j].hide ?? false
        //                 if (props.operationGroupProps[j].onClick) {
        //                     operations[i].onClick = props.operationGroupProps[j].onClick
        //                 } else {
        //                     if (props.operationGroupProps[j]?.callback) {
        //                         operations[i].onClick = () => {
        //                             operations[i].onClick(props.operationGroupProps[j].callback)
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        return operations
    })
}
