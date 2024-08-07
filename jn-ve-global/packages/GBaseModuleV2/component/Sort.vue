<template>
    <el-popover
        v-model:visible="sortPopoverVisible"
        placement="bottom-start"
        trigger="click"
        width="4rem"
        :popper-options="options"
    >
        <template #reference>
            <!-- <el-button type="primary" text>
                排序
            </el-button> -->
            <div class="sort-icon-wrapper">
                <g-icon icon="sort" custom-color />
            </div>
        </template>
        <div class="sort-wrapper">
            <div class="header-wrapper">
                <div class="title-wrapper">
                    <div class="title">
                        排序
                    </div>
                    <el-tooltip effect="dark" content="设置查询排序规则" placement="top-start">
                        <el-icon class="tip-icon" color="#C1C1C1">
                            <QuestionFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
            </div>
            <div class="btns-wrapper">
                <el-popover
                    v-model:visible="selectRuleModalVisible"
                    placement="left-start"
                    trigger="click"
                    :teleported="false"
                    :width="340"
                >
                    <template #reference>
                        <el-button class="add-btn-wrapper" type="primary" plain :icon="Plus">
                            排序规则
                        </el-button>
                    </template>
                    <div class="not-selected-wrapper">
                        <el-input
                            v-model.trim="keyword"
                            class="search-wrapper"
                            placeholder="搜索字段"
                            clearable
                            :suffix-icon="Search"
                            @change="search"
                        />
                        <div class="option-list-wrapper">
                            <div
                                v-for="(option, index) in searchResults"
                                :key="option.prop ?? index"
                                class="not-selected-item-wrapper"
                                @click="selectRule(option)"
                            >
                                {{ option.label }}
                            </div>
                        </div>
                    </div>
                </el-popover>

                <el-button
                    class="clear-btn-wrapper"
                    type="danger"
                    plain
                    :icon="Delete"
                    @click="clear"
                >
                    全部清空
                </el-button>
            </div>
            <div ref="selectedRulesRef" class="selected-rule-list-wrapper">
                <div
                    v-for="(option, index) in selectedRuleOptions"
                    :key="option.prop ?? index"
                    class="selected-rule-item-wrapper"
                    :data-prop="option.prop"
                >
                    <div class="rule-info">
                        <div class="label">
                            {{ option.label ?? '' }}
                        </div>
                        <el-radio-group v-model="option.order" class="order-radio-group">
                            <el-radio
                                v-for="item in orderOptions"
                                :key="item.value"
                                :value="item.value"
                                :label="item.value"
                                size="large"
                            >
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                        <el-tooltip effect="dark" content="拖动改变字段顺序" placement="top-start">
                            <div class="drag-icon-wrapper">
                                <g-icon icon="drag" custom-color />
                            </div>
                        </el-tooltip>
                    </div>
                    <el-icon class="delete-rule-btn" @click="deleteRule(option)">
                        <Delete />
                    </el-icon>
                </div>
            </div>
            <div class="confirm-btn-wrapper">
                <el-button type="primary" @click="confirm">
                    确定
                </el-button>
            </div>
        </div>
    </el-popover>
</template>
<script lang="ts" setup>
import { onMounted, watch, ref, computed, reactive, toRefs } from 'vue'
import { Delete, QuestionFilled, Plus, Search } from '@element-plus/icons-vue'
import { type TableColumnProps } from '../../GTable'
import { Order, orderOptions } from '../constant'
import { cloneDeep } from 'lodash'
import Sortable from 'sortablejs'
import type { RuleOption, OrderProps } from '../interface'
// import { global } from '@jsjn/utils'


const COMPONENT_NAME = 'Sort'
defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(
    defineProps<{
        columns: TableColumnProps[]
    }>(),
    {
        columns: () => []
    }
)

const options = {
    modifiers: [
        {
            name: 'preventOverflow',
            options: {
                // rootBoundary: global.document.querySelector('.micro-view')
                rootBoundary: document.querySelector('html')
            }
        },
        {
            name: 'flip',
            options: {
                rootBoundary: document.querySelector('html')
            }
        }
    ]
}

// const order = defineModel<OrderProps>({default: {
//     asc: [],
//     desc: []
// }})

const emits = defineEmits<{
    'confirm': [val?: OrderProps]
}>()

const sortPopoverVisible = ref<boolean>(false)

// const totalR
const notSelectedRuleOptions = ref<RuleOption[]>()
const searchResults = ref()
const selectedRuleOptions = ref<RuleOption[]>()

const init = () => {
    notSelectedRuleOptions.value = cloneDeep(props.columns ?? [])
        .filter((item) => !(item.prop === 'opertion' && item.label === '操作'))
        .map(({ prop, label }) => ({
            prop,
            label,
            order: Order.DESCENT
        }))

    searchResults.value = notSelectedRuleOptions.value
    selectedRuleOptions.value = []
}

init()

const selectRuleModalVisible = ref<boolean>(false)
const keyword = ref<string>('')

const selectedRulesRef = ref()
const sortableOption = {
    animation: 150,
    disabled: false,
    dataIdAttr: 'data-prop',
    // 拖拽时预览图样式
    // ghostClass: 'drag-background-class'
    onEnd: (event) => {
        const order = sortableInstance.toArray()
        selectedRuleOptions.value = order.map((prop) =>
            selectedRuleOptions.value.find((item) => item.prop === prop)
        )
    }
}

const clear = () => {
    init()
    sortPopoverVisible.value = false
}

const confirm = () => {
    sortPopoverVisible.value = false

    emits('confirm', {
        asc:
            selectedRuleOptions.value
                .filter((item) => item.order === Order.ASCENT)
                ?.map((item) => item.prop) ?? [],
        desc:
            selectedRuleOptions.value
                .filter((item) => item.order === Order.DESCENT)
                ?.map((item) => item.prop) ?? []
    })
}

const search = (val) => {
    if (val) {
        searchResults.value = notSelectedRuleOptions.value.filter((item) =>
            item?.label?.includes(val)
        )
    } else {
        searchResults.value = notSelectedRuleOptions.value
    }
}

const selectRule = (option: RuleOption) => {
    selectRuleModalVisible.value = false
    selectedRuleOptions.value.push(option)
    notSelectedRuleOptions.value = notSelectedRuleOptions.value.filter(
        (item) => item.prop !== option.prop
    )
    searchResults.value = notSelectedRuleOptions.value
}

const deleteRule = (option: RuleOption) => {
    selectedRuleOptions.value = selectedRuleOptions.value.filter(
        (item) => item.prop !== option.prop
    )
    const index = props.columns?.findIndex((item) => item.prop === option.prop)
    notSelectedRuleOptions.value.splice(index, 0, option)
    searchResults.value = notSelectedRuleOptions.value
}

let sortableInstance
onMounted(() => {
    console.log('onMounted', selectedRulesRef.value)
    sortableInstance = new Sortable(selectedRulesRef.value, sortableOption)
})
</script>

<style lang="scss" scoped>
.sort-icon-wrapper {
    cursor: pointer;
    margin-right: 18px;

    :deep(.custom-svg-icon) {
        color: #989898;
        &:hover {
            color: #409eff;
        }
    }
}

.sort-wrapper {
    padding: 5px 10px 0 10px;

    .header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .title-wrapper {
            display: flex;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 600;

            .title {
                margin-right: 5px;
            }
            .tip-icon {
                margin-top: 4px;
            }
        }
    }

    .btns-wrapper {
        margin-bottom: 20px;
        .clear-btn-wrapper {
            margin-left: 10px;
        }
    }
}
.not-selected-wrapper {
    max-height: 300px;

    .option-list-wrapper {
        padding-left: 8px;
        overflow-y: scroll;
        scroll-behavior: smooth;
        max-height: 260px;
        //height: calc(100% - 40px);
    }

    .not-selected-item-wrapper {
        padding: 5px 11px;
        font-size: 16px;
        font-weight: 400;
        color: #606266;
        cursor: pointer;
        background-color: #ffffff;

        &:hover {
            background-color: #eeeeee;
            border-radius: 4px;
            color: #333333;
            font-weight: 600;
        }
    }
    .search-wrapper {
        padding: 8px 8px 0 8px;
        margin-bottom: 5px;
    }
}

.selected-rule-list-wrapper {
    max-height: 350px;
    overflow-y: auto;
    scroll-behavior: smooth;

    .selected-rule-item-wrapper {
        display: flex;
        font-size: 16px;
        color: #606266;
        margin-bottom: 10px;
        align-items: center;
        justify-content: space-between;

        .rule-info {
            display: flex;
            align-items: center;
            border: 1px solid rgba(213, 213, 213, 1);
            border-radius: 4px;
            width: 93%;
            justify-content: flex-end;
            cursor: pointer;
            height: 100%;

            &:hover {
                border-color: var(--el-color-primary);
            }

            .label {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 0 11px;
                flex: 1;
            }

            .order-radio-group {
                flex-wrap: nowrap;
                align-self: flex-end;
            }
        }

        .delete-rule-btn {
            cursor: pointer;
        }

        .drag-icon-wrapper {
            //cursor: grab;
            width: 25px;
            height: 100%;
            margin-top: 7px;

            :deep(.custom-svg-icon) {
                color: #989898;
                &:hover {
                    color: #409eff;
                }
            }
        }
    }
}
.confirm-btn-wrapper {
    text-align: center;
    margin: 10px 0;
}
</style>
