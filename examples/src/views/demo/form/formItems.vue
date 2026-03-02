<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-06 10:10:36
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-04-11 10:48:58
 * @FilePath: \@jsjn-librar-monorepo\examples\src\views\demo\form\formItems.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div class="block">
        <span class="demonstration">{{ value }}</span>
        <el-progress type="circle" :percentage="25" stroke-linecap="butt" />
    </div>
    <div class="form-content">
        <!-- <el-switch
            v-model="value"
            :disabled="false"
            name="2222"
            :inline-prompt="true"
            :loading="loading"
            active-text="符合实际得分"
            inactive-text="十分士大夫和"
            active-value="'0'"
            inactive-value="'1'"
        /> -->
        <g-form :config="formConfig" />
    </div>
</template>

<script lang="ts">
export default {
    name: 'BusiFormItems'
}
</script>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import { getFormConfig } from './component/busiFormConfig'

const input1 = ref<string>('')

const formConfig = reactive(getFormConfig())

const value = ref('')
const loading = ref(false)

const props = reactive({
    expandTrigger: 'hover' as const,
    checkStrictly: true
})

const defaultProps = {
    children: 'children',
    label: 'label',
    disabled: 'disabled'
}

// const options = [
//     { label: '测试1', value: '1' },
//     { label: '测试2', value: '2' },
//     { label: '测试3', value: '3' },
//     { label: '测试4', value: '4' },
//     { label: '测试5', value: '5' },
//     { label: '测试6', value: '6' }
// ]

// const options = [
//     {
//         value: 'guide',
//         label: 'Guide',
//         children: [
//             {
//                 value: 'disciplines',
//                 label: 'Disciplines',
//                 children: [
//                     {
//                         value: 'consistency',
//                         label: 'Consistency'
//                     },
//                     {
//                         value: 'feedback',
//                         label: 'Feedback'
//                     },
//                     {
//                         value: 'efficiency',
//                         label: 'Efficiency'
//                     },
//                     {
//                         value: 'controllability',
//                         label: 'Controllability'
//                     }
//                 ]
//             },
//             {
//                 value: 'navigation',
//                 label: 'Navigation',
//                 children: [
//                     {
//                         value: 'side nav',
//                         label: 'Side Navigation'
//                     },
//                     {
//                         value: 'top nav',
//                         label: 'Top Navigation'
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         value: 'component',
//         label: 'Component',
//         children: [
//             {
//                 value: 'basic',
//                 label: 'Basic',
//                 children: [
//                     {
//                         value: 'layout',
//                         label: 'Layout'
//                     },
//                     {
//                         value: 'color',
//                         label: 'Color'
//                     },
//                     {
//                         value: 'typography',
//                         label: 'Typography'
//                     },
//                     {
//                         value: 'icon',
//                         label: 'Icon'
//                     },
//                     {
//                         value: 'button',
//                         label: 'Button'
//                     }
//                 ]
//             },
//             {
//                 value: 'form',
//                 label: 'Form',
//                 children: [
//                     {
//                         value: 'radio',
//                         label: 'Radio'
//                     },
//                     {
//                         value: 'checkbox',
//                         label: 'Checkbox'
//                     },
//                     {
//                         value: 'input',
//                         label: 'Input'
//                     },
//                     {
//                         value: 'input-number',
//                         label: 'InputNumber'
//                     },
//                     {
//                         value: 'select',
//                         label: 'Select'
//                     },
//                     {
//                         value: 'cascader',
//                         label: 'Cascader'
//                     },
//                     {
//                         value: 'switch',
//                         label: 'Switch'
//                     },
//                     {
//                         value: 'slider',
//                         label: 'Slider'
//                     },
//                     {
//                         value: 'time-picker',
//                         label: 'TimePicker'
//                     },
//                     {
//                         value: 'date-picker',
//                         label: 'DatePicker'
//                     },
//                     {
//                         value: 'datetime-picker',
//                         label: 'DateTimePicker'
//                     },
//                     {
//                         value: 'upload',
//                         label: 'Upload'
//                     },
//                     {
//                         value: 'rate',
//                         label: 'Rate'
//                     },
//                     {
//                         value: 'form',
//                         label: 'Form'
//                     }
//                 ]
//             },
//             {
//                 value: 'data',
//                 label: 'Data',
//                 children: [
//                     {
//                         value: 'table',
//                         label: 'Table'
//                     },
//                     {
//                         value: 'tag',
//                         label: 'Tag'
//                     },
//                     {
//                         value: 'progress',
//                         label: 'Progress'
//                     },
//                     {
//                         value: 'tree',
//                         label: 'Tree'
//                     },
//                     {
//                         value: 'pagination',
//                         label: 'Pagination'
//                     },
//                     {
//                         value: 'badge',
//                         label: 'Badge'
//                     }
//                 ]
//             },
//             {
//                 value: 'notice',
//                 label: 'Notice',
//                 children: [
//                     {
//                         value: 'alert',
//                         label: 'Alert'
//                     },
//                     {
//                         value: 'loading',
//                         label: 'Loading'
//                     },
//                     {
//                         value: 'message',
//                         label: 'Message'
//                     },
//                     {
//                         value: 'message-box',
//                         label: 'MessageBox'
//                     },
//                     {
//                         value: 'notification',
//                         label: 'Notification'
//                     }
//                 ]
//             },
//             {
//                 value: 'navigation',
//                 label: 'Navigation',
//                 children: [
//                     {
//                         value: 'menu',
//                         label: 'Menu'
//                     },
//                     {
//                         value: 'tabs',
//                         label: 'Tabs'
//                     },
//                     {
//                         value: 'breadcrumb',
//                         label: 'Breadcrumb'
//                     },
//                     {
//                         value: 'dropdown',
//                         label: 'Dropdown'
//                     },
//                     {
//                         value: 'steps',
//                         label: 'Steps'
//                     }
//                 ]
//             },
//             {
//                 value: 'others',
//                 label: 'Others',
//                 children: [
//                     {
//                         value: 'dialog',
//                         label: 'Dialog'
//                     },
//                     {
//                         value: 'tooltip',
//                         label: 'Tooltip'
//                     },
//                     {
//                         value: 'popover',
//                         label: 'Popover'
//                     },
//                     {
//                         value: 'card',
//                         label: 'Card'
//                     },
//                     {
//                         value: 'carousel',
//                         label: 'Carousel'
//                     },
//                     {
//                         value: 'collapse',
//                         label: 'Collapse'
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         value: 'resource',
//         label: 'Resource',
//         children: [
//             {
//                 value: 'axure',
//                 label: 'Axure Components'
//             },
//             {
//                 value: 'sketch',
//                 label: 'Sketch Templates'
//             },
//             {
//                 value: 'docs',
//                 label: 'Design Documentation'
//             }
//         ]
//     }
// ]

const data = [
    {
        value: '1',
        label: 'Level one 1',
        children: [
            {
                value: '1-1',
                label: 'Level two 1-1',
                children: [
                    {
                        value: '1-1-1',
                        label: 'Level three 1-1-1'
                    }
                ]
            }
        ]
    },
    {
        value: '2',
        label: 'Level one 2',
        children: [
            {
                value: '2-1',
                label: 'Level two 2-1',
                children: [
                    {
                        value: '2-1-1',
                        label: 'Level three 2-1-1'
                    }
                ]
            },
            {
                value: '2-2',
                label: 'Level two 2-2',
                children: [
                    {
                        value: '2-2-1',
                        label: 'Level three 2-2-1'
                    }
                ]
            }
        ]
    },
    {
        value: '3',
        label: 'Level one 3',
        children: [
            {
                value: '3-1',
                label: 'Level two 3-1',
                children: [
                    {
                        value: '3-1-1',
                        label: 'Level three 3-1-1'
                    }
                ]
            },
            {
                value: '3-2',
                label: 'Level two 3-2',
                children: [
                    {
                        value: '3-2-1',
                        label: 'Level three 3-2-1'
                    }
                ]
            }
        ]
    }
]

const data1 = [
    {
        id: 1,
        label: 'Level one 1',
        children: [
            {
                id: 3,
                label: 'Level two 2-1',
                children: [
                    {
                        id: 4,
                        label: 'Level three 3-1-1'
                    },
                    {
                        id: 5,
                        label: 'Level three 3-1-2',
                        disabled: true
                    }
                ]
            },
            {
                id: 2,
                label: 'Level two 2-2',
                disabled: true,
                children: [
                    {
                        id: 6,
                        label: 'Level three 3-2-1'
                    },
                    {
                        id: 7,
                        label: 'Level three 3-2-2',
                        disabled: true
                    }
                ]
            }
        ]
    }
]
</script>

<style lang="scss" scoped></style>
