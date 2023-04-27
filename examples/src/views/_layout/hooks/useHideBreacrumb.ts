import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default () => {
    const _route = useRoute()
    const hideBreacrumb = computed<boolean>(() => {
        return _route.path.startsWith('/home')
    })

    return {
        hideBreacrumb
    }
}
