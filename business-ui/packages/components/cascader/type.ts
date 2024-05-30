import type {
    FormItemProps,
    CascaderProps as Props,
    CascaderOption,
    CascaderValue,
    CascaderNode
} from 'element-plus'
import type { ExtractPropTypes } from 'vue'

export interface CascaderProps {
    modelValue: CascaderValue
    options?: CascaderOption[]
    props?: Props
    size?: 'large' | 'default' | 'small'
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    filterable?: boolean
    filterMethod?: (node: CascaderNode, keyword: string) => boolean
    separator?: string
    showAllLevels?: boolean
    collapseTags?: boolean
    maxCollapseTags?: number
    collapseTagsTooltip?: boolean
    debounce?: number
    beforeFilter?: (value: string) => boolean | Promise<any>
    popperClass?: string
    teleported?: boolean
    validateEvent?: boolean
    tagType?: 'success' | 'info' | 'warning' | 'danger'
    emptyValues?: Array<any>
    valueOnClear?: string | number | boolean | Function
}

// export type CascaderProps = Record<string, any>
// export type CascaderProps = ExtractPropTypes<typeof cascaderProps>
export type FiCascaderProps = CascaderProps & FormItemProps
