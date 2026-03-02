/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-19 10:21:54
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-03-19 11:01:45
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\hooks\use-namespace\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { computed, ref, unref } from 'vue'

export const defaultNamespace = 'bi'
const statePrefix = 'is-'

const _bem = (
    namespace: string,
    block: string,
    blockSuffix: string,
    element: string,
    modifier: string
) => {
    let cls = `${namespace}-${block}`
    if (blockSuffix) {
        cls += `-${blockSuffix}`
    }
    if (element) {
        cls += `__${element}`
    }
    if (modifier) {
        cls += `--${modifier}`
    }
    return cls
}

export const useNamespace = (block: string) => {
    const namespace = computed<string>(() => defaultNamespace)
    const b = (blcokSuffix = '') => _bem(unref(namespace), block, blcokSuffix, '', '')
    const e = (element?: string) => (element ? _bem(unref(namespace), block, '', element, '') : '')
    const m = (modifier?: string) =>
        modifier ? _bem(unref(namespace), block, '', '', modifier) : ''
    const be = (blcokSuffix?: string, element?: string) =>
        blcokSuffix && element ? _bem(unref(namespace), block, blcokSuffix, element, '') : ''
    const em = (element?: string, modifier?: string) =>
        element && modifier ? _bem(unref(namespace), block, '', element, modifier) : ''
    const bm = (blockSuffix?: string, modifier?: string) =>
        blockSuffix && modifier ? _bem(unref(namespace), block, blockSuffix, '', modifier) : ''
    const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
        blockSuffix && element && modifier
            ? _bem(unref(namespace), block, blockSuffix, element, modifier)
            : ''
    const is: {
        (name: string, state: boolean | undefined): string
        (name: string): string
    } = (name: string, ...args: [boolean | undefined] | []) => {
        const state = args.length >= 1 ? args[0]! : true
        return name && state ? `${statePrefix}${name}` : ''
    }

    return {
        namespace,
        b,
        e,
        m,
        be,
        em,
        bm,
        bem,
        is
    }
}
