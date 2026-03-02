<template>
    <div class="header-top-wrapper flex-al-c">
        <div class="left-box flex-al-c">
            <g-icon :icon="collapse ? 'menu-open' : 'menu-collapse'" @click="handleCollapse" />
            <h1>{{ sysName }}</h1>
        </div>

        <div class="system-info-wrapper flex-al-c">
            <!-- 机构名称 -->
            <span class="item">
                <g-icon icon="jg-public-dingbu-jigouming" />
                <span class="title">{{ currentInsttuName }}</span>
            </span>

            <!-- 用户信息 -->
            <div class="item">
                <g-icon v-if="!currentUserAvatarImgUrl" icon="jg-public-dingbu-yonghuming" />
                <img v-if="currentUserAvatarImgUrl" :src="currentUserAvatarImgUrl" alt="">
                <el-tooltip
                    effect="dark"
                    :content="currentUserName"
                    placement="left"
                    popper-class="my-custom-popper"
                >
                    <span class="title user-name overflow-ellipsis">{{ currentUserName }}</span>
                </el-tooltip>
            </div>

            <el-button @click="handleLogout">
                <span>退</span>出
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'HeaderSystemInfo'
}
</script>

<script lang="ts" setup>
import { inject, getCurrentInstance, ref, computed, watchEffect } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import Logout from '@/login/utils/logout'
import { getFileStreamUrl } from '@/utils/download'
import { apis } from '@/api'
import OrgInfo from '@jsjn/types/entity/OrgInfo'
import collapseKey from '@/views/_layout/constant/collapseKey'

const http = apis.personSetting

const { proxy } = getCurrentInstance() as any
const store = useStore()
const router = useRouter()

const collapse = inject(collapseKey)
const searchMenuDialogShow = ref<boolean>(false)
const modalShow = ref<boolean>(false)
const modalSysShow = ref<boolean>(false)
const currentUserAvatarImgUrl = ref<string>('')

// 机构列表
const instituList = ref<OrgInfo[]>([])
// 系统列表
const systemList = ref([])

// 当前业务是否全屏
const isFullScreen = computed(() => store.state.currentStatus.isFullScreen)

// 系统标题
const sysName = store.state.currentStatus.sysName

// 获取用户名称
const currentUserName = computed(() => store.state.currentUserInfo.accountInfo.name)

// 机构名称
let currentInsttuName = computed(() => store.state.currentUserInfo.instituInfo.name)

// 设置用户头像
watchEffect(() => {
    const fileId = store.state.currentUserInfo.accountInfo.avatar
    getFileStreamUrl(fileId).then((url) => {
        currentUserAvatarImgUrl.value = url
    })
})

// 收起/展开菜单
const handleCollapse = () => {
    proxy.mittBus.emit('changeAsideMenuCollapse', !collapse!.value)
}

// 切换业务区域全屏
const toggleFullScreen = () => {
    store.commit('currentStatus/setIsFullScreen', !isFullScreen.value)
}

// 退出
const handleLogout = () => {
    ElMessageBox.confirm('是否退出', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        Logout('regtech')
    })
}
</script>

<style lang="scss" scoped>
@import './styles.scss';
</style>

<style lang="scss">
.systemInfo-regtech-popper {
    .el-dropdown-menu__item {
        color: var(--jn-base-font-color);

        i,
        .g-icon {
            font-size: 22px;
        }
    }
}
</style>
