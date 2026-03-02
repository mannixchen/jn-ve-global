import type { InputProps, InputEvents } from './InputControlConfig'

export interface IconPickerProps extends InputProps, InputEvents {}

export interface IconPickerControlConfig {
    type: 'iconPicker'
    props?: IconPickerProps
}
