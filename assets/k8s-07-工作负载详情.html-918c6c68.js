import{_ as n,o as a,c as s,a as e}from"./app-999de8cb.js";const t={},l=e(`<h1 id="k8s-pod-控制器" tabindex="-1"><a class="header-anchor" href="#k8s-pod-控制器" aria-hidden="true">#</a> K8s Pod 控制器</h1><h2 id="_07-k8s-pod-控制器" tabindex="-1"><a class="header-anchor" href="#_07-k8s-pod-控制器" aria-hidden="true">#</a> <strong>07 K8s Pod 控制器</strong></h2><div class="language-mermaid line-numbers-mode" data-ext="mermaid"><pre class="language-mermaid"><code><span class="token keyword">stateDiagram</span>
    HorizontalPodAutoScale <span class="token arrow operator">--&gt;</span> Deployment
    Deployment <span class="token arrow operator">--&gt;</span> ReplicaSet 
    HorizontalPodAutoScale <span class="token arrow operator">--&gt;</span> ReplicationCotroller
    ReplicationCotroller <span class="token arrow operator">--&gt;</span> Pod
    StatefulSet <span class="token arrow operator">--&gt;</span> Pod
    HorizontalPodAutoScale <span class="token arrow operator">--&gt;</span> ReplicaSet
    ReplicaSet <span class="token arrow operator">--&gt;</span> Pod
    HorizontalPodAutoScale <span class="token arrow operator">--&gt;</span> StatefulSet
    CornJob <span class="token arrow operator">--&gt;</span> Job
    Job <span class="token arrow operator">--&gt;</span> Pod
    DaemonSet <span class="token arrow operator">--&gt;</span> Pod
    Pod <span class="token arrow operator">--&gt;</span> InitContainer
    Pod <span class="token arrow operator">--&gt;</span> Container
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-rc-rs-控制器" tabindex="-1"><a class="header-anchor" href="#_1-rc-rs-控制器" aria-hidden="true">#</a> <strong>1. RC/RS 控制器</strong></h3><p>在kubernetes v1.2版本之前，Kubernetes中默认的分片管理工具是Replication Controller，v1.2版本以后，升级成了一个新的概念Replica-Set。Deployment内部采用的就是Replica-Set。</p><p>Replica-Set和RC之间最大的区别在于RC只支持基于等式的label-Selector，而Replica-Set支持基于集合的Label-Selector。</p><p>RC主要用来声明某种Pod的副本数量在任意时刻都能符合预期值。定义包括以下几个方面： 1）Pod的副本数量； 2）用于筛选Pod的标签选择器； 3）定义Pod的模板用于创建新Pod时使用。</p><p>当定义RC并提交到Kubernetes集群后，Master节点上的Controller Manager组件会定期巡检当前存活目标的Pod副本数，保证副本数符合预期值。如果有过多的Pod在运行，会停掉一些Pod，如果少于预期值，会根据模板自动创建。通过使用RC，Kubernetes实现了用户集群高可用性，并减少了运维工作量。</p><h4 id="label-and-selector" tabindex="-1"><a class="header-anchor" href="#label-and-selector" aria-hidden="true">#</a> <strong>Label and Selector</strong></h4><p>标签是关键值对，可以配置到 K8s 中任何的对象（例如 Pods）。标签用于根据要求组织和选择子对象集。许多对象可以具有相同的标签。标签不为对象提供独特性。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl label resource-name <span class="token assign-left variable">app</span><span class="token operator">=</span>test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="label-selectors-–-标签选择器" tabindex="-1"><a class="header-anchor" href="#label-selectors-–-标签选择器" aria-hidden="true">#</a> <strong>Label Selectors – 标签选择器</strong></h4><p>通过标签选择器，我们可以选择对象的子集。K8s 支持两种类型的选择器：</p><ul><li><p>基于平等的选择器</p><ul><li>基于平等的选择器允许基于标签键和值对对象进行过滤。使用这种类型的选择器，我们可以使用 [，]，或！例如，通过 env=dev，我们选择的是设置 env 标签的对象。</li></ul></li><li><p>基于设置的选择器</p><ul><li>基于设置的选择器允许基于一组值对对象进行筛选。使用这种类型的选择器，我们可以使用内、不和存在操作员。例如，在 env 中（dev，qa），我们选择的对象是 env 标签设置为开发或卡。</li></ul></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl get rc owide
kubectl get pod -–show-label
kubectl get rs -owide

kubectl label nodes k8s-master env- #删除节点标签env=env
kubectl label nodes k8s-master env=env #给节点添加一个标签env=env
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="replicaset-replication-controller-创建" tabindex="-1"><a class="header-anchor" href="#replicaset-replication-controller-创建" aria-hidden="true">#</a> <strong>ReplicaSet/Replication Controller 创建</strong></h4><p>RS 的 yaml 文件创建</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ReplicaSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> frontend
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> guestbook
    <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
<span class="token key atrule">spec</span><span class="token punctuation">:</span> <span class="token comment"># modify replicas acc replicas: 3 selector: matchLabels: tier: frontend</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
  <span class="token comment"># --------------------------------------------</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">tier</span><span class="token punctuation">:</span> frontend
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx1
        <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>RS 自愈能力</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl delete rs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>RS 多副本</strong></p><p><strong>RS 扩缩容能力</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl scale name -replicas=2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-deployment" tabindex="-1"><a class="header-anchor" href="#_2-deployment" aria-hidden="true">#</a> <strong>2. Deployment</strong></h3><blockquote><p>控制Pod，使Pod拥有多副本，自愈，扩缩容等能力</p></blockquote><h4 id="deployment-的多副本能力" tabindex="-1"><a class="header-anchor" href="#deployment-的多副本能力" aria-hidden="true">#</a> <strong>Deployment 的多副本能力</strong></h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl create deploy my-dep --image=nginx --replicas=3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="deployment-扩缩容能力" tabindex="-1"><a class="header-anchor" href="#deployment-扩缩容能力" aria-hidden="true">#</a> <strong>Deployment 扩缩容能力</strong></h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl scale --replicas=5 deploy/my-dep
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="deployment-滚动更新" tabindex="-1"><a class="header-anchor" href="#deployment-滚动更新" aria-hidden="true">#</a> Deployment 滚动更新</h4><p><strong>Deployment upgrade</strong></p><ul><li>Method 1 <ul><li>kubectl set image deployment/NAME container:name=imagename:version</li><li>kubectl set image deployment/myngx myngx=nginx:latest</li></ul></li><li>Method2： <ul><li>kubectl edit deployment name</li></ul></li><li>Method3： <ul><li>kubectl apply –f yaml file</li></ul></li><li>生成一个新的 RS</li></ul><p><strong>check 升级记录</strong></p><ul><li>kubectl rollout history deployment/name</li><li>kubectl rollout history deployment/name --revision=3</li><li>kubectl get rs -owide</li><li>kubectl get deployments.apps myngx -o yaml # check metadata.generation: 2</li><li>This number is same with RS # rollback is not counted.</li></ul><h5 id="rollingupdate-parameter" tabindex="-1"><a class="header-anchor" href="#rollingupdate-parameter" aria-hidden="true">#</a> RollingUpdate Parameter</h5><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">strategy</span><span class="token punctuation">:</span>
  <span class="token key atrule">rollingUpdate</span><span class="token punctuation">:</span>
    <span class="token key atrule">maxSurge</span><span class="token punctuation">:</span> 25%
    <span class="token key atrule">maxUnavailable</span><span class="token punctuation">:</span> 25%
  <span class="token key atrule">type</span><span class="token punctuation">:</span> RollingUpdate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>maxSurge string</strong></p><ul><li>可调度的 Pod 最大数量超过所需数量 pod。值可以是绝对数（例如：5）或所需值的百分比豆荚（ex:10%）。绝对数通过四舍五入从百分比计算。默认为 25%。 • 例子：</li><li>当该值设置为 30%时，当滚动更新开始时可以立即放大新的复制集，旧的和 新的 pod 不超过所需吊舱的 130%。一旦老 pod 被杀死，新的 ReplicaSet可以进一步扩展，确保 POD 的总数在更新过程中的任何时间运行最多为所需 POD 的 130%。 <strong>maxUnavailable string</strong></li><li>更新期间不可用的最大 pod。价值可以是绝对数（例如：5）或所需 pod 的百分比 （例如：10%). 绝对数由百分比向下舍入计算得出。这如果 MaxSurge 为 0，则不能为 0。默认值为 25%。</li><li>示例：</li><li>设置此选项时到 30%，旧的 pod 可以缩小到所需 POD 的 70%滚动更新开始时立即执行。一旦新 pod 准备好，旧豆荚 ReplicaSet 可以进一步缩小，然后再放大新的 ReplicaSet，确保始终可用的 POD 总数在更新过程中，至少有70%的 POD 是所需的。</li></ul><h4 id="deployment-版本回退能力" tabindex="-1"><a class="header-anchor" href="#deployment-版本回退能力" aria-hidden="true">#</a> Deployment 版本回退能力</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 回滚到上一个版本：</span>
kubectl rollout undo deployment/NAME
<span class="token comment"># 回滚到先前的任何版本</span>
kubectl rollout undo deployment/nginx-deployment --to-revision<span class="token operator">=</span><span class="token number">2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-daemonset" tabindex="-1"><a class="header-anchor" href="#_3-daemonset" aria-hidden="true">#</a> 3.DaemonSet</h3><p>DaemonSet 能够让所有（或者一些特定）的 Node 节点运行同一个 pod。当节点加入到kubernetes 集群中，pod 会被（DaemonSet）调度到该节点上运行，当节点从 kubernetes 集群中被移除，被（DaemonSet）调度的 pod 会被移除，如果删除 DaemonSet，所有跟这个DaemonSet 相关的 pods 都会被删除。在使用 kubernetes 来运行应用时，很多时候我们需要在一个区域（zone）或者所有 Node 上运行同一个守护进程（pod）。</p><p>例如如下场景：</p><ul><li>每个 Node 上运行一个分布式存储的守护进程，例如 glusterd，ceph</li><li>每个 Node 上运行日志采集器，例如 fluentd，logstash</li></ul><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> DaemonSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> ds1
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kube<span class="token punctuation">-</span>system
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">k8s-app</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>logging
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>elasticsearch
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>elasticsearch
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">tolerations</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> node<span class="token punctuation">-</span>role.kubernetes.io/master
          <span class="token key atrule">effect</span><span class="token punctuation">:</span> NoSchedule
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> fluentd<span class="token punctuation">-</span>elasticsearch
          <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx<span class="token punctuation">:</span>1.7.9
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">limits</span><span class="token punctuation">:</span>
          <span class="token key atrule">memory</span><span class="token punctuation">:</span> 200Mi
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">cpu</span><span class="token punctuation">:</span> 100m
          <span class="token key atrule">memory</span><span class="token punctuation">:</span> 200Mi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-job-and-cronjob" tabindex="-1"><a class="header-anchor" href="#_4-job-and-cronjob" aria-hidden="true">#</a> <strong>4.Job and Cronjob</strong></h3><p>在有些场景下，是想要运行一些容器执行某种特定的任务，任务一旦执行完成，容器也就没有存在的必要了。在这种场景下，创建 pod 就显得不那么合适。于是就是了 Job，Job 指的就是那些一次性任务。通过 Job 运行一个容器，当其任务执行完以后，就自动退出，集群也不再重新将其唤醒。</p><p>从程序的运行形态上来区分，可以将 Pod 分为两类：长时运行服务（jboss、mysql 等）和一次性任务（数据计算、测试）。RC 创建的 Pod 都是长时运行的服务，Job 多用于执行一次性任务、批处理工作等，执行完成后便会停止（status.phase 变为 Succeeded）。</p><p>job 执行完后，不会自动启动一个新的 pod。执行完成后 pod 便会停止，也不会被自动删除。</p><h4 id="job" tabindex="-1"><a class="header-anchor" href="#job" aria-hidden="true">#</a> <strong>Job</strong></h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl create job test1 --image=nginx:1.9
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> batch/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Job
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> job<span class="token punctuation">-</span>demo
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
 <span class="token key atrule">template</span><span class="token punctuation">:</span>
   <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">name</span><span class="token punctuation">:</span> job<span class="token punctuation">-</span>demo
   <span class="token key atrule">spec</span><span class="token punctuation">:</span>
     <span class="token key atrule">restartPolicy</span><span class="token punctuation">:</span> Never
     <span class="token key atrule">containers</span><span class="token punctuation">:</span>
     <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> counter
       <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
       <span class="token key atrule">command</span><span class="token punctuation">:</span>
       <span class="token punctuation">-</span> <span class="token string">&quot;bin/sh&quot;</span>
       <span class="token punctuation">-</span> <span class="token string">&quot;-c&quot;</span>
       <span class="token punctuation">-</span> <span class="token string">&quot;for i in 9 8 7 6 5 4 3 2 1; do echo $i; done&quot;</span>
     <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="cronjob" tabindex="-1"><a class="header-anchor" href="#cronjob" aria-hidden="true">#</a> <strong>CronJob</strong></h4><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> batch/v1beta1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> CronJob
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> cronjob<span class="token punctuation">-</span>demo
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">schedule</span><span class="token punctuation">:</span> <span class="token string">&quot;*/1 * * * *&quot;</span>
  <span class="token key atrule">jobTemplate</span><span class="token punctuation">:</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">template</span><span class="token punctuation">:</span>
        <span class="token key atrule">spec</span><span class="token punctuation">:</span>
          <span class="token key atrule">containers</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> counter
              <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
              <span class="token key atrule">command</span><span class="token punctuation">:</span>
                <span class="token punctuation">-</span> <span class="token string">&quot;bin/sh&quot;</span>
                <span class="token punctuation">-</span> <span class="token string">&quot;-c&quot;</span>
                <span class="token punctuation">-</span> <span class="token string">&quot;for i in 9 8 7 6 5 4 3 2 1; do echo $i; done&quot;</span>
          <span class="token key atrule">restartPolicy</span><span class="token punctuation">:</span> OnFailure
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-statefulset" tabindex="-1"><a class="header-anchor" href="#_5-statefulset" aria-hidden="true">#</a> <strong>5.Statefulset</strong></h3><p><strong>StatefulSet 是为了解决有状态服务的问题</strong></p><p>有下面的任意要求时，StatefulSet 的价值就体现出来了。</p><ul><li><p>稳定的、唯一的网络标识。</p></li><li><p>稳定的、持久化的存储。</p></li><li><p>有序的、优雅的部署和扩展。</p></li><li><p>有序的、优雅的删除和停止。</p></li></ul><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>StatefulSet 组成 用于定义网络标志（DNS domain）的 Headless Service用于创建 PersistentVolumes 的 volumeClaimTemplates</p><p>定义具体应用的 StatefulSet。</p><p><strong>StatefulSet中 每 个Pod的DNS格式为statefulSetName-{0..N-1}.serviceName.namespace.svc.cluster.local</strong></p><p>示例:<code>web-0.nginx.default.svc.cluster.local</code></p><ul><li>serviceName 为 Headless Service 的名字</li><li>0..N-1 为 Pod 所在的序号，从 0 开始到 N-1</li><li>statefulSetName 为 StatefulSet 的名字</li><li>namespace 为服务所在的 namespace，</li><li>Headless Service 和 StatefulSet 必须在相同的 namespace.cluster.local 为 Cluster Domain，</li></ul><h3 id="_6-工作负载" tabindex="-1"><a class="header-anchor" href="#_6-工作负载" aria-hidden="true">#</a> 6 工作负载</h3><table><thead><tr><th>控制器</th><th></th><th>比如</th></tr></thead><tbody><tr><td>Deployment</td><td>无状态应用部署</td><td>微服务、提供多副本等功能</td></tr><tr><td>StatefulSet</td><td>有状态应用部署</td><td>Redis、提供稳定存储、网络等功能</td></tr><tr><td>DaemonSet</td><td>守护型应用部署</td><td>日志收集组件、在每个机器都运行一份</td></tr><tr><td>Job/CornJob</td><td>定时任务部署</td><td>垃圾清理组件、可以在指定时间运行</td></tr></tbody></table>`,66),i=[l];function p(o,c){return a(),s("div",null,i)}const r=n(t,[["render",p],["__file","k8s-07-工作负载详情.html.vue"]]);export{r as default};
