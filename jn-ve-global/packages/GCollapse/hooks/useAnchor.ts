import { ref, onMounted, shallowRef, type Ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import _ from 'lodash'
import { size2Rem, getStyle } from '@jsjn/utils'
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

export default ({
    props
}: Params): {
    anchorWrapperRef: Ref<any>
    collapseItemModels: Ref<any[]>
    collapseRef: Ref<any>
    handleNav: (target: CollapseItemModel) => void
    id: string
    backTop: () => void
    anchorItemHeight: string
    anchorWrapperMaxH: number
    isPackup: Ref<boolean>
} => {
    const collapseRef = ref<InstanceType<typeof ElCollapse> | null>(null)
    const anchorWrapperRef = ref<InstanceType<typeof ElScrollbar> | null>(null)

    const id = `collapse__wrapper-${+new Date()}`
    const collapseWrapperParent = shallowRef<HTMLElement>(props.parent)
    const collapseItemModels = ref<CollapseItemModel[]>([])
    const anchorItemHeight = `${size2Rem(46)}px`
    const anchorWrapperMaxH = 10 * parseInt(anchorItemHeight)
    const isAnchorNav = ref<boolean>(false)
    const isPackup = ref<boolean>(false)

    // el-collapse 距离滚动容器的顶部距离
    const collapseRefOTop = ref<number>(0)
    const parentWrapperPTop = ref<number>(0)

    onMounted(() => {
        if (!props.showNavBars) return

        const $collapseItems = document.querySelectorAll(`#${id} > .el-collapse-item`)

        // 默认取直接父级
        if (!props.parent) {
            collapseWrapperParent.value = (collapseRef?.value?.$el as HTMLElement)?.parentElement
        }

        // 滚动同步锚点面板选中
        if (collapseWrapperParent.value) {
            _cacheWrapperTopSize()

            collapseWrapperParent.value.addEventListener(
                'scroll',
                _.debounce((e) => {
                    // 锚点定位取消滚动联动
                    if (isAnchorNav.value) {
                        isAnchorNav.value = false
                        return
                    }

                    // 页面滚动联动锚点
                    const rootScrollTop = collapseWrapperParent.value?.scrollTop - _getScrollDiff()
                    if (
                        rootScrollTop === undefined ||
                        isNaN(rootScrollTop) ||
                        !collapseItemModels.value?.length
                    ) {
                        return
                    }

                    _initActive()

                    if (rootScrollTop < collapseItemModels.value[0].top) {
                        collapseItemModels.value[0].isActive = true
                        anchorWrapperRef.value.setScrollTop(0)
                        return
                    }

                    // 主动定位锚点
                    collapseItemModels.value.forEach((item, index) => {
                        const start = item.top
                        const end = start + item.height

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
                _cacheWrapperTopSize()
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

        // 实际父级滚动距离 = 存储的 item>wrapper 的距离 + wrapper>root 的顶部距离
        collapseWrapperParent.value.scrollTo({
            top: target.top + _getScrollDiff(),
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

    /**
     * 获取滚动差异：
     * 已知 item 节点获取距离父级元素的 top 是获取的 el-collapse 的
     * https://blog.csdn.net/kelly0721/article/details/109966274
     *
     * item model 存储的 top 值是基于 el-collapse 顶部的
     *
     * el-collapse 距离顶部的距离包含了滚动父容器的 pt 值
     *
     * 所以实际滚动距离 = el-collapse距离滚动容器的top + item到el-collapse的 - 滚动父容器的 padding-top
     * @returns
     */
    function _getScrollDiff() {
        const num = collapseRefOTop.value - parentWrapperPTop.value
        return num
    }

    function _cacheWrapperTopSize() {
        collapseRefOTop.value = (collapseRef?.value?.$el as HTMLElement)?.offsetTop ?? 0
        parentWrapperPTop.value =
            parseInt(getStyle(collapseWrapperParent.value, 'padding-top')) ?? 0
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
