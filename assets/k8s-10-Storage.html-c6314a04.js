import{_ as n,o as s,c as e,a}from"./app-999de8cb.js";const t={},i=a(`<h1 id="_10-k8s-存储" tabindex="-1"><a class="header-anchor" href="#_10-k8s-存储" aria-hidden="true">#</a> 10 .K8s 存储</h1><h2 id="_1-volume-and-pv-关系" tabindex="-1"><a class="header-anchor" href="#_1-volume-and-pv-关系" aria-hidden="true">#</a> 1.Volume and PV 关系</h2><h3 id="volume-卷" tabindex="-1"><a class="header-anchor" href="#volume-卷" aria-hidden="true">#</a> Volume（卷）</h3><p>属于 Pod 内部共享资源存储，生命周期和 Pod 相同，与 Container 无关，即使 Pod 上的容 器停止或者重启，Volume 不会受到影响，但是如果 Pod 终止，那么这个 Volume 的生命周 期也将结束。</p><p><strong>创建一个包含两个容器的 Pod</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">creationTimestamp</span><span class="token punctuation">:</span> <span class="token null important">null</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">run</span><span class="token punctuation">:</span> muti<span class="token punctuation">-</span>container
    <span class="token key atrule">name</span><span class="token punctuation">:</span> muti<span class="token punctuation">-</span>container
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span><span class="token number">1.9</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> muti<span class="token punctuation">-</span>container
      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> task<span class="token punctuation">-</span>pv<span class="token punctuation">-</span>storage
      <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/usr/share/nginx/html&quot;</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> centos
      <span class="token key atrule">name</span><span class="token punctuation">:</span> centos
      <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
      <span class="token key atrule">command</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token string">&quot;bin/sh&quot;</span>
        <span class="token punctuation">-</span> <span class="token string">&quot;-c&quot;</span>
        <span class="token punctuation">-</span> <span class="token string">&quot;for i in 9 8 7 6 5 4 3 2 1; do echo $i&gt;&gt;/pod-data/index.html&amp;&amp;date&amp;&amp;date&gt;&gt;/poddata/index.html&amp;&amp;sleep 20; done&quot;</span>
      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> task<span class="token punctuation">-</span>pv<span class="token punctuation">-</span>storage
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/pod-data&quot;</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> task<span class="token punctuation">-</span>pv<span class="token punctuation">-</span>storage
  <span class="token key atrule">emptyDir</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token key atrule">dnsPolicy</span><span class="token punctuation">:</span> ClusterFirst
  <span class="token key atrule">restartPolicy</span><span class="token punctuation">:</span> Never
<span class="token key atrule">status</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在配置文件中，你可以看到 Pod 有一个共享卷，名为 task-pv-storage。配置文件中的第一个容器运行了一个 nginx 服务器。共享卷的挂载路径是 /usr/share/nginx/html。第二个容器是基于 centos 镜像的，有一个 /pod-data 的挂载路径。第二个容器运行了下面的命令然后终止。<code>echo Hello from the debian container &gt; /pod-data/index.html </code></p><p>注意，第二个容器在 nginx 服务器的根目录下写了 index.html 文件。</p><h2 id="_2-存储基本组件介绍" tabindex="-1"><a class="header-anchor" href="#_2-存储基本组件介绍" aria-hidden="true">#</a> <strong>2.存储基本组件介绍</strong></h2><p>在 k8s 中 对 于 存 储 的 资 源 抽 象 了 两 个 概 念 ， 分 别 是 PersistentVolume(PV) 、PersistentVolumeClaim(PVC)。</p><ul><li><p>PV 是集群中的资源</p></li><li><p>PVC 是对这些资源的请求。</p></li></ul><p>PV 和 PVC 都只是抽象的概念，在 k8s 中是通过插件的方式提供具体的存储实现，目前包含有 NFS、ceph、iSCSI 和云提供商指定的存储系统，</p><h3 id="_1-pv-pvc-storageclass" tabindex="-1"><a class="header-anchor" href="#_1-pv-pvc-storageclass" aria-hidden="true">#</a> <strong>1.PV/PVC/StorageClass</strong></h3><p>管理存储是管理计算的一个明显问题。该 PersistentVolume 子系统为用户和管理员提供了一个 API，用于抽象如何根据消费方式提供存储的详细信息。为此，我们引入了两个新的<strong>API 资源</strong>：PersistentVolume 和 PersistentVolumeClaim</p><ul><li><p>PV ：PersistentVolume（持久化卷），是对底层的共享存储的一种抽象，PV 由管理员进行创建和配置，它和具体的底层的共享存储技术的实现方式有关，比如 Ceph、GlusterFS、NFS 等，都是通过插件机制完成与共享存储的对接。</p></li><li><p>PersistentVolumeClaim（<strong>PVC</strong>）是由<strong>用户进行存储的请求</strong>。 它类似于 pod。 Pod 消耗节点资源，PVC 消耗 PV 资源。Pod 可以请求特定级别的资源（CPU 和内存）。声明可以请求特定的大小和访问模式（例如，可以一次读/写或多次只读）。</p></li><li><p>虽然 PersistentVolumeClaims 允许用户使用抽象存储资源，但是 PersistentVolumes 对于不同的问题，用户通常需要具有不同属性（例如性能）。群集管理员需要能够提供各种PersistentVolumes 不同的方式，而不仅仅是大小和访问模式，而不会让用户了解这些卷的实现方式。对于这些需求，有 <strong>StorageClass 资源。</strong></p></li><li><p>StorageClass 为管理员提供了一种描述他们提供的存储的“类”的方法。不同的类可能映射到服务质量级别，或备份策略，或者由群集管理员确定的任意策略。 Kubernetes 本身对于什么类别代表是不言而喻的。 这个概念有时在其他存储系统中称为“配置文件”。</p></li><li><p>PV 是运维人员来创建的，开发操作 PVC，可是大规模集群中可能会有很多 PV，如果这些 PV 都需要运维手动来处理这也是一件很繁琐的事情，所以就有了动态供给概念，也就是Dynamic Provisioning，动态供给的关键就是 StorageClass，它的作用就是创建 PV 模板。创建 StorageClass 里面需要定义 PV 属性比如存储类型、大小等；另外创建这种 PV 需要用到存储插件。最终效果是，用户提交PVC，里面指定存储类型，如果符合我们定义的StorageClass，则会为其自动创建 PV 并进行绑定。</p></li></ul><p><strong>PVC 和 PV 是一一对应的。</strong></p><ul><li><p>PV 和 PVC 中的 spec 关键字段要匹配，比如存储（storage）大小。</p></li><li><p>PV 和 PVC 中的 storageClassName 字段必须一致。</p></li></ul><h3 id="_2-四个概念的关系" tabindex="-1"><a class="header-anchor" href="#_2-四个概念的关系" aria-hidden="true">#</a> <strong>2.四个概念的关系</strong></h3><p>Kubernetes 中 存 储 中 有 四 个 重 要 的 概 念 ： Volume 、 PersistentVolume （ PV ）、PersistentVolumeClaim（PVC）、StorageClass。掌握了这四个概念，就掌握了 Kubernetes中存储系统的核心。引用一张图来说明这四者之间的关系。</p><h3 id="_3-生命周期" tabindex="-1"><a class="header-anchor" href="#_3-生命周期" aria-hidden="true">#</a> <strong>3.生命周期</strong></h3><p>PV 是群集中的资源。PVC 是对这些资源的请求，并且还充当对资源的检查。PV 和 PVC之间的相互作用遵循以下生命周期：</p><blockquote><p>Provisioning ——-&gt; Binding ——–&gt;Using——&gt;Releasing——&gt;Recycling</p></blockquote><ol><li>供应准备 Provisioning**---通过集群外的存储系统或者云平台来提供存储持久化支持。</li></ol><ul><li><p>静态提供 Static：集群管理员创建多个 PV。 它们携带可供集群用户使用的真实存储的详细信息。 它们存在于 Kubernetes API 中，可用于消费</p></li><li><p>动态提供 Dynamic：当管理员创建的静态 PV 都不匹配用户的 PersistentVolumeClaim 时，集群可能会尝试为 PVC 动态配置卷。 此配置基于 StorageClasses：PVC 必须请求一个类，并且管理员必须已创建并配置该类才能进行动态配置。 要求该类的声明有效地为自己禁用动态配置。</p></li></ul><ol start="2"><li><p><strong>绑定 Binding</strong>---用户创建 pvc 并指定需要的资源和访问模式。在找到可用 pv 之前，pvc 会保持未绑定状态。</p></li><li><p>** 使用 Using**---用户可在 pod 中像 volume 一样使用 pvc。</p></li><li><p><strong>释放 Releasing</strong>---用户删除 pvc 来回收存储资源，pv 将变成“released”状态。由于还保留着之前的数据，这些数据需要根据不同的策略来处理，否则这些存储资源无法被其他 pvc 使用。</p></li><li><p><strong>回收Recycling</strong>---pv可以设置三种回收策略：保留（Retain），回收（Recycle）和删除（Delete）。</p></li></ol><ul><li><p>保留策略：允许人工处理保留的数据。</p></li><li><p>删除策略：将删除 pv 和外部关联的存储资源，需要插件支持。</p></li><li><p>回收策略：将执行清除操作，之后可以被新的 pvc 使用，需要插件支持。</p></li></ul><blockquote><p>注：目前只有 NFS 和 HostPath 类型卷支持回收策略，AWS EBS,GCE PD,Azure Disk 和 Cinder支持删除(Delete)策略。</p></blockquote><h3 id="_4-pv-类型" tabindex="-1"><a class="header-anchor" href="#_4-pv-类型" aria-hidden="true">#</a> <strong>4.PV 类型</strong></h3><table><thead><tr><th><strong>类型</strong></th><th><strong>描述</strong></th></tr></thead><tbody><tr><td>GCEPersistentDisk</td><td></td></tr><tr><td>AWSElasticBlockStore</td><td></td></tr><tr><td>AzureFile</td><td></td></tr><tr><td>AzureDisk</td><td></td></tr><tr><td>FC (Fibre Channel)</td><td></td></tr><tr><td>Flexvolume</td><td></td></tr><tr><td>Flocker</td><td></td></tr><tr><td>NFS</td><td></td></tr><tr><td>iSCSI</td><td></td></tr><tr><td>RBD (Ceph Block Device)</td><td></td></tr><tr><td>CephFS</td><td></td></tr><tr><td>Cinder (OpenStack block storage)</td><td></td></tr><tr><td>Glusterfs</td><td></td></tr><tr><td>GCEPersistentDisk</td><td></td></tr><tr><td>AWSElasticBlockStore</td><td></td></tr><tr><td>AzureFile</td><td></td></tr><tr><td>AzureDisk</td><td></td></tr><tr><td>FC (Fibre Channel)</td><td></td></tr><tr><td>Flexvolume</td><td></td></tr><tr><td>Flocker</td><td></td></tr></tbody></table><h3 id="_5-pv-卷阶段状态" tabindex="-1"><a class="header-anchor" href="#_5-pv-卷阶段状态" aria-hidden="true">#</a> <strong>5.PV 卷阶段状态</strong></h3><ul><li><p>Available – 资源尚未被 claim 使用</p></li><li><p>Bound – 卷已经被绑定到 claim 了</p></li><li><p>Released – claim 被删除，卷处于释放状态，但未被集群回收。</p></li><li><p>Failed – 卷自动回收失败</p></li></ul><h3 id="_6-k8s-存储架构图" tabindex="-1"><a class="header-anchor" href="#_6-k8s-存储架构图" aria-hidden="true">#</a> <strong>6.K8s 存储架构图</strong></h3><h2 id="_3-驱动-plugin-实现方法" tabindex="-1"><a class="header-anchor" href="#_3-驱动-plugin-实现方法" aria-hidden="true">#</a> <strong>3.驱动 Plugin 实现方法</strong></h2><h3 id="_1-in-tree" tabindex="-1"><a class="header-anchor" href="#_1-in-tree" aria-hidden="true">#</a> <strong>1.In Tree</strong></h3><p>Kubernetes 卷插件目前是“in-tree”，意味着它们与核心 kubernetes 二进制文件链接，编译，构建和一起发布。有不利于核心代码的发布,增加了工作量,并且卷插件的权限太高等缺点需要将后端存储的代码逻辑放到 K8S 的代码中运行。逻辑代码可能会引起与 K8S 其他部件之间的相互影响。</p><h3 id="_2-out-of-tree-provisioner-flexvolume" tabindex="-1"><a class="header-anchor" href="#_2-out-of-tree-provisioner-flexvolume" aria-hidden="true">#</a> <strong>2.Out-of-tree Provisioner-FlexVolume</strong></h3><p>现有的 Flex Volume 插件需要访问节点和主机的根文件系统才能部署第三方驱动程序文件,并且对主机的依赖性强.调用一个主机的可执行程序包的方式执行存储卷的挂载使用。解决了 In-Tree 方式的强耦合，不过命令行调用的方式，在主机安全性、部署依赖的容器化、与 K8S 服务之间的相互扩展性等方面存在不足Flexvolume 运行在 host 空间，不能使用 rbac授权机制访问Kubernetes API，导致其功能极大的受限<code>Storage providers support this type and develop Driver</code></p><h3 id="_3-out-of-tree-provisioner-csi" tabindex="-1"><a class="header-anchor" href="#_3-out-of-tree-provisioner-csi" aria-hidden="true">#</a> <strong>3.Out-of-tree Provisioner -CSI</strong></h3><p>容器存储接口（CSI）是由来自各个 CO 的社区成员（包括 Kubernetes，Mesos，Cloud Foundry和 Docker）之间的合作产生的规范。此接口的目标是为 CO 建立标准化机制，以将任意存储系统暴露给其容器化工作负载。CSI 标准使 K8S 和存储提供者之间将彻底解耦，将存储的所有的部件作为容器形式运行在K8S 上。</p><p>CO Container Orchestrer</p><p>Storage providers support this type and develop Driver</p><h2 id="_4-nfs-实现-k8s-存储" tabindex="-1"><a class="header-anchor" href="#_4-nfs-实现-k8s-存储" aria-hidden="true">#</a> <strong>4.NFS 实现 K8s 存储</strong></h2><p>创建一个 NFS 服务器作为 K8s 的存储系统，nfs 默认不支持动态存储，使用了第三方的 NFS 插件 实现 flexvolume and CSI 方式使用存</p><p>储。</p><h3 id="_1-nfs-服务的建立" tabindex="-1"><a class="header-anchor" href="#_1-nfs-服务的建立" aria-hidden="true">#</a> <strong>1.NFS 服务的建立</strong></h3><p><strong>Server</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yum install nfs-utils rpcbind -y

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Client</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yum install nfs-utils rpcbind -y
systemctl enable rpcbind nfs-server
systemctl start rpcbind nfs-server
systemctl status rpcbind nfs-server
showmount -e 192.168.56.5

mount -t nfs 192.168.56.5 :/nfs-server /home
umount /home
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>可以共享：自己创建的目录不能进行 mount.</p><p>Note: 在每一个节点都需要安装</p></blockquote><h3 id="_2-nfs-静态供应" tabindex="-1"><a class="header-anchor" href="#_2-nfs-静态供应" aria-hidden="true">#</a> <strong>2.NFS 静态供应</strong></h3><p><strong>PV 创建</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolume
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> pv0001
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">capacity</span><span class="token punctuation">:</span>
 	<span class="token key atrule">storage</span><span class="token punctuation">:</span> 5Gi
  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> ReadWriteMany
  <span class="token key atrule">persistentVolumeReclaimPolicy</span><span class="token punctuation">:</span> Recycle
       
  <span class="token key atrule">nfs</span><span class="token punctuation">:</span>
    <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/nfs-server&quot;</span>
    <span class="token key atrule">server</span><span class="token punctuation">:</span> 192.168.56.5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>PVC 创建</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolumeClaim
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>pvc
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> ReadWriteMany
       
  <span class="token key atrule">resources</span><span class="token punctuation">:</span>
    <span class="token key atrule">requests</span><span class="token punctuation">:</span>
      <span class="token key atrule">storage</span><span class="token punctuation">:</span> 1Gi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl get pod/pv/pvc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_3-nfs-flex-volume-动态供应" tabindex="-1"><a class="header-anchor" href="#_3-nfs-flex-volume-动态供应" aria-hidden="true">#</a> <strong>3.NFS flex-volume 动态供应</strong></h3><p><strong>Provisioner installation</strong></p><p><strong>Storage Class creation</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apiVersion: storage.k8s.io/v1beta1
kind: StorageClass
metadata:
 name: nfs
provisioner: fuseim.pri/ifs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-nfs-csi-动态供应" tabindex="-1"><a class="header-anchor" href="#_4-nfs-csi-动态供应" aria-hidden="true">#</a> <strong>4.NFS CSI 动态供应</strong></h3><p>NFS CSI Driver 是 K8s 官方提供的 CSI 示例程序，只实现了 CSI 的最简功能Controller 由 CSI Plugin+csi-provisioner+livenessprobe 组成node-server 由 CSI Plugin+liveness-probe+node-driver-registrar 组成</p><p><strong>StorageClass 定义。</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apiVersion: storage.k8s.io/v1
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>官网连接更新参考</p><p>https://artifacthub.io/packages/helm/keyporttech/csi-driver-nfs/0.1.4</p><p>https://github.com/kubernetes-csi/csi-driver</p><p>nfs/blob/master/deploy/example/README.md</p></blockquote><p><strong>卸载</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl delete -f csi-nfs-controller.yaml --ignore-not-found
kubectl delete -f csi-nfs-node.yaml --ignore-not-found
kubectl delete -f csi-nfs-driverinfo.yaml --ignore-not-found
kubectl delete -f rbac-csi.yaml --ignore-not-found
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>https://blog.csdn.net/qq_40722827/article/details/127948651 https://blog.csdn.net/weixin_43313333/article/details/128666197</p></blockquote>`,68),l=[i];function r(o,p){return s(),e("div",null,l)}const c=n(t,[["render",r],["__file","k8s-10-Storage.html.vue"]]);export{c as default};