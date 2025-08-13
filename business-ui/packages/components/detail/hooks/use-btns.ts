/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-10 10:33:27
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-08-13 15:23:59
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\hooks\use-btns.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

import { computed, Ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { DetailProps, BtnProps, TableRowForm, DisplayType } from '../type'
import { __is_simulator_env__ } from '../../../constants'
import { useOperation } from './use-form-operations'

export const useBtns = (
    props: DetailProps,
    emits,
    getCurrentPage: Function,
    selectedRows: Ref<TableRowForm[]>
) => {
    // console.log('useBtns', props)
    const { remove, copy, upMove, downMove } = useOperation(props, emits, getCurrentPage)

    const updateSelectedRows = (
        selectedRows: Ref<TableRowForm[]>,
        curOperationForm: TableRowForm,
        display: DetailProps['display'],
        operationType: 'delete' | 'copy' | 'up-move' | 'down-move'
    ) => {
        // console.log('before-updateSelectedRows', selectedRows.value)
        if (display === DisplayType.FORM) return
        const curId = curOperationForm?.id

        if (operationType === 'delete') {
            selectedRows.value = selectedRows.value.filter((item) => item.id !== curId)
        }
        // console.log('after-updateSelectedRows', selectedRows.value)

        emits('update:selectedRows', selectedRows.value)
    }

    return computed(() => {
        // const disabled l= __is_simulator_env__
        const {
            disabled,
            display,
            showOperation,
            showCopyButton,
            showDeleteButton,
            sortable,
            copyButtonLabel,
            upButtonLabel,
            downButtonLabel,
            deleteButtonLabel,
            confirmDelete,
            btns = []
        } = props

        const btnDisabled = disabled || __is_simulator_env__

        let toBeDeletedBtns: string[] = []

        let allBtns: BtnProps[] = [
            {
                label: deleteButtonLabel,
                disabled: btnDisabled,
                type: 'danger',
                onClick: ({ forms, form, index }) => {
                    if (confirmDelete) {
                        ElMessageBox.confirm('确认是否删除该记录?', '删除', {
                            confirmButtonText: '确认',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                            .then(() => {
                                // useDelete({ forms, form, index, emits })
                                remove({ forms, form, index })
                                updateSelectedRows(selectedRows, form, display, 'delete')
                            })
                            .catch(() => {})
                    } else {
                        // useDelete({ forms, form, index, emits })
                        remove({ forms, form, index })
                        updateSelectedRows(selectedRows, form, display, 'delete')
                    }
                }
            },
            {
                label: copyButtonLabel,
                disabled: btnDisabled,
                type: 'primary',
                text: true,
                onClick: ({ forms, form, index }) => {
                    // useCopy({ forms, form, index, emits })
                    copy({ forms, form, index })
                    // updateSelectedRows(selectedRows, form, display, 'copy')
                }
            },
            {
                label: upButtonLabel,
                disabled: btnDisabled,
                type: 'primary',
                onClick: ({ forms, form, index }) => {
                    // useUpMove({ forms, form, index, emits })
                    upMove({ forms, form, index })
                    // updateSelectedRows(selectedRows, form, display, 'up-move')
                }
            },
            {
                label: downButtonLabel,
                disabled: btnDisabled,
                type: 'primary',
                onClick: ({ forms, form, index }) => {
                    // useDownMove({ forms, form, index, emits })
                    downMove({ forms, form, index })
                    // updateSelectedRows(selectedRows, form, display, 'down-move')
                }
            },
            ...btns?.map(
                (item) =>
                    ({
                        type: 'primary',
                        ...item,
                        disabled: btnDisabled
                    } as BtnProps)
            )
        ]
        if ((disabled && __is_simulator_env__) || !showOperation) {
            allBtns = []
        } else {
            if (!showCopyButton) {
                toBeDeletedBtns.push(copyButtonLabel)
            }
            if (!showDeleteButton) {
                toBeDeletedBtns.push(deleteButtonLabel)
            }
            if (!sortable) {
                toBeDeletedBtns = [...toBeDeletedBtns, upButtonLabel, downButtonLabel]
            }
            allBtns = allBtns.filter((item) => !toBeDeletedBtns.includes(item.label))
        }

        return allBtns
    })
}
