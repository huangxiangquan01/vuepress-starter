import {defaultTheme, defineUserConfig} from 'vuepress'

export default defineUserConfig({
    base: '/vuepress-starter/',
    lang: 'zh-CN',
    title: '你好， VuePress ！',
    description: '这是我的第一个 VuePress 站点',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    theme: defaultTheme({
        // 侧边栏对象
        // 不同子路径下的页面会使用不同的侧边栏
        sidebar: {
            '/devops/kubernetes/': [
                {
                    text: 'kubernetes',
                    children: ['/devops/kubernetes/*'],
                }
            ],
            '/devops/docker/': [
                {
                    text: 'Docker',
                    children: ['/devops/k8s/k8s-01-Kubernetes系统原理.md'],
                }
            ],
            '/java/jvm/': [
                {
                    text: 'Jvm',
                    children: ['/java/jvm/JVM内存模型.md',
                        '/java/jvm/JVM对象创建和内存分配.md',
                        '/java/jvm/JVM类加载机制.md',
                        '/java/jvm/垃圾收集器G1和ZGC.md',
                        '/java/jvm/垃圾收集器ParNew和CMS.md'],
                },
                {
                    text: '数据结构与算法',
                    children: ['/java/数据结构与算法/字典树.md',
                        '/java/数据结构与算法/常用10种算法.md',
                        '/java/数据结构与算法/排序算法.md'],
                }
            ],
        },
        navbar: [
            // NavbarItem 组件接收的每一个 item 对象，都可以直接使用 Vue 组件进行格式化
            {
                text: 'Java',
                children: [
                    {
                        text: 'Jvm',
                        link: '/java/jvm/JVM内存模型.md',
                    },{
                        text: '数据结构与算法',
                        link: '/java/数据结构与算法/字典树.md',
                    }
                ]
            },
            {
                text: 'Devops',
                children: [
                    {
                        text: 'kubernetes',
                        link: '/devops/*'
                    }
                ]
            }
        ]
    }),
})
