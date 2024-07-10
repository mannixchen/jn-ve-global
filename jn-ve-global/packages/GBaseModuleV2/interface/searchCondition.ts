export interface ConditionProps {
  value: string
  label: string
  disabled: boolean
  isCurrent: boolean
}

export interface QueryProps {
  column: string
  isAuto?: boolean
  isHump?: boolean
  type: string
  value: string
  valueType?: string
}