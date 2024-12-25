import{_ as n,o as s,c as a,a as e}from"./app-999de8cb.js";const t={},l=e(`<h1 id="_09-k8s-ingress-and-网络" tabindex="-1"><a class="header-anchor" href="#_09-k8s-ingress-and-网络" aria-hidden="true">#</a> <strong>09.K8s Ingress and 网络</strong></h1><blockquote><p>https://github.com/kubernetes/ingress-nginx</p><p>https://kubernetes.github.io/ingress-nginx/</p></blockquote><p>Ingress将来自集群外部的 HTTP 和 HTTPS 路由暴露给集群 内的服务。流量路由由 Ingress 资源上定义的规则控制。</p><p>Ingress 可以配置为向服务提供外部可访问的 URL、负载平衡流量、终止 SSL/TLS 并提供基于名称的虚拟主机。一个入口控制器负责履行入口，通常有一个负载均衡器，虽然它也可以配置您的边缘路由器或额外的前端，以帮助处理流量。Ingress 不会公开任意端口或协议。向 Internet 公开 HTTP 和 HTTPS 以外的服务通常使用Service.Type=NodePort 或 Service.Type=LoadBalancer 类型的服务。</p><p>组成：</p><ul><li>Nginx Controller</li><li>Default-Backend</li><li>Ingress Rule</li></ul><h2 id="_1-ingress-安装" tabindex="-1"><a class="header-anchor" href="#_1-ingress-安装" aria-hidden="true">#</a> <strong>1.Ingress 安装</strong></h2><h3 id="_1-ingress-控制器" tabindex="-1"><a class="header-anchor" href="#_1-ingress-控制器" aria-hidden="true">#</a> <strong>1 Ingress 控制器</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.1/deploy/static/provider/cloud/deploy.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-ingress-rule-资源" tabindex="-1"><a class="header-anchor" href="#_2-ingress-rule-资源" aria-hidden="true">#</a> <strong>2 Ingress rule 资源</strong></h3><p>Ingress 控制器启动之后，就可以创建 Ingress 资源了</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test2
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ingressClassName</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> test2.bar.com
      <span class="token key atrule">http</span><span class="token punctuation">:</span>
        <span class="token key atrule">paths</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> test2
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2280</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>对应的业务部署：</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test2
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> test2
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> test2
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
        <span class="token key atrule">name</span><span class="token punctuation">:</span> test
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test2
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> myngx2
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">2280</span>
  <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
  <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">32287</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> test2
  <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>指定资源类型为 Ingress，定一个单一规则，所有发送 test2.bar.com 的请求都会被转发给端口为 80 的 nodeport 服务上；</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl get svc
kubectl get svc -n ingress-nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>修改域名解析地址</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/etc/hosts
192.168.56.5 test2.bar.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>大致请求流程如下：浏览器中请求域名首先会查询域名服务器，然后 DNS 返回了控制器的 IP 地址；客户端向控制器发送请求并在头部指定了 test2.bar.com；然后控制器根据头部信息确定客户端需要访问哪个服务；然后通过服务关联的 Endpoint 对象查看 pod IP，并将请求转发给其中一个；</p><h3 id="_3-defaultbackend" tabindex="-1"><a class="header-anchor" href="#_3-defaultbackend" aria-hidden="true">#</a> 3.DefaultBackend</h3><p>没有 rules 的 Ingress 将所有流量发送到同一个默认后端。 defaultBackend 通常是 Ingress 控制器 的配置选项，而非在 Ingress 资源中指定。如果 hosts 或 paths 都没有与 Ingress 对象中的 HTTP 请求匹配，则流量将路由到默认后端。资源后端Resource 后端是一个 ObjectRef，指向同一名字空间中的另一个 Kubernetes，将其作为Ingress 对象。Resource 与 Service 配置是互斥的，在 二者均被设置时会无法通过合法性检查。 Resource 后端的一种常见用法是将所有入站数据导向带有静态资产的对象存储后端。</p><p><strong>Service 例子</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apiVersion: networking.k8s.io/v1
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建了如上的 Ingress 之后，你可以使用下面的命令查看它：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> kubectl describe ingress defaultbackend
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>被配置的服务没有后端。</strong></p><p>This annotation is of the form nginx.ingress.kubernetes.io/default-backend: svcName to specify a custom default backend. This svcName is a reference to a service inside of the same namespace in which you are applying this annotation. This annotation overrides the global default backend. In case the service has multiple ports, the first one is the one which will received the backend traffic.</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>echo test1.bar.com&gt;/usr/share/nginx/html/index.html

cat /usr/share/nginx/html/index.html

kubectl describe ingress defaultbackend
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>This service will be used to handle the response when the configured service(test1) in</strong> <strong>the Ingress rule does not have any active endpoints</strong></p></blockquote><h2 id="_2-ingress-使用" tabindex="-1"><a class="header-anchor" href="#_2-ingress-使用" aria-hidden="true">#</a> <strong>2.Ingress 使用</strong></h2><h3 id="_1-基于名称的虚拟托管-根据域名访问" tabindex="-1"><a class="header-anchor" href="#_1-基于名称的虚拟托管-根据域名访问" aria-hidden="true">#</a> <strong>1.基于名称的虚拟托管 -根据域名访问</strong></h3><p>基于名称的虚拟主机支持将针对多个主机名的 HTTP 流量路由到同一 IP 地址上。</p><p>以下 Ingress 让后台负载均衡器基于 host 头部字段 来路由请求。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> foo.bar.com
      <span class="token key atrule">http</span><span class="token punctuation">:</span>
        <span class="token key atrule">paths</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2180</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> bar.foo.com
      <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
          <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/&quot;</span>
          <span class="token key atrule">backend</span><span class="token punctuation">:</span>
            <span class="token key atrule">service</span><span class="token punctuation">:</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> test2
              <span class="token key atrule">port</span><span class="token punctuation">:</span>
                number<span class="token punctuation">:</span><span class="token number">2280</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你创建的 Ingress 资源没有在 rules 中定义的任何 hosts，则可以匹配指向 Ingress 控制器 IP 地址的任何网络流量，而无需基于名称的虚拟主机。</p><p>修改 test1/test2 的默认访问文件。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 修改 test1/test2 的默认访问文件。 </span>
kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> test1 – <span class="token function">sh</span>
<span class="token function">mkdir</span> /usr/share/nginx/html/test1
<span class="token builtin class-name">echo</span> test1.bar.com-test1 <span class="token operator">&gt;</span>/usr/share/nginx/html/test1/index.html
<span class="token function">cat</span> /usr/share/nginx/html/test1/index.html
<span class="token function">mkdir</span> /usr/share/nginx/html/test2
<span class="token builtin class-name">echo</span> test1.bar.com-test2 <span class="token operator">&gt;</span>/usr/share/nginx/html/test2/index.html
<span class="token function">cat</span> /usr/share/nginx/html/test2/index.html
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-简单扇出" tabindex="-1"><a class="header-anchor" href="#_2-简单扇出" aria-hidden="true">#</a> <strong>2.简单扇出</strong></h3><p>一个扇出（fanout）配置根据请求的 HTTP URI 将来自同一 IP 地址的流量路由到多个Service。 Ingress 允许你将负载均衡器的数量降至最低。例如，这样的设置：</p><p>将需要一个如下所示的 Ingress：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test11
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ingressClassName</span><span class="token punctuation">:</span> ingress1
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> test1.bar.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/test1/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2180</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/test2/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2180</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> test1 – <span class="token function">sh</span>
<span class="token function">mkdir</span> /usr/share/nginx/html/test1
<span class="token builtin class-name">echo</span> test1.bar.com-test1 <span class="token operator">&gt;</span>/usr/share/nginx/html/test1/index.html
<span class="token function">cat</span> /usr/share/nginx/html/test1/index.html
<span class="token function">mkdir</span> /usr/share/nginx/html/test2
<span class="token builtin class-name">echo</span> test1.bar.com-test2 <span class="token operator">&gt;</span>/usr/share/nginx/html/test2/index.html
<span class="token function">cat</span> /usr/share/nginx/html/test2/index.html

kubectl describe ingress test11
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-ingress-暴露多个服务" tabindex="-1"><a class="header-anchor" href="#_3-ingress-暴露多个服务" aria-hidden="true">#</a> <strong>3.Ingress 暴露多个服务</strong></h3><p>rules 和 paths 是数组，可以配置多个</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test13
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ingressClassName</span><span class="token punctuation">:</span> ingress1
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> test1.bar.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/test1/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2180</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/test2/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2180</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> test3.bar.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> test3
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2380</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>配置了多个 host 和 path，这里为了方便映射了同样服务；</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl get ingress

kubectl describe ingress test13 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-ingress-高级用法-路径重写" tabindex="-1"><a class="header-anchor" href="#_4-ingress-高级用法-路径重写" aria-hidden="true">#</a> <strong>4.Ingress 高级用法-路径重写</strong></h3><p>Ingress 定义</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">nginx.ingress.kubernetes.io/rewrite-target</span><span class="token punctuation">:</span> /$2
  <span class="token key atrule">name</span><span class="token punctuation">:</span> rewrite
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> test1.bar.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
           <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
           <span class="token key atrule">port</span><span class="token punctuation">:</span> 
             <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2180</span>
        <span class="token key atrule">path</span><span class="token punctuation">:</span> /nginx(/<span class="token punctuation">|</span>$)(.<span class="token important">*)</span>
        <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-ingress-高级-限流" tabindex="-1"><a class="header-anchor" href="#_5-ingress-高级-限流" aria-hidden="true">#</a> <strong>5.Ingress 高级-限流</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">nginx.ingress.kubernetes.io/limit-rps</span><span class="token punctuation">:</span> <span class="token string">&quot;1&quot;</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> ratelimit
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> test1.bar.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
           <span class="token key atrule">name</span><span class="token punctuation">:</span> test1
           <span class="token key atrule">port</span><span class="token punctuation">:</span> 
             <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2180</span>
        <span class="token key atrule">path</span><span class="token punctuation">:</span> /
        <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Exact
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-ingress-处理-tls-传输" tabindex="-1"><a class="header-anchor" href="#_6-ingress-处理-tls-传输" aria-hidden="true">#</a> <strong>6.Ingress 处理 TLS 传输</strong></h3><p><strong>证书准备</strong></p><p>以上介绍的消息都是基于 Http 协议，Https 协议需要配置相关证书；客户端创建到 Ingress控制器的 TLS 连接时，控制器将终止 TLS 连接；客户端与 Ingress 控制器之间是加密的，而 Ingress 控制器和 pod 之间没有加密；要使控制器可以这样，需要将证书和私钥附加到 Ingress 中；通过设定包含 TLS 私钥和证书的 Secret 来保护 Ingress。 Ingress 只支持单个 TLS 端口443，并假定 TLS 连接终止于 Ingress 节点 （与 Service 及其 Pod 之间的流量都以明文传输）。 如果 Ingress 中的 TLS 配置部分指定了不同的主机，那么它们将根据通过 SNI TLS 扩展指定的主机名 （如果 Ingress 控制器支持 SNI）在同一端口上进行复用。 TLS Secret 必须包含名为 tls.crt 和 tls.key 的键名。 这些数据包含用于 TLS 的证书和私钥</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> openssl genrsa -out tls.key 2048
 openssl req -new -x509 -key tls.key -out tls.cert -days 360 -subj /CN=test.bar.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>secret 创建</strong></p><p>生成的两个文件创建 secret</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl create secret tls tls-secret --cert=tls.cert --key=tls.key
secret/tls-secret created
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>ingress 创建</strong></p><p>现在可以更新 Ingress 对象，以便它也接收 kubia.example.com 的 HTTPS 请求；</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test2
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">tls</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">hosts</span><span class="token punctuation">:</span> 
    <span class="token punctuation">-</span> test.bar.com
    <span class="token key atrule">secretName</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>secret
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> test.bar.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> test2
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">2280</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>tls 中指定相关证书</p><p>在 Ingress 中引用此 Secret 将会告诉 Ingress 控制器使用 TLS 加密从客户端到负载均衡器的通道。 你需要确保创建的 TLS Secret 创建自包含 https-example.foo.com 的公用名称（CN）的证书。 这里的公共名称也被称为全限定域名（FQDN）。</p><blockquote><p>**说明：**注意，默认规则上无法使用 TLS，因为需要为所有可能的子域名发放证书。 因此，tls 节区的 hosts 的取值需要域 rules 节区的 host 完全匹配</p></blockquote><p><strong>可选：修改 nodeport 范围的方法。</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vi</span> /etc/kubernetes/manifests/kube-apiserver.yaml
<span class="token comment">#添加到如下位置就行了</span>
- command:
- kube-apiserver
- --service-node-port-range<span class="token operator">=</span><span class="token number">1</span>-65535
<span class="token comment">#直接删除 kube-apiserver pod 就行了 会自动重启</span>
kubectl delete pod kube-apiserver <span class="token parameter variable">-n</span> kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-ingress-nginx-的高可用" tabindex="-1"><a class="header-anchor" href="#_3-ingress-nginx-的高可用" aria-hidden="true">#</a> <strong>3. Ingress-nginx 的高可用</strong></h2><p>Ingress 控制器启动引导时使用一些适用于所有 Ingress 的负载均衡策略设置， 例如负载均衡算法、后端权重方案和其他等。 更高级的负载均衡概念（例如持久会话、动态权重）尚未通过 Ingress 公开。 你可以通过用于服务的负载均衡器来获取这些功能。值得注意的是，尽管健康检查不是通过 Ingress 直接暴露的，在 Kubernetes 中存在并行的概念，比如 就绪检查， 允许你实现相同的目的。</p><p>修改 Nginx-controller 服务类型</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl edit svc -n ingress-nginx ingress-nginx-controller

kubectl get svc -n ingress-nginx ingress-nginx-controller
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-服务网络-网络模型总结" tabindex="-1"><a class="header-anchor" href="#_4-服务网络-网络模型总结" aria-hidden="true">#</a> <strong>4.服务网络-网络模型总结</strong></h2><p><img src="https://kubenertes.oss-cn-nanjing.aliyuncs.com/Image/9.png?Expires=1685329462&amp;OSSAccessKeyId=TMP.3KhxMvYNFBPf4LZNtgmHhxpPyU4oZRXF8ckZvnizbjzvNsWAgtMQ3qjuKqqd5j8JtkFo8Cj26Bwu1MvWP958SxotVA7JzN&amp;Signature=NyedILRUa4s2oOUxZlG7V7gL0sw%3D" alt=""></p><h2 id="_5-pod-网络类型" tabindex="-1"><a class="header-anchor" href="#_5-pod-网络类型" aria-hidden="true">#</a> <strong>5.Pod 网络类型</strong></h2><p><strong>Docker network type</strong>:</p><ul><li><p>Bridge</p></li><li><p>host</p></li><li><p>none</p></li><li><p>containter</p></li></ul><p><strong>Pod network</strong> :</p><ul><li>bridge</li><li>host</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl explain pod.spec.hostNetwork
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_6-pod-网络-cni-and-flannel" tabindex="-1"><a class="header-anchor" href="#_6-pod-网络-cni-and-flannel" aria-hidden="true">#</a> <strong>6.Pod 网络-CNI and flannel</strong></h2><h3 id="_1-docker-默认的网桥-docker0" tabindex="-1"><a class="header-anchor" href="#_1-docker-默认的网桥-docker0" aria-hidden="true">#</a> <strong>1.Docker 默认的网桥 docker0</strong></h3><blockquote><p>Docker network ls</p></blockquote><h3 id="_2-网络插件-overlay-network-flannel-udp-vxlan-简介" tabindex="-1"><a class="header-anchor" href="#_2-网络插件-overlay-network-flannel-udp-vxlan-简介" aria-hidden="true">#</a> **2.网络插件, overlay network flannel（**UDP+Vxlan）简介</h3><h4 id="flannel-udp-模式" tabindex="-1"><a class="header-anchor" href="#flannel-udp-模式" aria-hidden="true">#</a> <strong>Flannel UDP 模式</strong></h4><p><img src="https://kubenertes.oss-cn-nanjing.aliyuncs.com/Image/9_01.png?Expires=1685329483&amp;OSSAccessKeyId=TMP.3KhxMvYNFBPf4LZNtgmHhxpPyU4oZRXF8ckZvnizbjzvNsWAgtMQ3qjuKqqd5j8JtkFo8Cj26Bwu1MvWP958SxotVA7JzN&amp;Signature=bAYegbHA%2B2bnVjRn9erVNyWTxm0%3D" alt=""> 第一次，用户态的容器进程发出的 IP 包经过 docker0 网桥进入内核态；第二次，IP 包根据路由表进入 TUN（flannel0）设备，从而回到用户态的 flanneld 进程；第三次，flanneld 进行 UDP 封包之后重新进入内核态，将 UDP 包通过宿主机的 eth0 发出去。此外，我们还可以看到，Flannel 进行 UDP 封装（Encapsulation）和解封装（Decapsulation)的过程，也都是在用户态完成的。在 Linux 操作系统中，上述这些上下文切换和用户态操作的代价其实是比较高的，这也正是造成 Flannel UDP 模式性能不好的主要原因。进行系统级编程的时候，有一个非常重要的优化原则，就是要减少用户态到内核态的切换次数，并且把核心的处理逻辑都放在内核态进行。</p><h4 id="flannel-vxlan-模式" tabindex="-1"><a class="header-anchor" href="#flannel-vxlan-模式" aria-hidden="true">#</a> <strong>Flannel Vxlan 模式</strong></h4><p>这也是为什么，Flannel 后来支持的 VXLAN 模式，逐渐成为了主流的容器网络方案的原因。VXLAN，即 Virtual Extensible LAN（虚拟可扩展局域网），是 Linux 内核本身就支持的一种网络虚似化技术。</p><p>VXLAN 的覆盖网络的设计思想是：在现有的三层网络之上，“覆盖”一层虚拟的、由内核VXLAN 模块负责维护的二层网络，使得连接在这个 VXLAN 二层网络上的“主机”（虚拟机或者容器都可以）之间，可以像在同一个局域网（LAN）里那样自由通信。</p><p>当然，实际上，这些“主机”可能分布在不同的宿主机上，甚至是分布在不同的物理机房里。而为了能够在二层网络上打通“隧道”，VXLAN 会在宿主机上设置一个特殊的网络设备作为“隧道”的两端。这个设备就叫作 VTEP，即：VXLAN Tunnel End Point（虚拟隧道端点）。而VTEP 设备的作用，其实跟前面的 flanneld 进程非常相似。只不过，它进行封装和解封装的对象，是二层数据帧（Ethernet frame）；而且这个工作的执行流程，全部是在内核里完成的（因为 VXLAN 本身就是 Linux 内核中的一个模块）。上述基于 VTEP 设备进行“隧道”通信的流程，我也为你总结成了一幅图，如下所示： <img src="https://kubenertes.oss-cn-nanjing.aliyuncs.com/Image/9_03.png?Expires=1685329497&amp;OSSAccessKeyId=TMP.3KhxMvYNFBPf4LZNtgmHhxpPyU4oZRXF8ckZvnizbjzvNsWAgtMQ3qjuKqqd5j8JtkFo8Cj26Bwu1MvWP958SxotVA7JzN&amp;Signature=bvn1oRWmkRN1v6P1naUzQZ9oSrw%3D" alt=""> 可以看到，图中每台宿主机上名叫 flannel.1 的设备，就是 VXLAN 所需的 VTEP 设备，它既有 IP 地址，也有 MAC 地址。现在，我们的 container-1 的 IP 地址是 10.1.15.2，要访问的 container-2 的 IP 地址是 10.1.16.3。那么，与前面 UDP 模式的流程类似，当container-1 发出请求之后，这个目的地址是 10.1.16.3 的 IP 包，会先出现在 docker0 网桥，然后被路由到本机 flannel.1 设备进行处理。也就是说，来到了“隧道”的入口。为了方便叙述，我接下来会把这个 IP 包称为“原始 IP 包”。为了能够将“原始 IP 包”封装并且发送到正确的宿主机，VXLAN 就需要找到这条“隧道”的出口，即：目的宿主机的 VTEP 设备。而这个设备的信息，正是每台宿主机上的 flanneld 进程负责维护的。比如，当 Node 2 启动并加入 Flannel 网络之后，在 Node 1（以及所有其他节点)上，flanneld 就会添加一条如下所示的路由规则：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>route -n
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这条规则的意思是：凡是发往 10.1.16.0/24 网段的 IP 包，都需要经过 flannel.1 设备发出，并且，它最后被发往的网关地址是：10.1.16.0。从图 3 的 Flannel VXLAN 模式的流程图中我们可以看到，10.1.16.0 正是 Node 2 上的 VTEP 设备（也就是 flannel.1 设备）的 IP 地址。为了方便叙述，接下来我会把 Node 1 和 Node 2 上的 flannel.1 设备分别称为“源VTEP 设备”和“目的 VTEP 设备”。而这些 VTEP 设备之间，就需要想办法组成一个虚拟的二层网络，即：通过二层数据帧进行通信。在我们的例子中，“源 VTEP 设备”收到“原始 IP 包”后，就要想办法把“原始 IP 包”加上一个目的 MAC 地址，封装成一个二层数据帧，然后发送给“目的 VTEP 设备”（当然，这么做还是因为这个 IP 包的目的地址不是本机）。这里需要解决的问题就是：“目的 VTEP 设备”的 MAC 地址是什么？此时，根据前面的路由记录，我们已经知道了“目的 VTEP 设备”的 IP 地址。而要根据三层 IP 地址查询对应的二层 MAC 地址，这正是 ARP（Address Resolution Protocol ）表的功能。而这里要用到的 ARP 记录，也是 flanneld 进程在 Node 2 节点启动时，自动添加在 Node 1 上的。我们可以通过 ip 命令看到它，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 在 Node 1 上
ip neigh show dev flannel.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Flannel UDP 和 VXLAN 模式都可以称作“隧道”机制，也是很多其他容器网络插件的基础。比如 Weave 的两种模式，以及 Docker 的 Overlay 模式。此外，从上面的讲解中我们可以看到，VXLAN 模式组建的覆盖网络，其实就是一个由不同宿主机上的 VTEP 设备，也就是flannel.1 设备组成的虚拟二层网络。对于 VTEP 设备来说，它发出的“内部数据帧”就仿佛是一直在这个虚拟的二层网络上流动。这，也正是覆盖网络的含义。</p><h3 id="_3-k8s-flannel-使用-cni-的网桥-cni0-dhcp" tabindex="-1"><a class="header-anchor" href="#_3-k8s-flannel-使用-cni-的网桥-cni0-dhcp" aria-hidden="true">#</a> <strong>3.K8s flannel 使用 CNI 的网桥：cni0 - DHCP</strong></h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1. Troubleshooting
网段-MAC-&gt;吓一跳的 IP
ip route show dev flannel.1
10.10.0.0/24 via 10.10.0.0 onlink
ip neig show dev flannel.1
10.10.0.0 lladdr 4e:92:57:e1:be:8a PERMANENT
bridge fdb show dev flannel.1
4e:92:57:e1:be:8a dst 192.168.56.5 self permanent
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-network-policy" tabindex="-1"><a class="header-anchor" href="#_7-network-policy" aria-hidden="true">#</a> <strong>7.Network policy</strong></h2><blockquote><p>相当于 Access controller list</p></blockquote><p><strong>Network Policy概述</strong></p><p>network policy规范包含在给定命名空间中定义特定网络策略所需的所有信息。</p><ul><li><p>podSeletcor: 每个NetworkPolicy都包含一个podSelector，它选择应用该策略的pod分组。空的</p></li><li><p>podSeletcor选择命名空间中的所有pod。</p></li><li><p>policyTypes:每个NetworkPolicy都包含一个podTypes列表，其中可能包括入口、出口或两者。</p></li><li><p>policyTypes字段指示给定策略是否应用于所选pod的入口流量、所选pod的出口流量或两者。如果在网络策略上未指定策略类型，则默认情况下，将始终设置入口，如果网络策略具有任何出口规则，则将设置出口。</p></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl explain netpol.spec.podSelector
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>部署Calico网络模型实现网络策略(因为集群基于flannel网络模型用来作于网络功能，但其不支持网络策略，我们使用Calico网络模型来支持网络策略)</strong></p><p>https://docs.projectcalico.org/getting-started/kubernetes/self-managedonprem/onpremises#install-calico-with-kubernetes-api-datastore-50-nodes-or-less</p><p>Calico network 多网卡设置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>vi calico.yaml
changing ds:container configuration.
spec:
 containers:
 - env:
 - name: DATASTORE_TYPE
 value: kubernetes
 - name: IP_AUTODETECTION_METHOD # DaemonSet中添加该环境变量
 value: interface=enp0s8 # 指定内网网卡
 - name: WAIT_FOR_DATASTORE
 value: &quot;true&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>设置要点</strong></p><p>指定要保护的pod</p><p>指定进出的流量</p><p>指定访问或被访问的pod(namespace/ipblock/labesl + ports)</p><p>Permit or deny</p>`,110),i=[l];function p(c,r){return s(),a("div",null,i)}const o=n(t,[["render",p],["__file","k8s-09-Ingress.html.vue"]]);export{o as default};
