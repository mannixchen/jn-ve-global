import { FormItemProps as ElFormItemProps } from 'element-plus'
import { UploadControlConfig } from 'jn-ve-global'

export type BiUploadProps = UploadControlConfig['props']

export type BiFiUploadProps = BiUploadProps & ElFormItemProps
