import { TableConfig, TableColumnProps } from './index'
/**
 * 剔除扩展属性，获取表格的原生配置属性
 * @param props TableConfig
 */
export function getTableProps(props: TableConfig<any>): any {
    const {
        columns,
        instance,
        pagination,
        showSelection,
        selectedRows,
        onCellEdited,
        rowBtnConfig,
        ...tableProps
    } = props

    return tableProps
}

/**
 * 剔除扩展属性，获取 Column 原生配置属性
 * @param props
 */
export function getColumnProps(props: TableColumnProps): any {
    const {
        render,
        children,
        editable,
        controlConfig,
        rules,
        excelValueFormat,
        hide,
        ...columnProps
    } = props

    return columnProps
}
