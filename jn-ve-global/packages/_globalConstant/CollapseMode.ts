export type CollapseMode = 'syb' | 'default'

let _mode: CollapseMode = 'default'

export function getCollapseMode(): CollapseMode {
    return _mode
}

export function setCollapseMode(mode: CollapseMode): void {
    _mode = mode
}
