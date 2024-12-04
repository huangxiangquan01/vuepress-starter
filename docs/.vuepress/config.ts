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
            '/devops/docker/': [
                {
                    text: 'Docker',
                    children: ['/devops/docker/Docker常用命令大全.md',
                    '/devops/docker/Docker-compose命令大全.md',
                    '/devops/docker/Docker镜像构建.md'],
                }
            ],
            '/devops/kubernetes/': [
                {
                    text: 'kubernetes',
                    children: ['/devops/kubernetes/k8s-01-Kubernetes系统原理.md',
                        '/devops/kubernetes/k8s-03-Kubeadm搭建集群.md',
                        '/devops/kubernetes/k8s-04-Kubectl核心使用.md',
                        '/devops/kubernetes/k8s-05-Dashboard安装和使用.md',
                        '/devops/kubernetes/k8s-06-Pod原理和详解.md',
                        '/devops/kubernetes/k8s-03-Kubeadm搭建集群.md',
                        '/devops/kubernetes/k8s-07-工作负载详情.md',
                        '/devops/kubernetes/k8s-08-服务介绍.md',
                        '/devops/kubernetes/k8s-09-Ingress.md',
                        '/devops/kubernetes/k8s-10-Storage.md',
                        '/devops/kubernetes/k8s-11-集群配置默认存储类.md',
                        '/devops/kubernetes/k8s-12-Configmap和Secret.md',
                        '/devops/kubernetes/k8s-13-HorizontalPodAutoscaler.md',
                        '/devops/kubernetes/k8s-14-创建并部署WordPress.md',
                        '/devops/kubernetes/k8s-15-部署中间件.md',
                        '/devops/kubernetes/k8s-16-Devops.md',
                        '/devops/kubernetes/k8s-17-Istio基本介绍.md'
                    ],
                }
            ],
            '/java/jvm/': [
                {
                    text: 'Jvm',
                    children: [
                        '/java/jvm/JVM内存模型.md',
                        '/java/jvm/JVM对象创建和内存分配.md',
                        '/java/jvm/JVM类加载机制.md',
                        '/java/jvm/垃圾收集器G1和ZGC.md',
                        '/java/jvm/垃圾收集器ParNew和CMS.md'],
                }
            ],
            '/java/structure/': [
                {
                    text: '数据结构与算法',
                    children: [
                        '/java/arithmetic/字典树.md',
                        '/java/arithmetic/常用10种算法.md',
                        '/java/arithmetic/排序算法.md'],
                }
            ],
            '/java/concurrent/': [
                {
                    text: '并发编程',
                    children: [
                        '/java/concurrent/操作系统底层的整体认识.md',
                        '/java/concurrent/Java内存模型.md',
                        '/java/concurrent/CPU缓存一致性协议MESI.md',
                        '/java/concurrent/抽象队列同步器AQS.md',
                        '/java/concurrent/AQS工具类.md',
                        '/java/concurrent/Synchronized.md',
                        '/java/concurrent/Atomic和Unsafe.md',
                        '/java/concurrent/Collections.md',
                        '/java/concurrent/Executor线程池.md',
                        '/java/concurrent/Future&ForkJoin.md',
                    ]
                }
            ],
            '/java/design/': [
                {
                    text: '设计模式',
                    children: [
                        '/java/design/Java设计模式.md',],
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
                    },
                    {
                        text: '数据结构与算法',
                        link: '/java/arithmetic/字典树.md',
                    },
                    {
                        text: '并发编程',
                        link: '/java/concurrent/操作系统底层的整体认识.md',
                    },
                    {
                        text: '设计模式',
                        link: '/java/design/Java设计模式.md',
                    }
                ]
            },
            {
                text: 'Devops',
                children: [
                    {
                        text: 'docker',
                        link: '/devops/docker/Docker常用命令大全.md'
                    },
                    {
                        text: 'kubernetes',
                        link: '/devops/kubernetes/k8s-01-Kubernetes系统原理.md'
                    }
                ]
            }
        ]
    }),
})
