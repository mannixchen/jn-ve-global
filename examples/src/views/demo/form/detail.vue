<!--
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-07 10:59:44
 * @LastEditors: zhujin zhujin@jsjngf.com
 * @LastEditTime: 2025-08-13 16:20:57
 * @FilePath: \@jsjn-librar-monorepo\examples\src\views\demo\form\detail.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <bi-detail
        v-model="detail"
        v-model:selected-rows="selectedRows"
        prop="detail"
        show-copy-button
        :expand="true"
        :sortable="true"
        display="table"
        :btns="btns"
        operation-width="130"
        :border="true"
        :stripe="true"
        :show-serial="true"
        :left-fixed-columns="2"
        :fixed-operation="true"
        :page-size="5"
        :max="7"
        :show-summary="true"
        :multiple="true"
        :disabled="false"
        :summary-columns="['salary', 'age']"
        @select="select"
        @select-all="selectAll"
    >
        <!-- <el-tree-select
            v-model="treeSelect"
            :data="data"
            :render-after-expand="false"
            @change="(val) => {
                console.log('treeSelect', val)
            }"
        />
        <el-tree-select
            v-model="treeSelect2"
            :data="data"
            :render-after-expand="false"
            multiple
            @change="(val) => {
                console.log('treeSelect2', val)
            }"
        />
        <el-cascader
            v-model="cascader2"
            :options="options2"
            :props="cascaderProps"
            @change="
                (val) => {
                    console.log('cascader2', val)
                }
            "
        />

        <el-cascader
            v-model="cascader"
            :options="options2"
            @change="
                (val) => {
                    console.log('cascader', val)
                }
            "
        />

        <el-time-select
            v-model="timeSelect"
            start="08:30"
            step="00:15"
            end="18:30"
            placeholder="Select time"
        />
        <el-time-picker v-model="timePicker" placeholder="Arbitrary time" />
        <el-time-picker
            v-model="timePickerRange"
            is-range
            range-separator="-"
            start-placeholder="Start time"
            end-placeholder="End time"
        />
        <el-date-picker
            v-model="datetimerange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
        />
        <el-date-picker v-model="datetime" type="datetime" placeholder="Select date and time" />
        <el-date-picker
            v-model="date2"
            type="daterange"
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
        />
        <el-date-picker v-model="date1" type="date" placeholder="Pick a day" />
        <el-radio-group v-model="radioValue">
            <el-radio :label="3">
                Option A
            </el-radio>
            <el-radio :label="6">
                Option B
            </el-radio>
        </el-radio-group>

        <el-checkbox-group v-model="checkList">
            <el-checkbox label="shanghai" value="shanghai" />
            <el-checkbox label="beijing" value="beijing" />
        </el-checkbox-group> 

        <el-select v-model="selectValue" placeholder="Select" :multiple="true">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select> -->
        <!-- <el-input-number v-model="idCard" :min="1" :max="10" /> -->

        <bi-fi-input-card prop="idCard" label="身份证" clearable :rules="rules" required />
        <bi-fi-input-email prop="email" label="邮箱" clearable />
        <bi-fi-input-email prop="name" label="姓名" clearable />
        <bi-fi-input-email prop="age" label="年龄" clearable />
        <bi-fi-input-email prop="salary" label="工资" clearable />
        <!-- <bi-fi-input-card v-model="idCard" label="身份证x" prop="idCard2" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证3" prop="idCard3" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证4" prop="idCard4" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证5" prop="idCard5" clearable /> -->
    </bi-detail>
    <el-divider />
    <TableDemo />
    <!-- <bi-input-card v-model="idCard" prop="idCard" clearable /> -->

    <!-- <bi-fi-detail
        v-model="detail"
        prop="detail"
        show-copy-button
        :required="true"
        :expand="true"
        :sortable="true"
        display="table"
        :btns="btns"
        :operation-width="180"
        :border="false"
        :stripe="true"
        :show-serial="true"
        :left-fixed-columns="1"
        :fixed-operation="true"
        :page-size="5"
        :max="7"
    >
        <bi-fi-input-card v-model="idCard" prop="idCard" clearable :rules="rules" required />
        <bi-fi-input-email v-model="email" prop="email" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证3" prop="idCard3" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证4" prop="idCard4" clearable />
        <bi-fi-input-card v-model="idCard" label="身份证5" prop="idCard5" clearable />
    </bi-fi-detail> -->
    <!-- <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column fixed prop="date" label="Date" width="150" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="120" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column prop="zip" label="Zip" width="120" />
        <el-table-column fixed="right" label="Operations" width="120">
            <template #default>
                <el-button link type="primary" size="small" @click="handleClick">
                    Detail
                </el-button>
                <el-button link type="primary" size="small">
                    Edit
                </el-button>
            </template>
        </el-table-column>
    </el-table> -->
    <!-- <el-divider />
    <bi-detail
        show-copy-button
        :expand="true"
        sortable
        :btns="btns"
        :confirm-delete="false"
        label-position="top"
        :page-size="2"
    >
        <bi-fi-input-card v-model="idCard" prop="idCard" clearable :rules="rules" />
        <bi-fi-input-email v-model="email" prop="email" clearable />
    </bi-detail> -->
</template>

<script lang="ts" setup>
import { reactive, watch, ref, computed, toRefs } from 'vue'
import { BtnProps } from '@jsjn/business-ui/packages'
import TableDemo from './table.vue'

const btns = reactive<BtnProps[]>([
    {
        label: '保存',
        disabled: false,
        loading: false,
        onClick: ({ forms, form, index }) => {
            console.log('save')
            // form.instance.validate()
            form.instance.resetFields()
            // form.disabled = true
        }
    }
])

const rules = [{ required: true, message: 'age is required1111' }]

const idCard = ref(2)
const email = ref()
const selectValue = ref(['Option1', 'Option3', 'Option5'])
const radioValue = ref(3)
const checkList = ref(['beijing', 'shanghai'])
const date1 = ref('2025-11-05')
const date2 = ref(['2025-11-01', '2025-11-05'])
const datetime = ref('2025-11-05 12:30:00')
const datetimerange = ref(['2025-11-01 12:00:00', '2025-11-05 12:30:00'])
const timePicker = ref(new Date(2016, 9, 10, 18, 30))
const timePickerRange = ref<[Date, Date]>([
    new Date(2016, 9, 10, 8, 40),
    new Date(2016, 9, 10, 9, 40)
])
const timeSelect = ref('12:30')

const cascader = ref(['guide', 'disciplines', 'consistency'])
const cascader2 = ref([
    ['guide'],
    ['guide', 'disciplines'],
    ['guide', 'disciplines', 'consistency']
])
const cascaderProps = ref({
    multiple: true,
    checkStrictly: true
})

const treeSelect = ref('1-1-1')
const treeSelect2 = ref(['2-1-1', '3-2-1'])

const options = [
    {
        value: 'Option1',
        label: 'Option1'
    },
    {
        value: 'Option2',
        label: 'Option2'
    },
    {
        value: 'Option3',
        label: 'Option3'
    },
    {
        value: 'Option4',
        label: 'Option4'
    },
    {
        value: 'Option5',
        label: 'Option5'
    }
]

const detail = ref([
    {
        idCard: '111',
        email: '111ddasdasdaewdasdadsadadasdadadasewdadasedasdasdasdasd@xx.com',
        name: '张三',
        sex: '男',
        age: '30',
        salary: '0.333'
    },
    {
        idCard: '222',
        email: '222@xx.com',
        name: '李四',
        sex: '女',
        age: '25',
        salary: '0.666'
    }
])

const selectedRows = ref([])

const select = (selection, row) => {
    console.log('select', selection, row)
}

const selectAll = (selection) => {
    console.log('selectAll', selection)
}

watch(
    () => selectedRows.value,
    (val) => {
        console.log('watch-selectedRows', val)
    },
    {
        deep: true
    }
)

const options2 = [
    {
        value: 'guide',
        label: 'Guide',
        children: [
            {
                value: 'disciplines',
                label: 'Disciplines',
                children: [
                    {
                        value: 'consistency',
                        label: 'Consistency'
                    },
                    {
                        value: 'feedback',
                        label: 'Feedback'
                    },
                    {
                        value: 'efficiency',
                        label: 'Efficiency'
                    },
                    {
                        value: 'controllability',
                        label: 'Controllability'
                    }
                ]
            },
            {
                value: 'navigation',
                label: 'Navigation',
                children: [
                    {
                        value: 'side nav',
                        label: 'Side Navigation'
                    },
                    {
                        value: 'top nav',
                        label: 'Top Navigation'
                    }
                ]
            }
        ]
    },
    {
        value: 'component',
        label: 'Component',
        children: [
            {
                value: 'basic',
                label: 'Basic',
                children: [
                    {
                        value: 'layout',
                        label: 'Layout'
                    },
                    {
                        value: 'color',
                        label: 'Color'
                    },
                    {
                        value: 'typography',
                        label: 'Typography'
                    },
                    {
                        value: 'icon',
                        label: 'Icon'
                    },
                    {
                        value: 'button',
                        label: 'Button'
                    }
                ]
            },
            {
                value: 'form',
                label: 'Form',
                children: [
                    {
                        value: 'radio',
                        label: 'Radio'
                    },
                    {
                        value: 'checkbox',
                        label: 'Checkbox'
                    },
                    {
                        value: 'input',
                        label: 'Input'
                    },
                    {
                        value: 'input-number',
                        label: 'InputNumber'
                    },
                    {
                        value: 'select',
                        label: 'Select'
                    },
                    {
                        value: 'cascader',
                        label: 'Cascader'
                    },
                    {
                        value: 'switch',
                        label: 'Switch'
                    },
                    {
                        value: 'slider',
                        label: 'Slider'
                    },
                    {
                        value: 'time-picker',
                        label: 'TimePicker'
                    },
                    {
                        value: 'date-picker',
                        label: 'DatePicker'
                    },
                    {
                        value: 'datetime-picker',
                        label: 'DateTimePicker'
                    },
                    {
                        value: 'upload',
                        label: 'Upload'
                    },
                    {
                        value: 'rate',
                        label: 'Rate'
                    },
                    {
                        value: 'form',
                        label: 'Form'
                    }
                ]
            },
            {
                value: 'data',
                label: 'Data',
                children: [
                    {
                        value: 'table',
                        label: 'Table'
                    },
                    {
                        value: 'tag',
                        label: 'Tag'
                    },
                    {
                        value: 'progress',
                        label: 'Progress'
                    },
                    {
                        value: 'tree',
                        label: 'Tree'
                    },
                    {
                        value: 'pagination',
                        label: 'Pagination'
                    },
                    {
                        value: 'badge',
                        label: 'Badge'
                    }
                ]
            },
            {
                value: 'notice',
                label: 'Notice',
                children: [
                    {
                        value: 'alert',
                        label: 'Alert'
                    },
                    {
                        value: 'loading',
                        label: 'Loading'
                    },
                    {
                        value: 'message',
                        label: 'Message'
                    },
                    {
                        value: 'message-box',
                        label: 'MessageBox'
                    },
                    {
                        value: 'notification',
                        label: 'Notification'
                    }
                ]
            },
            {
                value: 'navigation',
                label: 'Navigation',
                children: [
                    {
                        value: 'menu',
                        label: 'Menu'
                    },
                    {
                        value: 'tabs',
                        label: 'Tabs'
                    },
                    {
                        value: 'breadcrumb',
                        label: 'Breadcrumb'
                    },
                    {
                        value: 'dropdown',
                        label: 'Dropdown'
                    },
                    {
                        value: 'steps',
                        label: 'Steps'
                    }
                ]
            },
            {
                value: 'others',
                label: 'Others',
                children: [
                    {
                        value: 'dialog',
                        label: 'Dialog'
                    },
                    {
                        value: 'tooltip',
                        label: 'Tooltip'
                    },
                    {
                        value: 'popover',
                        label: 'Popover'
                    },
                    {
                        value: 'card',
                        label: 'Card'
                    },
                    {
                        value: 'carousel',
                        label: 'Carousel'
                    },
                    {
                        value: 'collapse',
                        label: 'Collapse'
                    }
                ]
            }
        ]
    },
    {
        value: 'resource',
        label: 'Resource',
        children: [
            {
                value: 'axure',
                label: 'Axure Components'
            },
            {
                value: 'sketch',
                label: 'Sketch Templates'
            },
            {
                value: 'docs',
                label: 'Design Documentation'
            }
        ]
    }
]

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
</script>

<style lang="scss" scoped></style>
