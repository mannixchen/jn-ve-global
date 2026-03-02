interface Options {
    /**
     * html 容器
     */
    wrap: HTMLElement
    /**
     * canvas的ID
     */
    canvasId?: 'verifyCanvas' | string
    /**
     * 宽
     */
    width?: number
    /**
     * 高
     */
    height?: number
    /**
     * 类型
     * blend: 数字字母混合类型
     * number: 纯数字
     * letter: 纯字母
     */
    type?: 'blend' | 'number' | 'letter'
    /**
     * 指定值
     */
    code?: string
    /**
     * 生成的长度
     */
    codeLength?: number
    /**
     * 是否随机生成
     */
    isRandom?: boolean
    /**
     * 扩展字段
     */
    [k: string]: any
}

export default class GVerify {
    options: Options = {
        wrap: null
    }

    constructor(options: Options) {
        if (!options.wrap) throw new Error('wrap is null')

        // 默认options参数值
        this.options = {
            wrap: options.wrap,
            canvasId: options.canvasId || 'verifyCanvas',
            width: options.width || 100,
            height: options.height || 30,
            type: options.type || 'blend',
            code: options.code || '',
            codeLength: options.codeLength || 4,
            isRandom: options.isRandom === undefined ? true : options.isRandom
        }

        this._init = this._init.bind(this)
        this.refresh = this.refresh.bind(this)
        this.validate = this.validate.bind(this)
        this.getCode = this.getCode.bind(this)

        this._init()
        this.refresh()
    }

    // 初始化
    _init() {
        const con = (this.options as Options).wrap
        const canvas = document.createElement('canvas') as HTMLCanvasElement
        this.options.width = con.offsetWidth > 0 ? con.offsetWidth : this.options.width
        this.options.height = con.offsetHeight > 0 ? con.offsetHeight : this.options.height
        canvas.id = this.options.canvasId
        canvas.width = this.options.width
        canvas.height = this.options.height
        canvas.style.cursor = 'pointer'
        canvas.innerHTML = '您的浏览器版本不支持canvas'
        con.appendChild(canvas)
    }

    /**
     * 生成验证码
     */
    refresh() {
        if (this.options.isRandom) {
            this.options.code = ''
        }

        const canvas = document.getElementById(this.options.canvasId) as HTMLCanvasElement
        let ctx = null
        if (canvas.getContext) ctx = canvas.getContext('2d')
        else return

        ctx.textBaseline = 'middle'
        ctx.fillStyle = randomColor(180, 240)
        ctx.fillRect(0, 0, this.options.width, this.options.height)

        /**
         * 判断验证码类型
         *  1. 用户指定的
         *  2. 类型判断的
         */
        let txtArr = []
        if (!this.options.isRandom) {
            txtArr = this.options.code.split('')
        } else if (this.options.type === 'blend') {
            txtArr = [...getAllLetter(), ...getAllNumber()]
        } else if (this.options.type === 'number') {
            txtArr = getAllNumber()
        } else {
            txtArr = getAllLetter()
        }

        /**
         * 分字符绘制
         * 指定 || 随机
         */
        const codeLength = !this.options.isRandom
            ? this.options.code.length
            : this.options.codeLength

        for (let i = 0; i < codeLength; i++) {
            let txt: string = ''
            if (this.options.isRandom) {
                txt = txtArr[randomNum(0, txtArr.length)]
                this.options.code += txt
            } else {
                txt = txtArr[i]
            }

            // 绘制
            ctx.font = randomNum(this.options.height / 2, this.options.height) + 'px SimHei' //随机生成字体大小
            ctx.fillStyle = randomColor(50, 160) //随机生成字体颜色
            ctx.shadowOffsetX = randomNum(-3, 3)
            ctx.shadowOffsetY = randomNum(-3, 3)
            ctx.shadowBlur = randomNum(-3, 3)
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
            const x = (this.options.width / (codeLength + 1)) * (i + 1)
            const y = this.options.height / 2
            const deg = randomNum(-30, 30)

            // 设置旋转角度和坐标原点
            ctx.translate(x, y)
            ctx.rotate((deg * Math.PI) / 180)
            ctx.fillText(txt, 0, 0)
            // 恢复旋转角度和坐标原点
            ctx.rotate((-deg * Math.PI) / 180)
            ctx.translate(-x, -y)
        }

        // 绘制干扰线
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = randomColor(40, 180)
            ctx.beginPath()
            ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height))
            ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height))
            ctx.stroke()
        }

        // 绘制干扰点
        for (let i = 0; i < this.options.width / 4; i++) {
            ctx.fillStyle = randomColor(0, 255)
            ctx.beginPath()
            ctx.arc(
                randomNum(0, this.options.width),
                randomNum(0, this.options.height),
                1,
                0,
                2 * Math.PI
            )
            ctx.fill()
        }
    }

    /**
     * 校验
     * @param code
     * @returns
     */
    validate(code: string) {
        code = code.toLowerCase()
        const v_code = this.options.code.toLowerCase()

        if (code === v_code) {
            return true
        } else {
            this.refresh()
            return false
        }
    }

    /**
     * 获取
     */
    getCode() {
        return this.options.code.toLowerCase()
    }
}

/**
 * 生成字母数组
 */
function getAllLetter() {
    return 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(
        ','
    )
}

/**
 * 生成数字数组
 */
function getAllNumber() {
    return '0,1,2,3,4,5,6,7,8,9'.split(',')
}

/**
 * 生成一个随机数
 */
function randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}

/**
 * 生成一个随机色
 */
function randomColor(min: number, max: number) {
    var r = randomNum(min, max)
    var g = randomNum(min, max)
    var b = randomNum(min, max)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
}
