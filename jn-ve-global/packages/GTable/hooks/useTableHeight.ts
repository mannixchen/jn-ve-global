/*
 * @Author: zhujin zhujin@jsjngf.com
 * @Date: 2025-12-01 10:24:27
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-12-01 14:38:27
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GTable\hooks\useTableHeight.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Ref, ref, nextTick, watch } from 'vue'
import { TableConfig, TableMethodsExtend } from '../index'

export default function useTableHeight(props: TableConfig<any>): {
    gTableRef: Ref<HTMLDivElement | null>
    getTableHeight?: TableMethodsExtend['getTableHeight']
} {
    const gTableRef = ref<HTMLDivElement>()
    const getTableHeight = () => {
        // 确保在DOM更新后获取高度
        return nextTick(() => {
            if (gTableRef.value) {
                // 获取可视高度（不包括边框和滚动条）
                const clientHeight = gTableRef.value.clientHeight
                // 获取元素的整体高度（包括padding、border）
                const offsetHeight = gTableRef.value.offsetHeight
                // 获取元素的布局高度（包括内容、padding、border和滚动条）
                const scrollHeight = gTableRef.value.scrollHeight

                // console.log('表格DOM高度信息:', {
                //     clientHeight,
                //     offsetHeight,
                //     scrollHeight
                // })

                return {
                    clientHeight,
                    offsetHeight,
                    scrollHeight
                }
            }
            return null
        })
    }

    watch(
        () => props?.instance,
        (instance) => {
            if (!instance) return
            instance.getTableHeight = getTableHeight
        }
    )

    return {
        gTableRef,
        getTableHeight
    }
}
