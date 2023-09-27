# **09.K8s Ingress and 网络**

> https://github.com/kubernetes/ingress-nginx
>
> https://kubernetes.github.io/ingress-nginx/

Ingress将来自集群外部的 HTTP 和 HTTPS 路由暴露给集群 内的服务。流量路由由 Ingress 资源上定义的规则控制。

Ingress 可以配置为向服务提供外部可访问的 URL、负载平衡流量、终止 SSL/TLS 并提供基于名称的虚拟主机。一个入口控制器负责履行入口，通常有一个负载均衡器，虽然它也可以配置您的边缘路由器或额外的前端，以帮助处理流量。Ingress 不会公开任意端口或协议。向 Internet 公开 HTTP 和 HTTPS 以外的服务通常使用Service.Type=NodePort 或 Service.Type=LoadBalancer 类型的服务。

组成：

- Nginx Controller
- Default-Backend
- Ingress Rule

## **1.Ingress 安装** 

### **1 Ingress 控制器**

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.1/deploy/static/provider/cloud/deploy.yaml
```

### **2 Ingress rule 资源**

Ingress 控制器启动之后，就可以创建 Ingress 资源了

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test2
spec:
  ingressClassName: nginx
  rules:
    - host: test2.bar.com
      http:
        paths:
          - pathType: Prefix
        path: "/"
        backend:
          service:
            name: test2
            port:
              number: 2280
```

**对应的业务部署：**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test2
  template:
    metadata:
      labels:
        app: test2
    spec:
      containers:
      - image: nginx
        name: test
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: test2
spec:
  ports:
  - name: myngx2
    port: 2280
  targetPort: 80
  nodePort: 32287
  selector:
    app: test2
  type: NodePort
```

指定资源类型为 Ingress，定一个单一规则，所有发送 test2.bar.com 的请求都会被转发给端口为 80 的 nodeport 服务上；

```
kubectl get svc
kubectl get svc -n ingress-nginx
```

修改域名解析地址

```
/etc/hosts
192.168.56.5 test2.bar.com
```

大致请求流程如下：浏览器中请求域名首先会查询域名服务器，然后 DNS 返回了控制器的 IP 地址；客户端向控制器发送请求并在头部指定了 test2.bar.com；然后控制器根据头部信息确定客户端需要访问哪个服务；然后通过服务关联的 Endpoint 对象查看 pod IP，并将请求转发给其中一个；

### 3.DefaultBackend

没有 rules 的 Ingress 将所有流量发送到同一个默认后端。 defaultBackend 通常是 Ingress 控制器 的配置选项，而非在 Ingress 资源中指定。如果 hosts 或 paths 都没有与 Ingress 对象中的 HTTP 请求匹配，则流量将路由到默认后端。资源后端Resource 后端是一个 ObjectRef，指向同一名字空间中的另一个 Kubernetes，将其作为Ingress 对象。Resource 与 Service 配置是互斥的，在 二者均被设置时会无法通过合法性检查。 Resource 后端的一种常见用法是将所有入站数据导向带有静态资产的对象存储后端。

**Service 例子**

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
  nginx.ingress.kubernetes.io/default-backend: test2
  name: defaultbackend
spec:
  defaultBackend:
    service:
      name: test2
      port:
        number: 2280
  rules:
    - host: test1.bar.com
  http:
  paths:
    - backend:
  service:
  name: test1
  port:
    number: 2180
  path: /
  pathType: Prefix
```

创建了如上的 Ingress 之后，你可以使用下面的命令查看它：

```
 kubectl describe ingress defaultbackend
```

**被配置的服务没有后端。**

This annotation is of the form nginx.ingress.kubernetes.io/default-backend: <svc name> to specify a custom default backend. This <svc name> is a reference to a service inside of the same namespace in which you are applying this annotation. This annotation overrides the global default backend. In case the service has multiple ports, the first one is the one which will received the backend traffic.

```
echo test1.bar.com>/usr/share/nginx/html/index.html

cat /usr/share/nginx/html/index.html

kubectl describe ingress defaultbackend
```

> **This service will be used to handle the response when the configured service(test1) in** **the Ingress rule does not have any active endpoints**

## **2.Ingress 使用**

### **1.基于名称的虚拟托管 -根据域名访问**

基于名称的虚拟主机支持将针对多个主机名的 HTTP 流量路由到同一 IP 地址上。

以下 Ingress 让后台负载均衡器基于 host 头部字段 来路由请求。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test
spec:
  rules:
    - host: foo.bar.com
      http:
        paths:
        - pathType: Prefix
        path: "/"
        backend:
          service:
            name: test1
            port:
              number: 2180
    - host: bar.foo.com
      http:
      paths:
        - pathType: Prefix
          path: "/"
          backend:
            service:
              name: test2
              port:
                number:2280
```

如果你创建的 Ingress 资源没有在 rules 中定义的任何 hosts，则可以匹配指向 Ingress 控制器 IP 地址的任何网络流量，而无需基于名称的虚拟主机。

修改 test1/test2 的默认访问文件。 

```sh
# 修改 test1/test2 的默认访问文件。 
kubectl exec -it test1 – sh
mkdir /usr/share/nginx/html/test1
echo test1.bar.com-test1 >/usr/share/nginx/html/test1/index.html
cat /usr/share/nginx/html/test1/index.html
mkdir /usr/share/nginx/html/test2
echo test1.bar.com-test2 >/usr/share/nginx/html/test2/index.html
cat /usr/share/nginx/html/test2/index.html
```

### **2.简单扇出**

一个扇出（fanout）配置根据请求的 HTTP URI 将来自同一 IP 地址的流量路由到多个Service。 Ingress 允许你将负载均衡器的数量降至最低。例如，这样的设置：

将需要一个如下所示的 Ingress：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test11
spec:
  ingressClassName: ingress1
  rules:
  - host: test1.bar.com
    http:
      paths:
      - pathType: Prefix
        path: "/test1/"
        backend:
          service:
            name: test1
            port:
              number: 2180
      - pathType: Prefix
        path: "/test2/"
        backend:
          service:
            name: test1
            port:
              number: 2180
```

```sh
kubectl exec -it test1 – sh
mkdir /usr/share/nginx/html/test1
echo test1.bar.com-test1 >/usr/share/nginx/html/test1/index.html
cat /usr/share/nginx/html/test1/index.html
mkdir /usr/share/nginx/html/test2
echo test1.bar.com-test2 >/usr/share/nginx/html/test2/index.html
cat /usr/share/nginx/html/test2/index.html

kubectl describe ingress test11
```

### **3.Ingress 暴露多个服务**

rules 和 paths 是数组，可以配置多个

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test13
spec:
  ingressClassName: ingress1
  rules:
  - host: test1.bar.com
    http:
      paths:
      - pathType: Prefix
        path: "/test1/"
        backend:
          service:
            name: test1
            port:
              number: 2180
      - pathType: Prefix
        path: "/test2/"
        backend:
          service:
            name: test1
            port:
              number: 2180
  - host: test3.bar.com
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: test3
            port:
              number: 2380

```

>  配置了多个 host 和 path，这里为了方便映射了同样服务；

```
kubectl get ingress

kubectl describe ingress test13 
```

### **4.Ingress 高级用法-路径重写**

Ingress 定义

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
  name: rewrite
spec:
  rules:
  - host: test1.bar.com
    http:
      paths:
      - backend:
          service:
           name: test1
           port: 
             number: 2180
        path: /nginx(/|$)(.*)
        pathType: Prefix
```

### **5.Ingress 高级-限流**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/limit-rps: "1"
  name: ratelimit
spec:
  rules:
  - host: test1.bar.com
    http:
      paths:
      - backend:
          service:
           name: test1
           port: 
             number: 2180
        path: /
        pathType: Exact
```

### **6.Ingress 处理 TLS 传输**

**证书准备**

以上介绍的消息都是基于 Http 协议，Https 协议需要配置相关证书；客户端创建到 Ingress控制器的 TLS 连接时，控制器将终止 TLS 连接；客户端与 Ingress 控制器之间是加密的，而 Ingress 控制器和 pod 之间没有加密；要使控制器可以这样，需要将证书和私钥附加到 Ingress 中；通过设定包含 TLS 私钥和证书的 Secret 来保护 Ingress。 Ingress 只支持单个 TLS 端口443，并假定 TLS 连接终止于 Ingress 节点 （与 Service 及其 Pod 之间的流量都以明文传输）。 如果 Ingress 中的 TLS 配置部分指定了不同的主机，那么它们将根据通过 SNI TLS 扩展指定的主机名 （如果 Ingress 控制器支持 SNI）在同一端口上进行复用。 TLS Secret 必须包含名为 tls.crt 和 tls.key 的键名。 这些数据包含用于 TLS 的证书和私钥

```
 openssl genrsa -out tls.key 2048
 openssl req -new -x509 -key tls.key -out tls.cert -days 360 -subj /CN=test.bar.com
```

**secret 创建**

生成的两个文件创建 secret

```
kubectl create secret tls tls-secret --cert=tls.cert --key=tls.key
secret/tls-secret created
```

**ingress 创建**

现在可以更新 Ingress 对象，以便它也接收 kubia.example.com 的 HTTPS 请求；

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test2
spec:
  tls:
  - hosts: 
    - test.bar.com
    secretName: tls-secret
  rules:
  - host: test.bar.com
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: test2
            port:
              number: 2280
```

tls 中指定相关证书

在 Ingress 中引用此 Secret 将会告诉 Ingress 控制器使用 TLS 加密从客户端到负载均衡器的通道。 你需要确保创建的 TLS Secret 创建自包含 https-example.foo.com 的公用名称（CN）的证书。 这里的公共名称也被称为全限定域名（FQDN）。

> **说明：**注意，默认规则上无法使用 TLS，因为需要为所有可能的子域名发放证书。 因此，tls 节区的 hosts 的取值需要域 rules 节区的 host 完全匹配

**可选：修改 nodeport 范围的方法。**

```sh
vi /etc/kubernetes/manifests/kube-apiserver.yaml
#添加到如下位置就行了
- command:
- kube-apiserver
- --service-node-port-range=1-65535
#直接删除 kube-apiserver pod 就行了 会自动重启
kubectl delete pod kube-apiserver -n kube-system
```

## **3. Ingress-nginx 的高可用** 

Ingress 控制器启动引导时使用一些适用于所有 Ingress 的负载均衡策略设置， 例如负载均衡算法、后端权重方案和其他等。 更高级的负载均衡概念（例如持久会话、动态权重）尚未通过 Ingress 公开。 你可以通过用于服务的负载均衡器来获取这些功能。值得注意的是，尽管健康检查不是通过 Ingress 直接暴露的，在 Kubernetes 中存在并行的概念，比如 就绪检查， 允许你实现相同的目的。

修改 Nginx-controller 服务类型

```
kubectl edit svc -n ingress-nginx ingress-nginx-controller

kubectl get svc -n ingress-nginx ingress-nginx-controller
```

## **4.服务网络-网络模型总结**

![](https://kubenertes.oss-cn-nanjing.aliyuncs.com/Image/9.png?Expires=1685329462&OSSAccessKeyId=TMP.3KhxMvYNFBPf4LZNtgmHhxpPyU4oZRXF8ckZvnizbjzvNsWAgtMQ3qjuKqqd5j8JtkFo8Cj26Bwu1MvWP958SxotVA7JzN&Signature=NyedILRUa4s2oOUxZlG7V7gL0sw%3D)

## **5.Pod 网络类型**

**Docker network type**:

  - Bridge

- host
- none
- containter

**Pod network** :

- bridge
- host

```
kubectl explain pod.spec.hostNetwork
```

## **6.Pod 网络-CNI and flannel** 

### **1.Docker 默认的网桥 docker0**

> Docker network ls

### **2.网络插件, overlay network flannel（**UDP+Vxlan）简介

#### **Flannel UDP 模式**
![](https://kubenertes.oss-cn-nanjing.aliyuncs.com/Image/9_01.png?Expires=1685329483&OSSAccessKeyId=TMP.3KhxMvYNFBPf4LZNtgmHhxpPyU4oZRXF8ckZvnizbjzvNsWAgtMQ3qjuKqqd5j8JtkFo8Cj26Bwu1MvWP958SxotVA7JzN&Signature=bAYegbHA%2B2bnVjRn9erVNyWTxm0%3D)
第一次，用户态的容器进程发出的 IP 包经过 docker0 网桥进入内核态；第二次，IP 包根据路由表进入 TUN（flannel0）设备，从而回到用户态的 flanneld 进程；第三次，flanneld 进行 UDP 封包之后重新进入内核态，将 UDP 包通过宿主机的 eth0 发出去。此外，我们还可以看到，Flannel 进行 UDP 封装（Encapsulation）和解封装（Decapsulation)的过程，也都是在用户态完成的。在 Linux 操作系统中，上述这些上下文切换和用户态操作的代价其实是比较高的，这也正是造成 Flannel UDP 模式性能不好的主要原因。进行系统级编程的时候，有一个非常重要的优化原则，就是要减少用户态到内核态的切换次数，并且把核心的处理逻辑都放在内核态进行。

#### **Flannel Vxlan 模式**

这也是为什么，Flannel 后来支持的 VXLAN 模式，逐渐成为了主流的容器网络方案的原因。VXLAN，即 Virtual Extensible LAN（虚拟可扩展局域网），是 Linux 内核本身就支持的一种网络虚似化技术。

VXLAN 的覆盖网络的设计思想是：在现有的三层网络之上，“覆盖”一层虚拟的、由内核VXLAN 模块负责维护的二层网络，使得连接在这个 VXLAN 二层网络上的“主机”（虚拟机或者容器都可以）之间，可以像在同一个局域网（LAN）里那样自由通信。

当然，实际上，这些“主机”可能分布在不同的宿主机上，甚至是分布在不同的物理机房里。而为了能够在二层网络上打通“隧道”，VXLAN 会在宿主机上设置一个特殊的网络设备作为“隧道”的两端。这个设备就叫作 VTEP，即：VXLAN Tunnel End Point（虚拟隧道端点）。而VTEP 设备的作用，其实跟前面的 flanneld 进程非常相似。只不过，它进行封装和解封装的对象，是二层数据帧（Ethernet frame）；而且这个工作的执行流程，全部是在内核里完成的（因为 VXLAN 本身就是 Linux 内核中的一个模块）。上述基于 VTEP 设备进行“隧道”通信的流程，我也为你总结成了一幅图，如下所示：
![](https://kubenertes.oss-cn-nanjing.aliyuncs.com/Image/9_03.png?Expires=1685329497&OSSAccessKeyId=TMP.3KhxMvYNFBPf4LZNtgmHhxpPyU4oZRXF8ckZvnizbjzvNsWAgtMQ3qjuKqqd5j8JtkFo8Cj26Bwu1MvWP958SxotVA7JzN&Signature=bvn1oRWmkRN1v6P1naUzQZ9oSrw%3D)
可以看到，图中每台宿主机上名叫 flannel.1 的设备，就是 VXLAN 所需的 VTEP 设备，它既有 IP 地址，也有 MAC 地址。现在，我们的 container-1 的 IP 地址是 10.1.15.2，要访问的 container-2 的 IP 地址是 10.1.16.3。那么，与前面 UDP 模式的流程类似，当container-1 发出请求之后，这个目的地址是 10.1.16.3 的 IP 包，会先出现在 docker0 网桥，然后被路由到本机 flannel.1 设备进行处理。也就是说，来到了“隧道”的入口。为了方便叙述，我接下来会把这个 IP 包称为“原始 IP 包”。为了能够将“原始 IP 包”封装并且发送到正确的宿主机，VXLAN 就需要找到这条“隧道”的出口，即：目的宿主机的 VTEP 设备。而这个设备的信息，正是每台宿主机上的 flanneld 进程负责维护的。比如，当 Node 2 启动并加入 Flannel 网络之后，在 Node 1（以及所有其他节点)上，flanneld 就会添加一条如下所示的路由规则：

```
route -n
```

这条规则的意思是：凡是发往 10.1.16.0/24 网段的 IP 包，都需要经过 flannel.1 设备发出，并且，它最后被发往的网关地址是：10.1.16.0。从图 3 的 Flannel VXLAN 模式的流程图中我们可以看到，10.1.16.0 正是 Node 2 上的 VTEP 设备（也就是 flannel.1 设备）的 IP 地址。为了方便叙述，接下来我会把 Node 1 和 Node 2 上的 flannel.1 设备分别称为“源VTEP 设备”和“目的 VTEP 设备”。而这些 VTEP 设备之间，就需要想办法组成一个虚拟的二层网络，即：通过二层数据帧进行通信。在我们的例子中，“源 VTEP 设备”收到“原始 IP 包”后，就要想办法把“原始 IP 包”加上一个目的 MAC 地址，封装成一个二层数据帧，然后发送给“目的 VTEP 设备”（当然，这么做还是因为这个 IP 包的目的地址不是本机）。这里需要解决的问题就是：“目的 VTEP 设备”的 MAC 地址是什么？此时，根据前面的路由记录，我们已经知道了“目的 VTEP 设备”的 IP 地址。而要根据三层 IP 地址查询对应的二层 MAC 地址，这正是 ARP（Address Resolution Protocol ）表的功能。而这里要用到的 ARP 记录，也是 flanneld 进程在 Node 2 节点启动时，自动添加在 Node 1 上的。我们可以通过 ip 命令看到它，如下所示：

```
# 在 Node 1 上
ip neigh show dev flannel.1
```

Flannel UDP 和 VXLAN 模式都可以称作“隧道”机制，也是很多其他容器网络插件的基础。比如 Weave 的两种模式，以及 Docker 的 Overlay 模式。此外，从上面的讲解中我们可以看到，VXLAN 模式组建的覆盖网络，其实就是一个由不同宿主机上的 VTEP 设备，也就是flannel.1 设备组成的虚拟二层网络。对于 VTEP 设备来说，它发出的“内部数据帧”就仿佛是一直在这个虚拟的二层网络上流动。这，也正是覆盖网络的含义。

### **3.K8s flannel 使用 CNI 的网桥：cni0 - DHCP**

```
1. Troubleshooting
网段-MAC->吓一跳的 IP
ip route show dev flannel.1
10.10.0.0/24 via 10.10.0.0 onlink
ip neig show dev flannel.1
10.10.0.0 lladdr 4e:92:57:e1:be:8a PERMANENT
bridge fdb show dev flannel.1
4e:92:57:e1:be:8a dst 192.168.56.5 self permanent
```

## **7.Network policy** 

> 相当于 Access controller list

**Network Policy概述**

network policy规范包含在给定命名空间中定义特定网络策略所需的所有信息。

- podSeletcor: 每个NetworkPolicy都包含一个podSelector，它选择应用该策略的pod分组。空的

- podSeletcor选择命名空间中的所有pod。

- policyTypes:每个NetworkPolicy都包含一个podTypes列表，其中可能包括入口、出口或两者。

- policyTypes字段指示给定策略是否应用于所选pod的入口流量、所选pod的出口流量或两者。如果在网络策略上未指定策略类型，则默认情况下，将始终设置入口，如果网络策略具有任何出口规则，则将设置出口。

```
kubectl explain netpol.spec.podSelector
```

**部署Calico网络模型实现网络策略(因为集群基于flannel网络模型用来作于网络功能，但其不支持网络策略，我们使用Calico网络模型来支持网络策略)**

https://docs.projectcalico.org/getting-started/kubernetes/self-managedonprem/onpremises#install-calico-with-kubernetes-api-datastore-50-nodes-or-less

Calico network 多网卡设置

```
vi calico.yaml
changing ds:container configuration.
spec:
 containers:
 - env:
 - name: DATASTORE_TYPE
 value: kubernetes
 - name: IP_AUTODETECTION_METHOD # DaemonSet中添加该环境变量
 value: interface=enp0s8 # 指定内网网卡
 - name: WAIT_FOR_DATASTORE
 value: "true"
```

**设置要点**

指定要保护的pod

指定进出的流量

指定访问或被访问的pod(namespace/ipblock/labesl + ports)

Permit or deny