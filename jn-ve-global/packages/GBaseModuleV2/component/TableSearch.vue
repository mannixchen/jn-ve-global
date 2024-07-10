<template>
    <div
        ref="self"
        :class="[
            'search-wrapper not-select',
            'classic-mode',
            {
                [`show-more ${props.moreSearchMode}`]: props.moreSearchMode
            }
        ]"
    >
        <div v-if="showTitle" class="top">
            <div v-if="moreSearchMode" :class="['more', modeClass]" @click="handleMoreSearch">
                <LGIcon :icon="`pull-${modeClass.includes('active') ? 'up' : 'down'}`" />
                <span>更多查询</span>
            </div>
        </div>

        <!-- 核心表单 -->
        <div class="form-wrapper">
            <div :class="['search-field-form-wrapper', modeClass]">
                <LGForm class="search-field-form" :config="(localSearchFormConfig as FormProps)" />
            </div>

            <!-- 
                搜索条件创建分为两种情况
                1. 追加（push 到搜索条件中）
                2. 独占一行（表明独占一行 或 显示更多查询）
             -->
            <LGForm
                v-if="searchBtnHorizontal || moreSearchMode"
                :config="(localSearchBtnsFormConfig as FormProps)"
            />
        </div>
    </div>

    <!-- 更多查询弹出框 -->
    <LGModal
        v-if="moreSearchMode === 'popup'"
        v-model="dialogVisible"
        custom-class="base-module-search-more-dialog"
        title="更多查询"
        width="80%"
        top="5vh"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        :destroy-on-close="false"
    >
        <ElScrollbar max-height="400px">
            <LGForm :config="(localSearchFormConfig as FormProps)" />
        </ElScrollbar>
        <LGForm :config="(localSearchBtnsFormConfig as FormProps)" />
    </LGModal>
</template>

<script lang="tsx">
export default {
    name: 'GBaseModuleTableSearch'
}
</script>

<script lang="tsx" setup>
import { PropType, watch, ref, computed, reactive, onMounted, nextTick } from 'vue'
import { getStyle } from '@jsjn/utils'
import type { BaseModuleMode } from '../../_globalConstant/baseModuleMode'
import { ElScrollbar } from 'element-plus'
import { GForm as LGForm, type FormProps, type FormItemProps } from '../../GForm'
import { GModal as LGModal } from '../../GModal'
import { GIcon as LGIcon } from '../../GIcon'
import { assignOwnProp } from '@jsjn/utils'
import _ from 'lodash'

export interface Props {
    /**
     * 搜索条件表单配置
     */
    searchFormProps?: FormProps
    /**
     * 按钮组
     */
    searchBtnsConfig?: FormItemProps
    /**
     * 去除 “查询条件” label
     */
    noSearchLabel?: boolean
    /**
     * 搜索按钮是否独占一行
     */
    searchBtnHorizontal?: boolean
    /**
     * 更多查询展示方式
     * pullDown：下拉
     * popup：弹出
     */
    moreSearchMode?: 'pull-down' | 'popup'
}

const props = withDefaults(defineProps<Props>(), {
    searchFormProps: null,
    searchBtnsConfig: null,
    noSearchLabel: false,
    searchBtnHorizontal: false,
    moreSearchMode: undefined
})

const showTitle = computed(
    () => !props.noSearchLabel || props.moreSearchMode
)

/**
 * 按钮组 form config
 */
const localSearchBtnsFormConfig = reactive<FormProps>({
    instance: null,
    model: {},
    formItems: [props.searchBtnsConfig]
})

/**
 * 判断是否需要将按钮组追加到搜索条件中
 * 1. 是否独占一行
 * 2. 是否显示更多查询
 * 3. 是否已包含（用户配置自定义按钮组权限更高）
 */
const localSearchFormConfig = ref<FormProps>(props.searchFormProps)
if (
    !localSearchFormConfig.value.formItems.some((formItem) => formItem.prop === 'opertion-btn') &&
    !props.searchBtnHorizontal &&
    !props.moreSearchMode
) {
    localSearchFormConfig.value.formItems.push(props.searchBtnsConfig)
}

// 弹框
const dialogVisible = ref<boolean>(false)
// 下拉
const pullDownFlag = ref<boolean>(false)

const modeClass = computed<string>(() => {
    return `${props.moreSearchMode ? props.moreSearchMode : ''} ${
        props.moreSearchMode === 'pull-down' && pullDownFlag.value ? 'active' : ''
    }`
})

watch(
    () => modeClass.value,
    (val) => {
        console.log(`%c modeClass === `, 'color: #67c23a;', val)
    }
)

const modeTriggerLabel = computed<string>(() =>
    props.moreSearchMode === 'pull-down' ? (!pullDownFlag.value ? '展开' : '收起') : '查看更多'
)

/**
 * 下拉模式，原 form 高度
 * 这里获取的是 dom 的实际 height，故不需要 rem 的转换
 */
const self = ref<HTMLElement>(null)
const searchFieldFormHeight = ref<string>('auto')
onMounted(() => {
    if (props.moreSearchMode !== 'pull-down') return
    const searchFieldFormDom = self.value.querySelector('.search-field-form')
    const domHeight = getStyle(searchFieldFormDom, 'height')
    searchFieldFormHeight.value = domHeight
})

// 更多查询
const handleMoreSearch = () => {
    if (props.moreSearchMode === 'popup') {
        /**
         * bugfix: 一级展示的表单项，会有一个 form.instance，弹框弹出的，也会产生一个 form.instance
         * 后打开创建的 form.instance 会覆盖掉一级的 form.instance
         * 故：组件外部操作的实际是弹框的 form.instance，但是操作的都是同一个 form.model
         * 所以在重置时，依然可以重置表单项的数据
         *
         * 但是，二级弹框表单在创建之前，用户可能已经有所输入，导致重置时，无法重置到初始状态
         * 而是重置到用户输入的状态
         *
         * 解决方案：
         *  1. 在弹框弹出之前，缓存用户输入的数据
         *  2. 同时重置用户的输入
         *  3. 在弹框打开后，将缓存的数据赋值给弹框的 form.model，造成一个没有变化的假象
         *
         * 这样一来，就可以保证，每次弹框打开，都是一个干净的表单
         *
         * 重点是：表单的 form.instance 覆盖了一级 form.instance，但是 form.model 是同一个
         *
         * TODO: 还存在两个 form.instance 校验的问题，暂时不影响使用，后续再解决
         */
        const userInputModelCache = _.cloneDeep(localSearchFormConfig.value.model)
        localSearchFormConfig.value.instance.init()
        dialogVisible.value = true

        nextTick(() => {
            assignOwnProp(localSearchFormConfig.value.model, userInputModelCache)
        })
    } else if (props.moreSearchMode === 'pull-down') {
        pullDownFlag.value = !pullDownFlag.value
    }
}

defineExpose({
    closePopup: () => {
        dialogVisible.value = false
    },
    popupShow: dialogVisible
})
</script>

<style lang="scss">
@import './styles/classic-mode.scss';
//@import './styles/tabular-mode.scss';

.search-wrapper {
    .form-wrapper {
        padding: 0 var(--jn-ve-g-base-module-padding-lr);

        // 搜索条件表单
        .search-field-form-wrapper {
            // 弹框
            &.pull-down,
            &.popup {
                height: calc(var(--jn-ve-g-form-item-height) + var(--jn-ve-g-form-item-margin-b));
                overflow: hidden;
            }

            // 下拉
            &.pull-down {
                transition: height 0.2s;

                &.active {
                    height: v-bind(searchFieldFormHeight);
                }
            }
        }

        // 按钮
        .search-btn-item {
            .el-form-item__content {
                .el-button {
                    --jn-ve-g-btn-padding-lr: var(--jn-ve-g-btn-padding-lr2);
                    --jn-ve-g-base-font-size-s: 17px;

                    span {
                        margin-left: 10px;
                        line-height: 1;
                        height: 100%;
                    }

                    i {
                        font-size: calc(var(--jn-ve-g-base-font-size-s) + 2px);
                        height: 100%;
                    }
                }
            }
        }
    }
}

.base-module-search-more-dialog {
    .el-dialog__body {
        padding: 14px 0 14px 28px;

        .el-scrollbar {
            margin-bottom: 10px;
            .el-scrollbar__view {
                padding-right: 28px;
            }
        }
    }
}
</style>
