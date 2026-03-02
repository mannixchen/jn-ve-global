import _GForm from './index.vue'
import _GFormRow from './components/layout/GFormRow/index.vue'
import _GFormItem from './components/layout/GFormItem/index.vue'
import _GColFormItem from './components/layout/GColFormItem/index.vue'
import _GChoose from './components/control/GChoose/index.vue'
import _GAdvanceInput from './components/control/GAdvanceInput/index.vue'
import _formConfigProvideKey from './constant/formConfigProvideKey'

export * from './interface'

export const formConfigProvideKey = _formConfigProvideKey
export const GForm = _GForm
export const GFormRow = _GFormRow
export const GFormItem = _GFormItem
export const GColFormItem = _GColFormItem
export const GChoose = _GChoose
export const GAdvanceInput = _GAdvanceInput
