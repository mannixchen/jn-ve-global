/*
 * @Author: zhujin zhujin@jsjngf.com
 * @Date: 2025-08-05 14:42:43
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-08-12 10:29:28
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\hooks\useSummary.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from 'vue'
import { DetailProps, TableRowForm, SummaryMethodParams } from '../type'
import { isArray, toNumber } from 'lodash'
import { Decimal } from 'decimal.js'
import { ElMessage } from 'element-plus'

export const useSummary = (props: DetailProps) => {
    const summary = ref<string[]>([])
    const { showSummary, summaryColumns = [] } = props

    const summaryMethod = ({ forms, columns }: SummaryMethodParams): string[] => {
        // console.log('summaryMethod', forms, columns)
        if (!showSummary) return []

        if (props?.summaryMethod) return props.summaryMethod({ forms, columns })

        const results = columns.map((column, index) => {
            let value = ''
            const { type, prop, label } = column
            if (index === 0) return '合计'

            if (type === 'form') {
                const propValues = forms.map((form) => form?.model?.[prop])
                // 如果配置了summaryColumns, 则只对这些列进行合计
                if (summaryColumns.length > 0 && !summaryColumns.includes(prop)) {
                    return ''
                }

                // 如果propValues中有不可计算项，则返回空字符串
                if (
                    propValues.every((v) => v === '' || v === null || v === undefined) ||
                    propValues.some((v) => isNaN(toNumber(v)) || isArray(v))
                ) {
                    // ElMessage.warning(
                    //     `列 ${label}-(${prop}) 中存在不可合计的值, 请检查数据:${propValues}`
                    // )
                    return ''
                }
                value = propValues.reduce((acc, curVal) => {
                    return Decimal.add(acc, curVal || 0).toString()
                }, 0)
            } else if (type === 'operation') {
                value = ''
            }
            return value
        })

        // console.log('summaryMethod', results)
        return results
    }

    return {
        summary,
        summaryMethod
    }
}
