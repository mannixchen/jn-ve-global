<template>
    <template v-if="controlConfig">
        <!-- Input -->
        <template v-if="localControlType === 'input'">
            <LGAdvanceInput
                v-model.trim="localPropRef"
                :autosize="{ minRows: 5, maxRows: 8 }"
                v-bind="localControlProps"
                @focus="emits('controlFocus')"
                @blur="emits('controlBlur')"
            />
        </template>

        <!-- InputNumber -->
        <template v-if="localControlType === 'inputNumber'">
            <ElInputNumber
                v-model.number="localPropRef"
                v-bind="localControlProps"
                @focus="emits('controlFocus')"
                @blur="emits('controlBlur')"
            />
        </template>

        <!-- Select -->
        <template v-if="localControlType === 'select'">
            <ElSelect
                v-model="localPropRef"
                style="width: 100%"
                v-bind="localControlProps"
                @focus="emits('controlFocus')"
                @blur="emits('controlBlur')"
            >
                <ElOption
                    v-for="selectOption in (controlConfig as SelectControlConfig).options"
                    :key="(selectOption.value as any)"
                    :label="selectOption[(controlConfig?.props as SelectProps)?.optionProps?.['label'] ?? 'label']"
                    :value="selectOption[(controlConfig?.props as SelectProps)?.optionProps?.['value'] ?? 'value']"
                    :disabled="selectOption[(controlConfig?.props as SelectProps)?.optionProps?.['disabled'] ?? 'disabled']"
                >
                    <!-- 自定义渲染 Select 模板 -->
                    <template v-if="(controlConfig as SelectControlConfig).optionRender">
                        <FunctionalComponent
                            :render="(controlConfig as SelectControlConfig).optionRender(selectOption)"
                        />
                    </template>
                    <div
                        v-else-if="isRegtech && (localControlProps as SelectProps)?.multiple"
                        class="checkbox-option"
                    >
                        <span class="checkbox" />
                        <span>{{
                            selectOption[
                                (controlConfig?.props as SelectProps)?.optionProps?.['label'] ??
                                'label'
                            ]
                        }}</span>
                    </div>
                </ElOption>
            </ElSelect>
        </template>

        <!-- radio or checkbox -->
        <template
            v-if="['radio', 'radioButton', 'checkBox', 'checkBoxButton'].includes(localControlType)"
        >
            <LGChoose
                v-model="localPropRef"
                :type="(localControlType as any)"
                v-bind="(controlConfig as RadioControlConfig | CheckboxControlConfig).props"
                :options="(controlConfig as RadioControlConfig | CheckboxControlConfig).options"
            />
        </template>

        <!-- Switch -->
        <template v-if="localControlType === 'switch'">
            <ElSwitch v-model="localPropRef" v-bind="(controlConfig.props as any)" />
        </template>

        <!-- 选择 时间&日期 类 -->
        <template v-if="localControlType === 'timePicker'">
            <ElTimePicker v-model="localPropRef" v-bind="localControlProps" style="width: 100%" />
        </template>

        <template v-if="localControlType === 'timeSelect'">
            <ElTimeSelect v-model="localPropRef" v-bind="localControlProps" style="width: 100%" />
        </template>

        <template v-if="localControlType === 'datePicker'">
            <ElDatePicker
                v-model="localPropRef"
                v-bind="localControlProps"
                :popper-options="getPopoverOptions()"
                style="width: 100%"
            />
        </template>

        <template v-if="localControlType === 'dateTimePicker'">
            <ElDatePicker
                v-model="localPropRef"
                type="datetime"
                v-bind="localControlProps"
                :popper-options="getPopoverOptions()"
                style="width: 100%"
            />
        </template>

        <!-- Rate 打分 -->
        <template v-if="localControlType === 'rate'">
            <ElRate v-model="localPropRef" v-bind="(controlConfig.props as any)" />
        </template>

        <!-- Slider 滑块 -->
        <template v-if="localControlType === 'slider'">
            <ElSlider v-model="localPropRef" v-bind="(controlConfig.props as any)" />
        </template>

        <!-- ColorPicker 颜色选择器 -->
        <template v-if="localControlType === 'colorPicker'">
            <ElColorPicker v-model="localPropRef" v-bind="(controlConfig.props as any)" />
        </template>

        <!-- 下拉树 -->
        <template v-if="localControlType === 'selectTree'">
            <LGSelectTree
                v-model="localPropRef"
                :tree-data="(controlConfig as SelectTreeControlConfig).treeData"
                v-bind="(controlConfig.props as any)"
            >
                <template
                    v-if="(controlConfig as SelectTreeControlConfig)?.props?.slots?.treeNode"
                    #treeNode="{ node, data }"
                >
                    <!-- {{ (controlConfig as SelectTreeControlConfig).props.slots.treeNode(node) }} -->
                    <component
                        :is="(controlConfig as SelectTreeControlConfig).props.slots.treeNode(data, node)"
                    />
                </template>
            </LGSelectTree>
        </template>

        <!-- 下拉树版本2 -->
        <template v-if="localControlType === 'selectTreeV2'">
            <LGSelectTreeV2
                v-model="localPropRef"
                :tree-data="(controlConfig as SelectTreeControlConfig).treeData"
                v-bind="(controlConfig.props as any)"
            />
        </template>

        <!-- 上传文件 -->
        <template v-if="localControlType === 'upload'">
            <LGUpload
                v-model="localPropRef"
                v-model:file-list="localUploadFileList"
                v-model:instance="localUploadInstance"
                v-bind="(controlConfig.props as any)"
                :disabled="controlDisabled"
            />
        </template>

        <!-- 数值格式化、计算；输入框 -->
        <template v-if="localControlType === 'figureInput'">
            <LGFigureInput
                v-model="localPropRef"
                v-bind="localControlProps"
                @focus="emits('controlFocus')"
                @blur="emits('controlBlur')"
            />
        </template>

        <!-- 图标选择器 -->
        <template v-if="localControlType === 'iconPicker'">
            <LGIconPicker v-model="localPropRef" v-bind="(controlConfig.props as any)" />
        </template>

        <!-- 下拉框 多列展示（分页） -->
        <template v-if="localControlType === 'infoSelect'">
            <LGInfoSelect
                v-model="localPropRef"
                v-bind="localControlProps"
                :total="(controlConfig as InfoSelectControlConfig).total"
                :options-data="(controlConfig as InfoSelectControlConfig).options"
                :columns="(controlConfig as InfoSelectControlConfig).columns"
                :option-props="(controlConfig as InfoSelectControlConfig).optionProps"
            />
        </template>

        <!-- 下拉框 多列展示（虚拟滚动全量） -->
        <template v-if="localControlType === 'infoSelectAll'">
            <LGInfoSelectAll
                v-model="localPropRef"
                v-bind="localControlProps"
                :options-data="(controlConfig as InfoSelectAllControlConfig).options"
                :columns="(controlConfig as InfoSelectAllControlConfig).columns"
                :option-props="(controlConfig as InfoSelectAllControlConfig).optionProps"
            />
        </template>

        <!-- 带有输入建议且以表格形式展示的 input -->
        <template v-if="localControlType === 'infoAutocomplete'">
            <LGInfoAutocomplete
                v-model="localPropRef"
                v-bind="localControlProps"
                :columns="(controlConfig as InfoAutocompleteControlConfig).columns"
                :fetch-suggestions="(controlConfig as InfoAutocompleteControlConfig).fetchSuggestions"
                :value-key="(controlConfig as InfoAutocompleteControlConfig).valueKey"
            />
        </template>

        <!-- 地址输入 -->
        <template v-if="localControlType === 'address'">
            <LGAddress
                v-model="localPropRef"
                :options="(controlConfig as AddressControlConfig).options"
                :popper-options="getPopoverOptions()"
                v-bind="(controlConfig.props as any)"
            />
        </template>

        <!-- 富文本 -->
        <template v-if="localControlType === 'jnEditor'">
            <LJnEditor
                v-model="localPropRef"
                v-bind="(controlConfig.props as any)"
                :disabled="controlDisabled"
            />
        </template>

        <!-- 表格，仅做展示 -->
        <template v-if="(localControlType as any) === 'table'">
            <LGTable :config="(controlConfig.props as TableConfig<any>)" />
        </template>

        <!-- 占据排版的占位符 -->
        <template v-if="localControlType === 'placeholder'">
            <div class="form-item-placeholder" />
        </template>
    </template>
</template>

<script lang="ts">
export default {
    name: 'FormItemControl',
    inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { ref, computed, toRef, inject, watch, onUnmounted, Ref } from 'vue'
import {
    FormItemProps,
    RadioOptionProps,
    RadioButtonOptionProps,
    ControlConfig,
    UploadControlConfig,
    RadioControlConfig,
    CheckboxControlConfig,
    SelectControlConfig,
    InfoSelectAllControlConfig,
    InfoAutocompleteControlConfig,
    InfoSelectControlConfig,
    AddressControlConfig,
    SelectTreeControlConfig,
    DatePickerControlConfig,
    DatePickerProps,
    SelectProps
} from '../../../../interface'
import { TableConfig } from '../../../../../index'
import FunctionalComponent from '../../../../../FunctionalComponent'
import LGSelectTree from '../../../../../GSelectTree/v1/index.vue'
import LGFigureInput from '../../../../../GFigureInput/index.vue'
import LGIconPicker from '../../../../../GIconPicker/index.vue'
import LGUpload from '../../../../../GUpload/index.vue'
import LGInfoSelect from '../../../../../GInfoSA/GInfoSelect/index.vue'
import LGInfoSelectAll from '../../../../../GInfoSA/GInfoSelectAll/index.vue'
import LGInfoAutocomplete from '../../../../../GInfoSA/GInfoAutocomplete/index.vue'
import LGSelectTreeV2 from '../../../../../GSelectTree/v2/index.vue'
import LGAddress from '../../../../../GAddress/index.vue'
import LJnEditor from '../../../../../JnEditor/index.vue'
import LGAdvanceInput from '../../../control/GAdvanceInput/index.vue'
import LGTable from '../../../../../GTable/index.vue'
import LGChoose from '../../../control/GChoose/index.vue'

import formConfigProvideKey from '../../../../constant/formConfigProvideKey'
import getControlOprions from '../../../../hooks/getControlOprions'

import { getPopoverOptions } from '../../../../../_globalConstant/popoverOptions'
import { getBase } from '../../../../../_globalConstant/base'
import { Bases } from '../../../../../setting'

import {
    ElInputNumber,
    ElSelect,
    ElOption,
    ElSwitch,
    ElTimePicker,
    ElTimeSelect,
    ElDatePicker,
    ElRate,
    ElSlider,
    ElColorPicker
} from 'element-plus'

export interface Props {
    /**
     * FormItem 的配置参数
     */
    formItemConfig: FormItemProps
    /**
     * 输入控件的配置参数
     */
    controlConfig: ControlConfig
    /**
     * 表单绑定的值
     */
    prop: Ref<string | number | boolean | object | Array<any>>
}

const props = withDefaults(defineProps<Props>(), {
    formItemConfig: null,
    controlConfig: null,
    prop: null
})

const emits = defineEmits(['controlFocus', 'controlBlur'])
const rootFormConfig = inject(formConfigProvideKey)

const localControlType = computed(() => props.controlConfig.type)
const localPropRef = ref<any>(props.prop)

// 个别控件需要手动同步 form 的 disabled 状态
const controlDisabled = computed(() =>
    rootFormConfig.value.disabled
        ? rootFormConfig.value.disabled
        : (props.controlConfig.props as any)?.disabled
)

/**
 * 控件增强：自动获取控件的待选 options
 */
getControlOprions({ props: props as any })

/**
 * 特殊处理 upload 的 fileList
 */
let localUploadFileList = undefined
let localUploadInstance = undefined
if (localControlType.value === 'upload') {
    const config = props.controlConfig as UploadControlConfig
    localUploadFileList = toRef(config.props, 'fileList')
    localUploadInstance = toRef(config.props, 'instance')
}

// 获取 控件 的配置（三级配置）
const localControlProps = computed(() => {
    let controlProps = {
        ...props.controlConfig.props
    }

    // 占位符的配置
    if (!controlProps['placeholder']) {
        /* eslint-disable indent */
        switch (props.controlConfig!.type) {
            case 'input':
            case 'figureInput':
            case 'infoAutocomplete': {
                controlProps['placeholder'] = !controlDisabled?.value ? `请输入` : ' '
                break
            }
            case 'select':
            case 'infoSelect':
            case 'datePicker':
            case 'timeSelect':
            case 'timePicker':
            case 'dateTimePicker': {
                controlProps['placeholder'] = !controlDisabled?.value ? `请选择` : ' '
                break
            }
        }
    }
    if (
        controlDisabled.value &&
        props.controlConfig!.type === 'datePicker' &&
        (controlProps as DatePickerProps).type === 'daterange'
    ) {
        ;(controlProps as DatePickerProps).startPlaceholder = ' '
        ;(controlProps as DatePickerProps).endPlaceholder = ' '
    }

    /**
     * 这里在过滤传递的 props 的 _on 开头的伪事件代码
     * 处理原因忘记了
     * 应该不是为拖拽平台服务的，拖拽平台注入的事件都是处理过的事件名称
     *
     */
    const temp = {}
    if (Object.keys(controlProps).some((key) => key.startsWith('_on'))) {
        Object.keys(controlProps).forEach((key) => {
            if (!key.startsWith('_on')) {
                temp[key] = controlProps[key]
            }
        })
    }
    if (!!Object.keys(temp).length) {
        return temp
    }

    return controlProps
})

//监管基座下，select多选场景样式客制化，
const isRegtech = getBase() === Bases.REGTECH
</script>
