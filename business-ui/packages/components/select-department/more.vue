<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-14 16:01:51
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-29 10:41:20
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\select-department\more.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <g-modal v-model="config.dialogVisible" title="选择部门" :btns="btns">
        <div class="content-wrapper">
            <div class="left-wrapper">
                <el-tabs v-model="activeName" class="head" @tab-click="handleTabClick">
                    <el-tab-pane :label="tabMap[Tabs.RECENT]" :name="Tabs.RECENT">
                        <Search v-model="leftKeyword" @change="handleLeftChange" />
                    </el-tab-pane>
                    <el-tab-pane :label="tabMap[Tabs.ORGANIZATION]" :name="Tabs.ORGANIZATION">
                        User
                    </el-tab-pane>
                    <el-tab-pane :label="tabMap[Tabs.LIST]" :name="Tabs.LIST">
                        User
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="right-wrapper">
                <Search v-model="leftKeyword" @change="handleLeftChange" />
            </div>
        </div>
    </g-modal>
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import { GModal } from 'jn-ve-global'
import type { BtnProps } from 'jn-ve-global'
import type { TabsPaneContext } from 'element-plus'
import { MoreDepartmentProps, MoreDepartmentConfig } from './type'
import Search from './search.vue'
import { Tabs, tabMap } from './const'

const COMPONENT_NAME = 'MoreDepartment'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<MoreDepartmentProps>(), {})

const config = reactive<MoreDepartmentConfig>(props?.config)

const emits = defineEmits<{
    confirm: [val: string[] | number[]]
}>()

// 部门全部选项相关
const activeName = ref<string>(Tabs.RECENT)
const handleTabClick = (tab: TabsPaneContext, event: Event) => {}

// 搜索框相关
const leftKeyword = ref<string>('')
const righttKeyword = ref<string>('')

const handleLeftChange = (val) => {
    activeName.value = Tabs.LIST
}
const handleRightChange = (val) => {}

// const selectDepartments = defineModel<string[] | number[]>()
// const dialigVisible = defineModel<boolean>('dialogVisiible', {
//     required: true,
//     default: false
// })

const btns = reactive<BtnProps[]>([
    {
        label: '取消',
        type: 'default',
        onClick: () => {}
    },
    {
        label: '确定',
        onClick: () => {}
    }
])

const confirm = () => {
    config.dialogVisible = false
}

const clear = () => {
    config.dialogVisible = false
}
</script>

<style lang="scss" scoped></style>
