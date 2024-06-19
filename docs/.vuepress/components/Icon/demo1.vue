<template>
    <div class="project">
        <h2>监管项目（共{{ regtechIcons.length }}个）：</h2>
        <div class="icon-wrapper">
            <template v-for="icon in regtechIcons" :key="icon">
                <div class="item">
                    <g-icon :icon="icon" />
                    <p>{{ icon }}</p>
                </div>
            </template>
        </div>
    </div>

    <h2>新核心项目（共{{ newCore.length }}个）：</h2>
    <div class="icon-wrapper">
        <template v-for="icon in newCore" :key="icon">
            <div class="item">
                <g-icon :icon="icon" />
                <p>{{ icon }}</p>
            </div>
        </template>
    </div>

    <h2>其他（共{{ other.length }}个）：</h2>
    <div class="icon-wrapper">
        <template v-for="icon in other" :key="icon">
            <div class="item">
                <g-icon :icon="icon" />
                <p>{{ icon }}</p>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { localIcons } from 'jn-ve-global/packages/GIconPicker/data/icons'

function camelToKebab(camelCase: string): string {
    return camelCase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const kebabNames = localIcons.map((name) => camelToKebab(name))

const regtechIcons = kebabNames.filter((name) => name.startsWith('jg-'))
const newCore = kebabNames.filter((name) => name.startsWith('xhx-'))
const other = kebabNames.filter((name) => !name.startsWith('jg-') && !name.startsWith('xhx-'))
</script>

<style lang="scss" scoped>
.icon-wrapper {
    display: flex;
    flex-wrap: wrap;
    border-top: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;

    .item {
        box-sizing: border-box;
        width: calc(100% / 6);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        padding: 16px;
        padding-top: 20px;
        transition: all 0.2s;

        p {
            margin: 0;
            margin-top: 10px;
            width: 100%;
            text-align: center;
            line-height: 1.4;
        }

        &:hover {
            background-color: #f2f6fc;

            &,
            :deep(svg) {
                color: #53a8ff !important;
            }
        }
    }

    :deep(svg) {
        font-size: 24px;
        transition: color 0.2s;
    }
}
</style>
