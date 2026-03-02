<template>
    <transition name="shade-opactitys">
        <div v-if="show" class="loading-next">
            <div class="box">
                <slot>
                    <component :is="currentIcon" />
                </slot>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
export default {
    name: 'GLodingShade'
}
</script>

<script lang="ts" setup>
import { computed, type VNode, defineAsyncComponent } from 'vue'
import * as loadingIcons from './components'

const props = withDefaults(
    defineProps<{
        show: boolean
        i?: string
        color?: string
        scale?: number
    }>(),
    {
        show: false,
        i: '1',
        color: '#000',
        scale: 1
    }
)

const currentIcon = computed<VNode>(() => loadingIcons[`Loading${props.i}`])
</script>

<style lang="scss" scoped>
.loading-next {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    background-color: #fff;

    .box {
        transform: scale(v-bind(scale));
    }
}

.loading-next :deep(.loading) {
    color: v-bind(color);
}

.shade-opactitys-enter-active,
.shade-opactitys-leave-active {
    will-change: transform;
    transition: all 0.3s ease;
}

.shade-opactitys-enter-from,
.shade-opactitys-leave-to {
    opacity: 0;
}
</style>
