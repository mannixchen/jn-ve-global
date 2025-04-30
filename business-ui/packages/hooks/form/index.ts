/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-09 10:47:34
 * @LastEditors: Zyunchao 18651805393@163.com
 * @LastEditTime: 2025-04-30 16:28:19
 * @FilePath: /@jsjn-librar-monorepo/business-ui/packages/hooks/form/index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { computed, Ref, SetupContext } from 'vue'
import { FormItemProps as ElFormItemProps, FormProps, FormItemRule } from 'element-plus'
import {
    FormItemProps as BiFormItemProps,
    FormProps as BiFormProps,
    ControlProps
} from '../../components'
import { v4 as uuidV4 } from 'uuid'
import { findPropDeep } from '@jsjn/utils'

export const useFormProps = (
    props: BiFormProps,
    slots,
    option?: Record<string, any>
): BiFormProps => {
    let formModel = {}

    slots?.forEach((slot) => {
        const prop = findPropDeep(slot.props.__schema, 'prop')
        const defaultVal = slot?.props?.__schema?.props?.formItemConfig?.__defaultVal ?? ''
        if (prop) {
            formModel[prop] = defaultVal
        }

        // const label = slot?.props?.label || slot?.type?.props?.label?.default || ''
        // if (slot?.props?.prop) {
        //     formModel[slot.props.prop] = null
        // } else {
        //     // throw new Error(`请为${label}表单项绑定变量`)
        // }
    })

    // console.log(`%c init formModel ******* `, 'color: #67c23a;', formModel)

    return {
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
            for: props?.for,
            validateStatus
        }
    })
}

export const useControlProps = (
    props: BiFormItemProps,
    attrs?: SetupContext['attrs']
): Ref<Omit<ControlProps, 'modelValue'> & Record<string, any>> => {
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
            modelValue,
            modelModifiers,
            ...controlProps
        } = props as any
        delete controlProps['for']
        // const activeRules = rules
        // console.log('useControlProps', props, attrs, controlProps)
        return attrs ? { ...controlProps, ...attrs } : { ...controlProps }
    })
}
