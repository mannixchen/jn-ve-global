import { watch, ref, computed, nextTick, Ref, onMounted, shallowRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useResizeObserver } from '@vueuse/core'
import _ from 'lodash'
import { size2Rem } from '@jsjn/utils'
import { ElCollapse, ElScrollbar } from 'element-plus'

export interface CollapseItemModel {
    label: string
    top: number
    $dom: HTMLElement
    height: number
    isActive: boolean
    index: number
}

interface Params {
    props: {
        /**
         * 是否显示导航条
         */
        showNavBars?: boolean
        /**
         * 可选父容器，默认值取直接父容器
         */
        parent?: HTMLElement
    }
}

export default ({ props }: Params) => {
    const collapseRef = ref<InstanceType<typeof ElCollapse> | null>(null)
    const anchorWrapperRef = ref<InstanceType<typeof ElScrollbar> | null>(null)

    const id = `collapse__wrapper-${uuidv4()}`
    const collapseWrapperParent = shallowRef<HTMLElement>(props.parent)
    const collapseItemModels = ref<CollapseItemModel[]>([])
    const scrollOffsetCount = size2Rem(15)
    const anchorItemHeight = `${size2Rem(46)}px`
    const anchorWrapperMaxH = 10 * parseInt(anchorItemHeight)
    const isAnchorNav = ref<boolean>(false)
    const isPackup = ref<boolean>(false)

    onMounted(() => {
        if (!props.showNavBars) return

        const $collapseItems = document.querySelectorAll(`#${id} > .el-collapse-item`)

        // 默认取直接父级
        if (!props.parent) {
            collapseWrapperParent.value = (collapseRef?.value?.$el as HTMLElement)?.parentElement
        }

        // 滚动同步锚点面板选中
        if (collapseWrapperParent.value) {
            collapseWrapperParent.value.addEventListener(
                'scroll',
                _.debounce((e) => {
                    // 锚点定位取消滚动联动
                    if (isAnchorNav.value) {
                        isAnchorNav.value = false
                        return
                    }

                    // 页面滚动联动锚点
                    const rootScrollTop = collapseWrapperParent.value?.scrollTop + scrollOffsetCount
                    if(!rootScrollTop) return

                    collapseItemModels.value.forEach((item, index) => {
                        const start = item.top
                        const end = start + item.height
                        item.isActive = false

                        if (rootScrollTop < collapseItemModels.value[0].top) {
                            collapseItemModels.value[0].isActive = true
                            anchorWrapperRef.value.setScrollTop(0)
                            return
                        }

                        if (rootScrollTop >= start && rootScrollTop < end) {
                            anchorWrapperRef.value.setScrollTop(parseInt(anchorItemHeight) * index)
                            item.isActive = true
                        }
                    })
                }, 100)
            )
        }

        // 收集每个 item 的信息
        collapseItemModels.value = [].map.call(
            $collapseItems,
            ($item: HTMLElement, index: number) => {
                const label = $item.querySelector('.label__text')?.innerHTML || ''
                return {
                    label,
                    top: $item.offsetTop,
                    $dom: $item,
                    height: $item.offsetHeight,
                    isActive: index === 0,
                    index
                }
            }
        ) as CollapseItemModel[]

        // 监听整体容器高度变化，收缩后的锚点高度
        useResizeObserver(
            collapseRef.value.$el,
            _.debounce(() => {
                collapseItemModels.value.forEach((item) => {
                    item.top = item.$dom.offsetTop
                    item.height = item.$dom.offsetHeight
                })
            }, 20)
        )
    })

    function handleNav(target: CollapseItemModel) {
        if (!collapseWrapperParent.value) return
        _initActive()
        isAnchorNav.value = true
        target.isActive = true
        collapseWrapperParent.value.scrollTo({
            top: target.top - scrollOffsetCount,
            behavior: 'smooth'
        })
    }

    function backTop() {
        collapseWrapperParent.value.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        anchorWrapperRef.value.setScrollTop(0)
    }

    function _initActive() {
        collapseItemModels.value.forEach((item) => {
            item.isActive = false
        })
    }

    return {
        anchorWrapperRef,
        collapseItemModels,
        collapseRef,
        handleNav,
        id,
        backTop,
        anchorItemHeight,
        anchorWrapperMaxH,
        isPackup
    }
}
