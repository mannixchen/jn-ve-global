import _ from 'lodash'
import { str2Arr, arr2Str } from './string'
/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns
 */
export function filterObj(obj: object) {
    if (!(typeof obj === 'object')) {
        return
    }

    for (let key in obj) {
        if (
            obj.hasOwnProperty(key) &&
            (obj[key] === null || obj[key] === undefined || obj[key] === '')
        ) {
            delete obj[key]
        }
    }
    return obj
}

/**
 * b 对象赋值给 a 对象相同的字段
 * @param target 目标数据
 * @param provider 提供者
 * @param excludes 要排除的 key 数组
 * @param ignore 是否无视 undefined 或 null，即使提供者的字段无效，也进行赋值
 */
export function assignOwnProp(
    target: object,
    provider: object,
    excludes?: Array<string>,
    ignore?: boolean
) {
    Object.keys(target).forEach((k) => {
        if (excludes && excludes.includes(k)) {
            return false
        }

        if (!ignore && (provider[k] === undefined || provider[k] === null)) {
            return false
        }

        if (typeof provider[k] === 'object') {
            target[k] = _.cloneDeep(provider[k])
        } else {
            target[k] = provider[k]
        }
    })
}

/**
 * 合并两个对象的有效字段，无效字段从目标对象中移除
 * @param target 目标输出对象，是对源对象进行操作的
 * @param provider 提供者
 * @param processor 处理器钩子，需要返回布尔值或无返回值；true: 有效 | false: 无效 | undefined: 无返回值，交由自判断
 */
export function assignValidField(
    target: object,
    provider: object,
    processor?: (key: string, value: any) => boolean | undefined
) {
    Object.keys(provider).forEach((key) => {
        const providerVal = provider[key]

        /**
         * 处理器优先，是从字段级别出发的
         * 如果无返回值，不予处理
         */
        if (processor) {
            const res = processor(key, providerVal)
            if (res !== undefined && res === false) {
                delete target[key]
                return
            } else if (res !== undefined && res === true) {
                target[key] = providerVal
                return
            }
        }

        // 使用 isValidValue 进行判断
        if (!isValidValue(providerVal)) {
            delete target[key]
            return
        } else {
            target[key] = providerVal
        }
    })
}

/**
 * 增强版序列化对象：可以将对象转换成字符串，通过 JSON.stringify 实现
 *  - JSON.stringify 不能序列化函数，当前方法可以序列化函数
 *  - 但是不能序列化简写的函数，如：对象函数简写方式
 *
 * 注意：可序列化的函数，只能是声明式或箭头函数
 */
export const advanceSerialize = {
    FUNC_PREFIX: 'FUNC_PREFIX',
    stringify(obj: any, space?: number | string, error?: (err: Error | unknown) => void) {
        try {
            return JSON.stringify(
                obj,
                (k, v) => {
                    if (typeof v === 'function') {
                        return `${this.FUNC_PREFIX}${v}`
                    }
                    return v
                },
                space
            )
        } catch (err) {
            error && error(err)
        }
    },
    parse(jsonStr: string, error?: (err: Error | unknown) => void) {
        try {
            return JSON.parse(jsonStr, (key, value) => {
                if (value && typeof value === 'string') {
                    return value.indexOf(this.FUNC_PREFIX) !== -1
                        ? new Function(`return ${value.replace(this.FUNC_PREFIX, '')}`)()
                        : value
                }
                return value
            })
        } catch (err) {
            error && error(err)
        }
    }
}

/**
 * 清空 obj 所有的 key（非改变引用）
 * @param obj
 */
export function emptyObj(obj: object) {
    Object.keys(obj).forEach((key) => delete obj[key])
}

/**
 * 获取数组 or 对象的长度
 * @param target
 * @returns
 */
export function getLength(target: Array<any> | object) {
    if (_.isArray(target)) return target.length
    if (_.isObject(target)) return Object.keys(target).length
}

export interface KeyFound {
    key: string
    type: 'add' | 'sub' | 'change'
    newValue: any
    oldValue: any
}
/**
 * 比较两个对象不同的属性值（常用于 vue watch 对象，且深度监听，获取改变的字段）
 * @param newObj 新对象
 * @param oldObj 旧对象
 * @returns
 */
export function difference(newObj: object, oldObj: object) {
    let keyFounds: KeyFound[] = []

    // 旧对象没有，新对象有，代表所有字段都是新增的
    if (!oldObj && newObj) {
        keyFounds = Object.keys(newObj).map((key) => {
            return {
                key,
                type: 'add',
                newValue: newObj[key],
                oldValue: undefined
            }
        })
        return keyFounds
    }

    // 新对象没有，旧对象有，代表所有字段都是减少的
    if (!newObj && oldObj) {
        keyFounds = Object.keys(oldObj).map((key) => {
            return {
                key,
                type: 'sub',
                newValue: undefined,
                oldValue: newObj[key]
            }
        })
        return keyFounds
    }

    Object.keys(newObj).forEach((key) => {
        // 新的有，旧的也有（变化的）
        if (newObj[key] !== undefined && oldObj[key] !== undefined) {
            if (newObj[key] !== oldObj[key]) {
                keyFounds.push({
                    key,
                    type: 'change',
                    newValue: newObj[key],
                    oldValue: oldObj[key]
                })
            }
        }

        // 新的有，旧的没有（新增的）
        else if (newObj[key] !== undefined && oldObj[key] === undefined) {
            keyFounds.push({
                key,
                type: 'add',
                newValue: newObj[key],
                oldValue: oldObj[key]
            })
        }
    })

    // 新的没有，旧的有（减少的）
    Object.keys(oldObj).forEach((key) => {
        if (newObj[key] === undefined && oldObj[key] !== undefined) {
            keyFounds.push({
                key,
                type: 'sub',
                newValue: newObj[key],
                oldValue: oldObj[key]
            })
        }
    })

    // console.group(`%c 开始比对 ===== `, 'color: #000;')
    // console.log(`%c new ===== `, 'color: #67c23a;', newObj)
    // console.log(`%c old ===== `, 'color: #f56c6c;', oldObj)
    // console.log(`%c 差异 ===== `, 'color: #409eff;', keyFounds)
    // console.groupEnd()

    return keyFounds
}

/**
 * 递归性的处理数据中无效的引用类型数据（数组 or 对象），直接改变源数据
 * @param source 源数据
 * @param parent 父级，在自身数据清空后，促使父级移除自身
 * @returns
 */
export function clearEmpty(source: object | Array<any>, parent?: object | Array<any>) {
    if (_.isArray(source)) {
        source.forEach((item, index) => {
            if (_.isObject(item) && _.isEmpty(item)) {
                source.splice(index, 1)
                return
            }

            if (_.isObject(item)) {
                clearEmpty(item, source)
            }
        })

        if (parent && _.isEmpty(source)) {
            clearEmpty(parent)
            return
        }

        return
    }

    if (_.isObject(source)) {
        _.keys(source).forEach((key) => {
            const item = source[key]

            if (_.isObject(item) && _.isEmpty(item)) {
                delete source[key]
                return
            }

            if (_.isObject(item) && !_.isEmpty(item)) {
                clearEmpty(item, source)
            }
        })
    }
}

/**
 * 判断目标是否是 object 且不是数组的 object
 * @param target
 * @returns
 */
export function isObject(target: any) {
    return !!target && _.isObject(target) && !_.isArray(target)
}

/**
 * 把对象的指定字段从字符串数组转换成字符串，副作用函数
 * @param obj
 * @param field
 * @param symbol
 */
export function objFieldArr2Str(obj: object, field: string, symbol: string = ',') {
    obj[field] = arr2Str(obj[field], symbol)
    return obj
}

/**
 * 将对象的指定字段从字符串转换成数组，副作用函数
 * @param obj
 * @param field
 * @param symbol
 */
export function objFieldStr2Arr(obj: object, field: string, symbol: string = ',') {
    obj[field] = str2Arr(obj[field], symbol)
    return obj
}

/**
 * 对象转 url 参数序列化
 * @param obj
 * @returns
 */
export function obj2Params(obj: object): string {
    let paramStr = ''
    Object.keys(obj).forEach((item) => {
        if (paramStr === '') {
            paramStr = `${item}=${obj[item]}`
        } else {
            paramStr = `${paramStr}&${item}=${obj[item]}`
        }
    })
    return paramStr
}

/**
 * url 转 对象格式
 * @param url
 * @returns
 */
export function urlParams2Obj(url: string) {
    var params = {}
    var arr = url.split('?')
    if (arr.length <= 1) {
        return params
    }
    arr = arr[1].split('&')
    arr.forEach((v, i) => {
        let str = v.split('=')[1]
        if (str.indexOf('%') === -1) {
            params[v.split('=')[0]] = v.split('=')[1]
        } else {
            params[v.split('=')[0]] = JSON.parse(decodeURIComponent(v.split('=')[1]))
        }
    })
    return params
}

/**
 * 递归查找对象中指定属性名的值（返回第一个匹配的值）
 * @param obj 要搜索的对象
 * @param targetKey 目标属性名
 * @returns 找到的属性值，未找到则返回 undefined
 */
export function findPropDeep(obj: any, targetKey: string, visited = new WeakSet()): any {
    // 如果不是对象或是 null，直接返回 undefined
    if (
        obj === null ||
        typeof obj !== 'object' ||
        (typeof obj === 'object' && Object.keys(obj).length === 0)
    ) {
        return undefined
    }

    // 检测循环引用
    if (visited.has(obj)) {
        return undefined
    }
    visited.add(obj)

    // 如果当前对象直接包含目标属性，返回该属性值
    if (Object.prototype.hasOwnProperty.call(obj, targetKey)) {
        return obj[targetKey]
    }

    // 递归搜索所有属性
    for (const key in obj) {
        // 使用 Object.prototype.hasOwnProperty.call 而不是直接使用 obj.hasOwnProperty 的原因：
        // 1. 对象可能重写了 hasOwnProperty 方法，导致结果不准确
        // 2. 对象可能没有 hasOwnProperty 方法（比如使用 Object.create(null) 创建的对象）
        // 3. 通过 call 调用 Object.prototype 上的原始方法，确保判断的准确性
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const result = findPropDeep(obj[key], targetKey, visited)
            if (result !== undefined) return result
        }
    }

    return undefined
}

/**
 * 递归查找对象中指定属性名的所有值
 * @param obj 要搜索的对象
 * @param targetKey 目标属性名
 * @returns 包含所有匹配值的数组
 */
export function findAllPropsDeep(obj: any, targetKey: string): any[] {
    const results: any[] = []

    function search(current: any) {
        if (current === null || typeof current !== 'object') return

        if (Object.prototype.hasOwnProperty.call(current, targetKey)) {
            results.push(current[targetKey])
        }

        for (const key in current) {
            search(current[key])
        }
    }

    search(obj)
    return results
}

/**
 * 判断传入的值是否有效
 * @param value 要判断的值
 * @returns boolean 值是否有效
 */
export function isValidValue(value: any): boolean {
    if (
        _.isNull(value) ||
        _.isUndefined(value) ||
        (_.isArray(value) && !value.length) ||
        (_.isString(value) && !value) ||
        // (_.isNumber(value) && value === 0) ||
        (_.isBoolean(value) && value === false) ||
        (_.isObject(value) && _.isEmpty(value)) ||
        (_.isArray(value) && value.length && (value as Array<any>).every((item) => !item))
    ) {
        return false
    }
    return true
}
