/*
 * @Author: zhujin zhujin@jsjngf.com
 * @Date: 2025-12-01 11:33:53
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-12-02 10:20:20
 * @FilePath: \@jsjn-librar-monorepo\jn-ve-global\packages\GBaseModuleV2\hooks\useMaxheight.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { onMounted, onBeforeUnmount, Ref, nextTick } from 'vue'
import { PopoverInstance } from 'element-plus'
import { TableConfig } from 'jn-ve-global'
import { getTableHeight } from '../utils/utils'

export default function useMaxHeight({
    popoverRef,
    tableConfig,
    targeClassName
}: {
    popoverRef: Ref<PopoverInstance>
    tableConfig: TableConfig<any>
    targeClassName: string
}) {
    // console.log('useMaxHeight')
    // 声明resize事件处理函数，提升到函数作用域
    let handleResize: () => void

    // 计算并设置最大高度
    const calculateAndSetMaxHeight = async () => {
        // 确保DOM已经渲染完成
        await nextTick()
        const { height: tableHeight } = await getTableHeight(tableConfig)
        // console.log('calculateAndSetMaxHeight')
        const contentElement = popoverRef.value.popperRef.contentRef
        // 设置目标元素的最大高度
        if (targeClassName && contentElement) {
            const targetElement = contentElement.querySelectorAll(`.${targeClassName}`)[0]
            const availableHeight =
                tableHeight -
                (popoverRef.value.popperRef.contentRef.offsetHeight -
                    (targetElement as HTMLElement).offsetHeight) -
                10
            ;(targetElement as HTMLElement).style.maxHeight = `${availableHeight}px`
            ;(targetElement as HTMLElement).style.overflow = 'auto'
            // console.log('设置的最大高度:', availableHeight)
        }
    }

    // 在组件挂载时初始化
    onMounted(() => {
        // 监听窗口大小变化，重新计算高度
        handleResize = () => {
            calculateAndSetMaxHeight()
        }

        window.addEventListener('resize', handleResize)
    })

    // 清理事件监听器（在组件卸载时执行）
    onBeforeUnmount(() => {
        if (handleResize) {
            window.removeEventListener('resize', handleResize)
        }
    })

    // 暴露方法给外部使用
    return {
        calculateAndSetMaxHeight
    }
}
