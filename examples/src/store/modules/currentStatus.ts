import { Module } from 'vuex'
import { CurrentStatus, RootStateTypes } from '../interface'
import AppPackage from '@jsjn/types/entity/AppPackage'

const currentStatus: Module<CurrentStatus, RootStateTypes> = {
    namespaced: true,
    state() {
        return {
            currentMicroApp: '',
            currentPath: '',
            routeLoading: false,
            isRootRoute: false,
            isFullScreen: false,
            screenRatio: 1,
            isFirstAfterLogin: false,
            hintUpdatePass: false,
            currentBrowser: null,
            sysdictUpdated: false,
            userInfoUpdated: false,
            currentSystem: null,
            currentMessageCount: 0,
            currentFrontEndMsgCount: 0,
            isReplaced: false,
            sysName: import.meta.env.VITE_SYS_NAME
        }
    },
    mutations: {
        setCurrentMicroApp(state, name: string) {
            state.currentMicroApp = name
        },
        setCurrentPath(state, path: string) {
            state.currentPath = path
        },
        setRouteLoading(state, status: boolean) {
            state.routeLoading = status
        },
        setIsRootRoute(state, status: boolean) {
            state.isRootRoute = status
        },
        setIsFullScreen(state, status: boolean) {
            state.isFullScreen = status
        },
        setScreenRatio(state, ratio: number) {
            state.screenRatio = ratio
        },
        setFirstAfterLogin(state, status: boolean) {
            state.isFirstAfterLogin = status
        },
        setHintUpdatePass(state, status: boolean) {
            state.hintUpdatePass = status
        },
        setCurrentBrowser(state, browserInfo: CurrentStatus['currentBrowser']) {
            state.currentBrowser = browserInfo
        },
        setSysdictUpdated(state, status: boolean) {
            state.sysdictUpdated = status
        },
        setUserInfoUpdated(state, status: boolean) {
            state.userInfoUpdated = status
        },
        setCurrentSystem(state, system: AppPackage) {
            state.currentSystem = system
        },
        setCurrentMessageCount(state, count: number) {
            state.currentMessageCount = count
        },
        setCurrentFrontEndMsgCount(state, count: number) {
            state.currentFrontEndMsgCount = count
        },
        setIsReplaced(state, flag: boolean) {
            state.isReplaced = flag
        }
    },
    actions: {
        updateFirstLogin({ commit }, status: boolean) {
            commit('setFirstAfterLogin', status)
            commit('setHintUpdatePass', status)
        }
    }
}

export default currentStatus
