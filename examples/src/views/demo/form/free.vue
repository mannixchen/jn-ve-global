<template>
    <el-button @click="print">
        打印
    </el-button>

    <br>
    <br>

    <g-form :config="formConfig">
        <g-form-row>
            <g-col-form-item
                :form-item-config="{
                    label: '姓名',
                    prop: 'name',
                    tip: 'qwer'
                }"
            >
                <template #default="{ vmodel }">
                    <el-input v-model="vmodel.value" />
                </template>
            </g-col-form-item>

            <g-col-form-item :form-item-config="{ label: '年龄', prop: 'age' }">
                <template #default="{ vmodel }">
                    <el-input-number v-model="vmodel.value" />
                </template>
            </g-col-form-item>
        </g-form-row>
    </g-form>
</template>

<script lang="ts" setup>
import { watch, ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { FormProps, FormItemBaseProps } from 'jn-ve-global'

defineOptions({
    name: 'Free'
})

const formConfig = reactive<FormProps>({
    instance: null,
    model: {
        name: '',
        age: 18
    },
    colon: false,
    disabled: false
})

const print = () => {
    console.log(`%c formConfig === `, 'color: #67c23a;', formConfig)
}
</script>

<style lang="scss" scoped></style>
