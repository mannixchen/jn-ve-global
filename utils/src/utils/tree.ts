import _ from 'lodash'

/**
 * 依据子节点的 parentId 查找父节点
 * @param source 源数据（树）
 * @param pid 子节点的 parentId
 * @returns 父节点
 */
export function findParentByPId(source: any, pid: string | number) {
    let parent = null

    function recursion(source: any, pid: string | number) {
        for (let i = 0; i < source.length; i++) {
            const item = source[i]
            if (item.id === pid) {
                parent = item

                break
            }

            if (item.children && item.children.length) {
                recursion(item.children, pid)
            }
        }
    }

    recursion(source, pid)
    return parent
}

/**
 * 根据 id 查找目标对象，或目标对象的指定字段
 * @param source 源数据
 * @param id 目标id
 * @param field 是否返回目标的指定字段
 * @returns 目标对象 || 目标的指定字段
 */
export function findTargetById(source: any[], id: string, field?: string) {
    if (!id || source.length === 0) return null

    let target = null

    function recursion(source: any, id: string) {
        for (let i = 0; i < source.length; i++) {
            const item = source[i]
            if (item.id === id) {
                target = item

                break
            }

            if (item.children && item.children.length) {
                recursion(item.children, id)
            }
        }
    }

    recursion(source, id)
    if (field && target) return target[field]
    return target
}

/**
 * 在源数据中，依据指定字段查找数据节点，或者指定节点的字段
 * @param source 源数据
 * @param targetFieldVal 查找依据值
 * @param targetFieldName 依据字段名称，默认 'id'
 * @param extractFieldName 摘取字段
 * @returns
 */
export function findTargetByField(
    source: any[],
    targetFieldVal: string,
    targetFieldName: string = 'id',
    extractFieldName?: string
) {
    if (!targetFieldVal || source.length === 0) return null

    let target = null

    function recursion(source: any[], targetFieldVal: string, targetFieldName: string) {
        for (let i = 0; i < source.length; i++) {
            const item = source[i]
            if (item[targetFieldName] === targetFieldVal) {
                target = item
                break
            }

            if (item.children && item.children.length) {
                recursion(item.children, targetFieldVal, targetFieldName)
            }
        }
    }

    recursion(source, targetFieldVal, targetFieldName)
    if (extractFieldName && target) return target[extractFieldName]
    return target
}

/**
 * 在源数据中，依据指定字段查找数据节点（所有重复节点），或者指定节点的字段
 * @param source 源数据
 * @param targetFieldVal 查找依据值
 * @param targetFieldName 依据字段名称，默认 'id'
 * @returns
 */
export function findTargetsByField(
    source: any[],
    targetFieldVal: string,
    targetFieldName: string = 'id'
) {
    if (!targetFieldVal || source.length === 0) return null

    let target = []

    function recursion(source: any[], targetFieldVal: string, targetFieldName: string) {
        for (let i = 0; i < source.length; i++) {
            const item = source[i]
            if (item[targetFieldName] === targetFieldVal) {
                target.push(item)
            }

            if (item.children && item.children.length) {
                recursion(item.children, targetFieldVal, targetFieldName)
            }
        }
    }

    recursion(source, targetFieldVal, targetFieldName)
    return target
}

/**
 * 获取树的所有叶子节点（没有 children 字段或 children 为空的节点）
 * @param tree 树数据
 * @returns
 */
export function getAllLeaf(tree: any[]): any[] {
    const result: any[] = []
    const recursion = (tree) => {
        tree.forEach((item) => {
            if (!item.children || !item.children.length) {
                result.push(item)
            } else {
                recursion(item.children)
            }
        })
    }
    recursion(tree)
    return result
}

/**
 * 获取树中所有的父级节点（包含 children 且 children 长度有效）
 * @param tree
 * @returns
 */
export function getAllParentNode(tree: any[]): any[] {
    const result: any[] = []
    const recursion = (tree) => {
        tree.forEach((item) => {
            if (item.children && item.children.length) {
                result.push(item)
                recursion(item.children)
            }
        })
    }
    recursion(tree)
    return result
}

/**
 * 目标节点是否包含子元素，且子元素长度不为0
 * @param source 源数据（树）
 * @param targetFieldVal 查找依据值
 * @param targetFieldName 依据字段名称，默认 'id'
 * @returns
 */
export function nodeHasChildren(
    source: any[],
    targetFieldVal: string | number,
    targetFieldName: string = 'id'
): boolean {
    let flag = true

    function recursion(
        source: any[],
        targetFieldVal: string | number,
        targetFieldName: string = 'id'
    ) {
        source.some((item) => {
            if (item[targetFieldName] === undefined || item[targetFieldName] === null) {
                throw new Error(`${targetFieldName} not defined`)
            }

            if (item[targetFieldName] === targetFieldVal) {
                if (item.children && item.children.length > 0) {
                    flag = true
                } else {
                    flag = false
                }

                return true
            }

            if (item.children && item.children.length > 0) {
                recursion(item.children, targetFieldVal, targetFieldName)
            }
        })
    }

    recursion(source, targetFieldVal, targetFieldName)
    return flag
}

/**
 * 依据指定节点的指定字段的字段值，查找其所有的父级
 * @param source 源数据
 * @param fieldVal 目标字段值
 * @param fieldKey 目标字段 key 默认 'id'
 * @param includeSelf 是否包含自己 默认 true
 * @returns
 */
export function findAncestors<T>(
    source: T[],
    fieldVal: string,
    fieldKey: string = 'id',
    includeSelf: boolean = true
): Array<T> {
    let temp: Array<T> = []

    function recursion(source: T[], fieldVal: string, fieldKey: string, includeSelf: boolean) {
        return source.some((item: any) => {
            if (item[fieldKey] === fieldVal) {
                if (includeSelf) {
                    temp.unshift(item)
                }
                return true
            }

            if (item.children?.length) {
                let subFlag = recursion(item.children, fieldVal, fieldKey, includeSelf)
                if (subFlag) temp.unshift(item)
                return subFlag
            }
        })
    }

    let isHasTarge: boolean = recursion(source, fieldVal, fieldKey, includeSelf)
    return temp
}
