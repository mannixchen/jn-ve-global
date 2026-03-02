<template>
    <!-- 容器：数据分发 -->
    <div class="popper-sub-menu">
        <template v-for="item in config" :key="item.path">
            <!-- 
                仅适配倒数两级的菜单
                    监管：4 级
                    newcore：3 级
             -->
            <template v-if="!item.meta.hidden">
                <PenultMenuItem v-if="item.children && !!item.children.length" :config="item" />
                <LastMenuItem v-else :config="item" />
            </template>
        </template>
    </div>
</template>

<script lang="ts">
export default {
    name: 'PopperSubMenu'
}
</script>

<script lang="ts" setup>
import { PropType } from 'vue'
import { RouteConfig } from '@jsjn/types/Route'
import PenultMenuItem from './components/penultMenuItem.vue'
import LastMenuItem from './components/lastMenuItem.vue'

const props = defineProps({
    config: {
        type: Object as PropType<RouteConfig[]>,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.popper-sub-menu {
    overflow: auto;
    max-height: 90vh;
}
</style>
