<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-15 09:35:35
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-29 11:23:16
 * @FilePath: \@jsjn-librar-monorepo\examples\src\views\demo\form\businessUI.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <!-- <bi-input-email v-modal="email" /> -->
    <!-- <div class="wrapper">
        <div class="label">
            部门选择:
        </div>
        <bi-select-department v-model="department" />
    </div> -->
    <div class="example-demonstration">
        When you have few pages
    </div>
    <el-pagination layout="prev, pager, next" :total="50" :prev-icon="icon" />

    <div class="wrapper">
        <div class="label">
            数字{{ num }}:
        </div>
        <bi-input-number
            v-model="num"
            min="0"
            max="10"
            clearable
            disabled
            @change="numChange"
            @input="numInput"
        />
    </div>

    <div class="wrapper">
        <div class="label">
            利率{{ rate }}:
        </div>
        <bi-input-number v-model="rate" type="1" precision="2" />
    </div>

    <div class="wrapper">
        <div class="label">
            金额{{ amount }}:
        </div>
        <bi-input-number
            v-model="amount"
            type="5"
            precision="2"
            clearable
            :to-capital-amount="true"
            is-amount
            :currency-visible="true"
            :to-thousands="true"
        />
    </div>

    <!--<div class="wrapper">
        <div class="label">
            邮箱{{ email }}:
        </div>
        <bi-input-email v-model="email" clearable />
    </div>

    <div class="wrapper">
        <div class="label">
            证件{{ idCard }}:
        </div>
        <bi-input-card v-model="idCard" clearable />
    </div>

    <div class="wrapper">
        <div class="label">
            电话{{ phone }}:
        </div>
        <bi-input-phone v-model="phone" clearable />
    </div>

    <div class="wrapper">
        <div class="label">
            统一社会信用码{{ socialCode }}:
        </div>
        <bi-input-social-code v-model="socialCode" clearable />
    </div> -->

    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
        Check all
    </el-checkbox>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :key="city" :label="city" :value="city">
            <div>{{ city }}</div>
            <div>432423423423</div>
        </el-checkbox>
    </el-checkbox-group>
    <!-- <div class="wrapper">
        <div class="label">
            复选框{{ checkbox }}:
        </div>
        <bi-checkbox v-model="checkbox" :options="options" />
    </div> -->

    <div class="wrapper">
        <div class="label">
            单选框{{ radio }}:
        </div>
        <bi-radio v-model="radio" :options="options" />
    </div>

    <div class="wrapper">
        <div class="label">
            数字范围{{ numRange }}:
        </div>
        <bi-input-number-range
            v-model="numRange"
            start-min="0"
            start-max="10000"
            precision="2"
            type="5"
            boundary="0"
            currency="6"
            is-amount
            clearable
            :boundary-visible="true"
            :to-thousands="true"
            :currency-visible="true"
            :to-capital-amount="true"
        />
    </div>

    <div class="wrapper">
        <div class="label">
            年份范围{{ yearRange }}:
        </div>
        <bi-input-year-range v-model="yearRange" clearable disabled />
    </div>
</template>

<script lang="tsx" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import { Mute } from '@element-plus/icons-vue'

const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedCities = ref(['Shanghai', 'Beijing'])
const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']

const handleCheckAllChange = (val: boolean) => {
    checkedCities.value = val ? cities : []
    isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === cities.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}

const icon = <g-icon icon='el-AddLocation' />

console.log('test111')

const department = ref<string[]>()

const num = ref(1)

const numRange = ref()

const yearRange = ref()

const rate = ref('')

const amount = ref('')

const email = ref()

const phone = ref()

const idCard = ref()

const socialCode = ref()

const checkbox = ref()

const radio = ref()

const options = [
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3', disabled: true }
]

const numChange = (val) => {
    console.log('numChange', val)
}

const numInput = (val) => {
    console.log('numInput', val)
}

// setInterval(() => {num.value ++}, 5000)
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    margin-bottom: 10px;
    font-size: 16px;

    .label {
        width: 140px;
        margin-right: 5px;
        text-align: right;
    }
}
</style>
