import { computed, CSSProperties, Ref, onUpdated, watch, reactive, toRefs, nextTick } from 'vue'
import { useEventListener } from '@vueuse/core'
import { DetailProps, BtnProps, ColumnProps } from '../type'
import {
    DEFAULT_COLUMN_WIDTH,
    DEFAULT_MIN_COLUMN_WIDTH,
    DEFAULT_OPERATION_COLUMN_WIDTH,
    DEFAULT_SERIAL_COLUMN_WIDTH
} from '../const'
import { castArray } from 'lodash'
// import { useBtns } from './use-btns'

export const useTableColumns = (props: DetailProps, showOperation: boolean, slots) => {
    interface LocalState {
        columns: ColumnProps[]
    }
    const state = reactive<LocalState>({
        columns: []
    })

    const getFormItemProp = (slot) => slot?.props?.prop ?? slot?.type?.props?.prop?.default ?? ''

    const getTableCellStyle = (prop: string, columns: ColumnProps[]): CSSProperties => {
        // const prop = formItemSlot?.props?.prop ?? formItemSlot?.type?.props?.prop?.default ?? ''
        if (!prop) return
        const targetIndex = columns.findIndex((item) => item.prop === prop)
        let left = 0
        for (let i = 0; i < columns.length; i++) {
            if (i < targetIndex) {
                const { width, minWidth } = columns[i].style
                const columnWidth = width || minWidth
                left += Number(String(columnWidth)?.replace(/[^0-9]/gi, ''))
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
            fixColumns?.filter((item) => item.type !== 'serial')?.map((item) => item.prop) ?? []
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
        // console.log('getFirstColumnCellBorderClass')
        const { border, showSerial } = props
        const className = 'is-first-column-cell'
        if (type === 'serial' && border && !isHeader) {
            return className
        }
        if (type === 'form' && !showSerial && !isHeader && state.columns?.[0]?.prop === prop) {
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
        const { leftFixedColumns, fixedOperation, stripe, border } = props
        const isHead = classNames?.includes('table-head-item')
        const firstColumnCellBorderClass = getFirstColumnCellBorderClass(type, isHead, prop)
        const stripedClassName =
            stripe && (index + 1) % 2 === 0 && !isHead ? 'table-cell-striped' : ''
        const borderClassName = border ? 'table-cell-border' : ''
        let fixedClassNames = []
        // leftFixedColumn: ColumnProps
        if (type === 'serial') {
            if (leftFixedColumns === 1) {
                fixedClassNames = ['sticky-start', 'sticky-start-shadow']
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

        let leftFixedColumnList = state.columns?.filter((item, index) => index < leftFixedColumns)
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
        const { showSerial, operationWidth } = props
        let columns = slots
            ?.filter((item) => !item.children)
            ?.map((item, index) => {
                return {
                    prop: getFormItemProp(item),
                    label: item?.props?.label ?? item?.type?.props?.label?.default ?? '',
                    type: 'form',
                    required:
                        !!item?.props?.required ||
                        castArray(item?.props?.rules)?.some((rule) => rule?.required),
                    style: {
                        width: DEFAULT_COLUMN_WIDTH,
                        minWidth: DEFAULT_MIN_COLUMN_WIDTH,
                        maxWidth: DEFAULT_COLUMN_WIDTH,
                        // left: useTableCellStyle(showSerial ? index - 1 : index, showSerial)
                        //     .left as string
                        left: 0
                    }
                }
            })
        if (showSerial) {
            columns = [
                {
                    prop: 'serial',
                    label: '序号',
                    type: 'serial',
                    style: {
                        width: DEFAULT_SERIAL_COLUMN_WIDTH,
                        minWidth: DEFAULT_SERIAL_COLUMN_WIDTH,
                        maxWidth: DEFAULT_SERIAL_COLUMN_WIDTH,
                        left: 0
                    }
                },
                ...columns
            ]
        }
        if (showOperation) {
            const width = operationWidth
                ? String(operationWidth)?.replace(/[^0-9]/gi, '') + 'px'
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
                columns[i].style.left = getTableCellStyle(columns[i].prop, columns).left
            }
        }
        return columns
    }

    state.columns = getColumns(props, showOperation)

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

// export const useTableHeader = (props: DetailProps, btns: BtnProps[], slots): Ref<ColumnProps[]> => {
//     return computed<ColumnProps[]>(() => {
//         const { showSerial, showOperation, disabled } = props
//         let columns = slots
//             ?.filter((item) => !item.children)
//             ?.map((item) => {
//                 return {
//                     label: item?.props?.label ?? item?.type?.props?.label?.default ?? '',
//                     type: 'form'
//                 }
//             })
//         if (showSerial) {
//             columns = [{ label: '序号', type: 'serial' }, ...columns]
//         }
//         if (showOperation && !disabled && btns?.length > 0) {
//             columns = [...columns, { label: '操作', type: 'operation' }]
//         }
//         return columns
//     })
// }

// export const useTableHeaderStyle = (
//     label: string,
//     labelIndex: number,
//     showSerial: boolean,
//     operationWidth?: string | number
// ): CSSProperties => {
//     // return computed(() => {
//     // })
//     // console.log('useTableHeaderStyle')
//     let width: string, minWidth: string, maxWidth: string, left: string, right: string
//     if (label === '序号') {
//         width = DEFAULT_SERIAL_COLUMN_WIDTH
//         minWidth = width
//         maxWidth = width
//         left = '0px'
//     } else if (label === '操作') {
//         width = operationWidth
//             ? String(operationWidth)?.replace(/[^0-9]/gi, '') + 'px'
//             : DEFAULT_OPERATION_COLUMN_WIDTH
//         minWidth = width
//         maxWidth = width
//         right = '0px'
//     } else {
//         width = DEFAULT_COLUMN_WIDTH
//         minWidth = DEFAULT_MIN_COLUMN_WIDTH
//         maxWidth = DEFAULT_COLUMN_WIDTH
//         left = useTableCellStyle(showSerial ? labelIndex - 1 : labelIndex, showSerial)
//             .left as string
//     }
//     return label === '操作'
//         ? {
//             width,
//             minWidth,
//             maxWidth,
//             right,
//             textAlign: 'left'
//         }
//         : {
//             width,
//             minWidth,
//             maxWidth,
//             left,
//             textAlign: 'left'
//         }
// }

// export const useTableCellStyle = (prop: string, columns: ColumnProps[]): CSSProperties => {
//     // const prop = formItemSlot?.props?.prop ?? formItemSlot?.type?.props?.prop?.default ?? ''
//     if (!prop) return
//     const targetIndex = columns.findIndex((item) => item.prop === prop)
//     let left = 0
//     for (let i = 0; i < columns.length; i++) {
//         if (i < targetIndex) {
//             const { width, minWidth } = columns[i].style
//             const columnWidth = width || minWidth
//             left += Number(String(columnWidth)?.replace(/[^0-9]/gi, ''))
//         } else {
//             return
//         }
//     }
//     return {
//         left: left + 'px'
//     }
// }

// export const useTableCellStyle = (
//     formItemIndex: number,
//     showSerial: boolean,
//     showOperation?: boolean
// ): CSSProperties => {
//     let left: string
//     const width = Number(DEFAULT_COLUMN_WIDTH?.replace(/[^0-9]/gi, ''))
//     const serialWidth = Number(DEFAULT_SERIAL_COLUMN_WIDTH?.replace(/[^0-9]/gi, ''))
//     left = showSerial ? `${serialWidth + width * formItemIndex}px` : `${width * formItemIndex}px`
//     return {
//         left
//     }
// }

// export const useTableCellClassNames = (
//     type: ColumnProps['type'],
//     props: DetailProps,
//     classNames?: string[],
//     index?: Number
// ): string[] => {
//     // console.log('useTableCellClassNames')
//     const { showSerial, leftFixedColumns, fixedOperation } = props
//     let fixedClassNames = []
//     const fixedColumnsQuantity = Number(leftFixedColumns)
//     if (!fixedColumnsQuantity) return [...(classNames ?? []), 'table-cell']
//     if (type === 'serial') {
//         fixedClassNames =
//             fixedColumnsQuantity === 1 ? ['sticky-start', 'sticky-start-shadow'] : ['sticky-start']
//     } else if (type === 'operation') {
//         fixedClassNames = fixedOperation ? ['sticky-end', 'sticky-end-shadow'] : []
//     } else {
//         const lastFixedFormItemIndex = showSerial
//             ? fixedColumnsQuantity - 2
//             : fixedColumnsQuantity - 1
//         if (lastFixedFormItemIndex < Number(index)) {
//             fixedClassNames = []
//         } else if (lastFixedFormItemIndex === index) {
//             fixedClassNames = ['sticky-start', 'sticky-start-shadow']
//         } else {
//             fixedClassNames = ['sticky-start']
//         }
//     }
//     return [...(classNames ?? []), ...fixedClassNames, 'table-cell']
// }

export const useTableScrollClass = (scrollEl: any, tableEl: any, columns: ColumnProps[]) => {
    // console.log('useTableScrollClass', scrollEl, tableEl)

    let tableMinWidth = 0
    const tableClientWidth = scrollEl.clientWidth
    columns.forEach((item) => {
        const { width, minWidth } = item?.style ?? {}
        const columnWidth = width || minWidth
        tableMinWidth += Number(String(columnWidth)?.replace(/[^0-9]/gi, ''))
    })

    const scrollX = tableMinWidth > tableClientWidth

    const hasScrollClass = (className: string) => {
        return !!(tableEl && tableEl.classList.contains(className))
    }

    const setScrollClass = (className: string) => {
        // console.log('setScrollClass')
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
            new Set([...Array.from(el.classList), borderClass, ...classList])
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
                ? String(operationWidth)?.replace(/[^0-9]/gi, '') + 'px'
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
                minWidth: DEFAULT_COLUMN_WIDTH,
                maxWidth: DEFAULT_COLUMN_WIDTH
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

        left += Number(String(columnWidth)?.replace(/[^0-9]/gi, ''))

        // index ++
    }
}
