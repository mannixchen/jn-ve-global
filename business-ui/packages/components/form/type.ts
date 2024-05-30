import type {
    FormProps as ElFormProps,
    FormItemProps as ElFormItemProps,
    ColorPickerProps,
    RateProps,
    SliderProps,
    SwitchProps,
    DatePickerProps,
    TimePickerDefaultProps,
    ISelectV2Props,
    TransferProps,
    FormInstance
    // formProps,
    // formItemProps
} from 'element-plus'
import { ExtendRuleItem, TimeSelectProps } from 'jn-ve-global'
// import type { ExtractPublicPropTypes} from 'vue'

export interface RuleItem extends ExtendRuleItem {
    active?: boolean
}

// interface ElFormProps {
//     /**
//      * 表单数据对象
//      */
//     model: {
//         [k: string]: any
//     }
//     /**
//      * 表单验证规则
//      */
//     rules?: {
//         [k: string]: ExtendRuleItem | ExtendRuleItem[]
//     }
//     /**
//      * 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
//      * default：'right'
//      */
//     labelPosition?: 'right' | 'left' | 'top'
//     /**
//      * 	表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
//      */
//     labelWidth?: string
//     /**
//      * 是否显示必填字段的标签旁边的红色星号
//      * default?: false
//      */
//     hideRequiredAsterisk?: boolean
//     /**
//      * 是否显示校验错误信息
//      * default?: true
//      */
//     showMessage?: boolean
//     /**
//      * 是否以行内形式展示校验信息
//      * default?: false
//      */
//     inlineMessage?: boolean
//     /**
//      * 是否在输入框中显示校验结果反馈图标
//      * default?: false
//      */
//     statusIcon?: boolean
//     /**
//      * 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
//      * default?: false
//      */
//     disabled?: boolean
//     /**
//      * 是否在 rules 属性改变后立即触发一次验证
//      * default?: true
//      */
//     validateOnRuleChange?: boolean
// }

export interface FormProps extends ElFormProps {
    /**
     * 多个表单的主键
     */
    id?: string
    /**
     * 表单的实例（实际为 ref）
     */
    instance?: FormInstance | null
    // /**
    //  * 表单的自定义样式名称
    //  */
    // className?: string
    /**
     * 扩展字段
     */
    [k: string]: any
}

import {
    BiInputProps,
    BiCheckboxProps,
    BiRadioProps,
    InputNumberProps,
    InputNumberRangeProps,
    InputYearRangeProps,
    DetailProps,
    CascaderProps,
    TreeSelectProps,
    BiAdvanceInputProps,
    BiAddressProps,
    BiUploadProps
} from '../index'

export type ControlProps =
    | BiInputProps
    | BiCheckboxProps
    | BiRadioProps
    | InputNumberProps
    | InputNumberRangeProps
    | InputYearRangeProps
    | DetailProps
    | ColorPickerProps
    | RateProps
    | SliderProps
    | SwitchProps
    | DatePickerProps
    | TimePickerDefaultProps
    | TimeSelectProps
    | ISelectV2Props
    | TransferProps
    | CascaderProps
    | TreeSelectProps
    | BiAdvanceInputProps
    | BiAddressProps
    | BiUploadProps

export type FormItemProps = ControlProps & ElFormItemProps
