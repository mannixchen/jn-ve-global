import { watch, ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import type { TreeData } from '../../index'
import type { TreeNodeData, TreeNode } from 'element-plus/es/components/tree-v2/src/types'
import { findTargetByField } from '@jsjn/utils'
import { ElTreeV2 } from 'element-plus'
import { TreeProps } from './useTreeContext'

interface Params {
    props: {
        /**
         * 树的配置对象
         */
        sourceMapping?: TreeProps
        /**
         * 懒加载，使用懒加载将切换树的类型，虚拟树没有懒加载
         */
        lazy?: boolean
        /**
         * 加载子树数据的方法，仅当 lazy 属性为true 时生效
         * @param node
         * @param resolve
         */
        load?: (node, resolve) => void
    }
    localTreeData: Ref<TreeData[]>
    elTreeV2Ref: Ref<InstanceType<typeof ElTreeV2> | null>
    emits: { (e: 'node-expand', data: TreeNodeData, node: TreeNode): void }
}

export default ({ props, localTreeData, elTreeV2Ref, emits }: Params) => {
    async function handleExpand(data: TreeNodeData, node: TreeNode) {
        emits('node-expand', data, node)

        if (!props.lazy || !props.load || node.isLeaf || data.isLazy === false) return

        data['lazying'] = true
        const child: TreeNodeData[] = await new Promise((resolve, reject) => {
            props.load(node, resolve)
        })

        data['lazying'] = false

        const targetParent = findTargetByField(
            localTreeData.value,
            node.key as string,
            props.sourceMapping.value
        )

        targetParent.children = child

        // 更新节点
        elTreeV2Ref.value?.setData(localTreeData.value)
    }

    return {
        handleExpand
    }
}
