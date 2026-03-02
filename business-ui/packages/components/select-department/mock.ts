/*
 * @Author: “zhujin” zhujin@jsjngf.com
 * @Date: 2024-03-14 15:42:17
 * @LastEditors: “zhujin” zhujin@jsjngf.com
 * @LastEditTime: 2024-03-18 16:04:48
 * @FilePath: \@jsjn-librar-monorepo\business-ui\packages\components\select-department\mock.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */

export const departmentOptions = [
    {   
        // value: '1',
        // label: '部门1',
        id: '1',
        name: '部门1'
    },
    {
        // value: '21',
        // label: '部门21',
        id: '21',
        name: '部门21'
    },
    {
        // value: '31',
        // label: '部门31',
        id: '31',
        name: '部门31'
    }
]

export const departmentList = [
    {
        id: '1',
        name: '部门1',
        selected: false
    },
    {
        id: '2',
        name: '部门2',
        selected: false,
        children: [
            {
                id: '21',
                name: '部门21',
                selected: false
            },
            {
                id: '22',
                name: '部门22',
                selected: false
            }
        ]
    },
    {
        id: '3',
        name: '部门3',
        selected: false,
        children: [
            {
                id: '31',
                name: '部门31',
                selected: false
            },
            {
                id: '32',
                name: '部门32',
                selected: false
            }
        ]
    },
    {
        id: '4',
        name: '部门4',
        selected: false
    }
]