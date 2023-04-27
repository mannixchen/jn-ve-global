<template>
    <button @click="title = `${+new Date()}`">
        改变title
    </button>
    <JnSheet :title="title" />
</template>

<script lang="ts" setup name="App">
import { toRaw, watch, ref, computed, reactive, toRefs } from 'vue'
import { JnSheet } from '@jsjn/sheet'

const title = ref<string>('ceshi')
</script>

<style lang="scss" scoped>
button {
    position: fixed;
    z-index: 2;
}
</style>
