/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-12 15:20:14
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-03-20 11:14:13
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input-email\type.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
export type InputValue = string | number

export default interface BiInputProps {
    /**
     * modelValue 输入框内绑定的值
     */
    modelValue: InputValue
    /**
     * 未输入时的默认值（占位符）
     */
    placeholder: string
    /**
     * 是否禁用
     */
    disabled: boolean
}
