import { Module } from 'vuex'
import { AppFuncTree, RootStateTypes } from '../interface'
import AppFunc from '@jsjn/types/entity/AppFunc'
import store from '../index'
import { RouteConfig } from '@jsjn/types/Route'
import axios from 'axios'
import appMageApiConfigs from '@/api/modules/appMage.api'
import prefix from '@/api/prefix'
import { BaseResponse } from '@jsjn/types/Response'
import { ElMessage } from 'element-plus'

const appFuncTree: Module<AppFuncTree, RootStateTypes> = {
    namespaced: true,
    state() {
        return {
            currentUserAppFuncTree: [],
            systemAppFuncTree: [],
            updateAppFuncTreeFlag: false,
            routeConfigs: [],
            registeredRoutes: [],
            loadRouteFlag: false,
            userNoAccess: false
        }
    },
    mutations: {
        setSystemAppFuncTree(state, data: { sysData: AppFunc[]; refreshUserFuncTree: boolean }) {
            state.systemAppFuncTree = data.sysData
        },
        setCurrentUserAppFuncTree(state, data: AppFunc[]) {
            state.currentUserAppFuncTree = data
        },
        setUpdateAppFuncTreeFlag(state, data: boolean) {
            state.updateAppFuncTreeFlag = data
        },
        setRouteConfigs(state, data: RouteConfig[]) {
            state.routeConfigs = data
        },
        setRegisteredRoutes(state, data: RouteConfig[]) {
            state.registeredRoutes = data
        },
        setLoadRouteFlag(state, data: boolean) {
            state.loadRouteFlag = data
        },
        setUserNoAccess(state, data: boolean) {
            state.userNoAccess = data
        }
    },
    actions: {}
}

export default appFuncTree
