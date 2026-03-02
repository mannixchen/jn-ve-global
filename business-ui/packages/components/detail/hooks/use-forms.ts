import { getFormConfig } from './../../../../../examples/src/views/demo/form/component/busiFormConfig'
/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-05-19 12:45:56
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-05-19 13:25:22
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\detail\hooks\use-forms.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
import { reactive, toRefs } from 'vue'
import { DetailProps } from '../type'
import { useFormProps } from '../../../hooks'


export const useForms = (props: DetailProps, slots) => {
  interface LocalState {
    activeNames: string[]
  }

  const { labelPosition, labelWidth } = props

  function getFormConfig() {

  }

  return {}
}