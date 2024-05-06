// import type { CheckboxBoxOptionProps } from 'jn-ve-global'

export interface CheckboxOptionProps {
    /**
     * item 的显示值
     */
    label: string | number | boolean | object
    /**
     * 选中状态的值（扩展）
     */
    value: string | number | boolean | object
    /**
     * 选中时的值
     */
    trueValue?: string | number
    /**
     * 没有选中时的值
     */
    falseValue?: string | number
    /**
     * 是否禁用
     */
    disabled?: boolean
    /**
     * 原生 name 属性
     */
    name?: string
    /**
     * 当前是否勾选
     */
    checked?: boolean
    /**
     * 设置 indeterminate 状态，只负责样式控制
     */
    indeterminate?: boolean
}

export interface BiCheckboxProps {
    /**
     * modelValue 输入框内绑定的值
     */
    modelValue: string[] | number[]
    /**
     * 是否禁用
     */
    disabled: boolean
    /**
     * 选项
     */
    options: CheckboxOptionProps[]
    /**
     * Radio-group Events
     */
    onChange?: (value: string[] | number[]) => void
}
