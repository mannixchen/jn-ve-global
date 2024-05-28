/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-10 16:00:14
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-24 14:28:23
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\hooks\use-form-operations.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
// import { FormProps } from '../../form'
import { v4 as uuidV4 } from 'uuid'
import { DetailProps, OperationParams } from '../type'

export const useOperation = (props: DetailProps, emits, getCurrentPage: Function) => {
    const { max } = props
    const remove = ({ forms, form, index }: Omit<OperationParams, 'emits'>) => {
        console.log('remove')
        forms.splice(index, 1)
        getCurrentPage(index)
        emits('delete', { forms, form })
    }
    const copy = ({ forms, form, index }: Omit<OperationParams, 'emits'>) => {
        console.log('copy', forms)
        const copyForm = cloneDeep(form)
        copyForm.id = uuidV4()
        copyForm.instance = null
        forms.splice(index + 1, 0, copyForm)
        if (max && forms.length === max + 1) {
            forms.pop()
            ElMessage.warning(`本次操作已超出${max}条总量上限，超出部分已忽略`)
            return
        }
        getCurrentPage(index + 1)
        // getCurrentRecords()
        emits('copy', { forms, form })
    }
    const upMove = ({ forms, form, index }: Omit<OperationParams, 'emits'>) => {
        // console.log('upMove')
        if (index === 0) {
            ElMessage.warning(`首项数据无法上移`)
            return
        }
        ;[forms[index - 1], forms[index]] = [forms[index], forms[index - 1]]
        getCurrentPage(index - 1)
        // getCurrentRecords()
        emits('upMove', { forms, form })
    }
    const downMove = ({ forms, form, index }: Omit<OperationParams, 'emits'>) => {
        // console.log('downMove')
        const lastIndex = forms?.length - 1
        if (lastIndex === 0) {
            ElMessage.warning(`首项数据无法下移`)
            return
        }
        if (index === lastIndex) {
            ElMessage.warning(`最后一项数据无法下移`)
            return
        }
        ;[forms[index], forms[index + 1]] = [forms[index + 1], forms[index]]
        getCurrentPage(index + 1)
        // getCurrentRecords()
        emits('downMove', { forms, form })
    }

    return {
        remove,
        copy,
        upMove,
        downMove
    }
}
