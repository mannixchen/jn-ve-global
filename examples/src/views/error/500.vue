<template>
    <h1 class="not-select">
        500 Server Error
    </h1>
    <h1>
        <el-button text @click="backHome">
            返回首页
        </el-button>
    </h1>
</template>

<script lang="ts" setup>
import { defineComponent, toRaw, watch, watchEffect, computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const backHome = () => {
    router.replace('/')
}
</script>

<style lang="scss" scoped>
h1 {
    margin-top: 100px;
    text-align: center;
    color: var(--jn-base-font-color-black);

    .el-button {
        --jn-ve-g-base-font-size-s: 30px;
    }
}
</style>
