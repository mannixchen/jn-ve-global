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
 * 根据多个字段的 key-value 对匹配树节点
 * @param tree 源数据（树）
 * @param obj 匹配条件对象，包含多个 key-value 对
 * @returns 匹配的节点，如果没有找到则返回 null
 */
export function findTargetByMultipleFields(tree: any[], obj: Record<string, any>) {
    if (!tree || tree.length === 0 || !obj || Object.keys(obj).length === 0) return null

    let target = null

    function recursion(source: any[]) {
        for (let i = 0; i < source.length; i++) {
            const item = source[i]
            
            // 检查当前节点是否匹配所有条件
            const isMatch = Object.keys(obj).every(key => item[key] === obj[key])
            
            if (isMatch) {
                target = item
                break
            }

            if (item.children && item.children.length) {
                recursion(item.children)
            }
        }
    }

    recursion(tree)
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
 * 在源数据中，依据指定字段模糊查找数据节点（所有重复节点），或者指定节点的字段
 * @param source 源数据
 * @param targetFieldVal 查找依据值
 * @param targetFieldName 依据字段名称，默认 'id'
 * @returns
 */
export function fuzzyFindTargetsByField(
    source: any[],
    targetFieldVal: string,
    targetFieldName: string = 'id'
) {
    if (!targetFieldVal || source.length === 0) return null

    let target = []

    function recursion(source: any[], targetFieldVal: string, targetFieldName: string) {
        for (let i = 0; i < source.length; i++) {
            const item = source[i]
            if (item[targetFieldName].includes(targetFieldVal)) {
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

/**
 * 移动节点（改变源数据）
 * @param tree
 * @param sourceId
 * @param targetId
 */
export function moveNode(tree: any, sourceId: string, targetId: string) {
    let sourceNode: any = null
    let targetNode: any = null
    let parentNode: any = null

    function dfs(node, parent) {
        if (node.id === sourceId) {
            sourceNode = node
            parentNode = parent
        } else if (node.id === targetId) {
            targetNode = node
        } else if (node.children) {
            for (let child of node.children) {
                dfs(child, node)
            }
        }
    }

    for (let root of tree) {
        dfs(root, null)
    }

    if (sourceNode && targetNode) {
        // 从父节点中移除源节点
        const index = parentNode.children.indexOf(sourceNode)
        if (index !== -1) {
            parentNode.children.splice(index, 1)
        }

        // 将源节点添加到目标节点的子节点中
        if (!targetNode.children) {
            targetNode.children = []
        }
        targetNode.children.push(sourceNode)
    }
}

/**
 * 删除节点（返回新数组）
 * @param tree
 * @param targetId
 * @returns
 */
export function deleteNode(tree: any[], targetId: string): any[] {
    return tree.reduce((acc: any[], node: any) => {
        if (node.id === targetId) {
            // 如果找到目标节点，不将其添加到新的数组中，从而实现删除
            return acc
        } else {
            // 如果当前节点有子节点，递归处理子节点
            if (node.children) {
                node.children = deleteNode(node.children, targetId)
            }
            // 将当前节点添加到新的数组中
            acc.push(node)
            return acc
        }
    }, [])
}

/**
 * 获取树结构数组中所有节点的指定字段值
 * @param trees PageSchemaTreeNode 数组
 * @param fieldName 字段名称
 * @returns 所有节点 id 的数组
 */
export function getAllNodeFields<V = any>(trees: any[], fieldName: string): V[] {
    const nodeFields: V[] = []
    for (const tree of trees) {
        nodeFields.push(tree[fieldName])
        if (tree.children && tree.children.length > 0) {
            nodeFields.push(...getAllNodeFields(tree.children, fieldName))
        }
    }
    return nodeFields
}

/**
 * 获取树结构数组中所有节点的 id
 * @param trees PageSchemaTreeNode 数组
 * @returns 所有节点 id 的数组
 */
export function getAllNodeIds(trees: any[]): string[] {
    return getAllNodeFields<string>(trees, 'id')
}

/**
 * 获取树结构数组中所有父节点的指定字段值
 * @param trees PageSchemaTreeNode 数组
 * @param fieldName 字段名称
 * @returns 所有父节点 id 的数组
 */
export function getAllParentNodeFields<V = any>(trees: any[], fieldName: string): V[] {
    const parentFields: V[] = []

    for (const tree of trees) {
        // 如果当前节点有子节点，则它是父节点
        if (tree.children && tree.children.length > 0) {
            parentFields.push(tree[fieldName])
            // 递归收集子节点中的父节点 id
            parentFields.push(...getAllParentNodeFields(tree.children, fieldName))
        }
    }

    return parentFields
}

/**
 * 获取树结构数组中所有父节点的 id
 * @param trees PageSchemaTreeNode 数组
 * @returns 所有父节点 id 的数组
 */
export function getAllParentNodeIds(trees: any[]): string[] {
    return getAllParentNodeFields<string>(trees, 'id')
}

/**
 * 在指定的树结构中，根据子节点的指定字段查找目标节点，然后沿着祖先链向上查找满足条件的祖先节点
 * @param trees 树结构数组
 * @param childFKey 子节点字段名
 * @param childFVal 子节点字段值
 * @param ancestorFKey 祖先节点字段名
 * @param ancestorFVal 祖先节点字段值
 * @returns 匹配的祖先节点，如果未找到则返回 null
 */
export function findAncestorByChildAndAncestorField<R = any>(
    trees: any[],
    childFKey: string,
    childFVal: any,
    ancestorFKey: string,
    ancestorFVal: any
): R | null {
    let foundAncestor: any = null

    function findTargetAndAncestors(nodes: any[], ancestors: any[] = []): boolean {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            const currentAncestors = [...ancestors, node]
            
            // 检查当前节点是否是目标子节点
            if (node[childFKey] === childFVal) {
                // 找到目标子节点后，从当前祖先链中查找满足条件的祖先节点
                // 从最近的祖先开始向上查找（不包括目标节点本身）
                for (let j = ancestors.length - 1; j >= 0; j--) {
                    const ancestor = ancestors[j]
                    if (ancestor[ancestorFKey] === ancestorFVal) {
                        foundAncestor = ancestor
                        return true
                    }
                }
                // 如果没有找到匹配的祖先，返回 false 继续查找其他可能的目标节点
                return false
            }
            
            // 递归搜索子节点，传递当前的祖先链
            if (node.children && node.children.length > 0) {
                if (findTargetAndAncestors(node.children, currentAncestors)) {
                    return true
                }
            }
        }
        return false
    }

    findTargetAndAncestors(trees)
    return foundAncestor
}

/**
 * 在指定的树结构中，根据子节点的 id 和组件名称查找祖先节点
 * @param trees 树结构数组
 * @param childId 子节点 id
 * @param componentName 组件名称
 * @returns 匹配的祖先节点，如果未找到则返回 null
 */
export function findParentByComponentName<R = any>(
    trees: any,
    childId: string,
    componentName: string
): R | null {
    return findAncestorByChildAndAncestorField<R>(trees, 'id', childId, 'componentName', componentName)
}
