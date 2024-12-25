import{_ as n,o as s,c as a,a as e}from"./app-999de8cb.js";const i={},t=e(`<h1 id="devops" tabindex="-1"><a class="header-anchor" href="#devops" aria-hidden="true">#</a> Devops</h1><h2 id="一、devops、ci、cd" tabindex="-1"><a class="header-anchor" href="#一、devops、ci、cd" aria-hidden="true">#</a> 一、Devops、CI、CD</h2><h3 id="_1-agile-development" tabindex="-1"><a class="header-anchor" href="#_1-agile-development" aria-hidden="true">#</a> 1.Agile Development</h3><p>敏捷开发以用户的需求进化为核心，采用迭代、循序渐进的方法进行软件开发。在敏捷开发中，软件项目在构建初期被切分成多个子项目，各个子项目的成果都经过测试，具备可视、可集成和可运行使用的特征。换言之，就是把一个大项目分为多个相互联系，但也可独立运行的小项目，并分别完成，在此过程中软件一直处于可使用状态。</p><h3 id="_2-ci-持续集成" tabindex="-1"><a class="header-anchor" href="#_2-ci-持续集成" aria-hidden="true">#</a> 2.CI-<strong>持续集成</strong></h3><p>CI 的英文名称是 Continuous Integration，中文翻译为：持续集成。</p><p>CI 中，开发人员将会频繁地向主干提交代码，这些新提交的代码在最终合并到主干前，需要经过编译和自动化测试流进行验证。持续集成（CI）是在源代码变更后自动检测、拉取、构建和（在大多数情况下）进行单元测试的过程。持续集成的目标是快速确保开发人员新提交的变更是好的，并且适合在代码库中进一步使用。CI 的流程执行和理论实践让我们可以确定新代码和原有代码能否正确地集成在一起。</p><h3 id="_3-cd" tabindex="-1"><a class="header-anchor" href="#_3-cd" aria-hidden="true">#</a> 3.CD</h3><p>CD 可对应多个英文名称，持续交付 Continuous Delivery 和持续部署 Continuous Deployment</p><h4 id="持续交付" tabindex="-1"><a class="header-anchor" href="#持续交付" aria-hidden="true">#</a> 持续交付</h4><p>完成 CI 中构建及单元测试和集成测试的自动化流程后，持续交付可自动将已验证的代码发布到存储库。为了实现高效的持续交付流程，务必要确保 CI 已内置于开发管道。持续交付的目标是拥有一个可随时部署到生产环境的代码库。在持续交付中，每个阶段（从代码更改的合并，到生产就绪型构建版本的交付）都涉及测试自动化和代码发布自动化。在流程结束时，运维团队可以快速、轻松地将应用部署到生产环境中或发布给最终使用的用户。</p><h4 id="持续部署" tabindex="-1"><a class="header-anchor" href="#持续部署" aria-hidden="true">#</a> 持续部署</h4><p>对于一个成熟的 CI/CD 管道（Pipeline）来说，最后的阶段是持续部署。作为持续交付— —自动将生产就绪型构建版本发布到代码存储库——的延伸，持续部署可以自动将应用发布到生产环境。持续部署意味着所有的变更都会被自动部署到生产环境中。</p><p>持续交付意味着所有的变更都可以被部署到生产环境中，但是出于业务考虑，可以选择不部署。如果要实施持续部署，必须先实施持续交付。持续交付并不是指软件每一个改动都要尽快部署到产品环境中，它指的是任何的代码修改都可以在任何时候实施部署。持续交付表示的是一种能力，而持续部署表示的则一种方式。持续部署是持续交付的最高阶段。</p><h3 id="_4-devops" tabindex="-1"><a class="header-anchor" href="#_4-devops" aria-hidden="true">#</a> 4.DevOps</h3><p>DevOps 是 Development 和 Operations 的组合，是一种方法论，是一组过程、方法与系统的统称，用于促进应用开发、应用运维和质量保障（QA）部门之间的沟通、协作与整合。以期打破传统开发和运营之间的壁垒和鸿沟。</p><h2 id="二、jenkins-部署和基本使用" tabindex="-1"><a class="header-anchor" href="#二、jenkins-部署和基本使用" aria-hidden="true">#</a> 二、Jenkins 部署和基本使用</h2><h3 id="_1-简介" tabindex="-1"><a class="header-anchor" href="#_1-简介" aria-hidden="true">#</a> <strong>1. 简介</strong></h3><p>Jenkins 是一个开源软件项目，是基于 Java 开发的一种持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。当然除了 Jenkins 以外，也还有其他的工具可以实现自动化部署，如 Hudson 等 只是Jenkins 相对来说，使用得更广泛。</p><h3 id="_2-jenkins-部署环境" tabindex="-1"><a class="header-anchor" href="#_2-jenkins-部署环境" aria-hidden="true">#</a> <strong>2. Jenkins 部署环境</strong></h3><blockquote><p><strong>基本环境</strong>：</p><ol><li><p>jdk 环境，Jenkins 是 java 语言开发的，因需要 jdk 环境。</p></li><li><p>git/svn 客户端，因一般代码是放在 git/svn 服务器上的，我们需要拉取代码。</p></li><li><p>maven 客户端，因一般 java 程序是由 maven 工程，需要 maven 打包，当然也有其他打包方式，如：gradle</p></li></ol></blockquote><h4 id="pvc-创建" tabindex="-1"><a class="header-anchor" href="#pvc-创建" aria-hidden="true">#</a> <strong>PVC 创建</strong></h4><p><strong>创建命名空间</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl create namespace jenkins-k8s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolumeClaim
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>pvc
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>k8s
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">resources</span><span class="token punctuation">:</span>
    <span class="token key atrule">requests</span><span class="token punctuation">:</span>
      <span class="token key atrule">storage</span><span class="token punctuation">:</span> 10Gi
  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> ReadWriteMany
  <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> nfs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="serviceaccount" tabindex="-1"><a class="header-anchor" href="#serviceaccount" aria-hidden="true">#</a> <strong>ServiceAccount</strong></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 创建一个 sa 账号</span>
kubectl create sa jenkins-k8s-sa <span class="token parameter variable">-n</span> jenkins-k8s
<span class="token comment">#授权，kubectl create clusterrolebinding 名称、名称空间、绑定 clusterrole=cluster-admin </span>
kubectl create clusterrolebinding jenkins-k8s-sa-cluster <span class="token parameter variable">-n</span> jenkins-k8s <span class="token parameter variable">--clusterrole</span><span class="token operator">=</span>cluster-admin <span class="token parameter variable">--serviceaccount</span><span class="token operator">=</span>jenkins-k8s:jenkins-k8s-sa
kubectl create clusterrolebinding jenkins-k8s-sa-cluster1 <span class="token parameter variable">-n</span> jenkins-k8s <span class="token parameter variable">--clusterrole</span><span class="token operator">=</span>cluster-admin <span class="token parameter variable">--serviceaccount</span><span class="token operator">=</span>jenkins-k8s:default
kubectl create clusterrolebinding jenkins-k8s-sa-cluster1 <span class="token parameter variable">-n</span> jenkins-0119 <span class="token parameter variable">--clusterrole</span><span class="token operator">=</span>cluster-admin <span class="token parameter variable">--serviceaccount</span><span class="token operator">=</span>jenkins-0119:default
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="部署和验证-jenkins" tabindex="-1"><a class="header-anchor" href="#部署和验证-jenkins" aria-hidden="true">#</a> <strong>部署和验证 Jenkins</strong></h4><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>k8s
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> jenkins
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> jenkins
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins
          <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>hangzhou.aliyuncs.com/liuyik8s/jenkins<span class="token punctuation">:</span>2.303.3<span class="token punctuation">-</span>jdk11 
          <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
          <span class="token key atrule">ports</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> web
              <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">50000</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> agent
              <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
          <span class="token key atrule">resources</span><span class="token punctuation">:</span>
            <span class="token key atrule">limits</span><span class="token punctuation">:</span>
              <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 1000m
              <span class="token key atrule">memory</span><span class="token punctuation">:</span> 1Gi
            <span class="token key atrule">requests</span><span class="token punctuation">:</span>
              <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 500m
              <span class="token key atrule">memory</span><span class="token punctuation">:</span> 500Mi
          <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
            <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
              <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
              <span class="token key atrule">path</span><span class="token punctuation">:</span> /login
            <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">60</span>
            <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
            <span class="token key atrule">failureThreshold</span><span class="token punctuation">:</span> <span class="token number">12</span>
          <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
            <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
              <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
              <span class="token key atrule">path</span><span class="token punctuation">:</span> /login
            <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">60</span>
          <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /var/jenkins_home
              <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>volume
              <span class="token key atrule">subPath</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>home
      <span class="token key atrule">nodeSelector</span><span class="token punctuation">:</span>
        <span class="token key atrule">jenkins</span><span class="token punctuation">:</span> yes
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>volume
          <span class="token key atrule">persistentVolumeClaim</span><span class="token punctuation">:</span>
            <span class="token key atrule">claimName</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>pvc
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>service
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>k8s
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> jenkins
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> jenkins
  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> web
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> web
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> agent
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">50000</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> agent
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jk
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>k8s
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ingressClassName</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> jk.k8s.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> jenkins<span class="token punctuation">-</span>service
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">8080</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-jenkins-初始化配置" tabindex="-1"><a class="header-anchor" href="#_3-jenkins-初始化配置" aria-hidden="true">#</a> 3.<strong>Jenkins 初始化配置</strong></h3><h4 id="查看访问地址" tabindex="-1"><a class="header-anchor" href="#查看访问地址" aria-hidden="true">#</a> <strong>查看访问地址</strong></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get svc <span class="token parameter variable">-n</span> jenkins-k8s
 
<span class="token comment">#修改主机 host</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;218.76.8.107 jk.k8s.com&quot;</span> <span class="token operator">&gt;</span> /etc/hosts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查看初始化用户及密码" tabindex="-1"><a class="header-anchor" href="#查看初始化用户及密码" aria-hidden="true">#</a> <strong>查看初始化用户及密码</strong></h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 查看 Jenkins 日志,记录初始化密码，填入初始化页面
kubectl logs -n jenkins-k8s jenkins-57c7977bcd-9cf7h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="登陆系统" tabindex="-1"><a class="header-anchor" href="#登陆系统" aria-hidden="true">#</a> <strong>登陆系统</strong></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Ingress 方式访问</span>
http://jk.k8s.com:30880/
<span class="token comment"># Node Port 方式访问</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="初始化用户" tabindex="-1"><a class="header-anchor" href="#初始化用户" aria-hidden="true">#</a> <strong>初始化用户</strong></h4><h4 id="安装中文插件" tabindex="-1"><a class="header-anchor" href="#安装中文插件" aria-hidden="true">#</a> <strong>安装中文插件</strong></h4><h3 id="_4-jenkin-构建环境配置" tabindex="-1"><a class="header-anchor" href="#_4-jenkin-构建环境配置" aria-hidden="true">#</a> <strong>4.Jenkin 构建环境配置</strong></h3><h4 id="cloud-environment-配置" tabindex="-1"><a class="header-anchor" href="#cloud-environment-配置" aria-hidden="true">#</a> <strong>Cloud environment 配置</strong></h4><ol><li><p>可以连接多个云环境</p></li><li><p>连接云中不同的 namespace</p></li><li><p>创建不同的 pod 模板来完成不同的构建任务。</p></li></ol><p>Jenkins 的 kubernetes-plugin 在执行构建时会在 kubernetes 集群中自动创建一个 Pod，并在 Pod 内部创建一个名为 jnlp 的容器，该容器会连接 Jenkins 并运行 Agent 程序，形成一个 Jenkins 的 Master 和 Slave 架构，然后 Slave 会执行构建脚本进行构建。</p><h5 id="安装插件" tabindex="-1"><a class="header-anchor" href="#安装插件" aria-hidden="true">#</a> <strong>安装插件</strong></h5><ol><li>搜索 kubernetes 相关插件, 搜索后安装相应的插件。</li></ol><h5 id="配置-kuberenetes-云环境" tabindex="-1"><a class="header-anchor" href="#配置-kuberenetes-云环境" aria-hidden="true">#</a> <strong>配置 kuberenetes 云环境</strong></h5><p>系统配置-&gt; Cloud</p><blockquote><p>注意 Jenkins pod 的 SA 权限</p></blockquote><h5 id="配置-pod-模板" tabindex="-1"><a class="header-anchor" href="#配置-pod-模板" aria-hidden="true">#</a> <strong>配置 pod 模板</strong></h5><p>/root/.kube：这个目录挂载到容器的/root/.kube 目录下面这是为了让我们能够在 Pod 的容器中能够使用 kubectl 工具来访问我们的 Kubernetes 集群，方便我们后面在 Slave Pod 部署 Kubernetes 应用； 其他两个挂载是为了使用 Docker （DooD 方式) Workspace 使用 PVC，这样不用每次都下载各种库，减少构建的时间</p><p>最终的 slave pod 中使用的卷配置信息。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> volumeMounts:
 - mountPath: &quot;/home/jenkins/agent&quot;
 name: &quot;volume-3&quot;
 readOnly: false
 - mountPath: &quot;/var/run/docker.sock&quot;
 name: &quot;volume-0&quot;
 readOnly: false
 - mountPath: &quot;/home/jenkins/agent/.kube&quot;
 name: &quot;volume-1&quot;
 readOnly: false
 - mountPath: &quot;/usr/bin/docker&quot;
 name: &quot;volume-2&quot;
 readOnly: false
 volumes:
 - hostPath:
 path: &quot;/var/run/docker.sock&quot;
 name: &quot;volume-0&quot;
 - hostPath:
 path: &quot;/usr/bin/docker&quot;
 name: &quot;volume-2&quot;
 - hostPath:
 path: &quot;/root/.kube&quot;
 name: &quot;volume-1&quot;
 - emptyDir:
 medium: &quot;&quot;
 name: &quot;workspace-volume&quot;
 - name: &quot;volume-3&quot;
 persistentVolumeClaim:
 claimName: &quot;agent-workspace&quot;
 readOnly: false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在每个 step 制定的 docker 名字。</p><h5 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> <strong>测试</strong></h5><p>使用声明式 Pipeline 创建项目此处的 maven 与上图中标准的要一一对应。如使用 master 则使用 Jenkins Master 进行构建</p><div class="language-groovy line-numbers-mode" data-ext="groovy"><pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span>
      label <span class="token string">&#39;maven&#39;</span> 
         stages <span class="token punctuation">{</span>
           <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">&#39;拉取代码&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             steps <span class="token punctuation">{</span>
             		sh <span class="token string">&#39;echo &quot;拉取代码完成&quot; &#39;</span>
             <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
       <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> 
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="git-连接设置" tabindex="-1"><a class="header-anchor" href="#git-连接设置" aria-hidden="true">#</a> <strong>Git 连接设置</strong></h4><h5 id="github-服务器配置" tabindex="-1"><a class="header-anchor" href="#github-服务器配置" aria-hidden="true">#</a> <strong>GitHub 服务器配置</strong></h5><p>添加凭证 Manage Jenkins-&gt;Manage Credential-&gt;adding</p><h5 id="gitee-服务器配置" tabindex="-1"><a class="header-anchor" href="#gitee-服务器配置" aria-hidden="true">#</a> <strong>Gitee 服务器配置</strong></h5><p>添加凭证 Manage Jenkins-&gt;Manage Credential-&gt;adding 类型为 Username with password</p><h5 id="gitlab-私有服务器配置" tabindex="-1"><a class="header-anchor" href="#gitlab-私有服务器配置" aria-hidden="true">#</a> <strong>GitLab 私有服务器配置</strong></h5><h4 id="image-repository-设置" tabindex="-1"><a class="header-anchor" href="#image-repository-设置" aria-hidden="true">#</a> <strong>Image repository 设置</strong></h4><blockquote><p>Manage Jenkins-&gt;Manage Credential-&gt;adding</p></blockquote><h5 id="docker-hub-配置" tabindex="-1"><a class="header-anchor" href="#docker-hub-配置" aria-hidden="true">#</a> <strong>Docker Hub 配置</strong></h5><h5 id="aliyun-id-配置" tabindex="-1"><a class="header-anchor" href="#aliyun-id-配置" aria-hidden="true">#</a> <strong>Aliyun ID 配置</strong></h5><p>类型为 Username with password</p><h5 id="私有仓库-id-配置" tabindex="-1"><a class="header-anchor" href="#私有仓库-id-配置" aria-hidden="true">#</a> <strong>私有仓库 ID 配置</strong></h5><h3 id="_5-测试上述" tabindex="-1"><a class="header-anchor" href="#_5-测试上述" aria-hidden="true">#</a> <strong>5.测试上述</strong></h3><p>使用 gitee 作为代码管理平台。增加测试的 Pipline 脚本</p><h3 id="_6-图形化界面-blueocean" tabindex="-1"><a class="header-anchor" href="#_6-图形化界面-blueocean" aria-hidden="true">#</a> <strong>6.图形化界面 BlueOcean</strong></h3><p>BlueOcean 是 Jenkins 团队从用户体验角度出发，专为 Jenkins Pipeline 重新设计的一套 UI 界面，仍然兼容以前的 fressstyle 类型的 job，BlueOcean 具有以下的一些特性：连续交付（CD）Pipeline 的复杂可视化，允许快速直观的了解 Pipeline 的状态可以通过 Pipeline 编辑器直观的创建 Pipeline需要干预或者出现问题时快速定位，BlueOcean 显示了 Pipeline 需要注意的地方，便于异常处理和提高生产力用于分支和拉取请求的本地集成可以在 GitHub 或者 Bitbucket 中与其他人进行代码协作时最大限度提高开发人员的生产力。BlueOcean 可以安装在现有的 Jenkins 环境中，也可以使用 Docker 镜像的方式直接运行，我们这里直接在现有的 Jenkins 环境中安装 BlueOcean 插件：登录 Jenkins Web UI -&gt; 点击左侧的 Manage Jenkins -&gt; Manage Plugins -&gt; Available -&gt; 搜索查找 BlueOcean -&gt; 点击下载安装并重启。</p><h2 id="三-jenkins-pipeline" tabindex="-1"><a class="header-anchor" href="#三-jenkins-pipeline" aria-hidden="true">#</a> <strong>三.Jenkins Pipeline</strong></h2><blockquote><p>自 Jenkins 2.0 版本升级之后，支持了通过代码（Groovy DSL）来描述一个构建流水线，灵活方便地实现持续交付，大大提升 Jenkins Job 维护的效率，实现从 CI 到 CD 到转变。而在 2016 Jenkins World 大会上，Jenkins 发布了 1.0 版本的声明式流水线 -Declarative Pipeline，目前已经到发布了 1.2 版本，它是一种新的结构化方式定义一个流水线。</p></blockquote><h3 id="_1-pipeline-特性-pipeline-as-code" tabindex="-1"><a class="header-anchor" href="#_1-pipeline-特性-pipeline-as-code" aria-hidden="true">#</a> <strong>1.Pipeline 特性 - Pipeline As Code</strong></h3><p>Jenkins 从根本上讲是一种支持多种自动化模式的自动化引擎。Pipeline 为其添加了一套强大的自动化工具，支持从简单的持续集成到全面的持续交付。Jenkins Pipeline 特性如下：</p><ul><li><p>代码：Pipeline 以代码的形式描述，通常存储于源代码控制系统，如 Git，使团队能够编辑，审查和迭代其流程定义。</p></li><li><p>持久性：Pipeline 可以在计划和计划外重新启动 Jenkins Master 管理时不被影响。</p></li><li><p>可暂停：Pipeline 可以选择停止并等待人工输入或批准，然后再继续 Pipeline 运行。</p></li><li><p>多功能：Pipeline 支持复杂的项目持续交付要求，包括并行分支/连接，循环和执行 Job 的能力。</p></li><li><p>可扩展：Pipeline 插件支持其 DSL 的自定义扩展以及与其他插件集成。</p></li></ul><p>基于 Jenkins Pipeline，用户可以在一个 JenkinsFile 中快速实现一个项目的从构建、测试以到发布的完整流程，并且可以保存这个流水线的定义。</p><h3 id="_2-pipeline-基本概念" tabindex="-1"><a class="header-anchor" href="#_2-pipeline-基本概念" aria-hidden="true">#</a> <strong>2.Pipeline 基本概念</strong></h3><p>Node: 一个 Node 就是一个 Jenkins 节点，或者是 Master，或者是 Agent，是执行 Step 的具体运行环境，Pipeline 执行中的大部分工作都是在一个或多个声明 Node 步骤的上下文中完成的。</p><p>Stage: 一个 Pipeline 可以从逻辑上划分为若干个 Stage，每个 Stage 代表一组操作，如：Build、Test、Deploy。注意，Stage 是一个逻辑分组的概念，可以跨多个 Node。</p><p>Step: Step 是最基本的操作单元，小到执行一个 Shell 脚本，大到构建一个 Docker 镜像，由各类 Jenkins Plugin 提供，当插件扩展 Pipeline DSL 时，通常意味着插件已经实现#了一个新的步骤。</p><h3 id="_3-scripted-pipeline" tabindex="-1"><a class="header-anchor" href="#_3-scripted-pipeline" aria-hidden="true">#</a> <strong>3.Scripted Pipeline</strong></h3><p>CurrentBuild 可以获取档次执行的结果，可以用于判读后续流程走向，Jenkins 还提供了更多内置环境变量以及 DSL 对象，方便我们操作流水线任务，如：BUILD_ID、JOB_NAME、BRANCH_NAME、CHANGE_ID 等等，可参考 Global Variable。这种方式受 Jenkins 的限制较少，我们可以灵活控制和定义一个流水线，甚至我们可以在 JenkinsFile 中定义多个 Groovy 函数来扩展 Jenkins Pipeline 的能力。</p>`,83),l=[t];function p(c,o){return s(),a("div",null,l)}const u=n(i,[["render",p],["__file","k8s-16-Devops.html.vue"]]);export{u as default};
