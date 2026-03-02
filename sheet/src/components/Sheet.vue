<template>
    <div
        v-if="!reloadFlag"
        :id="containerId"
        class="js-sheet"
        style="
            margin: 0px;
            padding: 0px;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0px;
            top: 0px;
        "
    />
</template>

<script lang="ts" setup>
import { onMounted, nextTick, ref, shallowRef, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { getGlobal } from '@jsjn/utils'
import { loadSource } from './loadSource'

defineOptions({
    name: 'JnSheet'
})

const props = withDefaults(
    defineProps<{
        title?: string
        options?: object
    }>(),
    {
        options: () => ({}),
        title: 'XXX Sheet'
    }
)

const onlykey = uuidv4()
const containerId = `jn-sheet-${onlykey}`
const reloadFlag = ref<boolean>(false)
const luckysheet = shallowRef(window.luckysheet)

onMounted(() => {
    nextTick(init)
})

watch(() => props.title, reload)
watch(
    () => reloadFlag.value,
    (flag) => {
        if (flag) {
            setTimeout(init, 0)
        }
    }
)

/**
 * 初始化
 * 配置参考：https://dream-num.github.io/LuckysheetDocs/zh/guide/config.html
 */
function init() {
    if (luckysheet.value) {
        initSheet()
    } else {
        loadSource().then(() => {
            luckysheet.value = window.luckysheet
            initSheet()
        })
    }
}

function initSheet() {
    $(function () {
        const localOptions = {
            ...props.options, // 用户配置
            container: containerId, // 设定DOM容器的id
            lang: 'zh', // 设定表格语言
            title: props.title, // 工作簿名称
            gridKey: onlykey // 表格唯一标识符
        }

        luckysheet.value?.create(localOptions)
    })
}

/**
 * 重载方法
 */
function reload() {
    reloadFlag.value = true
    nextTick(() => {
        reloadFlag.value = false
    })
}

defineExpose({
    id: containerId,
    gridKey: onlykey,
    luckysheet,
    reload
})
</script>

<style lang="scss">
.js-sheet {
    #luckysheet_info_detail_title {
        display: none;
    }

    .luckysheet-share-logo {
        display: none;
    }
}
</style>
