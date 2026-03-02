import { departmentList } from './mock'
import type { InjectionKey } from 'vue'

export interface SelectDepartmentsContext {
    departmentList: any[]
    delete: () => void
}

// export const SelectDepartmentsContextKey = InjectionKey<>

export enum Tabs {
    RECENT = '0',
    ORGANIZATION = '1',
    LIST = '2'
}

export const tabMap = {
    [Tabs.RECENT]: '最近',
    [Tabs.ORGANIZATION]: '组织架构',
    [Tabs.LIST]: '列表'
}
