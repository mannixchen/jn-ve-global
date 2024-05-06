/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-11 18:04:19
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-03-20 10:53:07
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\utils\money.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { AmountUnits } from '../constants/index'
import Decimal from 'decimal.js'
type Unit = AmountUnits.YUAN | AmountUnits.WAN_YUAN | AmountUnits.YI_YUAN

/**
 *
 * @param n 数字金额
 * @param u 金额单位
 * @returns 大写中文金额
 */
export const dealBigMoney = (n, u: string = AmountUnits.YUAN) => {
    // console.log('dealBigMoney', n)
    if (['', null, undefined].includes(n)) return ''
    // if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return ''
    let step = 1
    // val += '00'
    if (u === AmountUnits.WAN_YUAN) {
        step = 10_000
    } else if (u === AmountUnits.YI_YUAN) {
        step = 100_000_000
    }
    var fraction = ['角', '分']
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ]
    var head = n < 0 ? '欠' : ''
    // n = n * step
    n = Decimal.mul(n, step).toNumber()
    if(n > 999_999_999_999.9999) {
        return '超出最大输出'
        // console.error('超出最大输出')
    }
    n = Math.abs(n)

    var s = ''

    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)

    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p
            n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return (
        head +
        s
            .replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整')
    )
}

// function changeNumMoneyToChinese(money) {
//     var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
//     var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
//     var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
//     var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
//     var cnInteger = "整"; //整数金额时后面跟的字符
//     var cnIntLast = "元"; //整型完以后的单位
//     var maxNum = 999999999999999.9999; //最大处理的数字
//     var IntegerNum; //金额整数部分
//     var DecimalNum; //金额小数部分
//     var ChineseStr = ""; //输出的中文金额字符串
//     var parts; //分离金额后用的数组，预定义
//     var Symbol = ""; //正负值标记
//     if (money == "") {
//         return "";
//     }

//     money = parseFloat(money);
//     if (money >= maxNum) {
//         alert('超出最大处理数字');
//         return "";
//     }
//     if (money == 0) {
//         ChineseStr = cnNums[0] + cnIntLast + cnInteger;
//         return ChineseStr;
//     }
//     if (money < 0) {
//         money = -money;
//         Symbol = "负 ";
//     }
//     money = money.toString(); //转换为字符串
//     if (money.indexOf(".") == -1) {
//         IntegerNum = money;
//         DecimalNum = '';
//     } else {
//         parts = money.split(".");
//         IntegerNum = parts[0];
//         DecimalNum = parts[1].substr(0, 4);
//     }
//     if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
//         var zeroCount = 0;
//         var IntLen = IntegerNum.length;
//         for (var i = 0; i < IntLen; i++) {
//             var n = IntegerNum.substr(i, 1);
//             var p = IntLen - i - 1;
//             var q = p / 4;
//             var m = p % 4;
//             if (n == "0") {
//                 zeroCount++;
//             } else {
//                 if (zeroCount > 0) {
//                     ChineseStr += cnNums[0];
//                 }
//                 zeroCount = 0; //归零
//                 ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
//             }
//             if (m == 0 && zeroCount < 4) {
//                 ChineseStr += cnIntUnits[q];
//             }
//         }
//         ChineseStr += cnIntLast;
//         //整型部分处理完毕
//     }
//     if (DecimalNum != '') { //小数部分
//         var decLen = DecimalNum.length;
//         for (var i = 0; i < decLen; i++) {
//             var n = DecimalNum.substr(i, 1);
//             if (n != '0') {
//                 ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
//             }
//         }
//     }
//     if (ChineseStr == '') {
//         ChineseStr += cnNums[0] + cnIntLast + cnInteger;
//     } else if (DecimalNum == '') {
//         ChineseStr += cnInteger;
//     }
//     ChineseStr = Symbol + ChineseStr;

//     return ChineseStr;
// }
