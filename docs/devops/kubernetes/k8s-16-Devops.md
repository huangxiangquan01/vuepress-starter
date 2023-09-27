# Devops

## 一、Devops、CI、CD

### 1.Agile Development

敏捷开发以用户的需求进化为核心，采用迭代、循序渐进的方法进行软件开发。在敏捷开发中，软件项目在构建初期被切分成多个子项目，各个子项目的成果都经过测试，具备可视、可集成和可运行使用的特征。换言之，就是把一个大项目分为多个相互联系，但也可独立运行的小项目，并分别完成，在此过程中软件一直处于可使用状态。

### 2.CI-**持续集成**

CI 的英文名称是 Continuous Integration，中文翻译为：持续集成。

CI 中，开发人员将会频繁地向主干提交代码，这些新提交的代码在最终合并到主干前，需要经过编译和自动化测试流进行验证。持续集成（CI）是在源代码变更后自动检测、拉取、构建和（在大多数情况下）进行单元测试的过程。持续集成的目标是快速确保开发人员新提交的变更是好的，并且适合在代码库中进一步使用。CI 的流程执行和理论实践让我们可以确定新代码和原有代码能否正确地集成在一起。

### 3.CD

CD 可对应多个英文名称，持续交付 Continuous Delivery 和持续部署 Continuous Deployment

#### 持续交付

完成 CI 中构建及单元测试和集成测试的自动化流程后，持续交付可自动将已验证的代码发布到存储库。为了实现高效的持续交付流程，务必要确保 CI 已内置于开发管道。持续交付的目标是拥有一个可随时部署到生产环境的代码库。在持续交付中，每个阶段（从代码更改的合并，到生产就绪型构建版本的交付）都涉及测试自动化和代码发布自动化。在流程结束时，运维团队可以快速、轻松地将应用部署到生产环境中或发布给最终使用的用户。

#### 持续部署

对于一个成熟的 CI/CD 管道（Pipeline）来说，最后的阶段是持续部署。作为持续交付— —自动将生产就绪型构建版本发布到代码存储库——的延伸，持续部署可以自动将应用发布到生产环境。持续部署意味着所有的变更都会被自动部署到生产环境中。

持续交付意味着所有的变更都可以被部署到生产环境中，但是出于业务考虑，可以选择不部署。如果要实施持续部署，必须先实施持续交付。持续交付并不是指软件每一个改动都要尽快部署到产品环境中，它指的是任何的代码修改都可以在任何时候实施部署。持续交付表示的是一种能力，而持续部署表示的则一种方式。持续部署是持续交付的最高阶段。

### 4.DevOps

DevOps 是 Development 和 Operations 的组合，是一种方法论，是一组过程、方法与系统的统称，用于促进应用开发、应用运维和质量保障（QA）部门之间的沟通、协作与整合。以期打破传统开发和运营之间的壁垒和鸿沟。

## 二、Jenkins 部署和基本使用

### **1. 简介** 

Jenkins 是一个开源软件项目，是基于 Java 开发的一种持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。当然除了 Jenkins 以外，也还有其他的工具可以实现自动化部署，如 Hudson 等 只是Jenkins 相对来说，使用得更广泛。

### **2. Jenkins 部署环境**

> **基本环境**：
>
>1. jdk 环境，Jenkins 是 java 语言开发的，因需要 jdk 环境。
>
>2. git/svn 客户端，因一般代码是放在 git/svn 服务器上的，我们需要拉取代码。
>
>3. maven 客户端，因一般 java 程序是由 maven 工程，需要 maven 打包，当然也有其他打包方式，如：gradle

#### **PVC 创建**

**创建命名空间**

```sh
kubectl create namespace jenkins-k8s
```

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: jenkins-pvc
  namespace: jenkins-k8s
spec:
  resources:
    requests:
      storage: 10Gi
  accessModes:
    - ReadWriteMany
  storageClassName: nfs
```

#### **ServiceAccount**

```sh
# 创建一个 sa 账号
kubectl create sa jenkins-k8s-sa -n jenkins-k8s
#授权，kubectl create clusterrolebinding 名称、名称空间、绑定 clusterrole=cluster-admin 
kubectl create clusterrolebinding jenkins-k8s-sa-cluster -n jenkins-k8s --clusterrole=cluster-admin --serviceaccount=jenkins-k8s:jenkins-k8s-sa
kubectl create clusterrolebinding jenkins-k8s-sa-cluster1 -n jenkins-k8s --clusterrole=cluster-admin --serviceaccount=jenkins-k8s:default
kubectl create clusterrolebinding jenkins-k8s-sa-cluster1 -n jenkins-0119 --clusterrole=cluster-admin --serviceaccount=jenkins-0119:default
```

#### **部署和验证 Jenkins**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins
  namespace: jenkins-k8s
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jenkins
  template:
    metadata:
      labels:
        app: jenkins
    spec:
      containers:
        - name: jenkins
          image: registry.cn-hangzhou.aliyuncs.com/liuyik8s/jenkins:2.303.3-jdk11 
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
              name: web
              protocol: TCP
            - containerPort: 50000
              name: agent
              protocol: TCP
          resources:
            limits:
              cpu: 1000m
              memory: 1Gi
            requests:
              cpu: 500m
              memory: 500Mi
          livenessProbe:
            httpGet:
              port: 8080
              path: /login
            initialDelaySeconds: 60
            timeoutSeconds: 5
            failureThreshold: 12
          readinessProbe:
            httpGet:
              port: 8080
              path: /login
            initialDelaySeconds: 60
          volumeMounts:
            - mountPath: /var/jenkins_home
              name: jenkins-volume
              subPath: jenkins-home
      nodeSelector:
        jenkins: yes
      volumes:
        - name: jenkins-volume
          persistentVolumeClaim:
            claimName: jenkins-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: jenkins-service
  namespace: jenkins-k8s
  labels:
    app: jenkins
spec:
  selector:
    app: jenkins
  type: ClusterIP
  ports:
    - port: 8080
      name: web
      targetPort: web
    - name: agent
      port: 50000
      targetPort: agent
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jk
  namespace: jenkins-k8s
spec:
  ingressClassName: nginx
  rules:
  - host: jk.k8s.com
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: jenkins-service
            port:
              number: 8080


```

### 3.**Jenkins 初始化配置** 

#### **查看访问地址**

```sh
kubectl get svc -n jenkins-k8s
 
#修改主机 host
echo "218.76.8.107 jk.k8s.com" > /etc/hosts
```

#### **查看初始化用户及密码**

```
# 查看 Jenkins 日志,记录初始化密码，填入初始化页面
kubectl logs -n jenkins-k8s jenkins-57c7977bcd-9cf7h
```

#### **登陆系统**

```sh
# Ingress 方式访问
http://jk.k8s.com:30880/
# Node Port 方式访问
```

#### **初始化用户**

#### **安装中文插件**

### **4.Jenkin 构建环境配置** 

#### **Cloud environment 配置**

1. 可以连接多个云环境

2. 连接云中不同的 namespace

3. 创建不同的 pod 模板来完成不同的构建任务。

Jenkins 的 kubernetes-plugin 在执行构建时会在 kubernetes 集群中自动创建一个 Pod，并在 Pod 内部创建一个名为 jnlp 的容器，该容器会连接 Jenkins 并运行 Agent 程序，形成一个 Jenkins 的 Master 和 Slave 架构，然后 Slave 会执行构建脚本进行构建。

##### **安装插件** 

1. 搜索 kubernetes 相关插件, 搜索后安装相应的插件。

##### **配置 kuberenetes 云环境** 

系统配置-> Cloud

> 注意 Jenkins pod 的 SA 权限

##### **配置 pod 模板**

/root/.kube：这个目录挂载到容器的/root/.kube 目录下面这是为了让我们能够在 Pod 的容器中能够使用 kubectl 工具来访问我们的 Kubernetes 集群，方便我们后面在 Slave Pod 部署 Kubernetes 应用； 其他两个挂载是为了使用 Docker （DooD 方式) Workspace 使用 PVC，这样不用每次都下载各种库，减少构建的时间

最终的 slave pod 中使用的卷配置信息。

```
 volumeMounts:
 - mountPath: "/home/jenkins/agent"
 name: "volume-3"
 readOnly: false
 - mountPath: "/var/run/docker.sock"
 name: "volume-0"
 readOnly: false
 - mountPath: "/home/jenkins/agent/.kube"
 name: "volume-1"
 readOnly: false
 - mountPath: "/usr/bin/docker"
 name: "volume-2"
 readOnly: false
 volumes:
 - hostPath:
 path: "/var/run/docker.sock"
 name: "volume-0"
 - hostPath:
 path: "/usr/bin/docker"
 name: "volume-2"
 - hostPath:
 path: "/root/.kube"
 name: "volume-1"
 - emptyDir:
 medium: ""
 name: "workspace-volume"
 - name: "volume-3"
 persistentVolumeClaim:
 claimName: "agent-workspace"
 readOnly: false
```

在每个 step 制定的 docker 名字。

##### **测试** 

使用声明式 Pipeline 创建项目此处的 maven 与上图中标准的要一一对应。如使用 master 则使用 Jenkins Master 进行构建

```groovy
pipeline {
    agent {
      label 'maven' 
         stages {
           stage('拉取代码') {
             steps {
             		sh 'echo "拉取代码完成" '
             }
          }
       }
    } 
}
```

#### **Git 连接设置**

##### **GitHub 服务器配置** 

添加凭证 Manage Jenkins->Manage Credential->adding 

##### **Gitee 服务器配置**
添加凭证
Manage Jenkins->Manage Credential->adding 类型为 Username with password

##### **GitLab 私有服务器配置** 

#### **Image repository 设置**

> Manage Jenkins->Manage Credential->adding 

##### **Docker Hub 配置** 

##### **Aliyun ID 配置** 

类型为 Username with password

##### **私有仓库 ID 配置** 

### **5.测试上述** 

使用 gitee 作为代码管理平台。增加测试的 Pipline 脚本

### **6.图形化界面 BlueOcean** 

BlueOcean 是 Jenkins 团队从用户体验角度出发，专为 Jenkins Pipeline 重新设计的一套 UI 界面，仍然兼容以前的 fressstyle 类型的 job，BlueOcean 具有以下的一些特性：连续交付（CD）Pipeline 的复杂可视化，允许快速直观的了解 Pipeline 的状态可以通过 Pipeline 编辑器直观的创建 Pipeline需要干预或者出现问题时快速定位，BlueOcean 显示了 Pipeline 需要注意的地方，便于异常处理和提高生产力用于分支和拉取请求的本地集成可以在 GitHub 或者 Bitbucket 中与其他人进行代码协作时最大限度提高开发人员的生产力。BlueOcean 可以安装在现有的 Jenkins 环境中，也可以使用 Docker 镜像的方式直接运行，我们这里直接在现有的 Jenkins 环境中安装 BlueOcean 插件：登录 Jenkins Web UI -> 点击左侧的 Manage Jenkins -> Manage Plugins -> Available -> 搜索查找 BlueOcean -> 点击下载安装并重启。

## **三.Jenkins Pipeline** 

> 自 Jenkins 2.0 版本升级之后，支持了通过代码（Groovy DSL）来描述一个构建流水线，灵活方便地实现持续交付，大大提升 Jenkins Job 维护的效率，实现从 CI 到 CD 到转变。而在 2016 Jenkins World 大会上，Jenkins 发布了 1.0 版本的声明式流水线 -Declarative Pipeline，目前已经到发布了 1.2 版本，它是一种新的结构化方式定义一个流水线。

### **1.Pipeline 特性 - Pipeline As Code** 

Jenkins 从根本上讲是一种支持多种自动化模式的自动化引擎。Pipeline 为其添加了一套强大的自动化工具，支持从简单的持续集成到全面的持续交付。Jenkins Pipeline 特性如下：

- 代码：Pipeline 以代码的形式描述，通常存储于源代码控制系统，如 Git，使团队能够编辑，审查和迭代其流程定义。

- 持久性：Pipeline 可以在计划和计划外重新启动 Jenkins Master 管理时不被影响。

- 可暂停：Pipeline 可以选择停止并等待人工输入或批准，然后再继续 Pipeline 运行。

- 多功能：Pipeline 支持复杂的项目持续交付要求，包括并行分支/连接，循环和执行 Job 的能力。

- 可扩展：Pipeline 插件支持其 DSL 的自定义扩展以及与其他插件集成。

基于 Jenkins Pipeline，用户可以在一个 JenkinsFile 中快速实现一个项目的从构建、测试以到发布的完整流程，并且可以保存这个流水线的定义。

### **2.Pipeline 基本概念** 

Node: 一个 Node 就是一个 Jenkins 节点，或者是 Master，或者是 Agent，是执行 Step 的具体运行环境，Pipeline 执行中的大部分工作都是在一个或多个声明 Node 步骤的上下文中完成的。

Stage: 一个 Pipeline 可以从逻辑上划分为若干个 Stage，每个 Stage 代表一组操作，如：Build、Test、Deploy。注意，Stage 是一个逻辑分组的概念，可以跨多个 Node。

Step: Step 是最基本的操作单元，小到执行一个 Shell 脚本，大到构建一个 Docker 镜像，由各类 Jenkins Plugin 提供，当插件扩展 Pipeline DSL 时，通常意味着插件已经实现#了一个新的步骤。

### **3.Scripted Pipeline** 

CurrentBuild 可以获取档次执行的结果，可以用于判读后续流程走向，Jenkins 还提供了更多内置环境变量以及 DSL 对象，方便我们操作流水线任务，如：BUILD_ID、JOB_NAME、BRANCH_NAME、CHANGE_ID 等等，可参考 Global Variable。这种方式受 Jenkins 的限制较少，我们可以灵活控制和定义一个流水线，甚至我们可以在 JenkinsFile 中定义多个 Groovy 函数来扩展 Jenkins Pipeline 的能力。
