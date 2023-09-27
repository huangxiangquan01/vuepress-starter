# k8s 集群搭建

Kubeadm 是 k8s 的部署工具，它提供了 kubeadm init 和 kubeadm join，专用于快速部署 k8s 集群，它能通过两条指令完成一个 Kubenetes 集群的搭建。Kubeadm 部署方式的优点是降低了部署门槛，部署方式快捷且简单；

## 1. 主机准备

准备三台虚拟机，分别安装 CentOS 系统。一台作为 master 节点，另两台作为 node 节点，且每台虚拟机有自己的专属 IP 地址。

虚拟机的创建和配置注意以下几点：

- 硬件按照上文要求进行配置；
- 虚拟机之间可以进行网络互通；
- 虚拟机可以访问外网，便于下载镜像；
- 安装好 wget 工具 `yum install wget`；
- 禁止 swap 分区。但缺点是屏蔽了诸多细节，遇到问题难以排查是哪里出现了问题。

## 2. 系统初始化

第一步：关闭防火墙

```sh
#临时关闭
systemctl stop firewalld
#永久关闭
systemctl disable firewalld

systemctl status firewalld
```

第二步：关闭 selinux

```sh
#永久关闭
sed -i '/selinux/s/enforcing/disabled/' /etc/selinux/config
#临时关闭
setenforce 0
```

第三步：关闭 swap

```sh
#临时关闭
swapoff -a
#永久关闭
sed -ri 's/.*swap.*/#&/' /etc/fstab
```

第四步：设置主机名称，使用命令 `hostnamectl set-hostname 主机名`，如下三台主机分别设置为：

```sh
#查看当前主机名称
hostname

hostnamectl set-hostname master
```

第五步：在`master`节点中添加 hosts，即节点 IP地址+节点名称

```sh
cat >> /etc/hosts << EOF
192.168.146.129 k8s-master
192.168.146.128 k8s-node1
192.168.146.130 k8s-node2
EOF
```

第六步：将[桥接](https://so.csdn.net/so/search?q=桥接&spm=1001.2101.3001.7020)的 IPv4 流量传递到 iptables 的链(所有节点都设置)；

```sh
# 设置
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

# 使其生效
sysctl --system
# 执行如下命令使修改生效
modprobe br_netfilter
sysctl -p /etc/sysctl.d/k8s.conf
```

第七步：时间同步，让各个节点(虚拟机)中的时间与本机时间保持一致。

```sh
yum install ntpdate -y
ntpdate time.windows.com
```

## 3. Docker 的安装

Kubernetes 默认容器运行时(CRI)为 Docker，所以需要先在各个节点中安装 Docker。

第一步：yum 包更新到最新。

```sh
# 更新yum
sudo yum update
# 更新yum软件包索引
yum makecache 
```

第二步：安装需要的软件包，yum-util*（提供 yum-config-manager 功能）*，device-mapper-persistent-data、lvm2*（devicemapper 驱动依赖）*；

```sh
# 安装需要的包
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

第三步：设置 yum 源为阿里云；

```sh
# 设置阿里云源
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

第四步：安装 Docker；

```sh
# 查看目前官方仓库的docker版本。
yum list docker-ce.x86_64 --showduplicates |sort -r #从高到低列出Docker-ce的版本
# 移除docker
yum remove docker-ce docker-ce-clicontainerd.io-y

# 安装docker
sudo yum install docker-ce
# 或
yum install docker-ce-20.10.8 docker-ce-cli-20.10.8 containerd.io-1.4.10 -y --allowerasing

# 启动 docker
systemctl start docker
# 设置为开机启动
systemctl enable docker --now

# 设置Docker镜像加速器修改docker 配置以适应kubelet
vim /etc/docker/daemon.json 
{
	"registry-mirrors": ["https://registry.cn-hangzhou.aliyuncs.com"],
	"exec-opts":["native.cgroupdriver=systemd"]
}
# 重新加载配置
systemctl daemon-reload
systemctl restart docker
```

第五步：检查 Docker 版本；

```sh
# 检查 docker 版本
docker -v
```

## 4. 添加阿里云 yum 源

此步骤是为了便于今后的下载，在每个节点中执行以下配置；

```sh
cat > /etc/yum.repos.d/kubernetes.repo << EOF
[Kubernetes]
name=kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg   https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

## 5. kubeadm、kubelet、kubectl 的安装

```sh
//查看kubeadm版本
yum list kubeadm --showduplicates |sort -r

//移除kubeadm、kubelet、kubectl 
yum remove kubeadm.x86_64 kubectl.x86_64 kubelet.x86_64 -y
//安装kubeadm、kubelet、kubectl 
yum install kubeadm kubectl kubelet-y
//指定版本安装
yum install kubeadm-1.21.5 kubectl-1.21.5 kubelet-1.21.5 -y
```

节点对应的位置即可使用 kubectl命令行工具

```sh
kubectl version
```

启动kubelet

```sh
systemctl daemon-reload
systemctl enable kubelet --now
systemctl status kubelet
```

## 6. 在 Master 节点中部署集群

### 1.命令行直接安装

在 `master` 节点中执行以下命令，注意将 master 节点 IP 和 kube 版本号修改为自己主机中所对应的。

```sh
kubeadm init --image -repository registry.aliyuncs.com/google_containers --kubernetes-version=v1.21.5 --pod-network-cidr=10.244.0.0/16 --service-cidr=10.20.0.0/16 --apiserver-advertise-address=192.168.146.136
```

此步骤执行完成之后，使用命令`docker images`查看系统中的镜像，可以我们需要的镜像均已安装完成。

查看提示信息，看到 initialized successfully 说明我们 master 节点上的 k8s 集群已经搭建成功；

### ~~2. 配置文件安~~装

第一步：生成文件

```sh
kubeadm config print init-defaults >init-config.yaml
kubeadm init --config=init-config.yaml
```

第二部：修改文件

```sh
vim init-config.yaml
```

## 7.将 node 节点加入集群

查看上一步执行成功后的提示信息，可以看到系统给了我们两条命令；

① 开启 kubectl 工具的使用(`该命令在master节点中执行`)。

```sh
mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

**Status Checking：**

```sh
kubectl get cs/node/pod
kubectl get all -A
```

② 将 node 节点加入 master 中的集群(`该命令在工作节点node中执行`)。

```sh
kubeadm join 192.168.200.132:6443 --token pahgrt.7gn13u88wz4f89an \
    --discovery-token-ca-cert-hash sha256:7f73daa421d7564a6f813985a03f860350a923967d05cd955f8223d56200eb5b
```

分别在 master 节点中执行第 ① 条命令，在各个 node 节点中执行第 ② 条命令；

执行完成之后在 master 节点中使用命令 kubectl get nodes 查看此时集群中的工作节点。可以看到，node1 和 node2 工作节点已加入至 master 中的集群。

③ 在node节点上使用kubectl

```sh
scp root@k8s-master:/etc/kubernetes/admin.conf /etc/kubernetes/admin.conf

echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> /etc/profile
# 生效
source /etc/profile
```

## 8. 部署 CNI 网络插件

在上述操作完成后，各个工作节点已经加入了集群，但是它们的状态都是 NoReady，这是由于无它们无法跨主机通信的原因。而 CNI 网络插件的主要功能就是实现 pod 资源能够跨宿主机进行通信。在`master`节点中执行以下命令进行配置：

```sh
# /etc/hosts
185.199.109.133  raw.githubusercontent.com

wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
# 如果多个网卡修改增加arg下面的参数
args:
	---ip-masq
	---kube-subnet-mgr
	---iface=enp0s8  #根据ifconfig -a		

kubectl apply -f kube-flannel.yaml
kubectl get ds -l app=flannel -n kube-system
```
> **Coredns**
>
> 在每个节点创建文件/run/flannel/subnet.env写入以下内容。注意每个节点都要加哦，不是主节点
>```
>FLANNEL_NETWORK=10.244.0.0/16 # 对应kubeadm --pod-network-cidr
>FLANNEL_SUBNET=10.244.0.1/24
>FLANNEL_MTU=1450
>FLANNEL_IPMASQ=true
>```
然后使用命令 kubectl get pods -n kube-system 查看运行状态，1 代表运行中；

最后再次使用kubectl get nodes查看集群中的工作节点；可以看到处于开机状态的 master 节点和 node2 节点已经是 ready 状态，处于关闭状态的 node1 节点为 NoReady 状态，测试无误

Kubernetes 集群搭建完成。

## 9. Master node 参与工作负载

使用Kubeadm初始化的集群，Pod不会被调度到Master Node上，也就是说Master Node不参与工作负载。这是因为当前的master节点node1被打上了node-role.kubernetes.io/master:NoSchedule的污点：

查看污点标记:

```sh
kubectl describe node k8s-master | grep Taint 
Taints:node-role.kubernetes.io/master:NoSchedule
```

执行命令去除标记:

```sh
# 因为这里搭建的是测试环境，去掉这个污点使node1参与工作负载：
kubectl taint nodes k8s-master node-role.kubernetes.io/master-


# 设置为一定不能被调度
kubectl taint node k8s-master03 node-role.kubernetes.io/master="":NoSchedule
```

kube-proxy开启ipvs:

```sh
kubectl describe configmap kube-proxy -n kube-system 

# 修改ConfigMap的kube-system/kube-proxy中的config.conf，把 mode: "" 改为mode: “ipvs" 保存退出即可
kubectl edit configmap kube-proxy -n  kube-system mode: "ipvs" 

# 删除之前的proxy pod
kubectl delete pod *1
```

查看proxy运行状态

```sh
kubectl get pod -n kube-system | grep kube-proxy
```

查看日志,如果有 `Using ipvs Proxier.` 说明kube-proxy的ipvs 开启成功!

```sh
 kubectl logs kube-proxy-54qnw -n kube-system
```

## 10. 卸载安装

使用flannel插件

```sh
kubeadm reset

ifconfig cni0 down && ip link delete cni0
ifconfig flannel.1 down && ip link delete flannel.1
rm -rf /var/lib/cni/
rm-rf /etc/kubernetes
rm -rf /root/.kube/config
rm -rf /var/lib/etcd
above is necessary, cnI0 address conflict to setup sandbox. 
```

**Join证书过期**
```yaml
kubeadm token create --print-join-command

然后把master节点的~/.kube/config文件拷贝到当前NODE

node role change
kubectl label nodes k8s-master node-role.kubernetes.io/node=
```
