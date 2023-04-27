<template>
    <div ref="editorContainer" class="code-editor" />
</template>

<script lang="ts" setup name="Editor">
import { computed, onMounted, shallowRef } from 'vue'
import monaco from './customMonaco'
import type { editor as MonacoEditor } from 'monaco-editor'

const props = withDefaults(
    defineProps<{
        /**
         * 代码值
         */
        modelValue: string
        /**
         * 语言
         */
        language?: 'typescript' | 'json'
        /**
         * 禁用（只读）
         */
        disabled?: boolean
    }>(),
    {
        modelValue: '',
        language: 'typescript',
        disabled: false
    }
)

const emits = defineEmits(['update:modelValue', 'change'])

const editor = shallowRef<MonacoEditor.IStandaloneCodeEditor>(null)
const editorContainer = shallowRef<HTMLElement>()

const lcoalModelValue = computed<string>({
    get: () => props.modelValue,
    set(val) {
        emits('update:modelValue', val)
    }
})

onMounted(() => {
    editor.value = monaco.editor.create(editorContainer.value, {
        value: lcoalModelValue.value,
        language: props.language,
        readOnly: props.disabled, // 是否为只读模式
        theme: 'vs-dark',
        cursorBlinking: 'phase', // 光标动画样式 "solid" | "blink" | "smooth" | "phase" | "expand"
        contextmenu: true, // 启用上下文菜单
        cursorStyle: 'line-thin', // "Block"|"BlockOutline"|"Line"|"LineThin"|"Underline"|"UnderlineThin" 光标样式
        roundedSelection: false, // 选区是否有圆角
        scrollBeyondLastLine: false, // 设置编辑器是否可以滚动到最后一行之后
        renderLineHighlight: 'all', // 当前行突出显示方式
        minimap: {
            enabled: true // 是否启用预览图
        }
    })

    editor.value.onDidChangeModelContent((event) => {
        const newVal = editor.value.getValue()

        // 前后值有差异的话，抛出 change 事件
        if (lcoalModelValue.value !== newVal) {
            emits('change', newVal)
        }

        // 抛出值
        lcoalModelValue.value = newVal
    })
})

/**
 * 提供设置编辑器值的方法
 * 注：为什么需要抛出一个改变值的方法？直接改变 midelValue 不行吗？
 * 答：内部在创建编辑器之后，vue 组件绑定的值并不能实时的响应到编辑器内部，也不能通过监听外部参数，然后主动的修改值
 *      - 这里是因为内部向外抛出也会触发组件参数的改变，由此造成递归设置值
 * 所以，这里放弃组件的自动填值，组件值的回填，交给用户手动管理
 * @param val
 */
const setValue = (val: string) => {
    editor.value.setValue(val)
}

const editorInstance = editor

defineExpose({
    editorInstance,
    editorContainer,
    setValue
})
</script>

<style lang="scss" scoped>
.code-editor {
    height: 100%;
    width: 100%;
    min-height: 500px;
}
</style>
