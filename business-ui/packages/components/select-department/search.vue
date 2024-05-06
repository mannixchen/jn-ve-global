<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-14 17:21:10
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-29 10:20:14
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\select-department\search.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-input v-model="keyword" :prefix-icon="SearchIcon" @change="change" />
</template>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import { Search as SearchIcon } from '@element-plus/icons-vue'

const COMPONENT_NAME = 'Search'
defineOptions({
    name: COMPONENT_NAME
})

// const props = withDefaults(defineProps<
// {
//     keywoa
// }>(), {

// })
// const keyword = ref<string | number>('')

const keyword = defineModel<string, 'trim'>({
    default: ''
})

const emits = defineEmits<{
    change: [val: string | number]
}>()

const change = (val: string | number) => {
    emits('change', val)
}
</script>

<style lang="scss" scoped></style>
