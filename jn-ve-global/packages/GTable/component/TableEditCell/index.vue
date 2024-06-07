<template>
    <div
        v-if="localPropRef !== undefined && localPropRef !== null"
        ref="editCellContentRef"
        class="edit-cell-content"
        @dblclick="handleDB"
        @click="handleSC"
    >
        <transition
            :name="`slide-${cellStatus === CellStatus.CONTROL ? 'right' : 'left'}`"
            mode="out-in"
        >
            <div v-if="textCellShow" class="text">
                <!-- 普通文本 -->
                <span v-if="!columnConfig.render">{{
                    figureInputValue === null ? localPropRef : figureInputValue
                }}</span>

                <!-- 自定义渲染 -->
                <FunctionalComponent
                    v-else-if="columnConfig.render"
                    :render="columnConfig.render(localData, index)"
                />
            </div>

            <div
                v-else-if="controlCellShow"
                :class="[
                    'control',
                    { 'is-required': controlIsRequired },
                    { 'is-error': !validateRes }
                ]"
                @dblclick.stop
            >
                <!-- 自定义控件 -->
                <FunctionalComponent
                    v-if="columnConfig.controlRender"
                    :render="
                        columnConfig.controlRender(
                            toRef(localData, columnConfig.prop),
                            columnConfig.prop,
                            localData,
                            index,
                            control2Text
                        )
                    "
                />

                <!-- 预定义控件 -->
                <template v-else>
                    <!-- input 输入框 -->
                    <template v-if="localControlType === 'input'">
                        <div style="display: flex; width: 100%">
                            <ElInput
                                ref="controlRef"
                                v-model="localPropRef"
                                v-bind="localControlProps"
                                size="small"
                                @blur="control2Text"
                            />
                        </div>
                    </template>

                    <!-- InputNumber -->
                    <template v-if="localControlType === 'inputNumber'">
                        <div class="inputnumber-control-wrapper">
                            <ElInputNumber
                                ref="controlRef"
                                v-model="localPropRef"
                                size="small"
                                v-bind="localControlProps"
                            />
                            <ElButton text size="small" @click.stop="control2Text">
                                确定
                            </ElButton>
                        </div>
                    </template>

                    <!-- 下拉选择（多选情况特殊） -->
                    <template v-if="localControlType === 'select'">
                        <ElSelect
                            v-if="
                                !localControlProps ||
                                    localControlProps.multiple === undefined ||
                                    localControlProps.multiple === false ||
                                    (localControlProps.multiple && Array.isArray(localPropRef))
                            "
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            size="small"
                            style="width: 100%"
                            @visible-change="
                                (show) => {
                                    if (!show) delayControlToText()
                                }
                            "
                        >
                            <ElOption
                                v-for="selectOption in (columnConfig.controlConfig as SelectControlConfig).options"
                                :key="(selectOption.value as any)"
                                :label="selectOption.label"
                                :value="selectOption.value"
                                :disabled="selectOption.disabled"
                            >
                                <!-- 自定义渲染 Select 模板 -->
                                <template
                                    v-if="(columnConfig.controlConfig as SelectControlConfig).optionRender"
                                >
                                    <FunctionalComponent
                                        :render="(columnConfig.controlConfig as SelectControlConfig).optionRender(selectOption)"
                                    />
                                </template>
                            </ElOption>
                        </ElSelect>
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' is multiple but prop is not array;
                            </ElTag>
                        </div>
                    </template>

                    <!-- 单选框 -->
                    <template v-if="localControlType === 'radio'">
                        <ElRadioGroup
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            @change="control2Text"
                        >
                            <ElRadio
                                v-for="radioOption in (columnConfig.controlConfig as RadioControlConfig).options"
                                :key="(radioOption.value as any)"
                                :label="radioOption.value"
                                :disabled="radioOption.disabled"
                                size="small"
                            >
                                {{ radioOption.label }}
                            </ElRadio>
                        </ElRadioGroup>
                    </template>

                    <!-- 选择日期&时间类 -->
                    <template v-if="localControlType === 'timePicker'">
                        <ElTimePicker
                            v-if="localPropRef instanceof Date"
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            style="width: 100%"
                            size="small"
                            @change="delayControlToText"
                        />
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' is not Date;
                            </ElTag>
                        </div>
                    </template>

                    <template v-if="localControlType === 'timeSelect'">
                        <ElTimeSelect
                            v-if="typeof localPropRef === 'string'"
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            style="width: 100%"
                            size="small"
                            @change="delayControlToText"
                        />
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' is not string;
                            </ElTag>
                        </div>
                    </template>

                    <template v-if="localControlType === 'datePicker'">
                        <ElDatePicker
                            v-if="datePickerValueVerify()"
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            style="width: 100%"
                            size="small"
                            @change="delayControlToText"
                        />
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' prop type inconformity;
                            </ElTag>
                        </div>
                    </template>

                    <template v-if="localControlType === 'dateTimePicker'">
                        <ElDatePicker
                            v-if="datePickerValueVerify()"
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            type="datetime"
                            style="width: 100%"
                            size="small"
                            @change="delayControlToText"
                        />
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' prop type inconformity;
                            </ElTag>
                        </div>
                    </template>

                    <!-- 多选框 -->
                    <template v-if="localControlType === 'checkBox'">
                        <div v-if="Array.isArray(localPropRef)" class="checkbox-wrapper">
                            <ElCheckboxGroup v-model="localPropRef" v-bind="localControlProps">
                                <ElCheckbox
                                    v-for="checkBoxOption in (columnConfig.controlConfig as CheckboxControlConfig).options"
                                    :key="(checkBoxOption.value as any)"
                                    :label="checkBoxOption.value"
                                    :disabled="checkBoxOption.disabled"
                                    size="small"
                                >
                                    {{ checkBoxOption.label }}
                                </ElCheckbox>
                            </ElCheckboxGroup>
                            <div class="checkbox-confirm-btn-wrapper">
                                <ElButton size="small" type="primary" @click.stop="control2Text">
                                    确定
                                </ElButton>
                            </div>
                        </div>
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' is not array;
                            </ElTag>
                        </div>
                    </template>

                    <!-- ColorPicker 颜色选择器 -->
                    <template v-if="localControlType === 'colorPicker'">
                        <ElColorPicker
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            size="small"
                            @change="control2Text"
                        />
                    </template>

                    <!-- Rate 打分 -->
                    <template v-if="localControlType === 'rate'">
                        <ElRate
                            v-if="typeof localPropRef === 'number'"
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            size="small"
                            @change="control2Text"
                        />
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' is not number;
                            </ElTag>
                        </div>
                    </template>

                    <!-- Slider 滑块 -->
                    <template v-if="localControlType === 'slider'">
                        <ElSlider
                            v-if="typeof localPropRef === 'number'"
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            size="small"
                            :show-tooltip="false"
                            :class="{
                                'has-marks':
                                    localControlProps.marks &&
                                    Object.keys(localControlProps.marks).length > 0
                            }"
                            @change="control2Text"
                        />
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' is not number;
                            </ElTag>
                        </div>
                    </template>

                    <!-- 下拉树 -->
                    <template v-if="localControlType === 'selectTree'">
                        <LGSelectTree
                            v-if="
                                !localControlProps ||
                                    localControlProps.multiple === undefined ||
                                    localControlProps.multiple === false ||
                                    (localControlProps.multiple && Array.isArray(localPropRef))
                            "
                            v-model="localPropRef"
                            :tree-data="(columnConfig.controlConfig as SelectTreeControlConfig).treeData"
                            v-bind="localControlProps"
                            size="small"
                            @visible-change="
                                (show) => {
                                    if (!show) delayControlToText()
                                }
                            "
                        />
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' is multiple but prop is not array;
                            </ElTag>
                        </div>
                    </template>

                    <!-- 下拉树 V2 -->
                    <template v-if="localControlType === 'selectTreeV2'">
                        <LGSelectTreeV2
                            v-if="
                                !localControlProps ||
                                    localControlProps.multiple === undefined ||
                                    localControlProps.multiple === false ||
                                    (localControlProps.multiple && Array.isArray(localPropRef))
                            "
                            v-model="localPropRef"
                            :tree-data="(columnConfig.controlConfig as SelectTreeV2ControlConfig).treeData"
                            v-bind="localControlProps"
                            size="small"
                            style="width: 100%"
                            @visible-change="
                                (show) => {
                                    if (!show) delayControlToText()
                                }
                            "
                        />
                        <div v-else>
                            <ElTag type="danger" size="small">
                                error: '{{ columnConfig.prop }}' is multiple but prop is not array;
                            </ElTag>
                        </div>
                    </template>

                    <!-- 数字格式化 -->
                    <template v-if="localControlType === 'figureInput'">
                        <LGFigureInput
                            ref="controlRef"
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            size="small"
                            @table-edit-hide="control2Text"
                        />
                    </template>

                    <!-- 下拉框 多列展示（分页） -->
                    <template v-if="localControlType === 'infoSelect'">
                        <LGInfoSelect
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            :total="(columnConfig.controlConfig as InfoSelectControlConfig).total"
                            :options-data="(columnConfig.controlConfig as InfoSelectControlConfig).options"
                            :columns="(columnConfig.controlConfig as InfoSelectControlConfig).columns"
                            :option-props="(columnConfig.controlConfig as InfoSelectControlConfig).optionProps"
                            size="small"
                            @closed="delayControlToText"
                        />
                    </template>

                    <!-- 下拉框 多列展示（虚拟滚动全量） -->
                    <template v-if="localControlType === 'infoSelectAll'">
                        <LGInfoSelectAll
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            :options-data="(columnConfig.controlConfig as InfoSelectAllControlConfig).options"
                            :columns="(columnConfig.controlConfig as InfoSelectAllControlConfig).columns"
                            :option-props="(columnConfig.controlConfig as InfoSelectAllControlConfig).optionProps"
                            size="small"
                            @closed="delayControlToText"
                        />
                    </template>

                    <!-- 带有输入建议且以表格形式展示的 input -->
                    <template v-if="localControlType === 'infoAutocomplete'">
                        <LGInfoAutocomplete
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            :columns="(columnConfig.controlConfig as InfoAutocompleteControlConfig).columns"
                            :fetch-suggestions="(columnConfig.controlConfig as InfoAutocompleteControlConfig).fetchSuggestions"
                            :value-key="(columnConfig.controlConfig as InfoAutocompleteControlConfig).valueKey"
                            size="small"
                            @closed="delayControlToText"
                        />
                    </template>

                    <!-- 地址 -->
                    <template v-if="localControlType === 'address'">
                        <LGAddress
                            v-model="localPropRef"
                            v-bind="localControlProps"
                            :options="(columnConfig.controlConfig as AddressControlConfig).options"
                            size="small"
                            @table-edit-hide="delayControlToText"
                        />
                    </template>

                    <!-- 错误信息，存在 rules 即创建 -->
                    <template v-if="columnConfig.rules">
                        <ElTooltip
                            popper-class="edit-cell-error-msg-tooltip"
                            effect="dark"
                            :content="validateMsg"
                            placement="bottom"
                            :offset="0"
                        >
                            <transition :name="`slide-${validateMsg ? 'right' : 'left'}`">
                                <span v-if="validateMsg && !validateRes" class="error-msg">
                                    <!-- {{ validateMsg }} -->
                                </span>
                            </transition>
                        </ElTooltip>
                    </template>
                </template>
            </div>
        </transition>
    </div>
</template>

<script lang="tsx">
export default {
    name: 'TableEditCell'
}
</script>

<script lang="tsx" setup>
import { toRef } from 'vue'
import type {
    SelectControlConfig,
    RadioControlConfig,
    CheckboxControlConfig,
    SelectTreeControlConfig,
    SelectTreeV2ControlConfig,
    InfoSelectAllControlConfig,
    InfoSelectControlConfig,
    InfoAutocompleteControlConfig,
    AddressControlConfig
} from '../../../GForm'
import type { TableColumnProps, BaseTableDataItem } from '../../interface'
import FunctionalComponent from '../../../FunctionalComponent'
import { GSelectTree as LGSelectTree, GSelectTreeV2 as LGSelectTreeV2 } from '../../../GSelectTree'
import { GFigureInput as LGFigureInput } from '../../../GFigureInput'
import {
    GInfoSelect as LGInfoSelect,
    GInfoSelectAll as LGInfoSelectAll,
    GInfoAutocomplete as LGInfoAutocomplete
} from '../../../GInfoSA'
import { GAddress as LGAddress } from '../../../GAddress'

import {
    useAddEscEvent,
    useAddValidate,
    useConstant,
    useMethods,
    useMonitorRowEdit,
    useRefsStore
} from './hooks'
import {
    ElInput,
    ElInputNumber,
    ElButton,
    ElSelect,
    ElOption,
    ElTag,
    ElRadio,
    ElRadioGroup,
    ElTimePicker,
    ElTimeSelect,
    ElDatePicker,
    ElCheckbox,
    ElCheckboxGroup,
    ElColorPicker,
    ElRate,
    ElSlider,
    ElTooltip
} from 'element-plus'

export interface Props {
    /**
     * 当前列配置
     */
    columnConfig: TableColumnProps
    /**
     * 单元格所在行的 数据
     */
    data: BaseTableDataItem
    /**
     * 单元格所在行的 index
     */
    index: number
}

const props = withDefaults(defineProps<Props>(), {
    columnConfig: null,
    data: null,
    index: null
})

// dom ref
const { editCellContentRef, controlRef } = useRefsStore()

// 上下文所必须的变量
const {
    // 常量
    CellStatus,
    localCellPropInitValue,
    animationTime,
    onCellEdited,
    tableInstance,
    cellStatus,
    localData,
    localPropRef,
    localPropCopy,
    localControlType,
    localControlProps,
    escTrigger,

    // 计算
    controlIsRequired,
    figureInputValue,
    textCellShow,
    controlCellShow,

    // 工具
    parentClassFlag
} = useConstant({ props, editCellContentRef })

// 校验
const { currentCellValidator, validateRes, validateMsg } = useAddValidate({
    editCellContentRef,
    props,
    localPropRef,
    localData,
    controlCellShow
})

// 添加 esc 事件 mixin
useAddEscEvent({
    localPropCopy,
    localPropRef,
    cellStatus,
    CellStatus,
    localCellPropInitValue,
    validateRes,
    localData,
    tableInstance,
    animationTime,
    escTrigger,
    editCellContentRef,
    rowIndex: props.index
})

// 执行上下文必须的方法
const {
    text2Control,
    control2Text,
    delayControlToText,
    datePickerValueVerify,
    handleDB,
    handleSC
} = useMethods({
    cellStatus,
    CellStatus,
    tableInstance,
    animationTime,
    editCellContentRef,
    validateRes,
    localData,
    escTrigger,
    localPropCopy,
    localPropRef,
    onCellEdited,
    props,
    localControlProps,
    controlRef,
    parentClassFlag
})

// 行编辑总控
useMonitorRowEdit({
    localData,
    text2Control,
    currentCellValidator,
    cellStatus,
    CellStatus,
    localPropCopy,
    localPropRef,
    validateRes,
    validateMsg,
    props
})
</script>

<style lang="scss">
@import './styles/index.scss';

// 切换动画需要使用变量
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    will-change: transform;
    transition: all v-bind(animationTime) ease;
}

// slide-right
.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

// slide-left
.slide-left-enter-from {
    @extend .slide-right-leave-to;
}

.slide-left-leave-to {
    @extend .slide-right-enter-from;
}

.edit-cell-error-msg-tooltip {
    color: #f56c6c !important;
}
</style>
