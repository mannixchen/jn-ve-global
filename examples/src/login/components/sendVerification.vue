<template>
    <div v-if="!sendVerification" class="send-verification not-select">
        <el-button size="small" :disabled="sendVerification" @click="handleSend">
            发送验证码
        </el-button>
    </div>
    <div v-else class="send-verification not-select again">
        <span>重新发送</span>
        <span> （{{ residueSeconds }}s） </span>
    </div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SendVerification'
})
</script>

<script lang="tsx" setup>
import { ref, inject } from 'vue'
import { Local } from '@jsjn/utils'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import sendVerSourceKey from '../constant/sendVerSourceKey'

const props = withDefaults(
    defineProps<{
        /**
         * 要发送验证码的目标（组件仅做校验处理）
         */
        phoneValue?: string
        /**
         * 是否进行校验
         */
        isValidate?: boolean
        /**
         * 校验消息
         */
        msg?: string
    }>(),
    {
        phoneValue: '',
        isValidate: true,
        msg: '请输入正确的手机格式'
    }
)

const emits = defineEmits(['send'])

const sendDate = parseInt((process.env['VUE_APP_SEND_VALID'] as string) || '60')
const sendVerification = ref<boolean>(false)

// 存储发送验证码事件的存储 key（依据使用者：最近父级的 inject 值确定）
const PRE_DATE_KEY = inject(sendVerSourceKey)

// 加载的时间
const loadPageDate = dayjs().valueOf()
// 上次发送验证码时间
const preDate = Local.get(PRE_DATE_KEY)
// 最大时间（倒计时最大值）
const maxSeconds = sendDate
// 剩余时间
const residueSeconds = ref<number | string>(maxSeconds)

/**
 * 获取上次发送验证码的时间与加载的时间
 * maxSeconds - (pre - now) = 剩余时间
 */
if (preDate && Math.abs(preDate - loadPageDate) < maxSeconds * 1000) {
    const date = maxSeconds - Math.floor(Math.abs((preDate - loadPageDate) / 1000))
    residueSeconds.value = zeroFill(date)
    countDown()
}

const handleSend = () => {
    // 未输入
    if (!props.phoneValue) {
        ElMessage.warning(props.msg)
        return
    }

    // 校验格式（可选的）
    if (props.isValidate) {
        const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        if (!reg.test(props.phoneValue)) {
            ElMessage.warning(props.msg)
            return
        }
    }

    // 记录发送时间
    Local.set(PRE_DATE_KEY, dayjs().valueOf())
    countDown()
    emits('send')
}

function countDown() {
    sendVerification.value = true
    const intervarId = setInterval(() => {
        // 减值
        residueSeconds.value = zeroFill((residueSeconds.value as number) - 1)

        // 归零初始化
        if ((residueSeconds.value as number) - 0 === 0) {
            clearInterval(intervarId)
            sendVerification.value = false
            residueSeconds.value = maxSeconds
            Local.remove(PRE_DATE_KEY)
        }
    }, 1000)
}

// 补零
function zeroFill(num: number | string) {
    return (num as number) < 10 ? `0${num}` : num
}
</script>

<style lang="scss" scoped>
$--input-item-content-height: 40px;

.send-verification {
    width: 200px !important;
    text-align: center;
    font-size: var(--jn-base-font-size-m);
    margin-left: 14px;
    cursor: pointer;
    border-radius: 4px;
    transition: color var(--jn-base-animation-date);
    color: var(--jn-base-font-color);

    &:hover {
        color: var(--el-color-primary);
    }

    &.again {
        color: rgb(131, 131, 131);
        cursor: default;
    }
}
</style>
