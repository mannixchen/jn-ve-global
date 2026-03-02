# 流程平台

基座应用提供了流程平台的展示页面，业务开发时，一般来说只需要关心其业务页面就可以了，通过特定的方式，进入系统的流程平台页面

:::tip

自框架 2.2.0 起，系统待办将同步工作流平台，2.2.0 前使用的是嵌套普元页面

:::

工作流平台名词解释：

* 业务节点：处理普通业务的节点
* 审批节点：执行审批的节点，内容不可编辑
* 审批可编辑节点：执行审批，且可以编辑的节点

## 跳转流程平台

:::tip

跳转流程平台，如下参数是必须的：

* appId: `string` 应用 id
* secretId: `string` 应用秘钥
* processInstId: `string` 流程 id

如下参数是可选的：

* title: `string` 流程标题
* from: `string` 流程来源，即关闭流程时，想要返回的页面，需要使用 Base64 加密后传递

可添加额外的参数，传递给业务页面
:::

```ts
import { toPage } from '@jsjn/micro-core-micro-main/navTo'
import { Base64 } from 'js-base64'

toPage({
    path: '/workflow',
    query: {
        appId: '3201006635120000',
        secretId: '592743c924ed451589709dce6596f444',
        processInstId: '795239480167497728',
        title: '沙钢定制化进件流程(房e贷)+-+有审批-可修改人工节点',
        from: Base64.encode(`${route.path}?index=${activeTask.value}`),
        // 如下自定义参数，无需额外参数，拷贝时请删除
        myField: '......'
    }
})
```

## 微应用业务页面开发

流程平台所运行的每一个节点，都会包含一个业务页面，业务页面存在于微应用中

在微应用框架中，提供了一个流程模块增强高阶组件： `@jsjn/micro-core-components/business/workflowModuleAdvance/index.vue`

:::tip

微应用流程业务页面的开发都是在与流程平台通讯，框架将通讯的过程封装进了这个增强组件，在使用过程中，只需要关注如何给增强组件数据就可以了

注意：写在增强组件中的业务页面在非流程平台中运行时，与普通页面运行无异，只有运行在流程平台中时才会进行通讯的处理

:::

### 流程模块增强-组件参数

参数|说明|类型|默认值
-----|-----|-----|-----
btns | 业务页面的按钮配置 | [BtnProps](./ButtonGroup.md)[] | --
isSaved | 标识业务页面数据保存完成 | boolean | false
isEdit | 标识业务页面是否处于编辑阶段，常用于审批可编辑节点 | boolean | false

`isSaved` 说明：在业务功能保存之后，需要通知到流程平台，流程平台才会显示出提交按钮，这个通知到操作，增强组件已经封装，只需要在合适的时候，通知增强组件就可以了

`isEdit` 原理同 `isSaved`

### 流程模块增强-获取数据

工作流平台会下发数据给业务页面，目前来说，可下发的数据有：

* 动态表单数据（高级用法，动态表单请[参考](../components/DynamicForm/FormGenerate.md)）
* 页面传递的参数
* 当前节点信息

增强组件通过自定义事件抛出数据：

```vue
<WorkflowModuleAdvance
    :btns="opertions"
    :is-saved="isSaved"
    @get-supplemental-form-config="getSupplementalFormConfigHandle"
    @get-route-query="getRouteQueryHandle"
    @get-current-task-node-info="getCurrentTaskNodeInfo"
>
    <h1>工作流内嵌页面</h1>

    <div class="box">
        <g-form :config="formConfig" />
    </div>
</WorkflowModuleAdvance>
```

参数|说明|类型|默认值
-----|-----|-----|-----
@getSupplementalFormConfig | 获取工作流下发的额外动态表单配置 | (data: FormProps) => void | --
@getRouteQuery | 进入工作流时，传递的路由参数 | (data: objet) => void | --
@getCurrentTaskNodeInfo | 获取当前的节点信息，可获取当前节点的类型及其他信息 | WorkflowNode | --

## 打印

:::tip
 2.5.0+ 适用，获取 `WorkflowModuleAdvance` 实例抛出的 print 方法，进行打印
:::

```vue
<template>
    <WorkflowModuleAdvance ref="workflowAdvanceRef">
        <div>printTest</div>
        <el-button @click="printHandle">
            打印
        </el-button>
    </WorkflowModuleAdvance>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'PrintTest'
})
</script>

<script lang="ts" setup>
import { watch, ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import WorkflowModuleAdvance from '@jsjn/micro-core-components/business/workflowModuleAdvance/index.vue'

const workflowAdvanceRef = ref<InstanceType<typeof WorkflowModuleAdvance> | null>(null)

function printHandle() {
    workflowAdvanceRef.value.print()
}
</script>

<style lang="scss" scoped></style>
```

## 完整示例

```vue
<!-- 请不要无脑复制，请结合实际需要进行复制代码 -->
<template>
    <WorkflowModuleAdvance
        :btns="opertions"
        :is-saved="isSaved"
        :is-edit="isEdit"
        @get-route-query="getRouteQueryHandle"
        @get-current-task-node-info="getCurrentTaskNodeInfo"
    >
        <h1>工作流内嵌页面</h1>

        <div class="box">
            <g-form :config="formConfig" />
        </div>
    </WorkflowModuleAdvance>
</template>

<script lang="ts">
export default {
    name: 'Aceraceae'
}
</script>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { BtnProps, FormProps } from 'jn-ve-global/packages'
import WorkflowModuleAdvance from '@/components/business/workflowModuleAdvance/index.vue'
import FormConfig from './component/formConfig'
import WorkflowNode from '@jsjn/types/entity/WorkflowNode'

const formConfig = FormConfig()
const isSaved = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const currentTaskNodeInfo = ref<WorkflowNode & { from: string; pageType: 'detail' | undefined; }>(null)

const opertions = reactive<BtnProps[]>([
    {
        label: '编辑',
        type: 'success',
        onClick() {
            isEdit.value = !isEdit.value
        }
    },
    {
        label: '保存',
        type: 'success',
        onClick() {
            // console.log(`%c 获取数据 === `, 'color: #67c23a;', formConfig.model)
            setTimeout(() => {
                isSaved.value = true
            }, 500)
        }
    },
    {
        label: '获取数据',
        type: 'success',
        onClick() {
            console.log(`%c 获取数据 === `, 'color: #67c23a;', formConfig.model)
        }
    },
    {
        label: '校验',
        type: 'success',
        onClick() {
            formConfig.instance.validate()
        }
    },
    {
        label: '重置',
        type: 'default',
        onClick() {
            formConfig.instance.resetFields()
        }
    },
    {
        label: '添加按钮',
        type: 'danger',
        onClick() {
            opertions.push({
                label: `${+new Date()}`,
                type: 'danger'
            })
        }
    }
])

const getRouteQueryHandle = (data) => {
    console.log(`%c 获取工作流路由参数：`, 'color: #f56c6c;', data)
}

function getCurrentTaskNodeInfo(info) {
    console.log('获取当前活跃的节点信息：', info)
    currentTaskNodeInfo.value = info
}
</script>

<style lang="scss" scoped>
.box {
    padding: 10px;
}
</style>
```
