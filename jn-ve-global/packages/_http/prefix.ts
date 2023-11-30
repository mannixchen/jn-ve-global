export let prefix = window['__BASE_PREFIX__']

export function setPrefix(prf: string) {
    prefix = prf
}

export function getPrefix() {
    return prefix
}
