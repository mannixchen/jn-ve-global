<template>
    <g-collapse v-model="activeNames">
        <g-collapse-item
            v-for="form in currentRecords"
            :key="form?.id ?? form?.serialNo"
            class="form-item-wrapper"
            :title="`${form?.name}${form?.serialNo}`"
            :name="`${form?.name}${form?.serialNo}`"
        >
            <el-button-group v-if="showOperation" class="operation-wrapper">
                <el-button
                    v-for="(btnProps, index) in btns"
                    :key="index"
                    class="operate-btn"
                    text
                    link
                    :type="btnProps.type"
                    :loading="btnProps.loading"
                    :disabled="btnProps.disabled as boolean"
                    @click.stop="
                        () => {
                            btnProps.onClick({
                                forms: formConfigs,
                                form,
                                index: form.serialNo - 1
                            })
                        }
                    "
                >
                    {{ btnProps.label }}
                </el-button>
            </el-button-group>

            <GForm :config="form">
                <GFormRow>
                    <slot />
                </GFormRow>
            </GForm>
        </g-collapse-item>
    </g-collapse>
</template>

<script lang="ts" setup>
import { watch, ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { GCollapse, GCollapseItem, FormProps, GForm, GFormRow } from 'jn-ve-global'
import { DetailProps } from '../type'
import { useDefaultProps } from '../hooks'
import { __is_simulator_env__ } from '../../../constants'
import { ElButton, ElButtonGroup, ElMessage, ElFormItem, ElPagination } from 'element-plus'

defineOptions({
    name: 'FormMode'
})

interface FormModeProps extends DetailProps {
    formConfigs: FormProps[]
    currentRecords: any[]
}

const props = withDefaults(defineProps<FormModeProps>(), {
    ...useDefaultProps(),
    formConfigs: () => []
})

const activeNames = computed<string[]>(() => {
    let names: string[] = []

    if (__is_simulator_env__) {
        names = props.expand ? [`${props.serialName}1`] : []
    } else {
        const allNames = props.formConfigs?.map((item, index) => props.serialName + (index + 1))
        names = props.expand ? allNames : activeNames.value
    }
    return names
})
</script>

<style lang="scss" scoped></style>
