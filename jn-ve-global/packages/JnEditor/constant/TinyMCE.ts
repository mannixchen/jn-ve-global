import { TinyMCE } from '../interface/tinymce'

const getTinymce = (): TinyMCE => {
    return window && ((window as any).tinymce ?? null)
}

export { getTinymce }
