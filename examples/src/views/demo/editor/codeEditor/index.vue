<template>
    <el-button @click="setVal">
        主动赋值
    </el-button>
    <el-button @click="disabledHandle">
        禁用
    </el-button>
    <jn-code-editor ref="editorRef" v-model="code" @change="changeHadnle" />
</template>

<script lang="ts" setup name="Test">
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import { Editor as JnCodeEditor } from '@jsjn/code-editor'
import '@jsjn/code-editor/style.css'

const editorRef = ref<InstanceType<typeof JnCodeEditor | null>>(null)

watch(
    () => editorRef.value,
    (instance) => {
        console.log(`%c in `, 'color: #67c23a;', instance.editorInstance)

        const editorInstance = instance.editorInstance
    }
)

const defaultVal = ref<string>('')

const code = ref<string>(`console.log("hello,world")

interface App {
    /**
     * 姓名
     */
    name: string
}`)

watch(
    () => code.value,
    (val) => {
        console.log(`%c ${val}`, 'color: #67c23a;')
    }
)

const changeHadnle = (val) => {
    console.log(`%c val ====== `, 'color: #67c23a;', val)
}

const setVal = () => {
    // code.value = 'const abc = 123'
    editorRef.value.setValue('qwrt')
}

const disabledHandle = () => {}
</script>

<style lang="scss" scoped></style>
