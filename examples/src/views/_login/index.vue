<template>
    <div
        class="login-wrapper"
        :style="{ backgroundImage: `url(/assets/images/login/maintenance/bg.png)` }"
        @keydown.enter="localHandleLogin"
    >
        <div class="info-wrapper">
            <h2 class="not-select">
                {{ sysName }}
            </h2>

            <g-form :config="loginInfoFormConfig" />

            <div class="pas-operation">
                <el-checkbox v-model="rememberFlag">
                    记住用户名
                </el-checkbox>
            </div>

            <div class="btn-wrapper">
                <el-button :loading="btnLoading" class="login-btn" @click="localHandleLogin">
                    登录
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Login'
}
</script>

<script lang="ts" setup>
import useLoginInfoFormConfig from './component/useLoginInfoFormConfig'
import useLoginContext from '@/login/hooks/useLoginContext'
import { useStore } from '@/store'

const store = useStore()
const sysName = store.state.currentStatus.sysName

// 获取登录页上下文
const {
    loginInfoFormConfig,
    localHandleLogin,
    btnLoading,
    retrievePasModalShow,
    rememberFlag
    // isBerth,
} = useLoginContext({
    useLoginInfoFormConfig
})
</script>

<style lang="scss" scoped>
@import './styles.scss';
</style>
