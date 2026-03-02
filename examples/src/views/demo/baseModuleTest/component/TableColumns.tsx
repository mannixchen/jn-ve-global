/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-02-18 14:59:56
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-11-04 14:11:26
 * @FilePath: \@jsjn-librar-monorepo\examples\src\views\demo\baseModuleTest\component\TableColumns.tsx
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { reactive } from 'vue'
import { TableColumnProps } from 'jn-ve-global'

export default () =>
    reactive<TableColumnProps[]>([
        {
            prop: '',
            label: '',
            type: 'expand',
            fixed: true,
            render: () => 11
        },
        {
            prop: 'date',
            label: '日期',
            width: 480,
            fixed: 'left'
        },
        {
            prop: 'name',
            label: '姓名',
            width: 480,
            fixed: true,
            showOverflowTooltip: true
        },
        {
            prop: 'address',
            width: 480,
            label: '地址'
        },
        {
            prop: 'tag',
            label: '标签',
            unsortable: true,
            width: 480,
            render() {
                return (
                    <el-tag class='ml-2' type='danger'>
                        Tag 52222
                    </el-tag>
                )
            }
        },
        {
            prop: 'tag1',
            label: '标签1',
            width: 480,
            render(row) {
                return (
                    <el-switch
                        v-model={row.tag1}
                        class='ml-2'
                        active-color='#13ce66'
                        inactive-color='#ff4949'
                        active-text='Open'
                        inactive-text='Close'
                    />
                )
            }
        }
    ])
