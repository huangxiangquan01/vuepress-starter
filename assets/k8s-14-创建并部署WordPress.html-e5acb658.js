import{_ as n,o as s,c as a,a as e}from"./app-999de8cb.js";const t={},p=e(`<h1 id="创建并部署-wordpress" tabindex="-1"><a class="header-anchor" href="#创建并部署-wordpress" aria-hidden="true">#</a> 创建并部署 WordPress</h1><h2 id="_1-wordpress-简介" tabindex="-1"><a class="header-anchor" href="#_1-wordpress-简介" aria-hidden="true">#</a> 1.WordPress 简介</h2><p>WordPress（使用 PHP 语言编写）是免费、开源的内容管理系统，用户可以使用 WordPress 搭建自己的网站。完整的 WordPress 应用程序包括以下 Kubernetes 对象，由 MySQL 作为后端数据库。</p><h2 id="_2-mysql-部署" tabindex="-1"><a class="header-anchor" href="#_2-mysql-部署" aria-hidden="true">#</a> 2.Mysql 部署</h2><h3 id="创建-mysql-密钥" tabindex="-1"><a class="header-anchor" href="#创建-mysql-密钥" aria-hidden="true">#</a> 创建 MySQL 密钥</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysecret
<span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">password</span><span class="token punctuation">:</span> MTIzNDU2
  <span class="token key atrule">username</span><span class="token punctuation">:</span> cm9vdA==
<span class="token comment">#user/pass=root/123456</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-statefulset-部署-mysql" tabindex="-1"><a class="header-anchor" href="#使用-statefulset-部署-mysql" aria-hidden="true">#</a> <strong>使用 StatefulSet 部署 mysql</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>sts
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> <span class="token string">&quot;mysql-sts&quot;</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>local<span class="token punctuation">-</span>storage
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">volume.beta.kubernetes.io/storage-class</span><span class="token punctuation">:</span> <span class="token string">&quot;couse-nfs-storage&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">&quot;ReadWriteOnce&quot;</span> <span class="token punctuation">]</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 25Gi
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>sts
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">labels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>sts
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token comment">#nodeSelector:</span>
        <span class="token comment">#wordpress: mysql</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span>5.7.34
        <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_ROOT_PASSWORD
          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
            <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> mysecret
              <span class="token key atrule">key</span><span class="token punctuation">:</span> password
        <span class="token comment">#- name: SECRET_USERNAME</span>
        <span class="token comment">#  valueFrom:</span>
        <span class="token comment">#  secretKeyRef:</span>
        <span class="token comment">#    name: mysecret</span>
        <span class="token comment">#    key: username</span>
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">3306</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>local<span class="token punctuation">-</span>storage
          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /var/lib/mysql
      <span class="token key atrule">initContainers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> init<span class="token punctuation">-</span>wordpress<span class="token punctuation">-</span>mysql
        <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;sh&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;-c&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;rm -rf /data/*&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;until nslookup mysql-sts; do echo waiting for mysql-sts; sleep 2; done;&#39;</span><span class="token punctuation">]</span>
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>local<span class="token punctuation">-</span>storage
          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="service-创建" tabindex="-1"><a class="header-anchor" href="#service-创建" aria-hidden="true">#</a> <strong>Service 创建</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>sts
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>sts
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3306</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>sts
  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-wordpress-部署" tabindex="-1"><a class="header-anchor" href="#_3-wordpress-部署" aria-hidden="true">#</a> 3. <strong>Wordpress 部署</strong></h2><h3 id="创建-mysql-配置" tabindex="-1"><a class="header-anchor" href="#创建-mysql-配置" aria-hidden="true">#</a> 创建 MySQL 配置</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">db-host</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>sts
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mycm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-nfs-存储" tabindex="-1"><a class="header-anchor" href="#使用-nfs-存储" aria-hidden="true">#</a> 使用 NFS 存储</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolumeClaim
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> pvc<span class="token punctuation">-</span>wp
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> couse<span class="token punctuation">-</span>nfs<span class="token punctuation">-</span>storage
  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> ReadWriteMany
  <span class="token key atrule">resources</span><span class="token punctuation">:</span>
     <span class="token key atrule">requests</span><span class="token punctuation">:</span>
       <span class="token key atrule">storage</span><span class="token punctuation">:</span> 12G
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="deployment-创建" tabindex="-1"><a class="header-anchor" href="#deployment-创建" aria-hidden="true">#</a> Deployment 创建</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> wordpress
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> wordpress
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> wordpress
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> wordpress
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token comment">#nodeSelector:</span>
        <span class="token comment">#wordpress: mysql</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> wordpress<span class="token punctuation">:</span>4.8<span class="token punctuation">-</span>apache
          <span class="token key atrule">name</span><span class="token punctuation">:</span> wordpress
          <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
          <span class="token key atrule">env</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> WORDPRESS_DB_HOST
              <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
                <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                  <span class="token key atrule">name</span><span class="token punctuation">:</span> mycm
                  <span class="token key atrule">key</span><span class="token punctuation">:</span> db<span class="token punctuation">-</span>host
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> WORDPRESS_DB_USER
              <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
                <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span>
                  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysecret
                  <span class="token key atrule">key</span><span class="token punctuation">:</span> username
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> WORDPRESS_DB_PASSWORD
              <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
                <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span>
                  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysecret
                  <span class="token key atrule">key</span><span class="token punctuation">:</span> password
          <span class="token key atrule">ports</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> wordpress
          <span class="token key atrule">resources</span><span class="token punctuation">:</span>
            <span class="token key atrule">requests</span><span class="token punctuation">:</span>
              <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token number">0.5</span>
          <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> wordpress<span class="token punctuation">-</span>local<span class="token punctuation">-</span>storage
              <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
              <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /var/www/html
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> wordpress<span class="token punctuation">-</span>local<span class="token punctuation">-</span>storage
          <span class="token key atrule">persistentVolumeClaim</span><span class="token punctuation">:</span>
            <span class="token key atrule">claimName</span><span class="token punctuation">:</span> pvc<span class="token punctuation">-</span>wp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="service-创建-1" tabindex="-1"><a class="header-anchor" href="#service-创建-1" aria-hidden="true">#</a> Service 创建</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> wordpress
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> wordpress
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">30180</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> wordpress
  <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ingress创建" tabindex="-1"><a class="header-anchor" href="#ingress创建" aria-hidden="true">#</a> Ingress创建</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> wordpress
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> wp.tuling.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> wordpress
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-hpa-的建立" tabindex="-1"><a class="header-anchor" href="#_4-hpa-的建立" aria-hidden="true">#</a> <strong>4.HPA 的建立</strong></h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl autoscale deployment wordpress <span class="token parameter variable">--min</span><span class="token operator">=</span><span class="token number">1</span> <span class="token parameter variable">--max</span><span class="token operator">=</span><span class="token number">40</span> --cpu-percent<span class="token operator">=</span><span class="token number">3</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_5-性能测试软件" tabindex="-1"><a class="header-anchor" href="#_5-性能测试软件" aria-hidden="true">#</a> 5. <strong>性能测试软件</strong></h2><h3 id="_1-使用-ab-软件测试" tabindex="-1"><a class="header-anchor" href="#_1-使用-ab-软件测试" aria-hidden="true">#</a> <strong>1.使用 ab 软件测试</strong></h3><p>ab 是 apache 自带的一款功能强大的测试工具,安装了 apache 一般就自带了, 一般我们用到的是-n，-t 和-c</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> httpd-tools <span class="token parameter variable">-y</span>

<span class="token comment"># 这个表示一共处理 10000 个请求,每次并发运行 1000 次 index.php 文件</span>
ab <span class="token parameter variable">-c</span> <span class="token number">1000</span> <span class="token parameter variable">-n</span> <span class="token number">10000</span> http://192.168.56.5:30180/

<span class="token comment">#这个表示 10000 个请求 2000s,每次并发运行 1000 次</span>
ab <span class="token parameter variable">-c</span> <span class="token number">1000</span> <span class="token parameter variable">-t</span> <span class="token number">2000</span> http://192.168.56.5:30180/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-使用-forti" tabindex="-1"><a class="header-anchor" href="#_2-使用-forti" aria-hidden="true">#</a> <strong>2.使用 Forti</strong></h3><p>可以直接部署 fortio 应用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl apply -f samples/httpbin/sample-client/fortio-deploy.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>登入客户端 Pod 并使用 Fortio 工具调用 httpbin 服务。-curl 参数表明发送一次调用：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">FORTIO_POD</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>fortio <span class="token parameter variable">-o</span> <span class="token string">&#39;jsonpath={.items[0].metadata.name}&#39;</span><span class="token variable">)</span></span>
kubectl <span class="token builtin class-name">exec</span> <span class="token string">&quot;<span class="token variable">$FORTIO_POD</span>&quot;</span> <span class="token parameter variable">-c</span> fortio -- /usr/bin/fortio <span class="token function">curl</span> <span class="token parameter variable">-quiet</span> http://wordpress/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>发送并发数为 2 的连接（-c 2），请求 20 次（-n 20）：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> <span class="token string">&quot;<span class="token variable">$FORTIO_POD</span>&quot;</span> <span class="token parameter variable">-c</span> fortio -- /usr/bin/fortio load <span class="token parameter variable">-c</span> <span class="token number">20</span> <span class="token parameter variable">-qps</span> <span class="token number">0</span> <span class="token parameter variable">-n</span> <span class="token number">2000</span> <span class="token parameter variable">-loglevel</span> Warning http://wordpress/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,34),l=[p];function i(c,o){return s(),a("div",null,l)}const r=n(t,[["render",i],["__file","k8s-14-创建并部署WordPress.html.vue"]]);export{r as default};
