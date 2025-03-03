import { AmountUnits } from '../../constants'
import type { SelectOptionProps } from 'jn-ve-global'

export enum InputNumberDisplayTypes {
    NUMBER = '0',
    PERCENTAGE = '1',
    THOUSANDTH = '2',
    TEN_THOUSANDTH = '3'
}

export enum Currency {
    CNY = '0',
    USD = '1',
    EUR = '2',
    GBP = '3',
    JPY = '4',
    CAD = '5',
    AUD = '6',
    CHF = '7',
    KRW = '8',
    INR = '9'
}

export const inputNumberSuffixMap = new Map([
    [InputNumberDisplayTypes.NUMBER, ''],
    [InputNumberDisplayTypes.PERCENTAGE, '%'],
    [InputNumberDisplayTypes.THOUSANDTH, '‰'],
    [InputNumberDisplayTypes.TEN_THOUSANDTH, '‱'],
    [AmountUnits.YUAN as string, '元'],
    [AmountUnits.WAN_YUAN as string, '万元'],
    [AmountUnits.YI_YUAN as string, '亿元']
])

export const currencyOptions: SelectOptionProps[] = [
    { label: '人民币(CNY)', value: Currency.CNY },
    { label: '美元(USD)', value: Currency.USD },
    { label: '欧元(EUR)', value: Currency.EUR },
    { label: '英镑(GBP)', value: Currency.GBP },
    { label: '日元(JPY)', value: Currency.JPY },
    { label: '加拿大元(CAD)', value: Currency.CAD },
    { label: '澳大利亚元(AUD)', value: Currency.AUD },
    { label: '瑞士法郎(CHF)', value: Currency.CHF },
    { label: '韩元(KRW)', value: Currency.KRW },
    { label: '印度卢比(INR)', value: Currency.INR }
]
