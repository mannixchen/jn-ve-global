<template>
    <el-button @click="print">
        打印
    </el-button>
    <g-form :config="formConfig">
        <g-form-row>
            <g-col-form-item :form-item-config="{ label: '测试22', prop: 'name' }">
                <template #default="{ itemConfig, vmodel }">
                    <el-input v-model="vmodel.value" />
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
        name: ''
    },
    formItems: [],
    colon: false,
    disabled: true
})

const print = () => {
    console.log(`%c formConfig === `, 'color: #67c23a;', formConfig)
}
</script>

<style lang="scss" scoped></style>
