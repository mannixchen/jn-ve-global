export * from './tableColumnsKey'

export enum Order {
    ASCENT = '0', // 升序
    DESCENT = '1' // 降序
}

export const orderOptions = [
    { label: '升序', value: Order.ASCENT },
    { label: '降序', value: Order.DESCENT }
]
