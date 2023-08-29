<template>
    <div :class="['g-address', { 'is-hide-detail': hideDetail }]">
        <el-cascader
            ref="elCascaderRef"
            v-bind="attrs"
            v-model="selectedRegion"
            :filterable="true"
            :options="localRegionData"
            :props="localCascaderProps"
            @visible-change="tableEditHide"
        />
        <el-input
            v-if="!hideDetail"
            v-model.trim="detailAddress"
            placeholder="详细地址"
            :size="($attrs.size as any)"
            :disabled="($attrs.disabled as boolean)"
            @blur="emits('table-edit-hide')"
        />
    </div>
</template>

<script lang="ts">
export default {
    name: 'GAddress'
}
</script>

<script lang="ts" setup>
import { toRaw, computed, useAttrs, watch, ref } from 'vue'
import { ElCascader, ElInput } from 'element-plus'
import myAxios from '../_http/http'
import prefix from '../_http/prefix'

const props = withDefaults(
    defineProps<{
        /**
         * 双向绑定的数据，两种格式
         *  - 正常：[string[], string]
         *  - 隐藏详情输入：string[]
         */
        modelValue?: Array<any>
        /**
         * 是否隐藏详情输入框
         */
        hideDetail?: boolean
        /**
         * 区域待选数据，覆盖本地
         */
        options?: Array<any>
        onChange?: (region?: string | string[], detail?: string, regionText?: string[]) => void
    }>(),
    {
        modelValue: () => [],
        hideDetail: false,
        options: null
    }
)

const emits = defineEmits(['update:modelValue', 'table-edit-hide'])
const attrs = useAttrs()
const elCascaderRef = ref<InstanceType<typeof ElCascader> | null>()

const localRegionData = ref([])
watch(
    () => props.options,
    (d) => {
        localRegionData.value = d
    },
    { immediate: true }
)
if (!props.options) {
    getAllAdministrative()
}

const localCascaderProps = computed(() => ({
    ...(attrs as any).props,
    value: 'id',
    label: 'name'
}))

// 地区
const selectedRegion = computed<string[]>({
    get: () => {
        if (props.hideDetail) {
            return Array.isArray(props.modelValue) ? props.modelValue : []
        }

        return Array.isArray(props.modelValue) && props.modelValue[0] !== undefined
            ? props.modelValue[0]
            : []
    },
    set: (val) => {
        emits(
            'update:modelValue',
            !props.hideDetail ? [toRaw(val), detailAddress.value] : toRaw(val)
        )
    }
})

// 详细地址
const detailAddress = computed<string>({
    get: () =>
        Array.isArray(props.modelValue) && props.modelValue[1] !== undefined
            ? props.modelValue[1]
            : '',
    set: (val) => {
        emits('update:modelValue', [toRaw(selectedRegion.value), val])
    }
})

watch(
    () => [selectedRegion.value, detailAddress.value],
    ([region, detail]) => {
        const node = elCascaderRef.value.getCheckedNodes(false)?.[0]
        props.onChange?.(region, detail as string, node?.pathLabels)
    }
)

// 表格中关闭
const tableEditHide = (val) => {
    if (!val && props.hideDetail) emits('table-edit-hide')
}

// 请求后台获取全国行政区划
function getAllAdministrative() {
    myAxios.get(`${prefix ?? ''}/kinso-basic-open-server/v1/area/treeByAuth`).then((res: any) => {
        if (res.code === '000000') {
            // 这里也可能外部采用了接口加载数据，有可能在初始化后，又改变了数据
            // 避免万一重复覆盖，这里再响应回来后，再次判断下
            if (!props.options) {
                localRegionData.value = res.data
            }
        }
    })
}

defineExpose({
    regionData: localRegionData,
    elCascaderRef
})
</script>

<style lang="scss" scoped>
.g-address {
    width: 100%;
    display: flex;
    justify-content: space-between;

    :deep(.el-cascader) {
        width: 40%;
    }

    > .el-input {
        width: 59%;
    }

    &.is-hide-detail {
        :deep(.el-cascader) {
            width: 100%;
        }
    }
}
</style>
