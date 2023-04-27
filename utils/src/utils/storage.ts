import { percent2percent25 } from './string'
import { global, getGlobal } from './bom'

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
    // 设置永久缓存
    set(key: string, val: any) {
        ;(global || getGlobal()).localStorage.setItem(key, JSON.stringify(val))
    },
    // 获取永久缓存
    get(key: string) {
        let json: any = (global || getGlobal()).localStorage.getItem(key)
        return JSON.parse(json)
    },
    // 移除永久缓存
    remove(key: string) {
        ;(global || getGlobal()).localStorage.removeItem(key)
    },
    // 移除全部永久缓存
    clear() {
        ;(global || getGlobal()).localStorage.clear()
    },
    // 数组 push
    push(key: string, val: any) {
        const arr = this.get(key) || []
        arr.push(val)
        this.set(key, arr)
    },
    // 数组 unshift
    unshift(key: string, val: any) {
        const arr = this.get(key) || []
        arr.unshift(val)
        this.set(key, arr)
    }
}

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
    // 设置临时缓存
    set(key: string, val: any) {
        ;(global || getGlobal()).sessionStorage.setItem(key, JSON.stringify(val))
    },
    // 获取临时缓存
    get(key: string) {
        let json: any = (global || getGlobal()).sessionStorage.getItem(key)
        return JSON.parse(json)
    },
    // 移除临时缓存
    remove(key: string) {
        ;(global || getGlobal()).sessionStorage.removeItem(key)
    },
    // 移除全部临时缓存
    clear() {
        ;(global || getGlobal()).sessionStorage.clear()
    },
    // 数组 push
    push(key: string, val: any) {
        const arr = this.get(key) || []
        arr.push(val)
        this.set(key, arr)
    },
    // 数组 unshift
    unshift(key: string, val: any) {
        const arr = this.get(key) || []
        arr.unshift(val)
        this.set(key, arr)
    }
}

/**
 * cookie
 */
export const Cookie = {
    set(name: string, value: string, days: number) {
        const val = percent2percent25(value)
        let d = new Date()
        d.setDate(d.getDate() + days)
        document.cookie = `${name}=${encodeURIComponent(val)};expires=${d};path=/;`
    },
    get(name: string) {
        const cookieStr = percent2percent25(document.cookie)
        let arr = decodeURIComponent(cookieStr).split('; ')
        for (let i = 0; i < arr.length; i++) {
            let newarr = arr[i].split('=')
            if (name === newarr[0]) {
                return newarr[1]
            }
        }
    },
    del(name: string) {
        this.set(name, '', -1)
    }
}
