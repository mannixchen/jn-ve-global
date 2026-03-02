import { reactive } from 'vue'
import { FormProps } from 'jn-ve-global'

export default () =>
    reactive<FormProps>({
        instance: null,
        labelWidth: '100px',
        model: {
            name: '',
            name2: '',
            name3: '',
            name4: '',
            name5: '',
            name6: '',
            name7: '',
            name8: '',
            name9: '',
            name10: '',
            name11: '',
            name12: ''
        },
        formItems: [
            {
                prop: 'name',
                label: '姓名23',
                span: 8,
                rules: [
                    {
                        required: true,
                        message: '姓名是必填项'
                    }
                ],
                controlConfig: {
                    type: 'input'
                }
            },
            {
                prop: 'name2',
                label: '日期',
                span: 8,
                controlConfig: {
                    type: 'datePicker',
                    props: {
                        type: 'date',
                        valueFormat: 'YYYY-MM-DD',
                        format: 'YYYY-MM-DD'
                    }
                }
            },
            {
                prop: 'name3',
                label: '地址',
                span: 8,
                controlConfig: {
                    type: 'radio',
                    options: [
                        {
                            label: 'a',
                            value: 'a'
                        },
                        {
                            label: 'b',
                            value: 'b'
                        }
                    ]
                }
            },
            {
                prop: 'name4',
                label: '性别',
                span: 8,
                controlConfig: {
                    type: 'selectTree',
                    treeData: []
                }
            },
            {
                prop: 'name5',
                label: '年龄',
                span: 8,
                controlConfigs: [
                    {
                        type: 'input',
                        after: '-'
                    },
                    {
                        type: 'select',
                        options: [],
                        after: '-'
                    }
                ]
            },
            {
                prop: 'name6',
                label: '身高',
                span: 8,
                controlConfig: {
                    type: 'input'
                }
            },
            {
                prop: 'name7',
                label: '体重',
                span: 8,
                controlConfig: {
                    type: 'input'
                }
            },
            {
                prop: 'name8',
                label: '爱好',
                span: 8,
                controlConfig: {
                    type: 'input'
                }
            }
            // {
            //     prop: 'name9',
            //     label: '身份证号',
            //     span: 8,
            //     controlConfig: {
            //         type: 'input'
            //     }
            // }
        ]
    })

export const searchConfig = () =>
    reactive<FormProps>({
        instance: null,
        labelWidth: '100px',
        model: {
            name: '',
            sex: '',
            date: '',
            date1: null,
            area: '',
            amount: '',
            name6: '',
            name7: '',
            name8: '',
            name9: '',
            name10: '',
            name11: '',
            name12: ''
        },
        formItems: [
            {
                prop: 'name',
                label: '姓名',
                span: 8,
                rules: [
                    {
                        required: true,
                        message: '姓名是必填项'
                    }
                ],
                controlConfig: {
                    type: 'input'
                }
            },
            {
                prop: 'sex',
                label: '性别',
                controlConfig: {
                    type: 'select',
                    options: [
                        { value: '0', label: '男' },
                        { value: '1', label: '女' }
                    ]
                }
            },
            {
                prop: 'date',
                label: '日期',
                span: 8,
                controlConfig: {
                    type: 'datePicker',
                    props: {
                        type: 'date',
                        valueFormat: 'YYYY-MM-DD',
                        format: 'YYYY-MM-DD'
                    }
                }
            },
            {
                prop: 'date1',
                label: '日期1',
                span: 8,
                controlConfig: {
                    type: 'dateTimePicker',
                    props: {
                        
                    }
                }
            },
            {
                prop: 'area',
                label: '地区',
                span: 8,
                controlConfig: {
                    type: 'selectTreeV2',
                    treeData: []
                }
            },
            {
                prop: 'amount',
                label: '金额',
                span: 8,
                controlConfig: {
                    type: 'figureInput',
                    props: {
                        showUnitTip: false
                    }
                }
            },
            {
                prop: 'name6',
                label: '身高',
                span: 8,
                controlConfig: {
                    type: 'inputNumber',
                    props: {
                        controls: false
                    }
                }
            }
            // {
            //     prop: 'name5',
            //     label: '年龄',
            //     span: 8,
            //     controlConfigs: [
            //         {
            //             type: 'input',
            //             after: '-'
            //         },
            //         {
            //             type: 'select',
            //             options: [],
            //             after: '-'
            //         }
            //     ]
            // },

            // {
            //     prop: 'name7',
            //     label: '体重',
            //     span: 8,
            //     controlConfig: {
            //         type: 'input'
            //     }
            // },
            // {
            //     prop: 'name8',
            //     label: '爱好',
            //     span: 8,
            //     controlConfig: {
            //         type: 'input'
            //     }
            // }
            // {
            //     prop: 'name9',
            //     label: '身份证号',
            //     span: 8,
            //     controlConfig: {
            //         type: 'input'
            //     }
            // }
        ]
    })
