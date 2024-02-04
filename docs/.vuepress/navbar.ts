export default [
    {
        text: '组件库',
        link: '/components/',
        activeMatch: '^/components/'
    },
    {
        text: '微前端',
        link: '/micro/',
        activeMatch: '^/micro/'
    },
    {
        text: 'micro-cli',
        link: '/micro-cli/',
        activeMatch: '^/micro-cli/'
    },
    {
        text: 'utils',
        link: '/utilsDocs/',
        activeMatch: '^/utilsDocs/'
    },
    // {
    //     text: '前端知识分享',
    //     link: '/blog/',
    //     activeMatch: '^/blog/'
    // },
    {
        text: '更新日志',
        children: [
            {
                text: '组件库@3.3.0-beta.3',
                link: '/components/UpdateLog.md'
            },
            {
                text: '统一管理平台@2.4.0',
                link: '/micro/updateLog/basic.md'
            },
            {
                text: '微应用依赖',
                link: '/micro/updateLog/dependence.md'
            }
        ]
    }
]
