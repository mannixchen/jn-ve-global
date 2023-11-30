import { h, Ref, ref, VNode, watch } from 'vue'
import { JnEditorProps } from '../interface/JnEditorProps'

const renderInline = (ce: any, id: string, tagName?: string): VNode =>
    ce(tagName ? tagName : 'div', {
        id
    })

const renderIframe = (ce: any, id: string): VNode =>
    ce('textarea', {
        id,
        visibility: 'hidden'
    })

export default (props: JnEditorProps, id: string): { element: VNode; elementRef: any } => {
    const elementRef = ref<Element | null>(null)

    const element: VNode =
        props.mode === 'inline' || props.mode === 'distraction-free'
            ? renderInline(h, id, props.tagName)
            : renderIframe(h, id)

    return { element, elementRef }
}
