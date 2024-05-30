import { FormItemProps as ElFormItemProps } from 'element-plus'
// import { AddressControlConfig } from 'jn-ve-global'

// export type BiAddressProps = AddressControlConfig['props']
export interface BiAddressProps {
    hideDetail?: boolean
    options?: any[]
    onChange?: (region?: string | string[], detail?: string, regionText?: string[]) => void
}

export type BiFiAddressProps = BiAddressProps & ElFormItemProps
