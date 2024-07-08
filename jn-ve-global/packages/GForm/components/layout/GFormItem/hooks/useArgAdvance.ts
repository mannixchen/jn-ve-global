import { watch, ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import type { FormProps, FormItemProps, FieldHistoryLog } from '../../../../index'
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

/**
 * 为每一项追加高级参数
 */
export default (props: Params) => {
    watch(() => props.formItemConfig, _advance)

    function _advance(itemConfig: FormItemProps) {
        if (!itemConfig?.controlConfig?.props) return
        const _props = itemConfig?.controlConfig?.props
        const eventKeys = Object.keys(_props).filter(
            (key) => key.startsWith('on') && _.isFunction(_props[key])
        )

        if (!eventKeys?.length) return
        
        eventKeys.forEach((eventKey) => {
            const _eventHandle: Function = _props[eventKey]
            _props[eventKey] = function () {
                return _eventHandle.apply(this, [...arguments, props.formConfig, props.formItemConfig])
            }
        })
    }
    _advance(props.formItemConfig)
    return {}
}
