import type { ComponentResolver, SideEffectsInfo } from 'unplugin-vue-components/types'

export function JnVeGlobalResolver(): ComponentResolver {
    return {
        type: 'component',
        resolve(name: string) {
            if (name.startsWith('G') || name.startsWith('LG') || name.startsWith('Jn')) {
                return {
                    name,
                    from: 'jn-ve-global'
                }
            }
        }
    }
}
