import { nextTick } from 'vue'
import type { FormProps, BtnProps } from 'jn-ve-global'

/**
 * 在使用 form 的 resetFields 方法时，在初始化值的同时还会触发校验，在第一次触发初始化后，再异步调用一次 resetFields
 * 就可以取消掉校验
 * @param instance form instance ref
 */
export function resetFields(instance: FormProps['instance']) {
    instance?.resetFields()
    nextTick(() => {
        instance?.resetFields()
    })
}

/**
 * 快捷设置按钮的加载状态
 * @param btns 按钮组
 * @param label 指定的 label
 * @param state 状态
 */
export function setBtnLoadingState(btns: BtnProps[], label: string, state: boolean) {
    const targetBnt = btns.find((btn) => btn.label === label)
    if (!targetBnt) return
    targetBnt.loading = state
}

/**
 * 快捷设置按钮的禁用
 * @param btns 按钮组
 * @param label 指定的 label
 * @param state 状态
 */
export function setBtnDisabledState(btns: BtnProps[], label: string, state: boolean) {
    const targetBnt = btns.find((btn) => btn.label === label)
    if (!targetBnt) return
    targetBnt.disabled = state
}

/**
 * 查找表单控件数组中的指定节点
 * @param formConfig 表单配置对象
 * @param targetProp 目标字段
 * @returns
 */
export function findTargetFormItem(formConfig: FormProps, targetProp: string) {
    const target = formConfig.formItems.find((item) => item.prop === targetProp) || null
    return target
}

/**
 * 查找指定节点的控件
 * @param formConfig
 * @param targetProp
 * @returns
 */
export function findTargetControl<T>(formConfig: FormProps, targetProp: string) {
    const target = findTargetFormItem(formConfig, targetProp)
    return target['controlConfig'] as T
}
