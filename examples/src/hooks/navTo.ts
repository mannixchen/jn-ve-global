import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Base64 } from 'js-base64'
import { OpenMode } from '@jsjn/types/entity/AppFunc'

/**
 * 报表动态添加会话 cache key
 */
export const activateIframeRoutesCacheKey = 'ACTIVATE_IFRAME_ROUTES'

/**
 * 获取跳转方法，内部需要 useXxx 需要动态调用
 * @returns
 */
export default function () {
    const router = useRouter()
    // const store = useStore()
    const routeControlMode: string = 'frontEnd'
    const registeredRoutes = computed(() => router.getRoutes())

    /**
     * 在系统中，拥有两种路由注册方式，最终 vue-router 所注册的都是一维数组的路由，且都是以 / 开头的
     * 然而前端控制路由为了层次结构，组件（菜单、搜索菜单）在使用该数据结构创建元素时，拿到的 path 并不是以 / 开头的（子路由）
     * 所以要将两种 path 去除差异化
     * @param path 路由唯一标识
     * @returns
     */
    const navTo = (path: string, params?: string, unify: boolean = true) => {
        if (!path) return
        /**
         * 去差异化，条件选择
         */
        unify && (path = routeControlMode === 'backEnd' ? path : `/${path}`)

        // router 实际注册的路由（一维数组）
        const targetRoute = registeredRoutes.value.find((route) => route.path === path)

        // 注册时携带的参数：经后台路由处理核心处理放到了 meta 信息中
        let linkParams: string = params
            ? `${params}${targetRoute ? '&' + targetRoute.meta.urlQuery : ''}`
            : (targetRoute?.meta.urlQuery as string)

        // 如果注册了
        if (targetRoute) {
            // 工作台主动跳转时，携带 funcId
            if (path.includes('home/workbench')) {
                linkParams = `${linkParams ? linkParams + '&' : '?'}funcId=${
                    targetRoute.meta.funcId
                }`
            }

            if (path.includes('iframe')) {
                const removeQuryPath = path.replace(/\:link/, '')

                // 获取到 meta 中携带的 link，与调用传递的参数拼接，search 拼接 或 & 拼接
                let targetLink = `${targetRoute.meta.link}${
                    linkParams
                        ? `${
                            (targetRoute.meta.link as string).includes('?') ? '&' : '?'
                        }${linkParams}`
                        : ''
                }`

                // 转义特殊字符如 ? 在这里，base64 将 ?... 加密成了 / ，导致路由匹配失败，所以需要在 base64 加密之前转义一次
                targetLink = encodeURIComponent(targetLink)

                /**
                 * 路由拼接的后续路段
                 * 将会以 :link 的形式作为 params 传递
                 *
                 * 也就是说 /xxx/:link
                 * 实际路由 /xxx/abcdef
                 *
                 * 那么，当前路由将会接收
                 *  route.params: {
                 *      link: 'abcdef'
                 *  }
                 */
                router.push({
                    path: `${removeQuryPath}${Base64.encode(targetLink)}`
                })
                return
            }

            path = linkParams ? `${path}${linkParams.includes('?') ? '' : '?'}${linkParams}` : path

            /**
             * 期望外部打开，且未隐藏路由，打开新的窗口
             * 拼接当前路径
             */
            if (targetRoute.meta.openMode === OpenMode.NEW && !targetRoute.meta.hidden) {
                const newWHref = `${window.location.origin}${window.location.pathname}#${path}`
                window.open(newWHref)
                return
            }

            router.push(path)
            return
        }

        // console.log(`%c ${path} 未注册组件`, 'color: #f56c6c;')
    }

    return {
        navTo
    }
}
