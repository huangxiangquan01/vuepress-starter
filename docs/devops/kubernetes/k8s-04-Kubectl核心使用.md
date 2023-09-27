## **kubectl 介绍**

####  **1. kubectl 概要**

kubectl 控制 Kubernetes 集群管理器，使用 Kubernetes 命令行工具 kubectl 在 Kubernetes上部署和管理应用程序。使用 kubectl，您可以检查群集资源; 创建，删除和更新组件; 看看你的新集群; 并提出示例应用程序。

#### **2.kubectl 安装**

添加软件源信息

```sh
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-
x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

yum install kubectl-version -y
```

**3.Kubectl 配置** 

在开启了 TLS 的集群中，当与集群交互的时候少不了的是身份认证，使用 kubeconfig（即证书） 和 token 两种认证方式是最简单也最通用的认证方式。

kubectl 只是个 go 编写的可执行程序，只要为 kubectl 配置合适的 kubeconfig，就可以在集群中的任意节点使用。kubectl 默认会从$HOME/.kube 目录下查找文件名为 config 的文件，也可以通过设置环境变量 KUBECONFIG 或者通过设置 --kubeconfig 去指定其它kubeconfig 文件。

kubeconfig 就是为访问集群所作的配置。

```sh
export KUBE_APISERVER=https://192.168.56.5:6443

# 设置集群参数
kubectl config set-cluster kubernetes \
 --certificate-authority=/etc/kubernetes/ssl/ca.pem \
 --embed-certs=true \
 --server=${KUBE_APISERVER}
 
 # 设置客户端认证参数
kubectl config set-credentials admin \
 --client-certificate=/etc/kubernetes/ssl/admin.pem \
 --embed-certs=true \
 --client-key=/etc/kubernetes/ssl/admin-key.pem
 
 # 设置上下文参数
kubectl config set-context kubernetes \
 --cluster=kubernetes \
 --user=admin
 
# 设置默认上下文
kubectl config use-context Kubernetes
```

生成的 kubeconfig 被保存到 ~/.kube/config 文件；配置文件描述了集群、用户和上下文。

- **集群参数**

​	本段设置了所需要访问的集群的信息。使用 set-cluster 设置了需要访问的集群，如上为kubernetes，这只是个名称，实际为--server 指向的 apiserver；--certificate-authority 设置了该集群的公钥；--embed-certs 为 true 表示将--certificate-authority 证书写入到		kubeconfig 中；--server 则表示该集群的 kube-apiserver 地址生成的 kubeconfig 被保存到 ~/.kube/config 文件

- **用户参数**

​	本段主要设置用户的相关信息，主要是用户证书。如上的用户名为 admin，证书为：/etc/kubernetes/ssl/admin.pem，私钥		为：/etc/kubernetes/ssl/admin-key.pem。注意客户端的证书首先要经过集群 CA 的签署，否则不会被集群认可。此处使用的是 ca 认证方式，也可以使用 token 认证，如 kubelet 的 TLS Boostrap 机制下的 bootstrapping 使用的就是 token 认证方式。上述 kubectl 使用的是 ca 认证，不需要 token 字段

- **上下文参数**
  context 定义了一个命名的 cluster、user、namespace 元组，用于使用提供的认证信息和命名空间将请求发送到指定的集群。三个都是可选的，仅使用 cluster、user、namespace 之一指定上下文，或指定 none。使用 kubectl config use-context kubernetes 来使用名为 kubenetes 的环境项来作为配置。如果配置了多个环境项，可以通过切换不同的环境项名字来访问到不同的集群环境。

```sh
#也可以修改默认的 namespace 名字
kubectl config set-context --current --namespace=kube-system

#查看相应的参数
kubectl config view
```

- 备注	
> 使用 kubeconfig 还需要注意**用户**已经经过授权（如 RBAC 授权），上述例子中用户的证书中 OU 字段为 system:masters，kube-apiserver 预定义的 RoleBinding cluster-admin 将Group system:masters 与 Role cluster-admin 绑定，该 Role 授予了调用 kubeapiserver 相关 API 的权限。

#### **4. kubectl 自动补全和别名**

在管理 k8s 集群的时候，避免不了使用 kubectl 命令工具，但是该命令还是挺复杂的，使用中也记不住那么多的 api 选项，可以使用 kubectl 命令补全工具。 

第一步: 安装 bash-completion：

```sh
yum install -y bash-completion 
source /usr/share/bash-completion/bash_completion
```

第二步: 应用 kubectl 的 completion 到系统环境：

- **Bash**

```sh
# set up autocomplete in bash into the current shell, bash-completion package should be installed first.
source <(kubectl completion bash)

# add autocomplete permanently to your bash shell.
echo "source <(kubectl completion bash)" >> ~/.bashrc
```

- **ZSH**

```sh
# set up autocomplete in zsh into the current shell
source <(kubectl completion zsh)  
# add autocomplete permanently to your zsh shell
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc 
```

第三步: 使用别名进一步简化

```sh
# 设置别名
alias k=kubectl
# 别名自动补全
complete -o default -F __start_kubectl k
```

第四步：增加这些进入 /etc/profile. Or ~/.bashrc

#### **5.Kubectl 命令介绍** 

1. **Basic Commands(Beginner)基础命令（初级）**

   ```sh
   # 通过 yaml/json 文件或者标准输入创建一个资源对象，支持很多子命令 例如 namespace pod deployment service 等
   kubectl create 
   # 将 json/yaml 文件中定义的资源对象的端口暴露给新的service 资源对象
   kubectl expose 
   # 创建并运行一个或多个容器镜像
   kubectl run 
   # 配置资源对象设置特定功能
   kubectl set 
   ```

2. **Basic Commands（Intermediate）基础命令（中级）**

   ```sh
   kubectl explain  #查看资源对象的详细信息(编写 yaml 的时候做一个提示
   kubectl explain deployment #会出现 deployment 下面可以写的字段以及字段属性还有 可以逐级使用
   kubectl get #获取一个或多个资源对象的信息
   kubectl edit #使用默认编辑器编辑服务器上定义的资源对象
   kubectl delete #通过 json/yaml 文件、标准舒服、资源名称或标签选择器来删除资源
   ```

3. **DeployCommands 部署命令**

   ```sh
   kubectl rollout #资源管理对象的部署
   kubectl rollout-update #使用 rc（replication controller）来做滚动恩星
   kubectl scale #扩容或者缩容 deployment replicaset replication controller 等
   kubectl autoscale #自动设置在 k8s 系统中运行的 pod 数量（水平自动伸缩）
   ```

4. **Cluster Manager Commands 集群管理命令**

   ```sh
   kubectl cetificate # 修改证书资源对象
   kubectl cluster-info # 查看集群信息
   kubectl top # 显示资源 cpu 内存 存储使用情况
   kubectl cordon # 标记节点为不可调度
   kubectl uncordon # 指定节点为可调度
   kubectl drain # 安全的驱逐节点的所有 pod
   kubectl taint  # 将一个或多个节点设置为污点
   ```

5. **Troubleshooting and Debugging Commands 故障排查和调试命令**

   ```sh
   kubectl describe # 显示一个或多个资源对象的详细信息
   kubectl logs # 输出 pod 资源对象中一个容器的日志
   kubectl attach # 连接到一个运行的容器
   kubectl exec  # 在指定容器内执行命令
   kubectl port-forward # 将本机指定端口映射到 pod 资源对象的端口
   kubectl proxy  # 将本机指定端口映射到 kube-apiserver
   kubectl cp  # 用于 pod 与主机交换文件
   kubectl auth  #检查验证
   ```

6. **Advanced Commands 高级命令**

   ```sh
   kubectl diff # 对比本地 json/yaml 文件与 kube-apiserver 中运行的配置文件是否有差异
   kubectl apply  # 通过 json/yaml 文件 标准输入对资源进行配置更新或者创建
   kubectl patch # 通过 patch 方式修改资源对象字段（补丁式）
   kubectl replace  #通过 json/yaml 文件或者标准输入来替换资源对象
   kubectl wait  # 在一个或者多个资源上等待条件达成
   kubectl convert # 转换 json/yaml 文件为不同的资源版本
   kubectl kustomize  # 定制 kubernetes 配置
   ```

7. **Settings Commands 设置命令**

   ```sh
   kubectl label # 增删改资源的标签
   kubectl annotate # 更新一个或者多个资源对象的注释（annotaion）信息
   kubectl completion # 命令自动补全
   ```

8. **Other Commands 其他命令**

   ```sh
   kubectl config # 管理 kubeconfig 配置文件
   kubectl plugin # 运行命令行插件功能
   kubectl version # 查看客户端服务端的系统版本信息
   kubectl api-versions # 列出当前 kubernetes 系统支持的资源组和资源版本表现形式为/
   kubectl api-resources # 列出当前 kubernetes 系统支持的 resource 资源列表
   kubectl options  # 查看支持的参数列表
   kubectl get pod -w
   watch -n 1 kubectl get pod
   ```

#### **6. kubectl cheatsheet** 

```sh
https://kubernetes.io/docs/reference/kubectl/cheatsheet/
k get pod -w watch -n 1 kubectl get pod
```

