<template>
    <div v-loading="!loadDataFinished" class="g-form-generate">
        <LGForm v-if="loadDataFinished" :config="(localFormConfig as FormProps)" />
    </div>
</template>

<script lang="ts">
export default {
    name: 'GFormGenerate'
}
</script>

<script lang="ts" setup>
import { watch, ref, computed, reactive, toRefs, type Ref } from 'vue'
import { GForm as LGForm, type FormProps } from '../GForm'
import type { FormGenerateProps } from './interface/FormGenerateProps'
import AdvanceFormConfig from './implements/AdvanceFormConfig'

const props = withDefaults(
    defineProps<{
        /**
         * 表单的配置，远程获取，格式：
         *  - JSON
         *  - 配置对象格式
         */
        config: string | FormGenerateProps | object
    }>(),
    {
        config: ''
    }
)

// 只有在加载完远程数据，且映射完毕后，才创建表单
const loadDataFinished = ref<boolean>(false)

// 本地基础表单配置对象
const localFormConfig = reactive<FormProps>({
    instance: null,
    labelPosition: 'right',
    labelWidth: '100px',
    model: {},
    formItems: []
})

const advanceFormConfig = new AdvanceFormConfig({
    formConfigRef: localFormConfig as FormGenerateProps
})

// 远端配置对象
const localRemoteConfig = computed<FormGenerateProps>(() => {
    advanceFormConfig.parseJson(props.config)
    return advanceFormConfig.getJsonConfig()
})

watch(
    () => localRemoteConfig.value,
    (remoteConfig) => {
        loadDataFinished.value = false
        if (remoteConfig) {
            loadDataFinished.value = true
        }
    },
    {
        immediate: true
    }
)

defineExpose({
    ...toRefs(localFormConfig)
} as {
    [k: string]: any
})
</script>

<style lang="scss" scoped>
.g-form-generate {
    min-height: calc(38px + 18px);
}
</style>
