<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-14 14:10:16
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-03-18 17:21:04
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\select-department\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-select-v2
        v-model="localModelValue"
        :props="optionProps"
        :options="options"
        :multiple="multiple"
        :collapse-tags="collapseTags"
        :collapse-tags-tooltip="collapseTagsTooltip"
        :placeholder="placeholder"
        v-bind="$attrs"
    >
        <template #prefix>
            <el-icon @click.stop="more">
                <Search />
            </el-icon>
        </template>
        <template #default="{ item }">
            <span>{{ item?.name ?? '' }}</span>
        </template>
        <template #footer>
            <div @click="more">
                更多
            </div>
        </template>
    </el-select-v2>

    <!-- 更多部门选择 -->
    <more-department v-if="moreDepartmentConfig.dialogVisible" :config="moreDepartmentConfig" />
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import type { PropType } from 'vue'
import SelectDepartmentProps, { SelectDepartments, DepartmentProps, MoreDepartmentConfig } from './type'
import { Search } from '@element-plus/icons-vue'
import { ElSelectV2 } from 'element-plus'
import { departmentOptions } from './mock'
import MoreDepartment from './more.vue'

const COMPONENT_NAME = 'BiSelectDepartment'
defineOptions({
    name: COMPONENT_NAME
})

console.log('BiSelectDepartment')
const props = withDefaults(defineProps<SelectDepartmentProps>(), {
    multiple: true,
    placeholder: '请选择',
    collapseTags: true,
    collapseTagsTooltip: true
})

// const props = defineProps({
//     modelValue: {
//         type: Object as PropType<String | Number | Array<number | string>>
//     },
//     multiple: {
//         type: Boolean,
//         default: () => true
//     },
//     collapseTags: {
//         type: Boolean,
//         default: () => true
//     },
//     collapseTagsTooltip: {
//         type: Boolean,
//         default: () => true
//     },
//     placeholder: {
//         type: String,
//         default: () => ''
//     }
//     // optionProps: {
//     //     type: Object,
//     //     default: () => ({
//     //         value: 'id',
//     //         label: 'name'
//     //     })
//     // }
// })

const optionProps = {
    value: 'id',
    label: 'name'
}

// const options = ref<Omit<DepartmentProps, 'children'>[]>()
const options = ref<DepartmentProps[]>(departmentOptions)
console.log('options', options.value)

const localModelValue = defineModel<SelectDepartments>()

const remoteMethod = (keyword: string) => {
    setTimeout(() => {
        options.value = departmentOptions
    }, 200)
}

// 更多
const moreDepartmentConfig = reactive<MoreDepartmentConfig>({
    dialogVisible: false,
    selectDepartments: props.modelValue
})
const more = () => {
    console.log('more')
    moreDepartmentConfig.dialogVisible = true
}
</script>

<style lang="scss" scoped></style>
