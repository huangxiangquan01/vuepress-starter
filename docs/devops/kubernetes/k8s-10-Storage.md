#  10 .K8s 存储
## 1.Volume and PV 关系

###  Volume（卷）
属于 Pod 内部共享资源存储，生命周期和 Pod 相同，与 Container 无关，即使 Pod 上的容
器停止或者重启，Volume 不会受到影响，但是如果 Pod 终止，那么这个 Volume 的生命周
期也将结束。

**创建一个包含两个容器的 Pod**

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: muti-container
    name: muti-container
spec:
  containers:
    - image: nginx:1.9
      name: muti-container
      volumeMounts:
    - name: task-pv-storage
      mountPath: "/usr/share/nginx/html"
      resources: {}
    - image: centos
      name: centos
      imagePullPolicy: IfNotPresent
      command:
        - "bin/sh"
        - "-c"
        - "for i in 9 8 7 6 5 4 3 2 1; do echo $i>>/pod-data/index.html&&date&&date>>/poddata/index.html&&sleep 20; done"
      volumeMounts:
        - name: task-pv-storage
          mountPath: "/pod-data"
      resources: {}
  volumes:
    - name: task-pv-storage
  emptyDir: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

在配置文件中，你可以看到 Pod 有一个共享卷，名为 task-pv-storage。配置文件中的第一个容器运行了一个 nginx 服务器。共享卷的挂载路径是 /usr/share/nginx/html。第二个容器是基于 centos 镜像的，有一个 /pod-data 的挂载路径。第二个容器运行了下面的命令然后终止。`echo Hello from the debian container > /pod-data/index.html `

注意，第二个容器在 nginx 服务器的根目录下写了 index.html 文件。

## **2.存储基本组件介绍**

在 k8s 中 对 于 存 储 的 资 源 抽 象 了 两 个 概 念 ， 分 别 是 PersistentVolume(PV) 、PersistentVolumeClaim(PVC)。

- PV 是集群中的资源

- PVC 是对这些资源的请求。

PV 和 PVC 都只是抽象的概念，在 k8s 中是通过插件的方式提供具体的存储实现，目前包含有 NFS、ceph、iSCSI 和云提供商指定的存储系统，

### **1.PV/PVC/StorageClass**

管理存储是管理计算的一个明显问题。该 PersistentVolume 子系统为用户和管理员提供了一个 API，用于抽象如何根据消费方式提供存储的详细信息。为此，我们引入了两个新的**API 资源**：PersistentVolume 和 PersistentVolumeClaim

- PV ：PersistentVolume（持久化卷），是对底层的共享存储的一种抽象，PV 由管理员进行创建和配置，它和具体的底层的共享存储技术的实现方式有关，比如 Ceph、GlusterFS、NFS 等，都是通过插件机制完成与共享存储的对接。

- PersistentVolumeClaim（**PVC**）是由**用户进行存储的请求**。 它类似于 pod。 Pod 消耗节点资源，PVC 消耗 PV 资源。Pod 可以请求特定级别的资源（CPU 和内存）。声明可以请求特定的大小和访问模式（例如，可以一次读/写或多次只读）。

- 虽然 PersistentVolumeClaims 允许用户使用抽象存储资源，但是 PersistentVolumes 对于不同的问题，用户通常需要具有不同属性（例如性能）。群集管理员需要能够提供各种PersistentVolumes 不同的方式，而不仅仅是大小和访问模式，而不会让用户了解这些卷的实现方式。对于这些需求，有 **StorageClass 资源。**

- StorageClass 为管理员提供了一种描述他们提供的存储的“类”的方法。不同的类可能映射到服务质量级别，或备份策略，或者由群集管理员确定的任意策略。 Kubernetes 本身对于什么类别代表是不言而喻的。 这个概念有时在其他存储系统中称为“配置文件”。

- PV 是运维人员来创建的，开发操作 PVC，可是大规模集群中可能会有很多 PV，如果这些 PV 都需要运维手动来处理这也是一件很繁琐的事情，所以就有了动态供给概念，也就是Dynamic Provisioning，动态供给的关键就是 StorageClass，它的作用就是创建 PV 模板。创建 StorageClass 里面需要定义 PV 属性比如存储类型、大小等；另外创建这种 PV 需要用到存储插件。最终效果是，用户提交PVC，里面指定存储类型，如果符合我们定义的StorageClass，则会为其自动创建 PV 并进行绑定。

**PVC 和 PV 是一一对应的。**

- PV 和 PVC 中的 spec 关键字段要匹配，比如存储（storage）大小。

- PV 和 PVC 中的 storageClassName 字段必须一致。

### **2.四个概念的关系**

Kubernetes 中 存 储 中 有 四 个 重 要 的 概 念 ： Volume 、 PersistentVolume （ PV ）、PersistentVolumeClaim（PVC）、StorageClass。掌握了这四个概念，就掌握了 Kubernetes中存储系统的核心。引用一张图来说明这四者之间的关系。

### **3.生命周期**

PV 是群集中的资源。PVC 是对这些资源的请求，并且还充当对资源的检查。PV 和 PVC之间的相互作用遵循以下生命周期：

>  Provisioning ——-> Binding ——–>Using——>Releasing——>Recycling

1. 供应准备 Provisioning**---通过集群外的存储系统或者云平台来提供存储持久化支持。

- 静态提供 Static：集群管理员创建多个 PV。 它们携带可供集群用户使用的真实存储的详细信息。 它们存在于 Kubernetes API 中，可用于消费

- 动态提供 Dynamic：当管理员创建的静态 PV 都不匹配用户的 PersistentVolumeClaim 时，集群可能会尝试为 PVC 动态配置卷。 此配置基于 StorageClasses：PVC 必须请求一个类，并且管理员必须已创建并配置该类才能进行动态配置。 要求该类的声明有效地为自己禁用动态配置。

2. **绑定 Binding**---用户创建 pvc 并指定需要的资源和访问模式。在找到可用 pv 之前，pvc 会保持未绑定状态。

3. ** 使用 Using**---用户可在 pod 中像 volume 一样使用 pvc。

4. **释放 Releasing**---用户删除 pvc 来回收存储资源，pv 将变成“released”状态。由于还保留着之前的数据，这些数据需要根据不同的策略来处理，否则这些存储资源无法被其他 pvc 使用。

5. **回收Recycling**---pv可以设置三种回收策略：保留（Retain），回收（Recycle）和删除（Delete）。

- 保留策略：允许人工处理保留的数据。

-  删除策略：将删除 pv 和外部关联的存储资源，需要插件支持。

- 回收策略：将执行清除操作，之后可以被新的 pvc 使用，需要插件支持。

> 注：目前只有 NFS 和 HostPath 类型卷支持回收策略，AWS EBS,GCE PD,Azure Disk 和 Cinder支持删除(Delete)策略。

### **4.PV 类型**

| **类型**                         | **描述** |
| -------------------------------- | -------- |
| GCEPersistentDisk                |          |
| AWSElasticBlockStore             |          |
| AzureFile                        |          |
| AzureDisk                        |          |
| FC (Fibre Channel)               |          |
| Flexvolume                       |          |
| Flocker                          |          |
| NFS                              |          |
| iSCSI                            |          |
| RBD (Ceph Block Device)          |          |
| CephFS                           |          |
| Cinder (OpenStack block storage) |          |
| Glusterfs                        |          |
| GCEPersistentDisk                |          |
| AWSElasticBlockStore             |          |
| AzureFile                        |          |
| AzureDisk                        |          |
| FC (Fibre Channel)               |          |
| Flexvolume                       |          |
| Flocker                          |          |

### **5.PV 卷阶段状态**

- Available – 资源尚未被 claim 使用

- Bound – 卷已经被绑定到 claim 了

- Released – claim 被删除，卷处于释放状态，但未被集群回收。

- Failed – 卷自动回收失败

### **6.K8s 存储架构图**



## **3.驱动 Plugin 实现方法** 

### **1.In Tree**

Kubernetes 卷插件目前是“in-tree”，意味着它们与核心 kubernetes 二进制文件链接，编译，构建和一起发布。有不利于核心代码的发布,增加了工作量,并且卷插件的权限太高等缺点需要将后端存储的代码逻辑放到 K8S 的代码中运行。逻辑代码可能会引起与 K8S 其他部件之间的相互影响。

### **2.Out-of-tree Provisioner-FlexVolume**

现有的 Flex Volume 插件需要访问节点和主机的根文件系统才能部署第三方驱动程序文件,并且对主机的依赖性强.调用一个主机的可执行程序包的方式执行存储卷的挂载使用。解决了 In-Tree 方式的强耦合，不过命令行调用的方式，在主机安全性、部署依赖的容器化、与 K8S 服务之间的相互扩展性等方面存在不足Flexvolume 运行在 host 空间，不能使用 rbac授权机制访问Kubernetes API，导致其功能极大的受限`Storage providers support this type and develop Driver`

### **3.Out-of-tree Provisioner -CSI**

容器存储接口（CSI）是由来自各个 CO 的社区成员（包括 Kubernetes，Mesos，Cloud Foundry和 Docker）之间的合作产生的规范。此接口的目标是为 CO 建立标准化机制，以将任意存储系统暴露给其容器化工作负载。CSI 标准使 K8S 和存储提供者之间将彻底解耦，将存储的所有的部件作为容器形式运行在K8S 上。

CO Container Orchestrer

Storage providers support this type and develop Driver

## **4.NFS 实现 K8s 存储** 

创建一个 NFS 服务器作为 K8s 的存储系统，nfs 默认不支持动态存储，使用了第三方的 NFS 插件 实现 flexvolume and CSI 方式使用存

储。

### **1.NFS 服务的建立**

**Server** 

```
yum install nfs-utils rpcbind -y

systemctl enable rpcbind nfs-server
systemctl start rpcbind nfs-server
systemctl status rpcbind nfs-server

mkdir /nfs-server
vi /etc/exports
/nfs-server *(rw,sync,no_root_squash)
exportfs -a

showmount -e own ip add(如不加可能报错，确保防火墙已经关闭）
showmount -e # 默认查看自己共享的服务，前提是要 DNS 能解析自己，不然容易报错
showmount -a # 显示已经与客户端连接上的目录信息
```

**Client**

```
yum install nfs-utils rpcbind -y
systemctl enable rpcbind nfs-server
systemctl start rpcbind nfs-server
systemctl status rpcbind nfs-server
showmount -e 192.168.56.5

mount -t nfs 192.168.56.5 :/nfs-server /home
umount /home
```

> 可以共享：自己创建的目录不能进行 mount. 
>
> Note: 在每一个节点都需要安装

### **2.NFS 静态供应**

**PV 创建**

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
 name: pv0001
spec:
  capacity:
 	storage: 5Gi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Recycle
       
  nfs:
    path: "/nfs-server"
    server: 192.168.56.5
```

**PVC 创建**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
 name: nfs-pvc
spec:
  accessModes:
  - ReadWriteMany
       
  resources:
    requests:
      storage: 1Gi
```

```
kubectl get pod/pv/pvc
```

###  **3.NFS flex-volume 动态供应**

**Provisioner installation**

**Storage Class creation**

```
apiVersion: storage.k8s.io/v1beta1
kind: StorageClass
metadata:
 name: nfs
provisioner: fuseim.pri/ifs
```

### **4.NFS CSI 动态供应**

NFS CSI Driver 是 K8s 官方提供的 CSI 示例程序，只实现了 CSI 的最简功能Controller 由 CSI Plugin+csi-provisioner+livenessprobe 组成node-server 由 CSI Plugin+liveness-probe+node-driver-registrar 组成

**StorageClass 定义。**

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: nfs-csi
provisioner: nfs.csi.k8s.io
parameters:
 server: 192.168.56.5 #修改为自己的 nfs 的服务器地址
 share: /home/nfs-server #修改为 nfs 的目录
reclaimPolicy: Retain # only retain is supported,目前这个回收策略只支持 Retain
volumeBindingMode: Immediate
mountOptions:
 - hard
 - nfsvers=4.1
```

> 官网连接更新参考
>
> https://artifacthub.io/packages/helm/keyporttech/csi-driver-nfs/0.1.4
>
> https://github.com/kubernetes-csi/csi-driver
>
> nfs/blob/master/deploy/example/README.md

**卸载**

```
kubectl delete -f csi-nfs-controller.yaml --ignore-not-found
kubectl delete -f csi-nfs-node.yaml --ignore-not-found
kubectl delete -f csi-nfs-driverinfo.yaml --ignore-not-found
kubectl delete -f rbac-csi.yaml --ignore-not-found
```

>https://blog.csdn.net/qq_40722827/article/details/127948651
>https://blog.csdn.net/weixin_43313333/article/details/128666197
