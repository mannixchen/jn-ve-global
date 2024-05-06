/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-12 16:22:07
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-03-20 14:27:40
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\radio\type.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import type { RadioOptionProps } from 'jn-ve-global'

export type { RadioOptionProps } from 'jn-ve-global'

export default interface BiRadioProps {
    /**
     * modelValue 输入框内绑定的值
     */
    modelValue: string | number | boolean
    /**
     * 是否禁用
     */
    disabled: boolean
    /**
     * 选项
     */
    options: RadioOptionProps[]
    /**
     * Radio-group Events
     */
    onChange?: (value: string | number | boolean) => void
}
