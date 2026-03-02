<template>
    <!-- 柱 或 线 -->
    <BarOrLine
        v-if="chartType.includes('bar') || chartType.includes('line')"
        :config="(config as BarOrLineConfig)"
        v-bind="$attrs"
    />

    <!-- 饼图 -->
    <Pie v-if="chartType.includes('pie' as any)" :config="(config as PieConfig)" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GChart'
})
</script>

<script lang="ts" setup>
import { toRaw, watch, ref, computed, reactive, type PropType, type Ref, provide } from 'vue'
import type { ChartConfig, BarOrLineConfig, PieConfig } from './interface'
import type { ECharts } from 'echarts'
import BarOrLine from './component/barOrLine.vue'
import Pie from './component/pie.vue'
import { chartInstanceKey } from './constant/chartInstanceKey'

const props = defineProps({
    config: {
        type: Object as PropType<ChartConfig | BarOrLineConfig | PieConfig>,
        default: null
    }
})

// 向下抛出 echarts 实例容器
const chartInstance = ref<ECharts>()
provide(chartInstanceKey, chartInstance)

const chartType = computed(() => props.config.type)

// 抛出
defineExpose({
    chartInstance
} as {
    chartInstance: Ref<ECharts>
})
</script>
