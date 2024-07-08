<template>
    <div :class="{ 'is-show-anchor': localConfig?.showNavBars && isCollapseLayout }">
        <ElForm
            v-if="config && refreshLoad"
            ref="localInstance"
            :class="['g-form', { 'is-show-anchor': localConfig?.showNavBars && isCollapseLayout }]"
            v-bind="formRootConfigs"
        >
            <!-- 
            提供默认插槽
            - 可以自定义表单内容的渲染
            - 配合拖拽平台
         -->
            <slot :form-items="(localConfig.formItems as FormItemProps[])">
                <!-- 默认表单项 || 不被 Collapse 控制的表单项 -->
                <LGFormRow
                    v-if="baseFormItems.length"
                    :class="{ 'is-collapse-layout': isCollapseLayout }"
                >
                    <template v-for="(item, index) in baseFormItems" :key="`${item.prop}-${index}`">
                        <LGColFormItem :form-item-config="item" />
                    </template>
                </LGFormRow>

                <!-- Collapse 布局容器 -->
                <LGCollapse
                    v-if="isCollapseLayout"
                    v-model="activeCollapses"
                    :mode="localConfig.collapseMode"
                    :show-nav-bars="localConfig.showNavBars"
                >
                    <template
                        v-for="(collapseItem, index) in collapseItems"
                        :key="`${collapseItem.title}-${index}`"
                    >
                        <LGCollapseItem
                            v-bind="collapseItem"
                            :class="{
                                'form-item-classify': true,
                                'is-tail': collapseItem.isTail
                            }"
                        >
                            <LGFormRow>
                                <template
                                    v-for="(item, index) in collapseItem.content"
                                    :key="`${item.prop}-${index}`"
                                >
                                    <LGColFormItem :form-item-config="item" />
                                </template>
                            </LGFormRow>
                        </LGCollapseItem>
                    </template>
                </LGCollapse>
            </slot>
        </ElForm>
    </div>
</template>

<script lang="ts" setup>
import { watch, provide, ref, toRef, nextTick, computed, type Ref, watchEffect } from 'vue'
import type { FormProps, FormInstance, FormItemProps } from './interface'
import formConfigProvideKey from './constant/formConfigProvideKey'
import { assignOwnProp, advanceSerialize } from '@jsjn/utils'
import useCollapseLayout from './hooks/useCollapseLayout'
import { ElForm } from 'element-plus'
import _ from 'lodash'

// 本地组件
import LGFormRow from './components/layout/GFormRow/index.vue'
import LGColFormItem from './components/layout/GColFormItem/index.vue'
import { GCollapse as LGCollapse, GCollapseItem as LGCollapseItem } from '../GCollapse'

defineOptions({
    name: 'GForm'
})

const props = withDefaults(
    defineProps<{
        config: FormProps
    }>(),
    {
        config: () => null
    }
)

provide(formConfigProvideKey, toRef(props, 'config'))

const localInstance = ref<FormInstance | null>(null)
const refreshLoad = ref(true)
const localConfig = ref<FormProps>(props.config)
// 缓存初始（创建前）的 model
const modelCache = ref<FormProps['model']>(_.cloneDeep(props.config?.model))
// 用户主动缓存
const userCache = ref<FormProps['model']>(null)

const { isCollapseLayout, collapseItems, activeCollapses, baseFormItems } = useCollapseLayout(props)

/**
 * 惰性监听（只在后续改变时执行）
 * props config 与本地建立关联
 * 总的来说，props.config 必须是一个 Proxy
 */
watch(
    () => props.config,
    (config) => {
        // 配置对象发生变化 RefInstance 需要重建
        refreshLoad.value = false
        nextTick(() => {
            refreshLoad.value = true
        })

        localConfig.value = config
        modelCache.value = _.cloneDeep(config.model)
    }
)

watch(
    () => props.config,
    (config) => {
        console.log(`%c ********* 表单配置 *********`, 'color: #67c23a;', config)
    },
    { deep: true, immediate: true }
)

/**
 * 监听实例的变化
 *  - 抛出
 *  - 扩展方法：initModel、init、cacheModel、isChangeByCache
 */
watch(
    () => localInstance.value,
    (instance) => {
        if (instance) {
            advanceInstance(instance)
            if (localConfig.value.instance === null) {
                localConfig.value.instance = instance
            } else if (_.isObject(localConfig.value.instance)) {
                _.assign(localConfig.value.instance, instance)
            }
        }
    }
)

/**
 * 获取 form 配置（一级配置）
 * 抛出自定义配置，剩余的即为 elemen-plus 原生配置
 */
const formRootConfigs = computed(() => {
    const { instance, formItems, gutter, colon, ...formConfigs } = props.config
    return formConfigs
})

// 增强表单实例，添加方法
function advanceInstance(instance: FormInstance) {
    instance['initModel'] = () => {
        assignOwnProp(localConfig.value.model, modelCache.value)
    }

    instance['init'] = function () {
        this.initModel()
        nextTick(() => {
            this.resetFields()
        })
    }

    instance['cacheModel'] = () => {
        userCache.value = _.cloneDeep(localConfig.value.model)
    }

    instance['isChangeByCache'] = () => {
        if (!userCache.value) {
            console.log(`%c 未主动缓存，不予比对`, 'color: #f56c6c;')
            return false
        }
        const cacheStr = advanceSerialize.stringify(userCache.value)
        const currentModelStr = advanceSerialize.stringify(localConfig.value.model)
        return !(cacheStr === currentModelStr)
    }
}

defineExpose({
    instance: localInstance,
    config: localConfig
} as {
    instance: Ref<FormInstance>
    config: Ref<FormProps>
})
</script>

<style lang="scss" scoped>
.is-show-anchor {
    height: 100%;
    overflow: auto;
    position: relative;
}
</style>
<style lang="scss">
@import './styles/index.scss';
@import './styles/index.global.scss';
</style>
