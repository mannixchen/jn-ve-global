<template>
    <!-- 末级菜单路由跳转 -->
    <div
        class="last-menu-item"
        :class="{ 'is-active': isActive, 'no-component': !config.component }"
        @click="navTo(config.path)"
    >
        <span>{{ config.meta.title }}</span>
    </div>
</template>

<script lang="ts">
export default {
    name: 'LastMenuItem'
}
</script>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { RouteConfig } from '@jsjn/types/Route'
import { useStore } from '@/store'
import navToMixin from '@/hooks/navTo'

const props = defineProps({
    config: {
        type: Object as PropType<RouteConfig>,
        required: true
    }
})

const { navTo } = navToMixin()
const store = useStore()
const isActive = computed(() => store.state.currentStatus.currentPath === props.config.path)
</script>

<style lang="scss" scoped>
.last-menu-item {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 14px;
    cursor: pointer;
    color: var(--jn-menu-popper-last-menu-item-color);

    &::after {
        content: '';
        width: 3px;
        height: 16px;
        border-radius: 2px;
        background-color: #dadada;
        margin: 0 14px;
    }

    &:hover {
        color: var(--jn-menu-popper-last-menu-item-hover-color);
    }

    &:last-of-type {
        &::after {
            display: none;
        }
    }

    &.is-active {
        color: var(--jn-menu-popper-last-menu-item-active-color) !important;
    }

    &.no-component {
        cursor: default;

        &:hover {
            color: var(--jn-menu-popper-last-menu-item-color);
        }
    }
}
</style>
