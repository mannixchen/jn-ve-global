import _ from 'lodash'

/**
 * 小驼峰转短横线
 * @param str 字符串
 * @returns 短横线
 */
export function hump2Partition(str: string) {
    return str.replace(/([A-Z])/g, (match, p1, offset, string) => {
        // 一个捕获组捕获全部，所以match等于p1
        return '-' + p1.toLowerCase()
    })
}

/**
 * 将小驼峰字段的对象转换成短横线字段的对象
 * @param obj 要转换的对象
 * @param excludes 排除的字段（字段将在最终的映射对象中排除）
 * @returns 短横线命名的对象
 */
export function humpObj2PartitionObj(obj: object, excludes?: Array<string> | string): object {
    const temp = {}
    Object.keys(obj).forEach((key) => {
        if (!excludes || !excludes.includes(key)) {
            const partitionK = hump2Partition(key)
            temp[partitionK] = obj[key]
        }
    })
    return temp
}

/**
 * 短横线转小驼峰
 * @param str 字符串
 * @returns 驼峰
 */
export function partition2Hump(str: string) {
    return str.replace(/(\-([a-z]))/g, (match, p1, p2, offset, string) => {
        // 这里有两个捕获组，第一个捕获组捕获全部并包含了第二个捕获组，所以match等于p1
        return p2.toUpperCase()
    })
}

/**
 * 将短横线字段的对象转换成驼峰字段的对象
 * @param obj 要转换的对象
 * @param excludes 排除的字段（字段将在最终的映射对象中排除）
 * @returns 短横线命名的对象
 */
export function partitionObj2HumpObj(obj: object, excludes?: Array<string> | string): object {
    const temp = {}
    Object.keys(obj).forEach((key) => {
        if (!excludes || !excludes.includes(key)) {
            const partitionK = partition2Hump(key)
            temp[partitionK] = obj[key]
        }
    })
    return temp
}

/**
 * 判断字符串是否为 json
 * @param str 要判断的字符串
 * @returns
 */
export function isJSON(str: string) {
    if (typeof str === 'string') {
        try {
            var obj = JSON.parse(str)
            if (typeof obj === 'object' && obj) {
                return true
            } else {
                return false
            }
        } catch (e) {
            // console.log(`%c error：${str} !!! ${e}`, 'color: #f56c6c;')
            return false
        }
    }
}

/**
 * 进阶处理 json 字符串
 * @param json 源数据
 * @param keyHandle key 的处理函数，接收 key 值，返回处理后的 key 值。格式为 '"key"' 带有双引号的 字符串
 * @param valHandle value 的处理函数，接收 value 值，返回处理后的 value 值。格式为 '"value"' 带有双引号的 字符串
 * @returns
 */
export function modifyJson(
    json: string,
    keyHandle?: (key: string) => string,
    valHandle?: (val: string) => string
) {
    return json.replace(
        /"(\\[^]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][-+]?\d+)?/g,
        function (match: string) {
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    // match = Key with enclosing quotes & following colon (".*"\s*:)
                    if (keyHandle) {
                        // 向外抛出不带 : 的，处理完后，再拼接 :
                        return `${keyHandle(match.replace(':', ''))}:`
                    }
                } else {
                    // match = String (not key) with enclosing quotes (".*")
                    if (valHandle) {
                        return valHandle(match)
                    }
                }
            }
            return match
        }
    )
}

/**
 * 函数字符串转函数体，遇到非函数字符串则抛出错误
 * @param str
 */
export function funStr2FuncBody(str: string) {
    if (typeof str !== 'string') return false

    try {
        return new Function('return ' + str)()
    } catch (e) {
        console.log(`%c error：${str} !!! ${e}`, 'color: #f56c6c;')
        return false
    }
}

/**
 * 反序列化函数，本质上是通过 new Function 将字符串转换成环境值
 * 常用于一些需要将字符串转换成特定对象的情况，如：
 *  - 将正则字符串转换成正则对象
 *  - 将从 json 截取的字符串（内部特殊字符如：\n 会被转换成 \\n），通过 new Function 转换成普通字符串
 *
 * 其实和 funStr2FuncBody 做的事情一样，为了命名区分及扩展，封装新的函数
 * 注意：在字符串中 \ 是特殊转义符，一般在书写正则时，如果想要书写的正则是带有 \ 的，在字符串中，应该体现为 \\
 * @param str
 */
export function deserialize(str: string) {
    if (typeof str !== 'string') return false

    try {
        return new Function('return ' + str)()
    } catch (e) {
        console.log(`%c error：${str} !!! ${e}`, 'color: #f56c6c;')
        return false
    }
}

/**
 * 获取字符串占据内存的大小
 * @param str 字符串
 * @param charset Unicode 编码集
 * @returns
 */
export function getStrSize(str: string, charset: string = 'UTF-8') {
    let total = 0
    charset = charset?.toLowerCase() || ''
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i)
        if (charset === 'utf-16' || charset === 'utf16') {
            total += charCode <= 0xffff ? 2 : 4
        } else {
            if (charCode <= 0x007f) {
                total += 1
            } else if (charCode <= 0x07ff) {
                total += 2
            } else if (charCode <= 0xffff) {
                total += 3
            } else {
                total += 4
            }
        }
    }
    return total
}

/**
 * 获取指定范围（以 a 开头，c 结尾）的字符串，不包含开头结尾
 * @param source 源数据
 * @param start 开头
 * @param end 结尾
 * @param handle 二次处理
 * @returns
 */
export function getRangeStr(
    source: string,
    start: string,
    end: string,
    handle?: (res: string) => string
) {
    if (!source || !start || !end) return

    /**
     * x(?=y)   先行断言: x 被 y 跟随时匹配 x
     * (?<=y)x  后行断言: x 跟随 y 的情况下匹配 x
     */
    const regStr = `/(?<=${start})[\\s\\S]*(?=${end})/`
    const reg = deserialize(regStr)

    // 匹配结果
    const res = source.match(reg)?.[0]

    // 用户传递的回调二次处理
    if (handle) {
        return handle(res)
    }

    return res
}

/**
 * 是否是 base64 字符串
 * @param str
 */
export function isBase64(str: string) {
    const reg = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
    return reg.test(str)
}

/**
 * 由于decodeURI转码时，通过%进行解析，如果字符串中存在%(如： ‘0.9%氯化钠注射液’)
 * 则会出现URI malformed
 */
export function percent2percent25(str: string) {
    if (str.indexOf('%') > -1) {
        return str.replace(/%/g, '%25')
    } else {
        return str
    }
}
