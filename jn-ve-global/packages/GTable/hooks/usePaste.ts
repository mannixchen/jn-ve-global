import { watch, ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import Schema, { ValidateError, ValidateFieldsError, Rules } from 'async-validator'
import { ElMessage } from 'element-plus'
import { TableConfig, TableMethods as TableInstance, TableColumnProps } from '../index'

interface Params {
    props: {
        config: TableConfig
    }
}

export default ({ props }: Params) => {
    const tablePaste = async (e: ClipboardEvent) => {
        if (!props.config.pastable) return
        // 粘贴源数据
        const pasteData = e.clipboardData.getData('Text').trim()
        // 每一行
        const rowArr = pasteData.split('\r\n')
        // 每一行分割列得到粘贴的表格 源数据
        const excelDataSource = rowArr.map((row) => row.split('\t'))
        // 表格配置的有效数据列（包含 prop 且 type 不为 ['selection', 'index', 'expand'] 的列皆为有效列）
        const localColumns = props.config.columns.filter(
            (column) =>
                !['selection', 'index', 'expand'].includes(column.type) &&
                column.prop &&
                column.prop !== 'opertion'
        )

        // 判断表格配置的 label 是否与粘贴得到的 label 一致（顺序无关）
        const localColumnsLabels = localColumns.map((column) => column.label)
        const excelFirstRow = excelDataSource[0]
        let disaffinity = localColumnsLabels.some((label) => !excelFirstRow.includes(label))

        /**
         * 第一行不符合条件存在两种情况：
         *  1. 表头本身不符合
         *  2. 未粘贴表头（依据列数判断数据是否合理）
         */
        if (
            disaffinity &&
            excelDataSource.some((row) => row.length !== localColumnsLabels.length)
        ) {
            ElMessage.error('粘贴的数据不符合，请核对')
            return
        }

        /**
         * 拼装数据
         *  1. 存在表头
         *  2. 不存在表头
         */
        const rowsSource = !disaffinity
            ? excelDataSource
                .filter((_, rowI) => rowI > 0)
                .map((rowSource) => {
                    let sourceRow = {}
                    excelFirstRow.forEach((key, keyI) => {
                        sourceRow[key] = rowSource[keyI]
                    })

                    return sourceRow
                })
            : excelDataSource.map((row) => {
                let temp = {}
                localColumnsLabels.forEach((label, labelI) => {
                    temp[label] = row[labelI]
                })
                return temp
            })

        /**
         * 获取 columns 配置的 rules
         */
        const descriptor: Rules = {}
        localColumns.forEach((column) => {
            column.rules && (descriptor[column.prop] = column.rules)
        })
        const validator: Schema = new Schema(descriptor)

        /**
         * 格式化
         */
        const tableDataFormatted = []
        for (let rowI = 0; rowI < rowsSource.length; rowI++) {
            let rowData = {}
            let rowSource = rowsSource[rowI]

            localColumns.forEach((column, columnIndex) => {
                if (column.excelValueFormat) {
                    const preField = rowI > 0 ? tableDataFormatted[rowI - 1][column.prop] : null

                    const currentField = column.excelValueFormat(
                        rowSource[column.label],
                        preField,
                        rowI
                    )
                    rowData[column['prop']] = currentField
                } else {
                    rowData[column['prop']] = rowSource[column.label]
                }
            })

            tableDataFormatted.push(rowData)
        }

        /**
         * 过滤符合校验规则的（一般粘贴和可编辑结合使用，可编辑处校验，故返回所有数据）
         * 校验规则应该是适用于可编辑表格的，所以要在转换数据过后，再进行数据的校验工作
         */
        const tableDataValidated = []
        for (let rowI = 0; rowI < tableDataFormatted.length; rowI++) {
            const rowData = tableDataFormatted[rowI]

            const res: boolean | ValidateError[] = await validator
                .validate(rowData)
                .then((res) => {
                    return true
                })
                .catch((errProps: { errors: ValidateError[]; fields: ValidateFieldsError }) => {
                    return errProps.errors
                })

            // res 不为空，说明 catch 有返回，校验出错
            if (res !== true) {
                ElMessage({
                    type: 'error',
                    dangerouslyUseHTMLString: true,
                    message: `<p style="margin-bottom: 6px;">第 ${
                        rowI + 1
                    } 行校验失败 ------------ </p>${(res as ValidateError[])
                        .map(
                            (errInfo) =>
                                '<p style="margin-bottom: 6px;">' +
                                '<strong>' +
                                (props.config.columns.find(
                                    (column) => column.prop === errInfo.field
                                )?.label || errInfo.field) +
                                '</strong>' +
                                ': ' +
                                errInfo.message +
                                '</p>'
                        )
                        .join('')}`,
                    duration: 0,
                    showClose: true
                })
                // continue
            }

            tableDataValidated.push(rowData)
        }

        // 将处理过的数据抛出
        props.config.onPasted?.(tableDataValidated)
    }

    return { tablePaste }
}
