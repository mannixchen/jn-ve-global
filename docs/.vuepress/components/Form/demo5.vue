<template>
    <div class="wrapper">
        <g-form :config="formConfig" />
    </div>
</template>

<script lang="tsx">
export default {
    name: 'FormDemo1'
}
</script>

<script lang="tsx" setup>
import { FormProps } from 'jn-ve-global'
import { reactive } from 'vue'

let formConfig = reactive<FormProps>({
    instance: null,
    labelPosition: 'right',
    labelWidth: '180px',
    model: {
        name: '',
        status: ''
    },
    formItems: [
        {
            prop: 'name',
            label: '姓名',
            span: 24,
            tip: 'tip & 修改历史同在',
            tipPosition: 'append',
            controlConfig: {
                type: 'input'
            }
        },
        {
            prop: 'status',
            label: '状态',
            span: 24,
            controlConfig: {
                type: 'select',
                options: [
                    { label: '全部', value: '0' },
                    { label: '正常', value: '1' },
                    { label: '禁用', value: '2' }
                ]
            }
        }
    ]
})

setTimeout(() => {
    formConfig.historyLog = `{
            "name": {
                 "old": "张三",
                 "new": "李四",
                 "message": "字段[name]值从[张三]变成[李四]"
            },
            "sex": {
                 "old": "15",
                 "new": "20",
                 "message": "字段[sex]值从[15]变成[20]"
            }
       }`
}, 2000)
</script>

<style lang="scss" scoped>
.wrapper {
    width: 700px;
}
</style>
