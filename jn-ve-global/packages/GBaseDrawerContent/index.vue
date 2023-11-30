<template>
    <div class="base-draweer-content">
        <div class="main">
            <ElScrollbar>
                <slot />
            </ElScrollbar>
        </div>
        <div v-if="$slots.footer" class="footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'GBaseDrawerContent'
})
</script>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus'
</script>

<style lang="scss" scoped>
.base-draweer-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .main {
        flex: 1;
        overflow: hidden;
    }

    .footer {
        padding-top: 10px;
        height: 70px;
        text-align: center;
    }
}

.base-draweer-content :deep(.el-scrollbar) {
    .el-scrollbar__view {
        padding: 0 30px 20px 10px;
        overflow: hidden;
    }
}
</style>
