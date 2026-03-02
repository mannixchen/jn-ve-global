import CryptoJS from 'crypto-js'
import { Base64 } from 'js-base64'

// 十六位十六进制数作为密钥
// const paw = CryptoJS.enc.Utf8.parse('PAW_KEY_XU123456')
// // 十六位十六进制数作为密钥偏移量
// const iv = CryptoJS.enc.Utf8.parse('PAW_KEY_XU789456')
//加密方法
// export function encrypt(word) {
//     const key = paw
//     const srcs = CryptoJS.enc.Utf8.parse(word)
//     const encrypted = CryptoJS.AES.encrypt(srcs, key, {
//         iv: iv,
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     })
//     return encrypted.toString()
// }

// //解密方法
// export function decrypt(word) {
//     const key = paw
//     const decrypt = CryptoJS.AES.decrypt(word, key, {
//         iv: iv,
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     })
//     return CryptoJS.enc.Utf8.stringify(decrypt).toString()
// }
// 以上方法中 mode就是加密模式，padding是填充。

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('123x567890abxdef')
// 十六位十六进制数作为密钥偏移量
// const SECRET_IV = CryptoJS.enc.Utf8.parse('1234123412341234')
/**
 * 加密方法
 * @param data
 * @returns {string}
 */
export function encrypt(pwd: string) {
    const password = CryptoJS.enc.Utf8.parse(pwd)
    const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}

/**
 * 解密方法（暂不需要）
 * @param data
 * @returns {string}
 */
export function decrypt(pwd: string) {
    var decrypt = CryptoJS.AES.decrypt(pwd, SECRET_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })

    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * 当前系统的密码加密方式
 * @param pwd
 * @returns
 */
export function myEncryptPwd(pwd: string) {
    return encrypt(Base64.encode(pwd))
}
