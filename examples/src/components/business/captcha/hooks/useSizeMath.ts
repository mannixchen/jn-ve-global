import _ from 'lodash'
import { useStore } from '@/store'
import { computed } from 'vue'

export default () => {
    const store = useStore()
    const _screenRatio = computed<number>(() => store.state.currentStatus.screenRatio)

    function fieldsSizeLargen(obj: object, fields?: string[]) {
        Object.keys(obj).forEach((key) => {
            if (fields && !fields.includes(key)) return
            const value = obj[key]
            if (_.isNumber(value)) {
                obj[key] = value * _screenRatio.value
            }
        })
    }

    function fieldsSizeLessen(obj: object, fields?: string[]) {
        Object.keys(obj).forEach((key) => {
            if (fields && !fields.includes(key)) return
            const value = obj[key]
            if (_.isNumber(value)) {
                obj[key] = value / _screenRatio.value
            }
        })
    }

    function getSize(size: number) {
        return size * _screenRatio.value
    }

    return {
        /**
         * 对象中的数字字段值扩大（倍数取决于浏览器）
         * @param obj 目标对象
         * @param fields 指定字段，不传则全部数字字段
         */
        fieldsSizeLargen,
        /**
         * 对象中的数字字段值缩小（倍数取决于浏览器）
         * @param obj 目标对象
         * @param fields 指定字段，不传则全部数字字段
         */
        fieldsSizeLessen,
        /**
         * 根据 Ratio 计算数值
         * @param size 要换算的数值
         * @returns
         */
        getSize
    }
}
