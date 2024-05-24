/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-09 10:47:34
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-23 16:58:38
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\hooks\form\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { computed, Ref } from 'vue'
import { FormItemProps as ElFormItemProps, FormProps, FormItemRule } from 'element-plus'
import {
    FormItemProps as BiFormItemProps,
    FormProps as BiFormProps,
    ControlProps
} from '../../components'
import { v4 as uuidV4 } from 'uuid'

export const useFormProps = (
    props: BiFormProps,
    slots,
    option?: Record<string, any>
): BiFormProps => {
    let formModel = {}
    slots?.forEach((slot) => {
        const label = slot?.props?.label || slot?.type?.props?.label?.default || ''
        if (slot?.props?.prop) {
            formModel[slot.props.prop] = null
        } else {
            throw new Error(`请为${label}表单项绑定变量`)
        }
    })
    console.log('formModel', formModel)
    return {
        // id: new Date().valueOf() + '-1',
        id: uuidV4(),
        instance: null,
        ...props,
        ...option,
        model: formModel
    }
}

export const useClearModel = (form: FormProps) => {
    for (const key in form?.model) {
        if (Object.prototype.hasOwnProperty.call(form?.model, key)) {
            form.model[key] = null
        }
    }
}

export const useFormItemProps = (
    props: BiFormItemProps,
    defaultRules: FormItemRule[] = []
): Ref<ElFormItemProps> => {
    return computed(() => {
        const {
            prop = '',
            label = '',
            labelWidth,
            required,
            rules = [],
            error,
            showMessage = true,
            inlineMessage,
            size,
            // for,
            validateStatus
        } = props
        // const activeRules = rules
        return {
            prop,
            label,
            labelWidth,
            required,
            rules: [...defaultRules, ...rules],
            error,
            showMessage,
            inlineMessage,
            size,
            validateStatus
        }
    })
}

export const useControlProps = (
    props: BiFormItemProps
): Ref<ControlProps> => {
    return computed(() => {
        const {
            prop = '',
            label = '',
            labelWidth,
            required,
            rules = [],
            error,
            showMessage = true,
            inlineMessage,
            size,
            // for,
            validateStatus,
            ...controlProps
        } = props
        // const activeRules = rules
        return controlProps as ControlProps
    })
}
