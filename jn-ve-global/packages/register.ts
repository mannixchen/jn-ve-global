import type { App } from 'vue'
import { elIconKeys, aliIcons, localIcons } from './GIconPicker/data/icons'
import { setting, type Settings } from './setting'

import { default as FunctionalComponent } from './FunctionalComponent'
import { GAddress } from './GAddress'
import { GBaseDrawerContent } from './GBaseDrawerContent'
import { GBaseModule } from './GBaseModule'
import { GButtonGroup } from './GButtonGroup'
import { GChart, GChartBasic } from './GChart'
import { GCollapse, GCollapseItem } from './GCollapse'
import { GDButton } from './GDButton'
import { GFigureInput } from './GFigureInput'
import { GFilePreview } from './GFilePreview'
import { GAdvanceInput, GChoose, GColFormItem, GForm, GFormItem, GFormRow } from './GForm'
import { GFormGenerate } from './GFormGenerate'
import { GHintBox } from './GHintBox'
import { GIcon } from './GIcon'
import { GIconPicker } from './GIconPicker'
import { GInfoAutocomplete, GInfoSelect, GInfoSelectAll } from './GInfoSA'
import { GIrregularTable } from './GIrregularTable'
import { GLodingShade } from './GLodingShade'
import { GModal } from './GModal'
import { GSelectTree, GSelectTreeV2 } from './GSelectTree'
import { GTable } from './GTable'
import { GTabs } from './GTabs'
import { GTransfer } from './GTransfer'
import { GTransferTree } from './GTransferTree'
import { GTree } from './GTree'
import { GUpload } from './GUpload'
import { JnEditor } from './JnEditor'

/**
 * TODO: rollup + esbuild 没找到类似于 import.meta.glob 或 require.context 的功能，只好一个个引入
 */
const components = [
    FunctionalComponent,
    GAddress,
    GBaseDrawerContent,
    GBaseModule,
    GButtonGroup,
    GChart,
    GChartBasic,
    GCollapse,
    GCollapseItem,
    GDButton,
    GFigureInput,
    GFilePreview,
    GAdvanceInput,
    GChoose,
    GColFormItem,
    GForm,
    GFormItem,
    GFormRow,
    GFormGenerate,
    GHintBox,
    GIcon,
    GIconPicker,
    GInfoAutocomplete,
    GInfoSelect,
    GInfoSelectAll,
    GIrregularTable,
    GLodingShade,
    GModal,
    GSelectTree,
    GSelectTreeV2,
    GTable,
    GTabs,
    GTransfer,
    GTransferTree,
    GTree,
    GUpload,
    JnEditor
]

/**
 * 全局注册
 */
export default {
    version: '__VERSION__',
    install(app: App, props?: Settings) {
        // vue 模板组件
        components.forEach((item, index) => {
            app.component(item.name, item)
        })

        setting(props)
    }
}

export const icons = { elIconKeys, aliIcons, localIcons }
