import { watch, ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import type { FormProps, FormItemProps, FieldHistoryLog } from '../../../index'
import _ from 'lodash'

interface Params {
    /**
     * 表单 item 配置参数
     */
    formItemConfig: FormItemProps
    /**
     * 表单配置对象
     */
    formConfig: FormProps
}

export default ({ formItemConfig, formConfig }: Params) => {
    const currentFieldName = formItemConfig.prop
    const currentFieldHistoryInfo = ref<FieldHistoryLog>(null)

    watch(
        () => formConfig.historyLog,
        (log) => {
            if (!log) return
            let logObj: { [k: string]: FieldHistoryLog } = null
            if (_.isString(log) && log.includes(currentFieldName)) {
                try {
                    logObj = JSON.parse(log)
                } catch (error) {}
            } else if (_.isObject(log)) {
                logObj = log
            }
            if (logObj?.[currentFieldName]) {
                currentFieldHistoryInfo.value = logObj[currentFieldName]
            }
        },
        { deep: true, immediate: true }
    )

    return {
        currentFieldHistoryInfo
    }
}
