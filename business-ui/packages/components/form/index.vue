<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-08 14:45:17
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-23 14:25:09
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\form\index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <el-form ref="localInstance" :model="config.model" v-bind="elFormProps">
        <slot />
    </el-form>
</template>

<script lang="ts" setup>
import { inject, watch, ref, computed, reactive, toRefs, provide, useAttrs } from 'vue'
import { ElForm } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { modelKey } from '../../constants'
import { FormProps as BiFormProps } from './type'

const COMPONENT_NAME = 'BiForm'
defineOptions({
    name: COMPONENT_NAME,
    inheritAttrs: false
})

const props = withDefaults(
    defineProps<{
        config: BiFormProps
    }>(),
    {
        config: () => null
    }
)
// console.log('BiForm', props)

const localInstance = ref<FormInstance>()

const localConfig = ref<BiFormProps>(props.config)

const attrs = useAttrs()

const elFormProps = computed(() => {
    const { instance, id, model, ...rest } = props.config
    return { ...rest, ...attrs }
})

// const formModel = reactive({
//     email: null,
//     idCard: null
// })

// provide(modelKey, formModel)
provide(modelKey, props?.config?.model ?? {})

watch(
    () => props.config,
    (config) => {
        // console.log('watch-config')
        localConfig.value = config
    }
)

watch(
    () => localInstance.value,
    (val) => {
        if (val) {
            // console.log('watch-instance', val)
            ;(localConfig as any).value.instance = val
        }
    },
    {
        deep: true
    }
)

// watch(
//     () => props.config.model,
//     (value) => {
//         console.log('watch-model', value)
//     },
//     {
//         deep: true
//     }
// )
</script>

<style lang="scss" scoped></style>
