import { ref, ComputedRef, shallowRef } from 'vue'
import { loadCss, loadScript } from '@jsjn/utils'

interface Params {
    previewType?: ComputedRef<'img' | 'pdf' | 'docx' | 'excel'>
}

interface SourceMapping {
    /**
     * window 全局挂载名称
     */
    globalName: string
    /**
     * umd js 文件
     */
    js: string
    /**
     * css 文件
     */
    css?: string
    /**
     * 基础路径
     */
    baseDir?: string
}

const preSourceMappings: SourceMapping[] = [
    {
        globalName: 'Vue',
        js: '/vue/vue.runtime.global.prod.js'
    },
    {
        globalName: 'VueDemi',
        js: '/vue-demi/lib/index.iife.js'
    },
    {
        globalName: 'pdfjs-dist/build/pdf',
        js: '/pdfjs.3.17.107/pdf.js'
    }
]

const sourceMappings: {
    'pdf'?: SourceMapping
    'excel'?: SourceMapping
    'docx'?: SourceMapping
} = {
    pdf: {
        globalName: 'vue-office-pdf',
        baseDir: '/vue-office/pdf',
        css: null,
        js: '/vue-office-pdf.umd.js'
    },
    excel: {
        globalName: 'vue-office-excel',
        baseDir: '/vue-office/excel',
        css: '/index.css',
        js: '/vue-office-excel.umd.js'
    },
    docx: {
        globalName: 'vue-office-docx',
        baseDir: '/vue-office/docx',
        css: '/index.css',
        js: '/vue-office-docx.umd.js'
    }
}

export default ({ previewType }: Params) => {
    const loadComSourceFlag = ref<boolean>(false)
    const currentOfficeCom = shallowRef(null)
    const loadComSourceErr = ref<boolean>(false)

    async function initSource() {
        loadComSourceFlag.value = true

        try {
            // 加载前置资源
            for (let index = 0; index < preSourceMappings.length; index++) {
                const preItem = preSourceMappings[index]
                if (!window[preItem.globalName]) {
                    await loadScript(preItem.js, preItem.globalName)
                }
            }

            // 加载当前激活的类型资源
            const currentComSourceMapping: SourceMapping = sourceMappings[previewType.value]
            if (!window[currentComSourceMapping.globalName]) {
                if (currentComSourceMapping.css) {
                    loadCss(currentComSourceMapping.baseDir + currentComSourceMapping.css)
                }

                const component = await loadScript(
                    currentComSourceMapping.baseDir + currentComSourceMapping.js,
                    currentComSourceMapping.globalName
                )

                currentOfficeCom.value = component
            } else {
                currentOfficeCom.value = window[currentComSourceMapping.globalName]
            }

            setTimeout(() => {
                loadComSourceFlag.value = false
            }, 300)
        } catch (error) {
            loadComSourceErr.value = true
        }
    }

    return {
        loadComSourceErr,
        loadComSourceFlag,
        currentOfficeCom,
        initSource
    }
}
