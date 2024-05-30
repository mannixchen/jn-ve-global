/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-30 09:45:02
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-30 09:53:52
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\input\type.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { FormItemProps as ElFormItemProps } from 'element-plus'
import { InputControlConfig } from 'jn-ve-global'

export type BiAdvanceInputProps = InputControlConfig['props']

export type BiFiAdvanceInputProps = BiAdvanceInputProps & ElFormItemProps
