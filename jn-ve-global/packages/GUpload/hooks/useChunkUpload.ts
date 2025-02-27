import SimpleUploader from 'simple-uploader.js'
import { UploadFile } from '../interface/UploadFile'
import _ from 'lodash'
import { UploadType } from '../enum'

const CHUNK_SIZE = 1024 * 1024 * 2

const DEV_MODE = process.env.NODE_ENV === 'development'

export default ({ attrs, localReqHeaders, localFileList, onChange, onSuccess, onError }) => {
    const createUploader = (sourceFile: UploadFile) => {
        const uploader = new SimpleUploader({
            target: DEV_MODE ? 'http://localhost:3000/upload' : attrs.value.action,
            headers: {
                ...(DEV_MODE ? {} : localReqHeaders)
            },
            checkChunkUploadedByResponse: function (chunk, message) {
                // TODO 默认写死，后续做断点续传时需要根据后端返回的数据判断是否上传过
                return false
                // var objMessage = {}
                // try {
                //   objMessage = JSON.parse(message)
                // } catch (e) {}
                // return (objMessage.uploaded_chunks || []).indexOf(chunk.offset + 1) >= 0
            },
            chunkSize: CHUNK_SIZE,
            fileParameterName: 'file',
            query: {
                ...(attrs.value.data ?? {})
            }
        })

        // 文件添加
        uploader.on('fileAdded', function (file) {})

        // 文件上传进度
        uploader.on('fileProgress', function (file, chunk) {
            sourceFile['percentage'] = Math.floor(file.progress() * 100)
        })

        // 文件上传成功
        uploader.on('fileSuccess', function (rootFile, file, response) {
            const res = DEV_MODE
                ? {
                    code: '000000',
                    data: {
                        fileId: '123456'
                    }
                }
                : response

            sourceFile['status'] = res.code === '000000' ? 'success' : 'fail'
            sourceFile['response'] = res

            // 定义上传类型用来区分做不同的处理
            sourceFile['uploadType'] = UploadType.chunk

            onSuccess(res, sourceFile, localFileList.value)

            // 这里调用onChange用于更新保证外面的数据是最新的
            onChange(sourceFile, localFileList.value)
        })

        // 文件上传失败
        uploader.on('fileError', function (file, message) {
            sourceFile['status'] = 'fail'
            onError(message, sourceFile, localFileList.value)
        })

        return uploader
    }
    /**
     *  上传文件
     * @param file
     */
    const uploader = (file: UploadFile) => {
        Promise.resolve().then(() => {
            localFileList.value.push(file)
        })

        // 上传状态
        file['status'] = 'uploading'
        // 上传进度
        file['percentage'] = 0

        // 创建上传器
        const uploader = createUploader(file as File)

        try {
            // 手动添加文件
            uploader.addFile(file.raw)
            // 开始上传
            uploader.upload()
        } catch (error) {
            console.error(error)
        }
    }

    return {
        uploader
    }
}
