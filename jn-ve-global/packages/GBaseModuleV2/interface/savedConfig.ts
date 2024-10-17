import type { FormProps } from '../../GForm'
import { RuleOption, BaseModuleColumnProps } from './index'

export interface SavedConfig {
  /**
   * 查询条件
   */
  searchConditions?: FormProps[]
  /**
   * 排序方式
   */
  sortOptions?: RuleOption[]
  /**
   * 冻结显示列
   */
  columns?: BaseModuleColumnProps[]
}