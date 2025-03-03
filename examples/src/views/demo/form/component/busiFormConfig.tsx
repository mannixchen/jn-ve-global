import { FormProps } from 'jn-ve-global'
import treeData from '@/views/demo/base/selectTreeTest/data.json'
import prefix from '@/api/prefix'
import dayjs from 'dayjs'
import { validateIdNo, validateSocialCreditNo, validateEMail, validatePhoneTwo } from '@jsjn/micro-core-utils/validator'


// 保留n位小数,不四舍五入
export const truncateDecimal = (val: number | string, digits: number) => {
    let value = ''
    const strArr = `${val}`.split('.')
    if (strArr?.length === 1) {
        value = strArr[0] + '.' + '0'.repeat(digits)
    } else {
        if (strArr[1].length >= digits) {
            value = strArr[0] + '.' + strArr[1].slice(0, digits)
        } else {
            value = strArr[0] + '.' + strArr[1] + '0'.repeat(digits - strArr[1].length)
        }
    }

    return value
}

export const toPercentage = (val: string | number, digits = 14) => {
    // return val ? Number.parseFloat(`${Number(val).toFixed(14)}`) : ''
    // return val ? `${truncateDecimal(Number(val), 14)}` : ''
    if (!val) return ''
    let str = ''
    const valArr = `${val}`.split('.')
    if (valArr?.length > 1 && valArr?.[1]?.length > digits) {
        str = valArr[0] + '.' + valArr[1].slice(0, digits)
    } else {
        str = `${val}`
    }
    return str
}

/**
 * 数字转换成千分位
 * @param {numer | string} number 要格式化的数字
 * @returns 千分位分割字符串
 */

export function toThousands(str: string | number, digits = 2) {
    const pre = `${str}`.match(/^\-/g)
    const reg = /\d{1,3}(?=(\d{3})+$)/g
    const tempStr = truncateDecimal(Number(str), digits)
    const thousands = `${tempStr}`
        .replace(/^-/, '')
        .replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
            return s1.replace(reg, '$&,') + s2
        })
    return pre !== null ? `-${thousands}` : thousands
}

const options = [
    { label: '选项一', value: '0' },
    { label: '选项二', value: '1' },
    { label: '选项三', value: '2', disabled: true }
]

const radioOptions = [
    { label: '是', value: '0' },
    { label: '否', value: '1' }
]

export const getFormConfig = (): FormProps => {
    const span = 24
    return {
        normalText: '',
        instance: null,
        labelWidth: '120px',
        model: {
            normalText: '示例',
            idNumber: '321084199108144211',
            socialCode: '913212030586377416',
            number1: '31231.212',
            password: '123123',
            email: '8573895793@qq.com',
            contactMethod: '17200967380',
            amount: '123000',
            rates: '12',
            // integer: 10,
            multiLineText: '多行文本示例',
            singleSelect: '0',
            multiSelect: ['0', '1'],
            radio: '0',
            checkbox: ['0', '1'],
            switch: true,
            treeSingleSelect: '1423533477376192513',
            treeMultiSelect: ['1423533477376192513', '1424688522159378434'],
            dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            date: dayjs().format('YYYY-MM-DD'),
            month: dayjs().format('YYYY-MM'),
            year: dayjs().format('YYYY'),
            dateTimeRange: ['2024-03-13 00:00:00', '2024-03-18 00:00:00'],
            dateRange: ['2024-03-13', '2024-03-18'],
            monthRange: ['2024-03', '2024-05'],
            yearRange: ['2024', '2028'],
            amountRange: ['1000', '20000'],
            address:  [['140000', '140400', '140406'], '上元大街88号']
            // avatar:'',
            // picture:''
        },
        formItems: [
            {
                prop: '',
                label: '输入类型',
                controlConfig: {
                    type: 'collapseItem'
                }
            },
            {
                prop: 'normalText',
                label: '单行文本',
                span,
                controlConfig: {
                    type: 'input',
                    props: {
                        clearable: true,
                        readonly: true
                    }
                }
            },
            {
                prop: 'idNumber',
                label: '身份证',
                span,
                rules: [
                    // {
                    //     validator(rule, value, callback, source, options) {
                    //         validateIdNo(rule, value, callback)
                    //     }
                    // },
                    {
                        type: 'email',
                        message: '邮箱格式错误'
                    },
                    {
                        required: true,
                        message: '比填'
                    },
                    {
                        max: 10,
                        message: '超出最大长度'
                    },
                    {
                        min: 2,
                        message: '未达到最小长度'
                    }
                ],
                controlConfig: {
                    type: 'input',
                    props: {
                        clearable: true
                    }
                }
            },
            {
                prop: 'socialCode',
                label: '统一信用码',
                span,
                rules: [
                    {
                        validator(rule, value, callback, source, options) {
                            validateSocialCreditNo(rule, value, callback)
                        }
                    }
                ],
                controlConfig: {
                    type: 'input',
                    props: {
                        clearable: true
                    }
                }
            },
            // {
            //     prop: 'number',
            //     label: '数字',
            //     span,
            //     rules: [],
            //     controlConfig: {
            //         type: 'input',
            //         props: {
            //             type: 'number',
            //             clearable: true
            //         }
            //     }
            // },
            {
                prop: 'contactMethod',
                label: '联系方式',
                span,
                rules: [
                    {
                        validator(rule, value, callback, source, options) {
                            validatePhoneTwo(rule, value, callback)
                        }
                    }
                ],
                controlConfig: {
                    type: 'input',
                    props: {
                        clearable: true
                    }
                }
            },
            {
                prop: 'email',
                label: '邮箱',
                span,
                rules: [
                    {
                        validator(rule, value, callback, source, options) {
                            validateEMail(rule, value, callback)
                        }
                    }
                ],
                controlConfig: {
                    type: 'input',
                    props: {
                        type: 'email',
                        clearable: true
                    } as any
                }
            },
            // {
            //     prop: 'password',
            //     label: '密码',
            //     span,
            //     rules: [],
            //     controlConfig: {
            //         type: 'input',
            //         props: {
            //             type: 'password',
            //             showPassword: true,
            //             clearable: true
            //         }
            //     }
            // },
            {
                prop: 'amount',
                label: '金额',
                span,
                rules: [],
                controlConfig: {
                    type: 'figureInput',
                    props: {
                        // showUnitTip: false,
                        format: (val) => {
                            return toThousands(val ?? '')
                        },
                        clearable: true
                    }
                }
            },
            // {
            //     prop: 'rates',
            //     label: '利率(%)',
            //     span,
            //     rules: [],
            //     controlConfig: {
            //         type: 'figureInput',
            //         props: {
            //             clearable: true,
            //             props: {
            //                 showUnitTip: false,
            //                 disabled: true,
            //                 format: (val) => toPercentage(val)
            //             }
            //         }
            //     }
            // },
            {
                prop: 'number1',
                label: '数字',
                span,
                rules: [],
                controlConfig: {
                    type: 'inputNumber',
                    props: {
                        // min: 1,
                        // max: 100,
                        // step: 0.1,
                        // stepStrictly: true,
                        precision: 4,
                        // size: 'large',
                        disabled: false,
                        controls: false,
                        controlsPosition: 'right'
                    }
                }
            },
            {
                prop: 'multiLineText',
                label: '多行文本',
                span: 24,
                controlConfig: {
                    type: 'input',
                    props: {
                        type: 'textarea',
                        clearable: true
                    }
                }
            },
            {
                prop: '',
                label: '选择类型',
                controlConfig: {
                    type: 'collapseItem'
                }
            },
            {
                prop: 'singleSelect',
                label: '下拉单选',
                span,
                controlConfig: {
                    type: 'select',
                    options,
                    props: {
                        clearable: true
                    }
                }
            },
            {
                prop: 'multiSelect',
                label: '下拉多选',
                span,
                controlConfig: {
                    type: 'select',
                    options,
                    props: {
                        multiple: true,
                        clearable: true
                    }
                }
            },
            {
                prop: 'radio',
                label: '单选框',
                span,
                controlConfig: {
                    type: 'radio',
                    options,
                    props: {}
                }
            },
            {
                prop: 'checkbox',
                label: '复选框',
                span,
                controlConfig: {
                    type: 'checkBox',
                    options,
                    props: {}
                }
            },
            {
                prop: 'switch',
                label: '开关',
                span,
                controlConfig: {
                    type: 'switch',
                    props: {
                        // loading: true,
                        // width: 100,
                        // inlinePrompt: true,
                    }
                }
            },
            {
                prop: 'treeSingleSelect',
                label: '树形单选',
                span,
                controlConfig: {
                    type: 'selectTree',
                    treeData,
                    props: {}
                }
            },
            {
                prop: 'treeMultiSelect',
                label: '树形多选',
                span,
                controlConfig: {
                    type: 'selectTree',
                    treeData,
                    props: {
                        multiple: true,
                        treeConfig: {
                            checkStrictly: true
                        }
                    }
                }
            },
            {
                prop: '',
                label: '日期时间选择',
                controlConfig: {
                    type: 'collapseItem'
                }
            },
            {
                prop: 'dateTime',
                label: '某时',
                span,
                controlConfig: {
                    type: 'dateTimePicker',
                    props: {
                        type: 'datetime',
                        valueFormat: 'YYYY-MM-DD HH:mm:ss',
                        format: 'YYYY-MM-DD HH:mm:ss'
                    }
                }
            },
            {
                prop: 'date',
                label: '某天',
                span,
                controlConfig: {
                    type: 'datePicker',
                    props: {
                        type: 'date'
                    }
                }
            },
            {
                prop: 'month',
                label: '某月',
                span,
                controlConfig: {
                    type: 'datePicker',
                    props: {
                        type: 'month'
                    }
                }
            },
            {
                prop: 'year',
                label: '某年',
                span,
                controlConfig: {
                    type: 'datePicker',
                    props: {
                        type: 'year'
                    }
                }
            },
            {
                prop: '',
                label: '范围选择',
                controlConfig: {
                    type: 'collapseItem'
                }
            },
            {
                prop: 'dateTimeRange',
                label: '时间范围',
                span,
                controlConfig: {
                    type: 'dateTimePicker',
                    props: {
                        type: 'datetimerange'
                    }
                }
            },
            {
                prop: 'dateRange',
                label: '日期范围',
                span,
                controlConfig: {
                    type: 'datePicker',
                    props: {
                        type: 'daterange'
                    }
                }
            },
            {
                prop: 'monthRange',
                label: '月度范围',
                span,
                controlConfig: {
                    type: 'datePicker',
                    props: {
                        type: 'monthrange'
                    }
                }
            },
            {
                prop: 'yearRange',
                label: '年度范围',
                span,
                controlConfigs: [
                    {
                        type: 'datePicker',
                        after: '-',
                        props: {
                            // placeholder: '开始时间',
                            valueFormat: 'YYYY',
                            type: 'year'
                        }
                    },
                    {
                        type: 'datePicker',
                        after: '',
                        props: {
                            // placeholder: '结束时间',
                            valueFormat: 'YYYY',
                            type: 'year'
                        }
                    }
                ]
            },
            {
                prop: 'amountRange',
                label: '金额范围',
                span,
                controlConfigs: [
                    {
                        type: 'figureInput',
                        after: '-',
                        props: {
                            showUnitTip: true,
                            format: (val) => {
                                return toThousands(val ?? '')
                            },
                            clearable: true
                        }
                    },
                    {
                        type: 'figureInput',
                        after: '',
                        props: {
                            showUnitTip: true,
                            format: (val) => {
                                return toThousands(val ?? '')
                            },
                            clearable: true
                        }
                    }
                ]
            },
            {
                prop: '',
                label: '地址',
                controlConfig: {
                    type: 'collapseItem'
                }
            },
            {
                prop: 'address',
                label: '地址',
                span: 24,
                controlConfig: {
                    type: 'address'
                }
            },
            {
                prop: '',
                label: '上传',
                controlConfig: {
                    type: 'collapseItem'
                }
            },
            {
                prop: 'avatar',
                label: '附件',
                span: 24,
                hide: false,
                controlConfig: {
                    type: 'upload',
                    props: {
                        action: `${prefix}/kinso-basic-open-server/v1/document/file/upload`,
                        downloadUrl: `${prefix}/kinso-basic-open-server/v1/document/file/download`,
                        fileList: [],
                        name: 'file',
                        // size: 2,s
                        // listType: 'picture-card',
                        onSuccess(res) {
                            // if (res.code === '000000') {
                            //     const config = formConfig.formItems.find(
                            //         (item) => item.prop === 'avatar'
                            //     ).controlConfig as UploadControlConfig

                            //     const fileList = config.props.fileList

                            //     console.log(
                            //         `%c onSuccess fileList == `,
                            //         'color: #67c23a;',
                            //         fileList
                            //     )
                            // }
                        },
                        onRemove() {
                            // const config = formConfig.formItems.find(
                            //     (item) => item.prop === 'avatar'
                            // ).controlConfig as UploadControlConfig

                            // const fileList = config.props.fileList

                            // console.log(`%c onRemove fileList == `, 'color: #67c23a;', fileList)
                        }
                    }
                }
            },
            {
                prop: 'pictures',
                label: '图片上传',
                span: 24,
                hide: false,
                controlConfig: {
                    type: 'upload',
                    props: {
                        action: `${prefix}/kinso-basic-open-server/v1/document/file/upload`,
                        downloadUrl: `${prefix}/kinso-basic-open-server/v1/document/file/download`,
                        fileList: [],
                        name: 'file',
                        // size: 2,s
                        listType: 'picture-card',
                        onSuccess(res) {
                            // if (res.code === '000000') {
                            //     const config = formConfig.formItems.find(
                            //         (item) => item.prop === 'avatar'
                            //     ).controlConfig as UploadControlConfig

                            //     const fileList = config.props.fileList

                            //     console.log(
                            //         `%c onSuccess fileList == `,
                            //         'color: #67c23a;',
                            //         fileList
                            //     )
                            // }
                        },
                        onRemove() {
                            // const config = formConfig.formItems.find(
                            //     (item) => item.prop === 'avatar'
                            // ).controlConfig as UploadControlConfig

                            // const fileList = config.props.fileList

                            // console.log(`%c onRemove fileList == `, 'color: #67c23a;', fileList)
                        }
                    }
                }
            },
            {
                prop: '',
                label: '文本编辑',
                // hide: true,
                controlConfig: {
                    type: 'collapseItem'
                }
            },
            {
                prop: 'editor',
                label: '',
                span: 24,
                // hide: true,
                controlConfig: {
                    type: 'jnEditor',
                    props: {
                        // disabled: true,
                        // uploadUrl: `${prefix}/kinso-basic-open-server/v1/document/file/upload`,
                        // downloadUrl: `${prefix}/kinso-basic-open-server/v1/document/file/download`,
                        onSetup(editor) {
                            console.log(`%c setup run......`, 'color: #67c23a;', +new Date())
                        },
                        onInit() {
                            console.log(`%c init run......`, 'color: #67c23a;', +new Date())
                        },
                        onInitInstanceCallback(editor) {
                            console.log(
                                `%c initInstanceCallback run......`,
                                'color: #67c23a;',
                                +new Date()
                            )
                        },
                        onChange(e) {
                            console.log(`%c onChange == `, 'color: #f56c6c;', e)
                        },
                        onInput(e) {
                            console.log(`%c input == `, 'color: #f56c6c;', e)
                        },
                        onUndo(e) {
                            console.log(`%c onUndo == `, 'color: #f56c6c;', e)
                        },
                        onRedo(e) {
                            console.log(`%c onRedo == `, 'color: #f56c6c;', e)
                        }
                    }
                }
            }
        ]
    }
}
