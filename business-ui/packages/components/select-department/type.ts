export type SelectDepartments = string[] | number[] | string | number | object

export interface MoreDepartmentConfig {
    /**
     * 弹框是否打开
     */
    dialogVisible: boolean
    /**
     * 已选中的部门
     */
    selectDepartments: SelectDepartments
}
export interface MoreDepartmentProps {
    config: MoreDepartmentConfig
}

export interface DepartmentProps {
    id: string
    name: string
    children?: DepartmentProps[]
    [key: string]: any
}

export interface SelectDepartmentsContext {
    departments: DepartmentProps[]
    delete: (val: DepartmentProps) => void
    clear: () => void
    
}

export default interface SelectDepartmentProps {
    /**
     * 选中绑定的值
     */
    modelValue: SelectDepartments
    /**
     * 是否多选
     */
    multiple: boolean
    /**
     * 多选时是否将选中值按文字的形式展示
     */
    collapseTags?: boolean
    /**
     * element-plus中的collapse-tags-tooltip
     */
    collapseTagsTooltip?: boolean
    /**
     * 占位文字
     */
    placeholder?: string
}
