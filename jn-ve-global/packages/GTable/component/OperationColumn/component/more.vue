<template>
    <ElDropdown
        :hide-on-click="false"
        @visible-change="(visible) => (dropdownIsVisible = visible)"
    >
        <!-- 触发器 -->
        <ElButton
            :class="[
                'table-row-more-operation-btn',
                {
                    'is-visible': dropdownIsVisible
                }
            ]"
            text
        >
            <span>更多操作...</span>
        </ElButton>

        <!-- 下拉 -->
        <template #dropdown>
            <ElDropdownMenu>
                <ElDropdownItem
                    v-for="(btn, index) in btns"
                    :key="`${btn.label}-${index}`"
                    class="table-row-more-operation-item"
                >
                    <!-- 不鉴权 -->
                    <ElButton
                        v-if="!btn.authCode"
                        v-bind="getBtnProps(btn)"
                        text
                        @click="handleBtnClick(btn)"
                    >
                        {{ btn.label }}
                    </ElButton>

                    <!-- 鉴权 -->
                    <ElButton
                        v-else
                        v-auth="btn.authCode"
                        v-bind="getBtnProps(btn)"
                        text
                        @click="handleBtnClick(btn)"
                    >
                        {{ btn.label }}
                    </ElButton>
                </ElDropdownItem>
            </ElDropdownMenu>
        </template>
    </ElDropdown>
</template>

<script lang="ts">
export default {
    name: 'GtableOperationColumnMore'
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { type TableRowBtnProps } from '../../../interface'
import { getBtnProps } from '../constant/util'
import { ElDropdown, ElButton, ElDropdownMenu, ElDropdownItem } from 'element-plus'

export interface Props {
    /**
     * 按钮组
     */
    btns: TableRowBtnProps<any>[]
    /**
     * 当前行数据
     */
    row: any
    /**
     * 当前行 index
     */
    index: number
}

const props = withDefaults(defineProps<Props>(), {
    btns: () => [],
    row: null,
    index: 0
})

// 下拉框展示
const dropdownIsVisible = ref<boolean>(false)

// 按钮点击，传递行数据
const handleBtnClick = (btn: TableRowBtnProps<any>) => {
    btn.onClick?.(props.row, props.index)
}
</script>

<style lang="scss" scoped>
.table-row-more-operation-btn {
    margin-left: 10px;
}

.table-row-more-operation-btn :deep(i.g-icon) {
    margin-left: 4px;
    transition: transform 0.3s;
}
</style>
<style lang="scss">
.table-row-more-operation-item {
    padding: 0;

    .ElButton {
        width: 100%;
        padding: 0 18px;
    }
}
</style>
