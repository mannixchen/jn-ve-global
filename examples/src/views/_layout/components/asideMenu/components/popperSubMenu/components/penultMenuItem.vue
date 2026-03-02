<template>
    <!-- 三级菜单仅做样式排版，数据分发，没有实际功能 -->
    <div class="second-menu-item">
        <div class="second-menu-item-title">
            <span>{{ config.meta.title }}</span>
        </div>

        <div class="last-menu-item-wrapper">
            <template v-for="lastItem in config.children" :key="lastItem.path">
                <LastMenuItem v-if="!lastItem.meta.hidden" :config="lastItem" />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'PenultMenuItem'
}
</script>

<script lang="ts" setup>
import { PropType } from 'vue'
import { RouteConfig } from '@jsjn/types/Route'
import LastMenuItem from './lastMenuItem.vue'

const props = defineProps({
    config: {
        type: Object as PropType<RouteConfig>,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.second-menu-item {
    margin-bottom: 10px;

    .second-menu-item-title {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 22px;
        color: var(--jn-menu-popper-penult-menu-item-color);
        font-weight: 600;
        letter-spacing: 1px;
        margin-bottom: 14px;
        cursor: default;

        &::before {
            content: '';
            width: 6px;
            height: 22px;
            border-radius: 2px;
            background-color: var(--jn-menu-popper-penult-menu-item-side-bgc);
            margin-right: 8px;
        }
    }

    .last-menu-item-wrapper {
        padding-left: 6 + 8px;
    }
}
</style>
