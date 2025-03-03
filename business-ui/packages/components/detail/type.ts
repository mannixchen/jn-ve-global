import type { ButtonProps, FormItemProps as ElFormItemProps } from 'element-plus'
import { CSSProperties } from 'vue'
import { FormProps } from '../form'

export interface OperationParams {
    forms: FormProps[]
    form: FormProps
    index: number
    emits: any
}

export interface ColumnProps {
    prop: string
    label: string
    type: 'serial' | 'form' | 'operation'
    style?: CSSProperties
    required?: boolean
}

export interface BtnProps extends Partial<ButtonProps> {
    label: string
    onClick?: (params?: any) => void
}

export interface DetailProps {
    /**
     * 数据
     */
    modelValue: Array<Record<string, any>>
    /**
     * 唯一标识
     */
    id?: string

    /**
     * 标题
     */
    // label: string

    /**
     * 子项标签位置，display为form时生效
     */
    labelPosition?: 'left' | 'top' | 'right'
    /**
     * 子项标签位置, display为form时时生效
     */
    labelWidth?: string | number

    // /**
    //  * 标题偏移, 当labelPosition为left时出现
    //  */
    // labelOffset?: string | number
    // /**
    //  * 标题对齐方式, 当labelPosition为left时出现
    //  */
    // labelAlign?: 'left' | 'right'
    // /**
    //  * 内容宽度, 当labelPosition为left或inner时出现
    //  */
    // contentWidth?: string | number
    // /**
    //  * 内容偏移, 当labelPosition为left或inner时出现
    //  */
    // contentOffset?: string | number

    /**
     * 是否禁用
     */
    disabled: boolean

    /**
     * 标题是否提示
     */
    // showTip?: boolean
    /**
     * 提示图标
     */
    // tipIcon?: String
    /**
     * 提示内容
     */
    // tip?: String

    /**
     * 排列方式
     */
    display?: 'form' | 'table'
    /**
     * 是否为斑马纹，排列方式为table时有效
     */
    stripe?: boolean
    /**
     * 是否带有纵向边框，排列方式为table时有效
     */
    border?: boolean

    /**
     * 主题，排列方式为table时有效
     */
    // theme?: 'stripe' | 'border' | 'divider'

    // /**
    //  * 显示表头，排列方式为table时有效
    //  */
    // showTableHeader?: boolean

    /**
     * 显示序号，排列方式为table时有效
     */
    showSerial?: boolean
    /**
     * 布局方式，排列方式为table时有效
     */
    layout?: 'auto' | 'fixed'
    /**
     * 左侧列冻结，冻结列数，排列方式为table时有效
     */
    leftFixedColumns?: number
    /**
     * 冻结操作列，排列方式为table时有效
     */
    fixedOperation?: boolean
    /**
     * 操作列宽度，排列方式为table时有效
     */
    operationWidth?: string | number

    /**
     * 自定义其他列，排列方式为table时有效
     */
    customColumns?: boolean

    /**
     * 是否展开，排列方式为form时有效
     */
    expand?: boolean
    /**
     * 序号名称，排列方式为form时有效
     */
    serialName?: string
    /**
     * 显示操作列
     */
    showOperation?: boolean
    /**
     * 显示复制按钮
     */
    showCopyButton?: boolean
    /**
     * 复制按钮名称
     */
    copyButtonLabel?: string
    /**
     * 显示删除按钮
     */
    showDeleteButton?: boolean
    /**
     * 删除按钮名称
     */
    deleteButtonLabel?: string
    /**
     * 删除确认
     */
    confirmDelete?: boolean
    /**
     * 显示排序，上移下移操作
     */
    sortable?: boolean
    /**
     * 上移按钮名称
     */
    upButtonLabel?: string
    /**
     * 下移按钮名称
     */
    downButtonLabel?: string
    /**
     * 自定义操作项，作为对已有操作的扩展
     */
    btns?: BtnProps[]
    /**
     * 新增按钮名称
     */
    addButtonLabel?: string

    // /**
    //  * 新增按钮状态
    //  */
    // addButtonStatus?: 'active' | 'disabled' | 'hidden'

    /**
     * 隐藏新增按钮
     */
    hideAddBtn?: boolean
    /**
     * 分页条数
     */
    pageSize?: number
    /**
     * 最大条数
     */
    max?: number
    /**
     * 组件内部插槽元素是否来源于父元素，针对不同的来源，组件内部获取表单控件的方式不同
     */
    slotFromParent?: boolean
}

export type FiDetailProps = DetailProps & ElFormItemProps
