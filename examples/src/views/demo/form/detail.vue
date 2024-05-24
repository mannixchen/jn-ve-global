<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-07 10:59:44
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-23 14:24:32
 * @FilePath: \@jsjn-librar-monorepo\examples\src\views\demo\form\detail.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <bi-detail
        v-model="detail"
        show-copy-button
        :expand="true"
        :sortable="true"
        display="form"
        :btns="btns"
        operation-width="130"
        :border="true"
        :stripe="true"
        :show-serial="false"
        :left-fixed-columns="1"
        :fixed-operation="true"
        :page-size="5"
        :max="7"
    >
        <bi-fi-input-card v-model="idCard" prop="idCard" clearable :rules="rules" required />
        <bi-fi-input-email v-model="email" prop="email" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证x" prop="idCard2" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证3" prop="idCard3" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证4" prop="idCard4" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证5" prop="idCard5" clearable />
    </bi-detail>
    <el-divider />
    <bi-fi-detail
        v-model="detail"
        prop="detail"
        show-copy-button
        :required="true"
        :expand="true"
        :sortable="true"
        display="table"
        :btns="btns"
        :operation-width="180"
        :border="false"
        :stripe="true"
        :show-serial="true"
        :left-fixed-columns="1"
        :fixed-operation="true"
        :page-size="5"
        :max="7"
    >
        <bi-fi-input-card v-model="idCard" prop="idCard" clearable :rules="rules" required />
        <bi-fi-input-email v-model="email" prop="email" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证x" prop="idCard2" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证3" prop="idCard3" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证4" prop="idCard4" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证5" prop="idCard5" clearable />
    </bi-fi-detail>
    <!-- <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column fixed prop="date" label="Date" width="150" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="120" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column prop="zip" label="Zip" width="120" />
        <el-table-column fixed="right" label="Operations" width="120">
            <template #default>
                <el-button link type="primary" size="small" @click="handleClick">
                    Detail
                </el-button>
                <el-button link type="primary" size="small">
                    Edit
                </el-button>
            </template>
        </el-table-column>
    </el-table> -->
    <!-- <el-divider />
    <bi-detail
        show-copy-button
        :expand="true"
        sortable
        :btns="btns"
        :confirm-delete="false"
        label-position="top"
        :page-size="2"
    >
        <bi-fi-input-card v-model="idCard" prop="idCard" clearable :rules="rules" />
        <bi-fi-input-email v-model="email" prop="email" clearable />
    </bi-detail> -->
</template>

<script lang="ts" setup>
import { reactive, watch, ref, computed, toRefs } from 'vue'
import { BtnProps } from '@jsjn/business-ui/packages'

const btns = reactive<BtnProps[]>([
    {
        label: '保存',
        disabled: false,
        loading: false,
        onClick: ({ forms, form, index }) => {
            console.log('save')
            // form.instance.validate()
            form.instance.resetFields()
            // form.disabled = true
        }
    }
])

const rules = [{ required: true, message: 'age is required1111' }]

const idCard = ref()
const email = ref()

const detail = ref([
    {
        idCard: '111',
        email: '111@xx.com'
    },
    {
        idCard: '222',
        email: '222@xx.com'
    }
])

// watch(
//     () => data.value,
//     (val) => {
//         console.log('watch-data', val)
//     },
//     {
//         deep: true
//     }
// )
</script>

<style lang="scss" scoped></style>
