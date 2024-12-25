import{_ as e,o as n,c as s,a}from"./app-999de8cb.js";const l={},t=a(`<h1 id="kubectl" tabindex="-1"><a class="header-anchor" href="#kubectl" aria-hidden="true">#</a> kubectl</h1><h2 id="kubectl-介绍" tabindex="-1"><a class="header-anchor" href="#kubectl-介绍" aria-hidden="true">#</a> <strong>kubectl 介绍</strong></h2><h4 id="_1-kubectl-概要" tabindex="-1"><a class="header-anchor" href="#_1-kubectl-概要" aria-hidden="true">#</a> <strong>1. kubectl 概要</strong></h4><p>kubectl 控制 Kubernetes 集群管理器，使用 Kubernetes 命令行工具 kubectl 在 Kubernetes上部署和管理应用程序。使用 kubectl，您可以检查群集资源; 创建，删除和更新组件; 看看你的新集群; 并提出示例应用程序。</p><h4 id="_2-kubectl-安装" tabindex="-1"><a class="header-anchor" href="#_2-kubectl-安装" aria-hidden="true">#</a> <strong>2.kubectl 安装</strong></h4><p>添加软件源信息</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&lt;&lt;</span><span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">&gt;</span> /etc/yum.repos.d/kubernetes.repo</span>
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-
x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF</span>

yum <span class="token function">install</span> kubectl-version <span class="token parameter variable">-y</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3.Kubectl 配置</strong></p><p>在开启了 TLS 的集群中，当与集群交互的时候少不了的是身份认证，使用 kubeconfig（即证书） 和 token 两种认证方式是最简单也最通用的认证方式。</p><p>kubectl 只是个 go 编写的可执行程序，只要为 kubectl 配置合适的 kubeconfig，就可以在集群中的任意节点使用。kubectl 默认会从$HOME/.kube 目录下查找文件名为 config 的文件，也可以通过设置环境变量 KUBECONFIG 或者通过设置 --kubeconfig 去指定其它kubeconfig 文件。</p><p>kubeconfig 就是为访问集群所作的配置。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">KUBE_APISERVER</span><span class="token operator">=</span>https://192.168.56.5:6443

<span class="token comment"># 设置集群参数</span>
kubectl config set-cluster kubernetes <span class="token punctuation">\\</span>
 --certificate-authority<span class="token operator">=</span>/etc/kubernetes/ssl/ca.pem <span class="token punctuation">\\</span>
 --embed-certs<span class="token operator">=</span>true <span class="token punctuation">\\</span>
 <span class="token parameter variable">--server</span><span class="token operator">=</span><span class="token variable">\${KUBE_APISERVER}</span>
 
 <span class="token comment"># 设置客户端认证参数</span>
kubectl config set-credentials admin <span class="token punctuation">\\</span>
 --client-certificate<span class="token operator">=</span>/etc/kubernetes/ssl/admin.pem <span class="token punctuation">\\</span>
 --embed-certs<span class="token operator">=</span>true <span class="token punctuation">\\</span>
 --client-key<span class="token operator">=</span>/etc/kubernetes/ssl/admin-key.pem
 
 <span class="token comment"># 设置上下文参数</span>
kubectl config set-context kubernetes <span class="token punctuation">\\</span>
 <span class="token parameter variable">--cluster</span><span class="token operator">=</span>kubernetes <span class="token punctuation">\\</span>
 <span class="token parameter variable">--user</span><span class="token operator">=</span>admin
 
<span class="token comment"># 设置默认上下文</span>
kubectl config use-context Kubernetes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生成的 kubeconfig 被保存到 ~/.kube/config 文件；配置文件描述了集群、用户和上下文。</p><ul><li><strong>集群参数</strong></li></ul><p>​ 本段设置了所需要访问的集群的信息。使用 set-cluster 设置了需要访问的集群，如上为kubernetes，这只是个名称，实际为--server 指向的 apiserver；--certificate-authority 设置了该集群的公钥；--embed-certs 为 true 表示将--certificate-authority 证书写入到 kubeconfig 中；--server 则表示该集群的 kube-apiserver 地址生成的 kubeconfig 被保存到 ~/.kube/config 文件</p><ul><li><strong>用户参数</strong></li></ul><p>​ 本段主要设置用户的相关信息，主要是用户证书。如上的用户名为 admin，证书为：/etc/kubernetes/ssl/admin.pem，私钥 为：/etc/kubernetes/ssl/admin-key.pem。注意客户端的证书首先要经过集群 CA 的签署，否则不会被集群认可。此处使用的是 ca 认证方式，也可以使用 token 认证，如 kubelet 的 TLS Boostrap 机制下的 bootstrapping 使用的就是 token 认证方式。上述 kubectl 使用的是 ca 认证，不需要 token 字段</p><ul><li><strong>上下文参数</strong> context 定义了一个命名的 cluster、user、namespace 元组，用于使用提供的认证信息和命名空间将请求发送到指定的集群。三个都是可选的，仅使用 cluster、user、namespace 之一指定上下文，或指定 none。使用 kubectl config use-context kubernetes 来使用名为 kubenetes 的环境项来作为配置。如果配置了多个环境项，可以通过切换不同的环境项名字来访问到不同的集群环境。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#也可以修改默认的 namespace 名字</span>
kubectl config set-context <span class="token parameter variable">--current</span> <span class="token parameter variable">--namespace</span><span class="token operator">=</span>kube-system

<span class="token comment">#查看相应的参数</span>
kubectl config view
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>备注</li></ul><blockquote><p>使用 kubeconfig 还需要注意<strong>用户</strong>已经经过授权（如 RBAC 授权），上述例子中用户的证书中 OU 字段为 system:masters，kube-apiserver 预定义的 RoleBinding cluster-admin 将Group system:masters 与 Role cluster-admin 绑定，该 Role 授予了调用 kubeapiserver 相关 API 的权限。</p></blockquote><h4 id="_4-kubectl-自动补全和别名" tabindex="-1"><a class="header-anchor" href="#_4-kubectl-自动补全和别名" aria-hidden="true">#</a> <strong>4. kubectl 自动补全和别名</strong></h4><p>在管理 k8s 集群的时候，避免不了使用 kubectl 命令工具，但是该命令还是挺复杂的，使用中也记不住那么多的 api 选项，可以使用 kubectl 命令补全工具。</p><p>第一步: 安装 bash-completion：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token parameter variable">-y</span> bash-completion 
<span class="token builtin class-name">source</span> /usr/share/bash-completion/bash_completion
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步: 应用 kubectl 的 completion 到系统环境：</p><ul><li><strong>Bash</strong></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># set up autocomplete in bash into the current shell, bash-completion package should be installed first.</span>
<span class="token builtin class-name">source</span> <span class="token operator">&lt;</span><span class="token punctuation">(</span>kubectl completion <span class="token function">bash</span><span class="token punctuation">)</span>

<span class="token comment"># add autocomplete permanently to your bash shell.</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;source &lt;(kubectl completion bash)&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.bashrc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>ZSH</strong></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># set up autocomplete in zsh into the current shell</span>
<span class="token builtin class-name">source</span> <span class="token operator">&lt;</span><span class="token punctuation">(</span>kubectl completion <span class="token function">zsh</span><span class="token punctuation">)</span>  
<span class="token comment"># add autocomplete permanently to your zsh shell</span>
<span class="token builtin class-name">echo</span> <span class="token string">&#39;[[ $commands[kubectl] ]] &amp;&amp; source &lt;(kubectl completion zsh)&#39;</span> <span class="token operator">&gt;&gt;</span> ~/.zshrc 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第三步: 使用别名进一步简化</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 设置别名</span>
<span class="token builtin class-name">alias</span> <span class="token assign-left variable">k</span><span class="token operator">=</span>kubectl
<span class="token comment"># 别名自动补全</span>
complete <span class="token parameter variable">-o</span> default <span class="token parameter variable">-F</span> __start_kubectl k
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第四步：增加这些进入 /etc/profile. Or ~/.bashrc</p><h4 id="_5-kubectl-命令介绍" tabindex="-1"><a class="header-anchor" href="#_5-kubectl-命令介绍" aria-hidden="true">#</a> <strong>5.Kubectl 命令介绍</strong></h4><ol><li><p><strong>Basic Commands(Beginner)基础命令（初级）</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 通过 yaml/json 文件或者标准输入创建一个资源对象，支持很多子命令 例如 namespace pod deployment service 等</span>
kubectl create 
<span class="token comment"># 将 json/yaml 文件中定义的资源对象的端口暴露给新的service 资源对象</span>
kubectl expose 
<span class="token comment"># 创建并运行一个或多个容器镜像</span>
kubectl run 
<span class="token comment"># 配置资源对象设置特定功能</span>
kubectl <span class="token builtin class-name">set</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>Basic Commands（Intermediate）基础命令（中级）</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl explain  <span class="token comment">#查看资源对象的详细信息(编写 yaml 的时候做一个提示</span>
kubectl explain deployment <span class="token comment">#会出现 deployment 下面可以写的字段以及字段属性还有 可以逐级使用</span>
kubectl get <span class="token comment">#获取一个或多个资源对象的信息</span>
kubectl edit <span class="token comment">#使用默认编辑器编辑服务器上定义的资源对象</span>
kubectl delete <span class="token comment">#通过 json/yaml 文件、标准舒服、资源名称或标签选择器来删除资源</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>DeployCommands 部署命令</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl rollout <span class="token comment">#资源管理对象的部署</span>
kubectl rollout-update <span class="token comment">#使用 rc（replication controller）来做滚动恩星</span>
kubectl scale <span class="token comment">#扩容或者缩容 deployment replicaset replication controller 等</span>
kubectl autoscale <span class="token comment">#自动设置在 k8s 系统中运行的 pod 数量（水平自动伸缩）</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>Cluster Manager Commands 集群管理命令</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl cetificate <span class="token comment"># 修改证书资源对象</span>
kubectl cluster-info <span class="token comment"># 查看集群信息</span>
kubectl <span class="token function">top</span> <span class="token comment"># 显示资源 cpu 内存 存储使用情况</span>
kubectl cordon <span class="token comment"># 标记节点为不可调度</span>
kubectl uncordon <span class="token comment"># 指定节点为可调度</span>
kubectl drain <span class="token comment"># 安全的驱逐节点的所有 pod</span>
kubectl taint  <span class="token comment"># 将一个或多个节点设置为污点</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>Troubleshooting and Debugging Commands 故障排查和调试命令</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl describe <span class="token comment"># 显示一个或多个资源对象的详细信息</span>
kubectl logs <span class="token comment"># 输出 pod 资源对象中一个容器的日志</span>
kubectl attach <span class="token comment"># 连接到一个运行的容器</span>
kubectl <span class="token builtin class-name">exec</span>  <span class="token comment"># 在指定容器内执行命令</span>
kubectl port-forward <span class="token comment"># 将本机指定端口映射到 pod 资源对象的端口</span>
kubectl proxy  <span class="token comment"># 将本机指定端口映射到 kube-apiserver</span>
kubectl <span class="token function">cp</span>  <span class="token comment"># 用于 pod 与主机交换文件</span>
kubectl auth  <span class="token comment">#检查验证</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>Advanced Commands 高级命令</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token function">diff</span> <span class="token comment"># 对比本地 json/yaml 文件与 kube-apiserver 中运行的配置文件是否有差异</span>
kubectl apply  <span class="token comment"># 通过 json/yaml 文件 标准输入对资源进行配置更新或者创建</span>
kubectl patch <span class="token comment"># 通过 patch 方式修改资源对象字段（补丁式）</span>
kubectl replace  <span class="token comment">#通过 json/yaml 文件或者标准输入来替换资源对象</span>
kubectl <span class="token function">wait</span>  <span class="token comment"># 在一个或者多个资源上等待条件达成</span>
kubectl convert <span class="token comment"># 转换 json/yaml 文件为不同的资源版本</span>
kubectl kustomize  <span class="token comment"># 定制 kubernetes 配置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>Settings Commands 设置命令</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl label <span class="token comment"># 增删改资源的标签</span>
kubectl annotate <span class="token comment"># 更新一个或者多个资源对象的注释（annotaion）信息</span>
kubectl completion <span class="token comment"># 命令自动补全</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>Other Commands 其他命令</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl config <span class="token comment"># 管理 kubeconfig 配置文件</span>
kubectl plugin <span class="token comment"># 运行命令行插件功能</span>
kubectl version <span class="token comment"># 查看客户端服务端的系统版本信息</span>
kubectl api-versions <span class="token comment"># 列出当前 kubernetes 系统支持的资源组和资源版本表现形式为/</span>
kubectl api-resources <span class="token comment"># 列出当前 kubernetes 系统支持的 resource 资源列表</span>
kubectl options  <span class="token comment"># 查看支持的参数列表</span>
kubectl get pod <span class="token parameter variable">-w</span>
<span class="token function">watch</span> <span class="token parameter variable">-n</span> <span class="token number">1</span> kubectl get pod
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h4 id="_6-kubectl-cheatsheet" tabindex="-1"><a class="header-anchor" href="#_6-kubectl-cheatsheet" aria-hidden="true">#</a> <strong>6. kubectl cheatsheet</strong></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>https://kubernetes.io/docs/reference/kubectl/cheatsheet/
k get pod <span class="token parameter variable">-w</span> <span class="token function">watch</span> <span class="token parameter variable">-n</span> <span class="token number">1</span> kubectl get pod
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,37),i=[t];function c(o,r){return n(),s("div",null,i)}const d=e(l,[["render",c],["__file","k8s-04-Kubectl核心使用.html.vue"]]);export{d as default};
