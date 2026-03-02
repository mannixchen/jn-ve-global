import { computed, CSSProperties, Ref, onUpdated, watch, reactive, toRefs, nextTick } from 'vue'
import { useEventListener, useMutationObserver } from '@vueuse/core'
import { DetailProps, BtnProps, ColumnProps } from '../type'
import {
    DEFAULT_COLUMN_WIDTH,
    DEFAULT_MIN_COLUMN_WIDTH,
    DEFAULT_OPERATION_COLUMN_WIDTH,
    DEFAULT_CHECKBOX_COLUMN_WIDTH,
    DEFAULT_SERIAL_COLUMN_WIDTH
} from '../const'
import { castArray } from 'lodash'
import { __is_simulator_env__ } from '../../../constants'
import { useNamespace } from '../../../hooks'
import { findPropDeep } from '@jsjn/utils'

export const useTableColumns = (props: DetailProps, showOperation: boolean, slots) => {
    interface LocalState {
        columns: ColumnProps[]
    }
    const state = reactive<LocalState>({
        columns: []
    })

    /**
     * 基于 gcolformItem vnode 的 props 获取字段唯一值
     * @param vnode
     * @returns
     */
    const getFormItemProp = (vnode) => {
        // const prop = findPropDeep(vnode?.props?.__schema, 'prop')
        const prop =
            findPropDeep(vnode?.props?.__schema, 'prop') || findPropDeep(vnode?.props, 'prop') || ''
        return prop
    }

    const getTableCellStyle = (
        type: ColumnProps['type'],
        columns: ColumnProps[],
        prop?: string
    ): CSSProperties => {
        const { multiple } = props
        if (type === 'selection') {
            return {
                left: 0
            }
        } else if (type === 'serial') {
            if (multiple) {
                const { width, minWidth } = columns[0].style
                return {
                    left: width || minWidth
                }
            } else {
                return {
                    left: 0
                }
            }
        }

        if (!prop) {
            // throw new Error('请设置表单项prop')
            return {}
        }

        const targetIndex = columns.findIndex((item) => item.prop === prop)

        let left = 0
        for (let i = 0; i < columns.length; i++) {
            if (i < targetIndex) {
                const { width, minWidth } = columns[i].style
                const columnWidth = width || minWidth
                left += parseFloat(String(columnWidth))
            } else {
                break
            }
        }

        return {
            left: left + 'px'
        }
    }

    const getLeftFixedClass = (prop: string, fixColumns: ColumnProps[]) => {
        let classNames: string[] = []
        const fixedPropList =
            fixColumns
                ?.filter((item) => item.type !== 'serial' && item.type !== 'selection')
                ?.map((item) => item.prop) ?? []
        const lastFixedProp = fixColumns?.at(-1)?.prop
        if (prop === lastFixedProp) {
            classNames = ['sticky-start', 'sticky-start-shadow']
        } else {
            if (fixedPropList.includes(prop)) {
                classNames = ['sticky-start']
            }
        }
        return classNames
    }

    const getFirstColumnCellBorderClass = (
        type: ColumnProps['type'],
        isHeader: boolean,
        prop?: string
    ) => {
        const { border, showSerial, multiple } = props
        const className = 'is-first-column-cell'
        if (type === 'selection' && border) {
            return className
        }
        if (type === 'serial' && border && !multiple && !isHeader) {
            return className
        }
        if (
            type === 'form' &&
            !showSerial &&
            !multiple &&
            !isHeader &&
            state.columns?.[0]?.prop === prop
        ) {
            return className
        }
        return ''
    }

    const getTableCellClass = (
        type: ColumnProps['type'],
        classNames: string[] = [],
        index: number,
        prop?: string
    ) => {
        // console.log('getTableCellClass', props)
        const { leftFixedColumns, fixedOperation, stripe, border, multiple } = props
        const isHead = classNames?.includes('table-head-item')
        const firstColumnCellBorderClass = getFirstColumnCellBorderClass(type, isHead, prop)
        const stripedClassName =
            stripe && (index + 1) % 2 === 0 && !isHead ? 'table-cell-striped' : ''
        const borderClassName = border ? 'table-cell-border' : ''
        let fixedClassNames = []
        // leftFixedColumn: ColumnProps

        if (type === 'selection') {
            fixedClassNames =
                leftFixedColumns > 0 ? ['sticky-start'] : ['sticky-start', 'sticky-start-shadow']

            return [
                ...classNames,
                ...fixedClassNames,
                stripedClassName,
                firstColumnCellBorderClass,
                borderClassName,
                'table-cell',
                'table-selection-cell'
            ]
        }

        if (type === 'serial') {
            if (leftFixedColumns === 1) {
                fixedClassNames = multiple
                    ? ['sticky-start']
                    : ['sticky-start', 'sticky-start-shadow']
            } else if (leftFixedColumns > 1) {
                fixedClassNames = ['sticky-start']
            }
            return [
                ...classNames,
                ...fixedClassNames,
                stripedClassName,
                firstColumnCellBorderClass,
                borderClassName,
                'table-cell'
            ]
        }

        let leftFixedColumnList = state.columns?.filter((item, index) => {
            return multiple ? index < leftFixedColumns + 1 : index < leftFixedColumns
        })
        if (fixedOperation) {
            leftFixedColumnList = leftFixedColumnList.filter((item) => item.type !== 'operation')
            // leftFixedColumn = leftFixedColumnList.at(-1)
            if (type === 'operation') {
                fixedClassNames = ['sticky-end', 'sticky-end-shadow']
            } else if (type === 'form') {
                fixedClassNames = getLeftFixedClass(prop, leftFixedColumnList)
            }
        } else {
            // leftFixedColumn = leftFixedColumnList.at(-1)
            fixedClassNames = getLeftFixedClass(prop, leftFixedColumnList)
            // if (type === 'operation') {
            // } else if (type === 'form') {
            //     fixedClassNames = getLeftFixedClass(prop, leftFixedColumnList)
            // }
        }

        return [
            ...classNames,
            ...fixedClassNames,
            stripedClassName,
            firstColumnCellBorderClass,
            borderClassName,
            'table-cell'
        ]
    }

    const getTableRowClass = (index: number, classNames: string[] = []) => {
        const className = props.stripe && (index + 1) % 2 === 0 ? 'table-row-is-striped' : ''
        return [...classNames, className]
    }

    const getTableClass = (classNames: string[]) => {
        const { stripe, border } = props
        const stripeClassName = stripe ? 'table-stripe' : ''
        const borderClassName = border ? 'table-border' : ''
        return [...classNames, stripeClassName, borderClassName]
    }

    const getColumns = (props: DetailProps, showOperation: boolean) => {
        // console.log('getColumns', props, showOperation)
        const { showSerial, operationWidth, disabled } = props

        let columns = slots
            // ?.filter((item) => !item.children)
            ?.map((vnode, index) => {
                const rules = findPropDeep(vnode.props, 'rules')
                const required = rules?.some((rule) => rule?.required)

                // 宽度继承设计时传递的宽度配置
                const width = vnode.props?.style?.width ?? DEFAULT_COLUMN_WIDTH
                // const width = vnode.props?.style?.width ?? 'auto'

                return {
                    prop: getFormItemProp(vnode),
                    label: findPropDeep(vnode.props, 'label') ?? '',
                    type: 'form',
                    required,
                    style: {
                        width,
                        minWidth: DEFAULT_MIN_COLUMN_WIDTH,
                        maxWidth: width,
                        // minWidth: '200px',
                        // maxWidth: '400px',
                        left: 0
                    }
                }
            })

        // 复选框
        if (props?.multiple) {
            columns = [
                {
                    prop: 'selection',
                    label: '',
                    type: 'selection',
                    style: {
                        width: DEFAULT_CHECKBOX_COLUMN_WIDTH,
                        minWidth: DEFAULT_CHECKBOX_COLUMN_WIDTH,
                        maxWidth: DEFAULT_CHECKBOX_COLUMN_WIDTH,
                        left: 0
                    }
                },
                ...columns
            ]
        }

        // 序号列
        if (showSerial) {
            const serialColumn = {
                prop: 'serial',
                label: '序号',
                type: 'serial',
                style: {
                    width: DEFAULT_SERIAL_COLUMN_WIDTH,
                    minWidth: DEFAULT_SERIAL_COLUMN_WIDTH,
                    maxWidth: DEFAULT_SERIAL_COLUMN_WIDTH,
                    left: props?.multiple ? DEFAULT_CHECKBOX_COLUMN_WIDTH : 0
                }
            }

            // columns = props?.multiple
            //     ? columns.splice(1, 0, serialColumn)
            //     : [serialColumn, ...columns]
            props?.multiple
                ? columns.splice(1, 0, serialColumn)
                : columns.splice(0, 0, serialColumn)
        }

        // 操作列
        if (showOperation && !disabled) {
            const width = operationWidth
                ? parseFloat(String(operationWidth)) + 'px'
                : DEFAULT_OPERATION_COLUMN_WIDTH

            columns = [
                ...columns,
                {
                    prop: 'operation',
                    label: '操作',
                    type: 'operation',
                    style: {
                        width,
                        minWidth: width,
                        maxWidth: width,
                        right: 0
                    }
                }
            ]
        }
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].type === 'form') {
                columns[i].style.left = getTableCellStyle('form', columns, columns[i].prop).left
            }
        }
        return columns
    }

    state.columns = getColumns(props, showOperation)
    // console.log('columns', state.columns)

    // onUpdated(() => {
    //     state.columns = getColumns(props, showOperation)
    // })

    watch(
        () => props.showSerial,
        (val) => {
            state.columns = getColumns(props, showOperation)
        }
    )

    watch(
        () => showOperation,
        (val) => {
            state.columns = getColumns(props, val)
        }
    )

    return {
        ...toRefs(state),
        getFormItemProp,
        getTableCellStyle,
        getTableCellClass,
        getTableRowClass,
        getTableClass
    }

    // return computed<ColumnProps[]>()
}

export const useTableScrollClass = (scrollEl: any, tableEl: any, columns: ColumnProps[]) => {
    let tableMinWidth = 0
    const tableClientWidth = scrollEl.clientWidth
    columns.forEach((item) => {
        const { width, minWidth } = item?.style ?? {}
        const columnWidth = width || minWidth
        tableMinWidth += parseFloat(String(columnWidth))
    })

    const scrollX = tableMinWidth > tableClientWidth

    const hasScrollClass = (className: string) => {
        return !!(tableEl && tableEl.classList.contains(className))
    }

    const setScrollClass = (className: string) => {
        if (!tableEl) return
        const classNames = Array.from(tableEl.classList).filter(
            (item) => !(item as string)?.startsWith('is-scrolling-')
        )
        classNames.push(scrollX ? className : 'is-scrolling-none')
        tableEl.className = classNames.join(' ')
    }

    const syncPosition = () => {
        // console.log('syncPosition')
        // const scrollContainer = tableEl
        if (!scrollX) {
            const scrollingNoneClass = 'is-scrolling-none'
            if (!hasScrollClass(scrollingNoneClass)) {
                setScrollClass(scrollingNoneClass)
            }
            return
        }
        if (!scrollEl) return
        const { scrollLeft, offsetWidth, scrollWidth } = scrollEl
        const maxScrollLeftPosition = scrollWidth - offsetWidth - 1
        if (scrollLeft >= maxScrollLeftPosition) {
            setScrollClass('is-scrolling-right')
        } else if (scrollLeft === 0) {
            setScrollClass('is-scrolling-left')
        } else {
            setScrollClass('is-scrolling-middle')
        }
    }

    // 组件渲染后,加上相应的滚动样式
    syncPosition()

    const bindScrollEvent = () => {
        if (!scrollEl) return
        useEventListener(scrollEl, 'scroll', syncPosition, {
            passive: true
        })
    }

    return bindScrollEvent
}

export const useSimulatorTableStyle = (props: DetailProps, tableEl: any) => {
    // console.log('useSimulatorTableStyle')
    if (!tableEl) return
    const { leftFixedColumns, fixedOperation, stripe, border, operationWidth } = props

    const setStyle = (el: any, style: CSSProperties) => {
        Object.entries(style).forEach(([key, value]) => {
            el.style[key] = value
        })
    }

    const setClass = (el: any, classList: string[]) => {
        // console.log('setClass')
        if (!el) return
        const borderClass = border ? 'form-item-border' : ''
        el.className = Array.from(
            new Set([
                ...Array.from(el.classList)
                    ?.filter((item) => item !== 'form-item-border')
                    ?.filter((item) => !(item as string)?.startsWith('sticky-')),
                borderClass,
                ...classList
            ])
        )?.join(' ')
    }

    const getLeftFixedClass = (index: number) => {
        // console.log('getLeftFixedClass', index)
        let classList: string[] = []
        if (index < leftFixedColumns) {
            classList = ['sticky-start']
        } else if (index === leftFixedColumns) {
            classList = ['sticky-start', 'sticky-start-shadow']
        }
        return classList
    }

    let left = 0,
        index = 0
    for (const el of tableEl?.children) {
        index++

        if (el?.className?.includes('serial-column')) {
            setStyle(el, {
                left: '0px',
                width: DEFAULT_SERIAL_COLUMN_WIDTH,
                minWidth: DEFAULT_SERIAL_COLUMN_WIDTH,
                maxWidth: DEFAULT_SERIAL_COLUMN_WIDTH
            })

            setClass(el, getLeftFixedClass(index))
        } else if (el?.className?.includes('operation-column')) {
            const width = operationWidth
                ? parseFloat(String(operationWidth)) + 'px'
                : DEFAULT_OPERATION_COLUMN_WIDTH

            setStyle(el, {
                right: '0px',
                width: width,
                minWidth: width,
                maxWidth: width
            })

            setClass(
                el,
                fixedOperation ? ['sticky-end', 'sticky-end-shadow'] : getLeftFixedClass(index)
            )
        } else {
            setStyle(el, {
                // right: '0px',
                width: DEFAULT_COLUMN_WIDTH,
                // maxWidth: DEFAULT_COLUMN_WIDTH,
                minWidth: DEFAULT_COLUMN_WIDTH
            })
            setClass(el, getLeftFixedClass(index))
        }
        const columnWidth = el.style.width || el.style.minWidth
        if (
            !el?.className?.includes('serial-column') &&
            !el?.className?.includes('operation-column')
        ) {
            setStyle(el, {
                left: left + 'px'
            })
        }

        left += parseFloat(String(columnWidth))

        // index ++
    }

    useMutationObserver(
        tableEl,
        (mutations) => {
            // console.log('mutations', mutations)
            useSimulatorTableStyle(props, tableEl)
        },
        {
            childList: true
        }
    )

    //
    watch(
        () => props?.border,
        (val) => {
            // for (const el of tableEl?.children) {
            //     const classList = Array.from(el.classList)?.filter(
            //         (item) => item !== 'form-item-border'
            //     )
            //     const borderClass = val ? 'form-item-border' : ''
            //     el.className = [...classList, borderClass]?.join(' ')
            // }
            useSimulatorTableStyle(props, tableEl)
        }
    )

    watch(
        () => props?.fixedOperation,
        (val) => {
            // console.log('watch-fixedOperation', props)
            useSimulatorTableStyle(props, tableEl)
        }
    )

    watch(
        () => props?.leftFixedColumns,
        (val) => {
            useSimulatorTableStyle(props, tableEl)
        }
    )

    watch(
        () => props?.operationWidth,
        (val) => {
            // console.log('watch-operationWidth', val)
            // const index = tableEl?.children?.length - 1
            // const width = val
            //     ? String(val)?.replace(/[-+]?\d*\.\d+|[-+]?\d+/g, '') + 'px'
            //     : DEFAULT_OPERATION_COLUMN_WIDTH

            // setStyle(tableEl.children[index], {
            //     right: '0px',
            //     width: width,
            //     minWidth: width,
            //     maxWidth: width
            // })
            useSimulatorTableStyle(props, tableEl)
        }
    )
}
