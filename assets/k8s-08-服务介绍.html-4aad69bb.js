import{_ as n,o as s,c as a,a as e}from"./app-999de8cb.js";const t={},l=e(`<h1 id="_08-服务介绍" tabindex="-1"><a class="header-anchor" href="#_08-服务介绍" aria-hidden="true">#</a> 08 服务介绍</h1><blockquote><p>Service 将运行在一组 Pods 上的应用程序公开为网络服务的抽象方法。使用 Kubernetes，你无需修改应用程序即可使用不熟悉的服务发现机制。 Kubernetes 为Pods 提供自己的 IP 地址，并为一组 Pod 提供相同的 DNS 名， 并且可以在它们之间进行负载均衡。Kubernetes Service 定义了这样一种抽象：逻辑上的一组 Pod，一种可以访问它们的策略 — — 通常称为微服务。 Service 所针对的 Pods 集合通常是通过选择算符来确定的。</p></blockquote><h2 id="_1-service-服务-clusterip-方式" tabindex="-1"><a class="header-anchor" href="#_1-service-服务-clusterip-方式" aria-hidden="true">#</a> <strong>1.Service 服务 ClusterIP 方式</strong></h2><h3 id="_1-创建-clusterip-服务" tabindex="-1"><a class="header-anchor" href="#_1-创建-clusterip-服务" aria-hidden="true">#</a> <strong>1.创建 ClusterIP 服务</strong></h3><p>服务的连接对所有的后端 pod 是负载均衡的，至于哪些 pod 被属于哪个服务，通过在定义服务的时候设置标签选择器；</p><p><strong>Yaml方式</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
  <span class="token key atrule">spec</span><span class="token punctuation">:</span>
    <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>1.7.9
        <span class="token key atrule">name</span><span class="token punctuation">:</span> test
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
          <span class="token key atrule">resources</span><span class="token punctuation">:</span>
            <span class="token key atrule">requests</span><span class="token punctuation">:</span>
              <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token number">0.1</span>
              <span class="token key atrule">limits</span><span class="token punctuation">:</span>
                <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token number">1</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> myngx
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">2180</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>命令行创建</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pod/deployment
kubectl expose deployment test1 –-name<span class="token operator">=</span>test2 -–port<span class="token operator">=</span><span class="token number">3280</span>
kubectl create svc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用之前的 yaml 文件创建 pod，模版中设置的标签为 app: test1，所以创建服务的 yaml（还有之前介绍的 kubectl expose 方式也可以创建服务）中也需要指定相同的标签：首先指定的资源类型为 Service，然后指定了两个端口分别：port 服务提供的端口，targetPort指定 pod 中进程监听的端口，最后指定标签选择器，相同标签的 pod 被当前服务管理；</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get svc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建完服务之后，可以发现给 kubia 分配了 CLUSTER-IP，这是一个内部 ip；至于如何测试可以使用 kubectl exec 命令远程地在一个已经存在的 pod 容器上执行任何命令；pod 名称可以随意指定三个中的任何一个，接收到 crul 命令的 pod，会转发给 Service，由 Service 来决定将请求交给哪个 pod 处理，所以可以看到多次执行，发现每次处理的 pod 都不一样；如 果 希 望 特 定 客 户 端 产 生 的 所 有 请 求 每 次 都 指 向 同 一 个 pod, 可以设置服务的sessionAffinity 属性为 ClientIP；</p><div class="language-mermaid line-numbers-mode" data-ext="mermaid"><pre class="language-mermaid"><code><span class="token keyword">stateDiagram</span>
    ServiceNameCall <span class="token arrow operator">--&gt;</span> CoreDNS
    CoreDNS <span class="token arrow operator">--&gt;</span> CLUSTER_IP<span class="token text string">(iptables)</span>
    CLUSTER_IP<span class="token text string">(iptables)</span> <span class="token arrow operator">--&gt;</span> Pod1
    CLUSTER_IP<span class="token text string">(iptables)</span> <span class="token arrow operator">--&gt;</span> Pod2
    CLUSTER_IP<span class="token text string">(iptables)</span> <span class="token arrow operator">--&gt;</span> Pod3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><ol><li>通过ServiceName访问</li><li>CoreDNS解析ServiceName，返回ClusterIP</li><li>ClusterIP根据机器上iptables配置，转发到指定Pod</li></ol></blockquote><h3 id="_2-测试-service-的服务发现" tabindex="-1"><a class="header-anchor" href="#_2-测试-service-的服务发现" aria-hidden="true">#</a> <strong>2.测试 Service 的服务发现</strong></h3><p><strong>Service、EndPoint、Pod之间的关系</strong></p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span><span class="token punctuation">&gt;</span></span>
   	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span><span class="token punctuation">&gt;</span></span>
     	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span> <span class="token attr-name">colspan</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span>3</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">text-align</span><span class="token punctuation">:</span>center</span><span class="token punctuation">&quot;</span></span></span><span class="token punctuation">&gt;</span></span>Service: Nginx-Service spac.selector: app=nginx<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>th</span><span class="token punctuation">&gt;</span></span>
  	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">&gt;</span></span>
   	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span><span class="token punctuation">&gt;</span></span>
     	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span> <span class="token attr-name">colspan</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span>3</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">text-align</span><span class="token punctuation">:</span>center</span><span class="token punctuation">&quot;</span></span></span><span class="token punctuation">&gt;</span></span>EndPoint:Nginx-Service (PodIP:Port, PodIP:Port, PodIP:Port) <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>th</span><span class="token punctuation">&gt;</span></span>
  	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">&gt;</span></span>
  	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span><span class="token punctuation">&gt;</span></span>
  		<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">&gt;</span></span>Nginx Pod labels: app=nginx<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>th</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">&gt;</span></span>Nginx Pod labels: app=nginx<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>th</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">&gt;</span></span>Nginx Pod labels: app=nginx<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>th</span><span class="token punctuation">&gt;</span></span>
  	<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果使用 ipvs，当你创建 Service 的时候，kube-proxy 会获取 Service 对应的 Endpoint，调用 LVS 帮我们实现负载均衡的功能。</p><p>通过删除和增加 Pod 观看服务发现的作用</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> pod-name -- <span class="token function">sh</span>
<span class="token builtin class-name">echo</span> <span class="token number">111</span> <span class="token operator">&gt;</span> /usr/share/nginx/html/index.html
<span class="token builtin class-name">echo</span> <span class="token number">22</span><span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span> /usr/share/nginx/html/index.html
<span class="token builtin class-name">echo</span> <span class="token number">333</span> <span class="token operator">&gt;</span> /usr/share/nginx/html/index.html
<span class="token function">cat</span> /usr/share/nginx/html/index.html
<span class="token function">curl</span> serviceIP:port
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-headless-service-clusterip" tabindex="-1"><a class="header-anchor" href="#_3-headless-service-clusterip" aria-hidden="true">#</a> <strong>3.Headless service clusterIP</strong></h3><p>顾名思义，就是没头的 Service。有啥用呢？很简单，dns 查询会如实的返回 2 个真实的Endpoint,有时候 client 想自己来决定使用哪个 Real Server，可以通过查询 DNS 来获取 Real Server 的信息。Headless Service 的对应的每一个 Endpoints，即每一个 Pod，都会有对应的 DNS 域名；这样 Pod 之间就可以互相访问。</p><blockquote><ol><li>通过无头的ServiceName访问</li><li>由于没有ClusterIP，也就无法指定转发规则（iptables）和负载均衡（loadbalance）</li><li>因此只能返回所有的待转发对象（Pod）的请求方式</li><li>命名规则\${podName}.\${headlessServiceName}.\${nameSpace}.\${clusterDomainname}，一般指定到headlessServiceName</li></ol></blockquote><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> web
    <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
    <span class="token key atrule">selector</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> web
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx&quot;</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
    <span class="token key atrule">template</span><span class="token punctuation">:</span>
      <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
        <span class="token key atrule">labels</span><span class="token punctuation">:</span>
          <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
      <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span><span class="token number">1.9</span>
      <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-同一个-deployment-暴露多次显示多个服务名称" tabindex="-1"><a class="header-anchor" href="#_4-同一个-deployment-暴露多次显示多个服务名称" aria-hidden="true">#</a> <strong>4.同一个 deployment 暴露多次显示多个服务名称</strong></h3><p>如果 pod 监听了两个或者多个端口，那么服务同样可以暴露多个端口</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
   <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>1.7.9
        <span class="token key atrule">name</span><span class="token punctuation">:</span> test
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 10m
          <span class="token key atrule">limits</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> myngx
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">2180</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> myngx1
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3180</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-使用命名的端口" tabindex="-1"><a class="header-anchor" href="#_5-使用命名的端口" aria-hidden="true">#</a> <strong>5.使用命名的端口</strong></h3><p>在 Service 中指定了端口为 8080，如果目标端口变了这里也需要改变，可以在定义 pod 的模版中给端口命名，在 Service 中可以直接指定名称:</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
  <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>1.7.9
        <span class="token key atrule">name</span><span class="token punctuation">:</span> test
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http
          <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token number">0.1</span>
          <span class="token key atrule">limits</span><span class="token punctuation">:</span>
            <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token number">1</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> myngx<span class="token punctuation">-</span>http
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">2180</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> http
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> test1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>targetPort 直接使用了名称 http</p><h3 id="_6-服务注册和域名发现-–-coredns" tabindex="-1"><a class="header-anchor" href="#_6-服务注册和域名发现-–-coredns" aria-hidden="true">#</a> <strong>6.服务注册和域名发现 – CoreDNS</strong></h3><p><strong>服务注册</strong></p><p>创建服务时，增加相应的 key/value 进入 etcd.</p><p>Servicename:clusterip through API-server.</p><p>Deployment</p><p>Service domain name</p><p>myngx.default.svc.cluster.local FQDN</p><p><strong>服务发现</strong></p><ol><li>Coredns</li><li>Host – dns configuration</li></ol><p>服务给我们提供了一个单一不变的 ip 去访问 pod，那是否每次都要先创建服务，然后找到服务的 CLUSTER-IP，再给其他 pod 去使用；这样就太麻烦了，Kubernets 还提供了其他方式去访问服务；</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl run <span class="token function">curl</span> <span class="token parameter variable">--image</span><span class="token operator">=</span>radial/busyboxplus:curl <span class="token parameter variable">-it</span> -- <span class="token function">sh</span>

<span class="token function">nslookup</span> my-nginx：
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="通过环境变量发现服务" tabindex="-1"><a class="header-anchor" href="#通过环境变量发现服务" aria-hidden="true">#</a> <strong>通过环境变量发现服务</strong></h4><p>在 pod 开始运行的时候，Kubernets 会初始化一系列的环境变量指向现在存在的服务；如果创建的服务早于客户端 pod 的创建，pod 上的进程可以根据环境变量获得服务的 IP 地址和端口号；</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> test1-7b544844bb-5zxxx <span class="token parameter variable">--env</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Service 还没创建，所有没有这个服务的环境变量，即使创建后也不会有 test2 服务的环境变量。</p><p>Service创建后，如果删除 pod 重新创建新的 pod，这样服务就在创建 pod 之前了，再次获取环境变量可以发现KUBIA_SERVICE_HOST 和 KUBIA_SERVICE_PORT，分别代表了 test2 服务的 IP 地址和端口号；这样就可以通过环境变量去获取 IP 和端口了</p><h4 id="dns-域名解析过程" tabindex="-1"><a class="header-anchor" href="#dns-域名解析过程" aria-hidden="true">#</a> DNS 域名解析过程</h4><p>作为服务发现机制的基本功能，在集群内需要能够通过服务名对服务进行访问，这就需要一个集群范围内的 DNS 服务来完成从服务名到 ClusterIP 的解析。</p><p>从 Kubernetes 1.11 版本开始，Kubernetes 集群的 DNS 服务由 CoreDNS 提供。CoreDNS 是 CNCF 基金会的一个项目，是用 Go 语言实现的高性能、插件式、易扩展的 DNS服务端。CoreDNS 解决了 KubeDNS 的一些问题，例如 dnsmasq 的安全漏洞、externalName 不能使用 stubDomains 设置，等等。</p><p>CoreDNS 支持自定义 DNS 记录及配置 upstream DNS Server，可以统一管理 Kubernetes 基于服务的内部 DNS 和数据中心的物理 DNS。</p><p>CoreDNS 没有使用多个容器的架构，只用一个容器便实现了 KubeDNS 内 3 个容器的全部功能。</p><p>CoreDNS 的总体架构:</p><div class="language-mermaid line-numbers-mode" data-ext="mermaid"><pre class="language-mermaid"><code><span class="token keyword">stateDiagram</span>
    cornpod <span class="token arrow operator">--&gt;</span> KubernetesMaster<span class="token operator">:</span> 获取服务信息建立DNS记录
    cornpod <span class="token arrow operator">--&gt;</span> Pod<span class="token operator">:</span> 返回服务Ip
    <span class="token keyword">state</span> CornDNSPod <span class="token punctuation">{</span>
    	cornpod
    <span class="token punctuation">}</span>
    Pod <span class="token arrow operator">--&gt;</span> cornpod<span class="token operator">:</span> 查询服务服务名，例如serviceName.ns.svc.cluster.local
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>当一个service创建之后，在etcd 中，注册servicename：Servicename:clusterip等信息， 然后CoreDns 会在kubernets master 中订阅服务，进行watch list。</p><p>当ervice创建之后，kubernetes master通知 CoreDns，建立DNS关系。</p><p>Pod会从conredns中查询service，例如：servicename.ns1.svc.cluster.local，找到映射的ip，如：169.169.58.168</p></blockquote><h4 id="servicename的dns解析举例" tabindex="-1"><a class="header-anchor" href="#servicename的dns解析举例" aria-hidden="true">#</a> ServiceName的DNS解析举例</h4><p>在centos下，安装必要功能</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yum -y install bind-utils
kubectl run c5 -it --image=registry.cn-hangzhou.aliyuncs.com/liuyik8s/centos:dns – sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来使用一个带有 nslookup 工具的 Pod 来验证 DNS 服务能否正常工作：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl run curl --image=radial/busyboxplus:curl -i
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后，按回车并执行nslookup kubernets 命令，查看kubernetes集群服务情况</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nslookup kubernetes
Server: 10.20.0.10
Address 1: 10.20.0.10 kube-dns.kube-system.svc.cluster.local
Name: kubernetes
Address 1: 10.20.0.1 kubernetes.default.svc.cluster.local
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，通过 DNS 服务器，成功找到了 test1 服务的 IP 地址：10.20.45.33。</p><h4 id="查找同命名空间的服务" tabindex="-1"><a class="header-anchor" href="#查找同命名空间的服务" aria-hidden="true">#</a> <strong>查找同命名空间的服务</strong></h4><p>如果某个 Service 属于不同的命名空间，那么在进行 Service 查找时，需要补充 Namespace 的名称，组合成完整的域名。下面以查找 kube-dns 服务为例，将其所在的 Namespace“kube-system”补充在服务名之后，用“.”连接为“kube-dns.kube-system”，即可查询成功：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nslookup kube-dns.kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果仅使用“kube-dns”进行查找，则会失败：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nslookup kube-dns
Server: 10.96.0.10
Address: 10.96.0.10#53
** server can&#39;t find kube-dns: NXDOMAIN
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="域名解析过程分析" tabindex="-1"><a class="header-anchor" href="#域名解析过程分析" aria-hidden="true">#</a> 域名解析过程分析</h4><h5 id="resolv-conf-文件分析" tabindex="-1"><a class="header-anchor" href="#resolv-conf-文件分析" aria-hidden="true">#</a> resolv.conf 文件分析</h5><p>部署 pod 的时候，如果用的是 K8s 集群的 DNS，那么 kubelet 在起 pause 容器的时候， 会将其 DNS 解析配置初始化成集群内的配置。</p><p>比如刚才创建了一个叫 pod1 的 pod，它的 resolv.conf 文件如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl exec -it pod1 -- sh 
/ # cat /etc/resolv.conf 
nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local 
options ndots:5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在集群中 pod 之间互相用 svc name 访问的时候，会根据 resolv.conf 文件的 DNS 配置 来解析域名，下面来分析具体的过程。</p><p>pod 的 resolv.conf 文件主要有三个部分，分别为 nameserver、search 和 option。</p><p>而这三 个部分可以由 K8s 指定，也可以通过 pod.spec.dnsConfig 字段自定义。</p><ul><li><p><strong>nameserver</strong></p><p>resolv.conf 文件的第一行 nameserver 指定的是 DNS 服务的 IP，这里就是 coreDNS 的 clusterIP</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl get services -n kube-system -o wide
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) 
AGE SELECTOR
kube-dns ClusterIP 10.96.0.10 &lt;none&gt; 53/UDP,53/TCP,9153/TCP 24h 
k8s-app=kube-dns
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说所有域名的解析，都要经过 coreDNS 的虚拟 IP 10.96.0.10 进行解析，不论是 Kubernetes 内部域名还是外部的域名。</p></li><li><p><strong>search 域</strong></p><p>resolv.conf 文件的第二行指定的是 DNS search 域。解析域名的时候，将要访问的域名依次 带入 search 域，进行 DNS 查询。</p><p>比如我要在刚才那个 pod 中访问一个域名为 dnsutils 的服务，其进行的 DNS 域名查询的 顺序是： dnsutils.default.svc.cluster.local -&gt; dnsutils.svc.cluster.local -&gt; dnsutils.cluster.local 直到查到为止</p></li><li><p><strong>options</strong> resolv.conf 文件的第三行指定的是其他项，最常见的是 dnots。dnots 指的是如果查询的域 名包含的点 “.” 小于 5，则先走 search域，再用绝对域名；如果查询的域名包含点数大于 或等于 5，则先用绝对域名，再走 search 域。 K8s 中默认的配置是 5。 也就是说，如果我访问的是 a.b.c.e.f.g ，那么域名查找的顺序如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>a.b.c.e.f.g. -&gt; a.b.c.e.f.g.default.svc.cluster.local -&gt; a.b.c.e.f.g.svc.cluster.local -&gt;  a.b.c.e.f.g.cluster.local
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果我访问的是 a.b.c.e，那么域名查找的顺序如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>a.b.c.e.default.svc.cluster.local -&gt; a.b.c.e.svc.cluster.local -&gt; a.b.c.e.cluster.local -&gt; a.b.c.e
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><h4 id="查看-coredns-信息" tabindex="-1"><a class="header-anchor" href="#查看-coredns-信息" aria-hidden="true">#</a> 查看 CoreDNS 信息</h4><p>k8s 的 v1.20.5 版本在集群启动时，已经启动了 coreDNS 域名服务。</p><p>在部署 CoreDNS 应用前，至少需要创建一个 ConfigMap、一个 Deployment 和一个 Service 共 3 个资源对象。ConfigMap“coredns”主要设置 CoreDNS 的主配置文件 Corefile 的内容， 其中可以定义各种域名的解析方式和使用的插件。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get configmap <span class="token parameter variable">-n</span> kube-system

kubectl edit configmap coredns <span class="token parameter variable">-n</span> kube-system 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中，各插件说明：</p><ol><li><p>errors：错误信息到标准输出。</p></li><li><p>health：CoreDNS 自身健康状态报告，默认监听端口 8080，一般用来做健康检查。您可以通 过 http://localhost:8080/health 获取健康状态。</p></li><li><p>ready：CoreDNS 插件状态报告，默认监听端口 8181，一般用来做可读性检查。可以通过 http://localhost:8181/ready 获取可读状态。当所有插件都运行后，ready 状态为 200。</p></li><li><p>kubernetes：CoreDNS kubernetes 插件，提供集群内服务解析能力。</p></li><li><p>prometheus：CoreDNS 自身 metrics 数据接口。可以通过http://localhost:9153/metrics 获取 prometheus 格式的监控数据。 forward（或 proxy）：将域名查询请求转到预定义的 DNS 服务器。默认配置中，当域名不在 kubernetes 域时，将请求转发到预定义的解析器（/etc/resolv.conf）中。默认使用宿主机的 /etc/resolv.conf 配置。</p></li><li><p>cache：DNS 缓存。</p></li><li><p>loop：环路检测，如果检测到环路，则停止 CoreDNS。</p></li><li><p>reload：允许自动重新加载已更改的 Corefile。编辑 ConfigMap 配置后，请等待两分钟以使 更改生效。</p></li><li><p>loadbalance：循环 DNS 负载均衡器，可以在答案中随机 A、AAAA、MX 记录的顺序。 在下面的示例中为域名“ cluster.local ”设置了一系列插件，包括 errors 、health、kubernetes、 prometheus、forward、cache、loop、reload 和 loadbalance，在进行域名解析时，这些插件 将以从上到下的顺序依次执行。 另外，etcd 和 hosts 插件都可以用于用户自定义域名记录。 下面是使用 etcd 插件的配置示例，将以“.com”结尾的域名记录配置为从 etcd 中获取，并将 域名记录保存在/skydns 路径下</p></li></ol><h4 id="pod级别dns配置说明" tabindex="-1"><a class="header-anchor" href="#pod级别dns配置说明" aria-hidden="true">#</a> Pod级别DNS配置说明</h4><p>除了使用集群范围的 DNS 服务（如 CoreDNS），在 Pod 级别也能设置 DNS 的相关策略和配 置。在 Pod 的 YAML 配置文件中通过 spec.dnsPolicy 字段设置 DNS 策略，例如：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">namespace</span><span class="token punctuation">:</span> default
 <span class="token key atrule">name</span><span class="token punctuation">:</span> dns<span class="token punctuation">-</span>example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
 <span class="token key atrule">containers</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> test
 <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
 <span class="token key atrule">dnsPolicy</span><span class="token punctuation">:</span> <span class="token string">&quot;Default&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>目前可以设置的 DNS 策略如下。</p><ul><li>Default：继承 Pod 所在宿主机的 DNS 设置。</li><li>ClusterFirst：优先使用 Kubernetes 环境的 DNS 服务（如 CoreDNS 提供的域名解析服务）， 将无法解析的域名转发到从宿主机继承的 DNS 服务器。</li><li>ClusterFirstWithHostNet：与 ClusterFirst 相同，对于以 hostNetwork 模式运行的 Pod，应 明确指定使用该策略。</li><li>None：忽略 Kubernetes 环境的 DNS 配置，通过 spec.dnsConfig 自定义 DNS 配置。这个 选项从 Kubernetes 1.9 版本开始引入，到 Kubernetes 1.10 版本升级为 Beta 版，到 Kubernetes 1.14 版本升级为稳定版。</li></ul><p>以下面的 dnsConfig 为例：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">namespace</span><span class="token punctuation">:</span> default
 <span class="token key atrule">name</span><span class="token punctuation">:</span> dns<span class="token punctuation">-</span>example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
 <span class="token key atrule">containers</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> test
 <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
 <span class="token key atrule">dnsPolicy</span><span class="token punctuation">:</span> <span class="token string">&quot;None&quot;</span>
 <span class="token key atrule">dnsConfig</span><span class="token punctuation">:</span>
 <span class="token key atrule">nameservers</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> 1.2.3.4
 <span class="token key atrule">searches</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> ns1.svc.cluster.local
 <span class="token punctuation">-</span> my.dns.search.suffix
 <span class="token key atrule">options</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ndots
   <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;2&quot;</span>
 <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> edns0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-kubernetes-负载均衡的实现" tabindex="-1"><a class="header-anchor" href="#_7-kubernetes-负载均衡的实现" aria-hidden="true">#</a> 7.<strong>Kubernetes 负载均衡的实现</strong></h3><p>Clusterip – podIP 对应表。</p><p>Kube-proxy – from etcd 1:1 1:m</p><p>kube-proxy 的 Service 的 iptables 模式与 IPVS 模式的对比</p><p>IPTABLES 模式实现原理</p><p>IPVS 模式实现原理：主流的方式</p><p>ip addr</p><p>而接下来，kube-proxy 就会通过 Linux 的 IPVS 模块，为这个 IP 地址设置三个 IPVS 虚拟主机，并设置这三个虚拟主机之间使用轮询模式 (rr) 来作为负载均衡策略。我们可以通过 ipvsadm 查看到这个设置，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl get svc
ipvsadm -ln |grep 10.20.207.99 -C5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，这三个 IPVS 虚拟主机的 IP 地址和端口，对应的正是三个被代理的 Pod。这时候，任何发往 10.102.128.4:80 的请求，就都会被 IPVS 模块转发到某一个后端 Pod 上了。而相比于 iptables，IPVS 在内核中的实现其实也是基于 Netfilter 的 NAT 模式，所以在转发这一层上，理论上 IPVS 并没有显著的性能提升。但是，IPVS 并不需要在宿主机上为每个 Pod 设置 iptables 规则，而是把对这些“规则”的处理放到了内核态，从而极大地降低了维护这些规则的代价。</p><p>不过需要注意的是，IPVS 模块只负责上述的负载均衡和代理功能。而一个完整的 Service 流程正常工作所需要的包过滤、SNAT 等操作，还是要靠 iptables 来实现。只不过，这些辅助性的 iptables 规则数量有限，也不会随着 Pod 数量的增加而增加。</p><p>在大规模集群里，建议 kube-proxy 设置–proxy-mode=ipvs 来开启这个功能。它为Kubernetes 集群规模带来的提升，还是非常巨大的。</p><p>Service 与 DNS 的关系。在 Kubernetes 中，Service 和 Pod 都会被分配对应的 DNS A 记录（从域名解析 IP 的记录）。对于 ClusterIP 模式的 Service 来说，它的 A 记录的格式是：<code>..svc.cluster.local</code>。当你访问这条 A 记录的时候，它解析到的就是该 Service 的 VIP 地址。而对于指定了 clusterIP=None 的 Headless Service 来说，它的 A 记录的格式也是：<code>..svc.cluster.local</code>。但是，当你访问这条 A 记录的时候，它返回的是所有被代理的 Pod 的 IP 地址的集合。当然，如果你的客户端没办法解析这个集合的话，它可能会只会拿到第一个 Pod 的 IP 地址。</p><h2 id="_2-服务暴露-nodeport-方式" tabindex="-1"><a class="header-anchor" href="#_2-服务暴露-nodeport-方式" aria-hidden="true">#</a> <strong>2.服务暴露 NodePort 方式</strong></h2><h3 id="_1-三种地址和端口" tabindex="-1"><a class="header-anchor" href="#_1-三种地址和端口" aria-hidden="true">#</a> <strong>1.三种地址和端口</strong></h3><p><strong>具体的 pod</strong></p><ul><li><p>targetPort : PodIP - container port</p><p>The port on the pod that the service should proxy traffic to.targetPort 很好理解，<strong>targetPort 是 pod 上的端口</strong>，从 port 和 nodePort 上到来的数据最终经过 kube-proxy 流入到后端 pod 的 targetPort 上进入容器。PodIP:<strong>targetPort (container’s port)</strong></p></li></ul><p><strong>具体的服务名字和 IP</strong></p><ul><li><p>Port : ServiceIP/clusterIp</p><p>The port that the service is exposed on the service’s cluster ip (virsual ip). Port is the service port which is accessed by others with cluster ip.即，这里的 port 表示：service 暴露在 cluster ip 上的端口，<strong>clusterIp:port</strong> 是提供给集群<strong>内部客户</strong>访问 service 的入口。</p></li></ul><p><strong>对应的宿主机-物理机或者虚拟机</strong></p><ul><li><p>NodePort : NodeIP</p><p>On top of having a cluster-internal IP, expose the service on a port on each node of the cluster (the same port on each node). You&#39;ll be able to contact the service on any<strong>nodeIP:nodePort</strong>address. So nodePort is alse the service port which can be accessed by the node ip by others with external ip.首先，nodePort 是 kubernetes 提供给集群外部客户访问 service 入口的一种方式（另一种方式是 LoadBalancer），所以，<strong>nodeIP:nodePort</strong> 是<strong>提供给集群外****部客户访问</strong> service 的入口。考虑到安全因素，这个方法不被推荐。相当于后门。</p></li></ul><blockquote><p><strong>port、nodePort 总结</strong></p><p>总的来说，port 和 nodePort 都是 service 的端口，前者暴露给集群内客户访问服务，后者暴露给集群外客户访问服务。从这两个端口到来的数据都需要经过反向代理 kubeproxy 流入后端 pod 的 target Pod，从而到达 pod 上的容器内</p></blockquote><h3 id="_2-nodeport-类型的服务" tabindex="-1"><a class="header-anchor" href="#_2-nodeport-类型的服务" aria-hidden="true">#</a> <strong>2.NodePort 类型的服务</strong></h3><p>创建一个服务并将其类型设置为 NodePort，通过创建 NodePort 服务，可以让 kubernetes在其所有节点上保留一个端口（所有节点上都使用相同的端口号），然后将传入的连接转发给 pod；</p><p>Deployment and Service</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: test1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test1
  template:
    metadata:
      labels:
        app: test1
  spec:
    containers:
    - image: nginx:1.7.9
      name: test
      ports:
      - containerPort: 80
    resources:
      requests:
        cpu: 0.1
        limits:
          cpu: 1
---
apiVersion: v1
kind: Service
metadata:
  name: test1
spec:
  ports:
  - name: myngx
    port: 2180
    targetPort: 80
    nodePort: 32187
  selector:
    app: test1
  type: NodePort
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>指定服务类型为 NodePort，节点端口为 32187；</p><p>使用 nodeport 方式访问在 cluster 外部访问http://192.168.56.5:32187</p><h3 id="_3-loadbalance-类型服务" tabindex="-1"><a class="header-anchor" href="#_3-loadbalance-类型服务" aria-hidden="true">#</a> <strong>3.LoadBalance 类型服务</strong></h3><p>相比 NodePort 方式可以通过任何节点的 30312 端口访问内部的 pod，LoadBalancer 方式拥有自己独一无二的可公开访问的 IP 地址；LoadBalance 其实是 NodePort 的一种扩展，使得服务可以通过一个专用的负载均衡器来访问</p><h4 id="_1-metalb-负载均衡" tabindex="-1"><a class="header-anchor" href="#_1-metalb-负载均衡" aria-hidden="true">#</a> <strong>1.MetaLb 负载均衡</strong></h4><p>Kubernetes 没 有 为 裸 机 集 群 提 供 网 络 负 载 平 衡 器 的 实 现 （ svc 类 型 为loadbalance）,Kubernetes 附带的 Network LB 的实现都是调用各种 IaaS 平台（GCP，AWS，Azure 等）的粘合代码。如果未在受支持的 IaaS 平台（GCP，AWS，Azure 等）上运行，则 LoadBalancers 在创建时将无限期保持 pending 状态metalb 解决了这种问题，使得裸机集群也能使用 svc 类型为 loadbalancer。</p><p>MetaLB 是搭建私有 Kubernet 集群负载均衡的利器，可以提供 Layer 2 mode 和 BGP 模式的负载均衡。</p><p>Layer 2 模式下，每个 Service 会有集群中的一个 Node 来负责。服务的入口流量全部经由单个节点，然后该节点的 Kube-Proxy 会把流量再转发给服务的 Pods。也就是说，该模式下 MetalLB 并没有真正提供负载均衡器。尽管如此，MetalLB 提供了故障转移功能，如果持有 IP 的节点出现故障，则默认 10 秒后即发生故障转移，IP 会被分配给其它健康的节点。</p><p><strong>优点：</strong></p><p>是它的通用性：它可以在任何以太网网络上运行，不需要特殊的硬件。</p><p><strong>缺点：</strong></p><p>Layer 2 模式下存在单节点瓶颈，服务所有流量都经过一个 Node 节点。这意味着服务的入口带宽被限制为单个节点的带宽。由于 Layer 2 模式需要 ARP/NDP 客户端配合，当故障转移发生时，MetalLB 会发送 ARP 包来宣告 MAC 地址和 IP 映射关系的变化，地址分配略为繁琐。</p><p>创建 kubernets 域名空间</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Namespace
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> metallb<span class="token punctuation">-</span>system
 <span class="token key atrule">labels</span><span class="token punctuation">:</span>
 	<span class="token key atrule">app</span><span class="token punctuation">:</span> metallb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装 MeltLb 负载均衡</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl create ns metallb-system

<span class="token function">wget</span> https://raw.githubusercontent.com/google/metallb/v0.8.3/manifests/metallb.yaml
kubectl apply <span class="token parameter variable">-f</span> metallb.yaml

kubectl create <span class="token parameter variable">-f</span> cm.yaml

kubectl create secret generic <span class="token parameter variable">-n</span> metallb-system memberlist --from-literal<span class="token operator">=</span>secretkey<span class="token operator">=</span><span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span>openssl rand <span class="token parameter variable">-base64</span> <span class="token number">128</span><span class="token variable">)</span></span>&quot;</span>

<span class="token comment"># 查看 kubernets 集群 Node 主机 IP</span>
kubectl get <span class="token function">node</span> <span class="token parameter variable">-o</span> wide
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>负载均衡可以 IP 地址范围取 node 集群 IP 的前三位 IP 地址，第四位设置负责均衡付给 kubernets 集群中应用的可用范围</p><p>设置 MetLab 配置信息<strong>Layer 2</strong> <strong>模式负载均衡配置</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># cm.yaml</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> metallb<span class="token punctuation">-</span>system
  <span class="token key atrule">name</span><span class="token punctuation">:</span> config
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
 	address-pools:
 	- name: default
 	  protocol: layer2
 	addresses:
 	- 192.168.56.253-192.168.56.254</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>bgp</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># cm.yaml</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> metallb<span class="token punctuation">-</span>system
  <span class="token key atrule">name</span><span class="token punctuation">:</span> config
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
    peers:
    - peer-address: 10.0.0.1
      peer-asn: 64501
      my-asn: 64500
    address-pools:
    - name: default
      protocol: bgp
      addresses:
      - 192.168.10.0/24</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>如何访问</strong></p><p>所以可以发现同样能通过使用 NodePort 的方式来访问服务（节点 IP+节点端口）；同时也可以通过 EXTERNAL-IP 来访问</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>External-IP add:port. Same with clusterIP
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>备注：metallb 只负责进行 arp 地址解析及对外发布。不负责数据转发。下面是两个 pod 的 logs</p></blockquote><h4 id="_2-部署-loadbalancer-服务" tabindex="-1"><a class="header-anchor" href="#_2-部署-loadbalancer-服务" aria-hidden="true">#</a> <strong>2.部署 loadbalancer 服务</strong></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl edit svc test1

<span class="token comment"># type. NodePort --&gt; LoadBalancer</span>
kubectl get svc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到虽然我们没有指定节点端口，但是创建完之后自动启动了 32187 节点端口http://192.168.56.252:2180/</p><h2 id="_3-防止不必要的网络跳数" tabindex="-1"><a class="header-anchor" href="#_3-防止不必要的网络跳数" aria-hidden="true">#</a> <strong>3.防止不必要的网络跳数</strong></h2><p>当外部客户端通过节点端口连接到服务时，随机选择的 pod 并不一定在接收连接的同一节点上运行；可以通过将服务配置为仅将外部通信重定向到接收连接的节点上运行的 pod 来阻止此额外跳数；</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> kubia<span class="token punctuation">-</span>nodeport<span class="token punctuation">-</span>onlylocal
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
 <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort
 <span class="token key atrule">externalTrafficPolicy</span><span class="token punctuation">:</span> Local
 <span class="token key atrule">ports</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
 	 <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
 	 <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">30124</span>
 <span class="token key atrule">selector</span><span class="token punctuation">:</span>
   <span class="token key atrule">app</span><span class="token punctuation">:</span> kubia
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过在服务的 spec 部分中设置 externalTrafficPolicy 字段来完成；</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl explain service.spec.externalTrafficPolicy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,149),p=[l];function i(c,o){return s(),a("div",null,p)}const u=n(t,[["render",i],["__file","k8s-08-服务介绍.html.vue"]]);export{u as default};
