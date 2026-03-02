export interface FileUploaderOptionProps {
    /**
     * 目标上传 URL
     */
    target?: string

    /**
     * 是否单文件上传
     */
    singleFile?: boolean

    /**
     * 分块时按照该值来分。最后一个上传块的大小是可能是大于等于1倍的这个值但是小于两倍的这个值大小
     */
    chunkSize?: number

    /**
     * 是否强制所有的块都是小于等于 chunkSize 的值
     */
    forceChunkSize?: boolean

    /**
     * 并发上传数
     */
    simultaneousUploads?: number

    /**
     * 是否强制所有的块都是小于等于 chunkSize 的值
     */
    fileParameterName?: string

    /**
     * 上传请求的其他额外参数
     */
    query?: Object

    /**
     * 额外的一些请求头
     */
    headers?: Object

    /**
     * 标准的 CORS 请求是不会带上 cookie 的，如果想要带的话需要设置 withCredentials 为 true
     */
    withCredentials?: boolean

    /**
     * 当上传的时候所使用的是方式，可选 multipart、octet
     */
    method?: 'multipart' | 'octet'

    /**
     * 测试的时候使用的 HTTP 方法
     */
    testMethod?: string

    /**
     * 一个文件已经上传过了是否还允许再次上传
     */
    allowDuplicateUploads?: boolean

    /**
     * 对于文件而言是否高优先级发送第一个和最后一个块。一般用来发送到服务端，然后判断是否是合法文件；
     * 例如图片或者视频的 meta 数据一般放在文件第一部分，这样可以根据第一个块就能知道是否支持
     */
    prioritizeFirstAndLastChunk?: boolean

    /**
     * 是否测试每个块是否在服务端已经上传了，主要用来实现秒传、跨浏览器上传等
     */
    testChunks?: boolean

    /**
     * 可选的函数，每个块在测试以及上传前会被调用，参数就是当前上传块实例 Uploader.Chunk
     */
    preprocess?: (instance?: any) => void

    /**
     * 可选函数用于初始化文件对象，传入的参数就是 Uploader.File 实例
     */
    initFileFn?: (instance?: any) => void

    /**
     * 可选的函数用于原始文件的读取操作，传入的参数就是
     * Uploader.File 实例、文件类型、开始字节位置 startByte，结束字节位置 endByte、以及当前块 Uploader.Chunk 实例
     */
    readFileFn?: (
        fileInstance?: any,
        fileType?: string,
        startByte?: number,
        endByte?: number,
        chunkInstance?: any
    ) => void

    /**
     * 可选的函数用于根据 XHR 响应内容检测每个块是否上传成功了，
     * 传入的参数是：Uploader.Chunk 实例以及请求响应信息
     */
    checkChunkUploadedByResponse?: (chunkInstance?: any, res?: any) => boolean

    /**
     * 可覆盖默认的生成文件唯一标示的函数
     */
    generateUniqueIdentifier?: (file?: any) => string | number

    /**
     * 最大自动失败重试上传次数，值可以是任意正整数，如果是 undefined 则代表无限次
     */
    maxChunkRetries?: number

    /**
     * 重试间隔，值可以是任意正整数，如果是 null 则代表立即重试
     */
    chunkRetryInterval?: number | null

    /**
     *  进度回调间隔
     */
    progressCallbacksInterval?: number

    /**
     *  主要用于计算平均速度，值就是从 0 到 1，
     * 如果是 1 那么上传的平均速度就等于当前上传速度，如果说长时间上传的话，建议设置为 0.02，
     * 这样剩余时间预估会更精确，这个参数是需要和 progressCallbacksInterval 一起调整的，默认是 0.1。
     */
    speedSmoothingFactor?: number

    /**
     *  认为响应式成功的响应码
     */
    successStatuses?: string[] | number[]

    /**
     *  认为是出错的响应码
     */
    permanentErrors?: string[] | number[]

    /**
     *  初始文件 paused 状态
     */
    initialPaused?: number

    /**
     *  处理请求结果
     */
    processResponse?: (res?: any, cb?: Function, fileInstance?: any, chunkInstance?: any) => void

    /**
     *  处理请求参数
     */
    processParams?: (
        params?: any,
        fileInstance?: any,
        chunkInstance?: any,
        isTest?: boolean
    ) => void
}

export interface FileUploaderProps {
  /**
   * Uploader配置项
   */
  options?: FileUploaderOptionProps

  /**
   * 是否自动上传
   */
  autoStart?: boolean

  /**
   * 文件上传状态文案
   */
  fileStatusText?: Record<string, string> | Function
}
