export interface DefaultBaseModuleProps {
    border?: boolean
    columnsConfigurable?: boolean
}

let _defaultProps: DefaultBaseModuleProps = {
    border: false,
    columnsConfigurable: false
}

export function getBaseModuleProps(): DefaultBaseModuleProps {
    return _defaultProps
}

export function setBaseModuleProps(props: DefaultBaseModuleProps) {
    _defaultProps = { ..._defaultProps, ...props }
}
