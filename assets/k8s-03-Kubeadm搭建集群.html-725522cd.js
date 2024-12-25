import{_ as i,r as l,o as d,c,b as s,d as e,e as t,a as n}from"./app-999de8cb.js";const r={},o=n(`<h1 id="k8s-集群搭建" tabindex="-1"><a class="header-anchor" href="#k8s-集群搭建" aria-hidden="true">#</a> k8s 集群搭建</h1><p>Kubeadm 是 k8s 的部署工具，它提供了 kubeadm init 和 kubeadm join，专用于快速部署 k8s 集群，它能通过两条指令完成一个 Kubenetes 集群的搭建。Kubeadm 部署方式的优点是降低了部署门槛，部署方式快捷且简单；</p><h2 id="_1-主机准备" tabindex="-1"><a class="header-anchor" href="#_1-主机准备" aria-hidden="true">#</a> 1. 主机准备</h2><p>准备三台虚拟机，分别安装 CentOS 系统。一台作为 master 节点，另两台作为 node 节点，且每台虚拟机有自己的专属 IP 地址。</p><p>虚拟机的创建和配置注意以下几点：</p><ul><li>硬件按照上文要求进行配置；</li><li>虚拟机之间可以进行网络互通；</li><li>虚拟机可以访问外网，便于下载镜像；</li><li>安装好 wget 工具 <code>yum install wget</code>；</li><li>禁止 swap 分区。但缺点是屏蔽了诸多细节，遇到问题难以排查是哪里出现了问题。</li></ul><h2 id="_2-系统初始化" tabindex="-1"><a class="header-anchor" href="#_2-系统初始化" aria-hidden="true">#</a> 2. 系统初始化</h2><p>第一步：关闭防火墙</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#临时关闭</span>
systemctl stop firewalld
<span class="token comment">#永久关闭</span>
systemctl disable firewalld

systemctl status firewalld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步：关闭 selinux</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#永久关闭</span>
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;/selinux/s/enforcing/disabled/&#39;</span> /etc/selinux/config
<span class="token comment">#临时关闭</span>
setenforce <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第三步：关闭 swap</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#临时关闭</span>
swapoff <span class="token parameter variable">-a</span>
<span class="token comment">#永久关闭</span>
<span class="token function">sed</span> <span class="token parameter variable">-ri</span> <span class="token string">&#39;s/.*swap.*/#&amp;/&#39;</span> /etc/fstab
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第四步：设置主机名称，使用命令 <code>hostnamectl set-hostname 主机名</code>，如下三台主机分别设置为：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#查看当前主机名称</span>
<span class="token function">hostname</span>

hostnamectl set-hostname master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第五步：在<code>master</code>节点中添加 hosts，即节点 IP地址+节点名称</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> /etc/hosts <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
192.168.146.129 k8s-master
192.168.146.128 k8s-node1
192.168.146.130 k8s-node2
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17),p={href:"https://so.csdn.net/so/search?q=%E6%A1%A5%E6%8E%A5&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},u=n(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 设置</span>
<span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/sysctl.d/k8s.conf <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF</span>

<span class="token comment"># 使其生效</span>
<span class="token function">sysctl</span> <span class="token parameter variable">--system</span>
<span class="token comment"># 执行如下命令使修改生效</span>
modprobe br_netfilter
<span class="token function">sysctl</span> <span class="token parameter variable">-p</span> /etc/sysctl.d/k8s.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第七步：时间同步，让各个节点(虚拟机)中的时间与本机时间保持一致。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> ntpdate <span class="token parameter variable">-y</span>
ntpdate time.windows.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-docker-的安装" tabindex="-1"><a class="header-anchor" href="#_3-docker-的安装" aria-hidden="true">#</a> 3. Docker 的安装</h2><p>Kubernetes 默认容器运行时(CRI)为 Docker，所以需要先在各个节点中安装 Docker。</p><p>第一步：yum 包更新到最新。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 更新yum</span>
<span class="token function">sudo</span> yum update
<span class="token comment"># 更新yum软件包索引</span>
yum makecache 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步：安装需要的软件包，yum-util*（提供 yum-config-manager 功能）<em>，device-mapper-persistent-data、lvm2</em>（devicemapper 驱动依赖）*；</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 安装需要的包</span>
<span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token parameter variable">-y</span> yum-utils device-mapper-persistent-data lvm2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第三步：设置 yum 源为阿里云；</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 设置阿里云源</span>
<span class="token function">sudo</span> yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第四步：安装 Docker；</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 查看目前官方仓库的docker版本。</span>
yum list docker-ce.x86_64 <span class="token parameter variable">--showduplicates</span> <span class="token operator">|</span><span class="token function">sort</span> <span class="token parameter variable">-r</span> <span class="token comment">#从高到低列出Docker-ce的版本</span>
<span class="token comment"># 移除docker</span>
yum remove docker-ce docker-ce-clicontainerd.io-y

<span class="token comment"># 安装docker</span>
<span class="token function">sudo</span> yum <span class="token function">install</span> docker-ce
<span class="token comment"># 或</span>
yum <span class="token function">install</span> docker-ce-20.10.8 docker-ce-cli-20.10.8 containerd.io-1.4.10 <span class="token parameter variable">-y</span> <span class="token parameter variable">--allowerasing</span>

<span class="token comment"># 启动 docker</span>
systemctl start <span class="token function">docker</span>
<span class="token comment"># 设置为开机启动</span>
systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span> <span class="token parameter variable">--now</span>

<span class="token comment"># 设置Docker镜像加速器修改docker 配置以适应kubelet</span>
<span class="token function">vim</span> /etc/docker/daemon.json 
<span class="token punctuation">{</span>
	<span class="token string">&quot;registry-mirrors&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span><span class="token string">&quot;https://registry.cn-hangzhou.aliyuncs.com&quot;</span><span class="token punctuation">]</span>,
	<span class="token string">&quot;exec-opts&quot;</span>:<span class="token punctuation">[</span><span class="token string">&quot;native.cgroupdriver=systemd&quot;</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
<span class="token comment"># 重新加载配置</span>
systemctl daemon-reload
systemctl restart <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第五步：检查 Docker 版本；</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 检查 docker 版本</span>
<span class="token function">docker</span> <span class="token parameter variable">-v</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-添加阿里云-yum-源" tabindex="-1"><a class="header-anchor" href="#_4-添加阿里云-yum-源" aria-hidden="true">#</a> 4. 添加阿里云 yum 源</h2><p>此步骤是为了便于今后的下载，在每个节点中执行以下配置；</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/yum.repos.d/kubernetes.repo <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
[Kubernetes]
name=kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg   https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-kubeadm、kubelet、kubectl-的安装" tabindex="-1"><a class="header-anchor" href="#_5-kubeadm、kubelet、kubectl-的安装" aria-hidden="true">#</a> 5. kubeadm、kubelet、kubectl 的安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>//查看kubeadm版本
yum list kubeadm <span class="token parameter variable">--showduplicates</span> <span class="token operator">|</span><span class="token function">sort</span> <span class="token parameter variable">-r</span>

//移除kubeadm、kubelet、kubectl 
yum remove kubeadm.x86_64 kubectl.x86_64 kubelet.x86_64 <span class="token parameter variable">-y</span>
//安装kubeadm、kubelet、kubectl 
yum <span class="token function">install</span> kubeadm kubectl kubelet-y
//指定版本安装
yum <span class="token function">install</span> kubeadm-1.21.5 kubectl-1.21.5 kubelet-1.21.5 <span class="token parameter variable">-y</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>节点对应的位置即可使用 kubectl命令行工具</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>启动kubelet</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl daemon-reload
systemctl <span class="token builtin class-name">enable</span> kubelet <span class="token parameter variable">--now</span>
systemctl status kubelet
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-在-master-节点中部署集群" tabindex="-1"><a class="header-anchor" href="#_6-在-master-节点中部署集群" aria-hidden="true">#</a> 6. 在 Master 节点中部署集群</h2><h3 id="_1-命令行直接安装" tabindex="-1"><a class="header-anchor" href="#_1-命令行直接安装" aria-hidden="true">#</a> 1.命令行直接安装</h3><p>在 <code>master</code> 节点中执行以下命令，注意将 master 节点 IP 和 kube 版本号修改为自己主机中所对应的。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubeadm init <span class="token parameter variable">--image</span> <span class="token parameter variable">-repository</span> registry.aliyuncs.com/google_containers --kubernetes-version<span class="token operator">=</span>v1.21.5 --pod-network-cidr<span class="token operator">=</span><span class="token number">10.244</span>.0.0/16 --service-cidr<span class="token operator">=</span><span class="token number">10.20</span>.0.0/16 --apiserver-advertise-address<span class="token operator">=</span><span class="token number">192.168</span>.146.136
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>此步骤执行完成之后，使用命令<code>docker images</code>查看系统中的镜像，可以我们需要的镜像均已安装完成。</p><p>查看提示信息，看到 initialized successfully 说明我们 master 节点上的 k8s 集群已经搭建成功；</p><h3 id="_2-配置文件安装" tabindex="-1"><a class="header-anchor" href="#_2-配置文件安装" aria-hidden="true">#</a> <s>2. 配置文件安</s>装</h3><p>第一步：生成文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubeadm config print init-defaults <span class="token operator">&gt;</span>init-config.yaml
kubeadm init <span class="token parameter variable">--config</span><span class="token operator">=</span>init-config.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第二部：修改文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> init-config.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_7-将-node-节点加入集群" tabindex="-1"><a class="header-anchor" href="#_7-将-node-节点加入集群" aria-hidden="true">#</a> 7.将 node 节点加入集群</h2><p>查看上一步执行成功后的提示信息，可以看到系统给了我们两条命令；</p><p>① 开启 kubectl 工具的使用(<code>该命令在master节点中执行</code>)。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token environment constant">$HOME</span>/.kube
  <span class="token function">sudo</span> <span class="token function">cp</span> <span class="token parameter variable">-i</span> /etc/kubernetes/admin.conf <span class="token environment constant">$HOME</span>/.kube/config
  <span class="token function">sudo</span> <span class="token function">chown</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-u</span><span class="token variable">)</span></span><span class="token builtin class-name">:</span><span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-g</span><span class="token variable">)</span></span> <span class="token environment constant">$HOME</span>/.kube/config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Status Checking：</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get cs/node/pod
kubectl get all <span class="token parameter variable">-A</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>② 将 node 节点加入 master 中的集群(<code>该命令在工作节点node中执行</code>)。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubeadm <span class="token function">join</span> <span class="token number">192.168</span>.200.132:6443 <span class="token parameter variable">--token</span> pahgrt.7gn13u88wz4f89an <span class="token punctuation">\\</span>
    --discovery-token-ca-cert-hash sha256:7f73daa421d7564a6f813985a03f860350a923967d05cd955f8223d56200eb5b
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>分别在 master 节点中执行第 ① 条命令，在各个 node 节点中执行第 ② 条命令；</p><p>执行完成之后在 master 节点中使用命令 kubectl get nodes 查看此时集群中的工作节点。可以看到，node1 和 node2 工作节点已加入至 master 中的集群。</p><p>③ 在node节点上使用kubectl</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">scp</span> root@k8s-master:/etc/kubernetes/admin.conf /etc/kubernetes/admin.conf

<span class="token builtin class-name">echo</span> <span class="token string">&quot;export KUBECONFIG=/etc/kubernetes/admin.conf&quot;</span> <span class="token operator">&gt;&gt;</span> /etc/profile
<span class="token comment"># 生效</span>
<span class="token builtin class-name">source</span> /etc/profile
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-部署-cni-网络插件" tabindex="-1"><a class="header-anchor" href="#_8-部署-cni-网络插件" aria-hidden="true">#</a> 8. 部署 CNI 网络插件</h2><p>在上述操作完成后，各个工作节点已经加入了集群，但是它们的状态都是 NoReady，这是由于无它们无法跨主机通信的原因。而 CNI 网络插件的主要功能就是实现 pod 资源能够跨宿主机进行通信。在<code>master</code>节点中执行以下命令进行配置：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># /etc/hosts</span>
<span class="token number">185.199</span>.109.133  raw.githubusercontent.com

<span class="token function">wget</span> https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
<span class="token comment"># 如果多个网卡修改增加arg下面的参数</span>
args:
	---ip-masq
	---kube-subnet-mgr
	---iface<span class="token operator">=</span>enp0s8  <span class="token comment">#根据ifconfig -a		</span>

kubectl apply <span class="token parameter variable">-f</span> kube-flannel.yaml
kubectl get ds <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>flannel <span class="token parameter variable">-n</span> kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>Coredns</strong></p><p>在每个节点创建文件/run/flannel/subnet.env写入以下内容。注意每个节点都要加哦，不是主节点</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FLANNEL_NETWORK=10.244.0.0/16 # 对应kubeadm --pod-network-cidr
FLANNEL_SUBNET=10.244.0.1/24
FLANNEL_MTU=1450
FLANNEL_IPMASQ=true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><p>然后使用命令 kubectl get pods -n kube-system 查看运行状态，1 代表运行中；</p><p>最后再次使用kubectl get nodes查看集群中的工作节点；可以看到处于开机状态的 master 节点和 node2 节点已经是 ready 状态，处于关闭状态的 node1 节点为 NoReady 状态，测试无误</p><p>Kubernetes 集群搭建完成。</p><h2 id="_9-master-node-参与工作负载" tabindex="-1"><a class="header-anchor" href="#_9-master-node-参与工作负载" aria-hidden="true">#</a> 9. Master node 参与工作负载</h2><p>使用Kubeadm初始化的集群，Pod不会被调度到Master Node上，也就是说Master Node不参与工作负载。这是因为当前的master节点node1被打上了node-role.kubernetes.io/master:NoSchedule的污点：</p><p>查看污点标记:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl describe <span class="token function">node</span> k8s-master <span class="token operator">|</span> <span class="token function">grep</span> Taint 
Taints:node-role.kubernetes.io/master:NoSchedule
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>执行命令去除标记:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 因为这里搭建的是测试环境，去掉这个污点使node1参与工作负载：</span>
kubectl taint nodes k8s-master node-role.kubernetes.io/master-


<span class="token comment"># 设置为一定不能被调度</span>
kubectl taint <span class="token function">node</span> k8s-master03 node-role.kubernetes.io/master<span class="token operator">=</span><span class="token string">&quot;&quot;</span>:NoSchedule
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>kube-proxy开启ipvs:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl describe configmap kube-proxy <span class="token parameter variable">-n</span> kube-system 

<span class="token comment"># 修改ConfigMap的kube-system/kube-proxy中的config.conf，把 mode: &quot;&quot; 改为mode: “ipvs&quot; 保存退出即可</span>
kubectl edit configmap kube-proxy <span class="token parameter variable">-n</span>  kube-system mode: <span class="token string">&quot;ipvs&quot;</span> 

<span class="token comment"># 删除之前的proxy pod</span>
kubectl delete pod *1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看proxy运行状态</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pod <span class="token parameter variable">-n</span> kube-system <span class="token operator">|</span> <span class="token function">grep</span> kube-proxy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看日志,如果有 <code>Using ipvs Proxier.</code> 说明kube-proxy的ipvs 开启成功!</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> kubectl logs kube-proxy-54qnw <span class="token parameter variable">-n</span> kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_10-卸载安装" tabindex="-1"><a class="header-anchor" href="#_10-卸载安装" aria-hidden="true">#</a> 10. 卸载安装</h2><p>使用flannel插件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubeadm reset

<span class="token function">ifconfig</span> cni0 down <span class="token operator">&amp;&amp;</span> <span class="token function">ip</span> <span class="token function">link</span> delete cni0
<span class="token function">ifconfig</span> flannel.1 down <span class="token operator">&amp;&amp;</span> <span class="token function">ip</span> <span class="token function">link</span> delete flannel.1
<span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/lib/cni/
rm-rf /etc/kubernetes
<span class="token function">rm</span> <span class="token parameter variable">-rf</span> /root/.kube/config
<span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/lib/etcd
above is necessary, cnI0 address conflict to setup sandbox. 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Join证书过期</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>kubeadm token create <span class="token punctuation">-</span><span class="token punctuation">-</span>print<span class="token punctuation">-</span>join<span class="token punctuation">-</span>command

然后把master节点的~/.kube/config文件拷贝到当前NODE

node role change
kubectl label nodes k8s<span class="token punctuation">-</span>master node<span class="token punctuation">-</span>role.kubernetes.io/node=
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,71);function m(v,b){const a=l("ExternalLinkIcon");return d(),c("div",null,[o,s("p",null,[e("第六步：将"),s("a",p,[e("桥接"),t(a)]),e("的 IPv4 流量传递到 iptables 的链(所有节点都设置)；")]),u])}const h=i(r,[["render",m],["__file","k8s-03-Kubeadm搭建集群.html.vue"]]);export{h as default};
