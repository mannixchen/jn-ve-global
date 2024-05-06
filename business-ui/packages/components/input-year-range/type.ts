export type Year = Date | string

export interface InputYearRangeProps {
    /**
     * modelValue 输入框内绑定的值
     */
    modelValue: [Date, Date] | [string, string]
    /**
     * 起始输入框的占位符
     */
    startPlaceholder?: string
    /**
     * 结束输入框的占位符
     */
    endPlaceholder?: string
    /**
     * 分隔符
     */
    rangeSeparator?: string
    /**
     * 是否禁用
     */
    disabled?: boolean
    /**
     * 清除
     */
    clearable?: boolean
    /**
     * 显示在输入框中的格式
     */
    format?: string
    /**
     * 绑定值的格式
     */
    valueFormat?: string
}
