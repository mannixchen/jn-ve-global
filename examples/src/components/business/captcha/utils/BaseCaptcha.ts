export interface CurrentCaptchaConfig {
    bgImageWidth: number
    bgImageHeight: number
    sliderImageWidth: number
    sliderImageHeight: number
    end: number
    startX?: number
    startY?: number
    startTime?: Date
    stopTime?: Date
    trackArr?: {
        x: number
        y: number
        type: 'down' | 'move' | 'up'
        t: Date | number
    }[]
    moveX?: number
    movePercent?: number
}

export default class BaseCaptcha {
    private _currentCaptchaConfig: CurrentCaptchaConfig = undefined
    private _doDown: (config?: CurrentCaptchaConfig) => void = undefined
    private _doMove: (config?: CurrentCaptchaConfig) => void = undefined
    private _valid: (config?: CurrentCaptchaConfig) => void = undefined

    constructor(props: {
        doDown: (config?: CurrentCaptchaConfig) => void
        doMove: (config?: CurrentCaptchaConfig) => void
        valid: (config?: CurrentCaptchaConfig) => void
    }) {
        this._doDown = props.doDown
        this._doMove = props.doMove
        this._valid = props.valid
    }

    /**
     * 初始化配置
     * @param bgImageWidth
     * @param bgImageHeight
     * @param sliderImageWidth
     * @param sliderImageHeight
     * @param end
     * @returns
     */
    initConfig(
        bgImageWidth: number,
        bgImageHeight: number,
        sliderImageWidth: number,
        sliderImageHeight: number,
        end: number
    ) {
        this._currentCaptchaConfig = {
            startTime: new Date(),
            trackArr: [],
            movePercent: 0,
            bgImageWidth,
            bgImageHeight,
            sliderImageWidth,
            sliderImageHeight,
            end
        }
        return this._currentCaptchaConfig
    }

    down = (event) => {
        let targetTouches = event.originalEvent
            ? event.originalEvent.targetTouches
            : event.targetTouches
        let startX = event.pageX
        let startY = event.pageY
        if (startX === undefined) {
            startX = Math.round(targetTouches[0].pageX)
            startY = Math.round(targetTouches[0].pageY)
        }
        this._currentCaptchaConfig.startX = startX
        this._currentCaptchaConfig.startY = startY

        const pageX = this._currentCaptchaConfig.startX
        const pageY = this._currentCaptchaConfig.startY
        const startTime = this._currentCaptchaConfig.startTime
        const trackArr = this._currentCaptchaConfig.trackArr
        trackArr.push({
            x: pageX - startX,
            y: pageY - startY,
            type: 'down' as 'down',
            t: new Date().getTime() - startTime.getTime()
        })

        // pc
        window.addEventListener('mousemove', this.move)
        window.addEventListener('mouseup', this.up)

        this._doDown(this._currentCaptchaConfig)
    }

    move = (event) => {
        // if (event instanceof TouchEvent) {
        //     event = event.touches[0]
        // }
        let pageX = Math.round(event.pageX)
        let pageY = Math.round(event.pageY)
        const startX = this._currentCaptchaConfig.startX
        const startY = this._currentCaptchaConfig.startY
        const startTime = this._currentCaptchaConfig.startTime
        const end = this._currentCaptchaConfig.end
        const bgImageWidth = this._currentCaptchaConfig.bgImageWidth
        const trackArr = this._currentCaptchaConfig.trackArr
        let moveX = pageX - startX
        const track = {
            x: pageX - startX,
            y: pageY - startY,
            type: 'move' as 'move',
            t: new Date().getTime() - startTime.getTime()
        }
        trackArr.push(track)
        if (moveX < 0) {
            moveX = 0
        } else if (moveX > end) {
            moveX = end
        }
        this._currentCaptchaConfig.moveX = moveX
        this._currentCaptchaConfig.movePercent = moveX / bgImageWidth

        this._doMove(this._currentCaptchaConfig)
    }

    up = (event) => {
        window.removeEventListener('mousemove', this.move)
        window.removeEventListener('mouseup', this.up)

        // if (event instanceof TouchEvent) {
        //     event = event.changedTouches[0]
        // }
        this._currentCaptchaConfig.stopTime = new Date()
        let pageX = Math.round(event.pageX)
        let pageY = Math.round(event.pageY)
        const startX = this._currentCaptchaConfig.startX
        const startY = this._currentCaptchaConfig.startY
        const startTime = this._currentCaptchaConfig.startTime
        const trackArr = this._currentCaptchaConfig.trackArr

        const track = {
            x: pageX - startX,
            y: pageY - startY,
            type: 'up' as 'up',
            t: new Date().getTime() - startTime.getTime()
        }

        trackArr.push(track)

        this._valid(this._currentCaptchaConfig)
    }
}
