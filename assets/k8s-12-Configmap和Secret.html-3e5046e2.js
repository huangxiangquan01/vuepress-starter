import{_ as n,o as a,c as s,a as e}from"./app-999de8cb.js";const t={},i=e(`<h1 id="configmap-and-secret" tabindex="-1"><a class="header-anchor" href="#configmap-and-secret" aria-hidden="true">#</a> Configmap and Secret</h1><h2 id="_1-configmap" tabindex="-1"><a class="header-anchor" href="#_1-configmap" aria-hidden="true">#</a> 1.Configmap</h2><p><strong>使用场景</strong> 用来存储配置文件的 kubernetes 资源对象，配置内容都存储在 etcd 中。</p><h3 id="定义方法" tabindex="-1"><a class="header-anchor" href="#定义方法" aria-hidden="true">#</a> <strong>定义方法</strong></h3><ol><li><p>通过直接在命令行中指定 configmap 参数创建，即--from-literal</p></li><li><p>通过指定文件创建，即将一个配置文件创建为一个 ConfigMap --from-file=&lt;文件&gt;</p></li><li><p>通过指定目录创建，即将一个目录下的所有配置文件创建为一个 ConfigMap，--from-file=&lt;目录&gt;</p></li><li><p>事先写好标准的 configmap 的 yaml 文件，然后 kubectl create -f 创建</p></li></ol><h3 id="如何使用" tabindex="-1"><a class="header-anchor" href="#如何使用" aria-hidden="true">#</a> <strong>如何使用</strong></h3><ol><li>第一种是通过环境变量的方式，直接传递给 pod</li></ol><ul><li><p>使用 configmap 中指定的 key</p></li><li><p>使用 configmap 中所有的 key</p></li></ul><ol start="2"><li><p>第二种是通过在 pod 的命令行下运行的方式(启动命令中)</p></li><li><p>第三种是作为 volume 的方式挂载到 pod 内configmap 的热更新，</p></li></ol><p><strong>更新 ConfigMap 后</strong>：</p><ul><li><p>使用该 ConfigMap 挂载的 Env 不会同步更新</p></li><li><p>使用该 ConfigMap 挂载的 Volume 中的数据需要一段时间（实测大概 10 秒）才能同步更新</p></li></ul><h4 id="通过环境变量使用" tabindex="-1"><a class="header-anchor" href="#通过环境变量使用" aria-hidden="true">#</a> <strong>通过环境变量使用</strong></h4><ol><li>使用 valueFrom、configMapKeyRef、name、key 指定要用的 key:</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>spec.containers.name.env. valueFromonfigMapKeyRef
Containers:
 env: 
 -name: SPECIAL_LEVEL_KEY 
 valueFrom: 
 configMapKeyRef: 
 name: special-config 
 key: special.how
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>通过 envFrom、configMapRef、name 使得 configmap 中的所有 key/value 对都自动变成</li></ol><p>环境变量：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Containers:
 envFrom: 
 configMapRef: 
 name: special-config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>Env and envfrom in the container.</p></blockquote><h3 id="在启动命令中引用" tabindex="-1"><a class="header-anchor" href="#在启动命令中引用" aria-hidden="true">#</a> <strong>在启动命令中引用</strong></h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>containers:
 command: [ &quot;/bin/sh&quot;, &quot;-c&quot;, &quot;echo $(SPECIAL_LEVEL_KEY) $(SPECIAL_TYPE_KEY)&quot; ] 
 env: 
 -name: SPECIAL_LEVEL_KEY 
 	valueFrom: 
 		configMapKeyRef: 
     name: special-config 
     key: SPECIAL_LEVEL
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="作为-volume-挂载使用" tabindex="-1"><a class="header-anchor" href="#作为-volume-挂载使用" aria-hidden="true">#</a> <strong>作为 volume 挂载使用</strong></h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>spec: 
 containers:
 volumeMounts: 
 - name: config-volume4 
   mountPath: /tmp/config4
   subPath: my.cnf
   volumes: 
   - name: config-volume4 
     configMap: 
     	name: test-config4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-secrets" tabindex="-1"><a class="header-anchor" href="#_2-secrets" aria-hidden="true">#</a> <strong>2.Secrets</strong></h2><p><strong>使用场景</strong></p><p>Secret 解决了密码、token、密钥等敏感数据的配置问题，而不需要把这些敏感数据暴露到镜像或者 Pod Spec 中。Secret 可以以 Volume 或者环境变量的方式使用。</p><h3 id="三种类型" tabindex="-1"><a class="header-anchor" href="#三种类型" aria-hidden="true">#</a> <strong>三种类型</strong></h3><ul><li>Opaque：base64 编码格式的 Secret，用来存储密码、密钥等；但数据也通过 base64 –decode解码得到原始数据</li><li>kubernetes.io/dockerconfigjson：用来存储私有 docker registry 的认证信息。</li><li>kubernetes.io/service-account-token： 用于被 serviceaccount 引用。</li></ul><h3 id="定义方法-1" tabindex="-1"><a class="header-anchor" href="#定义方法-1" aria-hidden="true">#</a> <strong>定义方法</strong></h3><ul><li><p>Yaml 文件</p></li><li><p>从文件中产生</p></li></ul><h3 id="如何使用-1" tabindex="-1"><a class="header-anchor" href="#如何使用-1" aria-hidden="true">#</a> <strong>如何使用</strong></h3><ul><li><p>以环境变量方式</p></li><li><p>以 Volume 方式</p></li></ul><h2 id="_3-例子" tabindex="-1"><a class="header-anchor" href="#_3-例子" aria-hidden="true">#</a> <strong>3.例子</strong></h2><h3 id="_1-通过命令行参数创建-cm" tabindex="-1"><a class="header-anchor" href="#_1-通过命令行参数创建-cm" aria-hidden="true">#</a> <strong>1 通过命令行参数创建 cm</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl create configmap test-config1 --from-literal<span class="token operator">=</span>db.host<span class="token operator">=</span><span class="token number">10.5</span>.10.116 --fromliteral<span class="token operator">=</span>db.port<span class="token operator">=</span>&#39;3306’
<span class="token function">vi</span> configs
db.host <span class="token number">10.5</span>.10.116 
db.port <span class="token number">3306</span>
kubectl create configmap test-config4 --from-env-file<span class="token operator">=</span>./configs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-指定文件创建-cm" tabindex="-1"><a class="header-anchor" href="#_2-指定文件创建-cm" aria-hidden="true">#</a> <strong>2.指定文件创建 cm</strong></h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl create configmap test-config2 --from-file=key1=./app.properties
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_3-指定目录创建-cm" tabindex="-1"><a class="header-anchor" href="#_3-指定目录创建-cm" aria-hidden="true">#</a> <strong>3 指定目录创建 cm</strong></h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl create configmap test-config4 --from-file=./configs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-yaml-文件创建-cm" tabindex="-1"><a class="header-anchor" href="#_4-yaml-文件创建-cm" aria-hidden="true">#</a> <strong>4 yaml 文件创建 cm</strong></h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apiVersion: v1
data:
 lsec1: ltop1
 lsec2: ltop2
 lsec3: ltop3
kind: ConfigMap
metadata:
 creationTimestamp: null
 name: cm8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-yaml-文件创建-secret" tabindex="-1"><a class="header-anchor" href="#_5-yaml-文件创建-secret" aria-hidden="true">#</a> <strong>5. yaml 文件创建 secret</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;admin&#39;</span> <span class="token operator">|</span> base64 
<span class="token comment">#vYWRtaW4= $ </span>
<span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;1f2d1e2e67df&#39;</span> <span class="token operator">|</span> base64 
<span class="token comment">#MWYyZDFlMmU2N2Rm</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> mysecret
<span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque
<span class="token key atrule">data</span><span class="token punctuation">:</span>
 <span class="token key atrule">username</span><span class="token punctuation">:</span> YWRtaW4=
 <span class="token key atrule">password</span><span class="token punctuation">:</span> MWYyZDFlMmU2N2Rm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl create <span class="token parameter variable">-f</span> ./secret.yaml 
<span class="token builtin class-name">echo</span> <span class="token string">&#39;MWYyZDFlMmU2N2Rm&#39;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--decode</span>
<span class="token comment"># 1f2d1e2e67df</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-命令行创建-secret" tabindex="-1"><a class="header-anchor" href="#_6-命令行创建-secret" aria-hidden="true">#</a> <strong>6.命令行创建 secret</strong></h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl create secret generic test --from-literal=username=admin --from-literal=password=1f2d1e2e67df
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_7-查看命令以及验证" tabindex="-1"><a class="header-anchor" href="#_7-查看命令以及验证" aria-hidden="true">#</a> <strong>7.查看命令以及验证</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get cm 
kubectl describe cm test-config1

kubectl get secrets
kubectl describe secrets test-config1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-通过-env-使用-cm-传递启动命令参数" tabindex="-1"><a class="header-anchor" href="#_8-通过-env-使用-cm-传递启动命令参数" aria-hidden="true">#</a> <strong>8.通过 env 使用 CM 传递启动命令参数</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> dapi<span class="token punctuation">-</span>test<span class="token punctuation">-</span>pod
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
 <span class="token key atrule">containers</span><span class="token punctuation">:</span>
 <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> test<span class="token punctuation">-</span>container
 	 <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
   <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;echo $(SPECIAL_LEVEL_KEY) $(SPECIAL_TYPE_KEY)&quot;</span> <span class="token punctuation">]</span>
   <span class="token key atrule">env</span><span class="token punctuation">:</span>
   <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SPECIAL_LEVEL_KEY
     <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
       <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
        <span class="token key atrule">name</span><span class="token punctuation">:</span> special<span class="token punctuation">-</span>config
        <span class="token key atrule">key</span><span class="token punctuation">:</span> SPECIAL_LEVEL
   <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SPECIAL_TYPE_KEY
     <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
      <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
   			<span class="token key atrule">name</span><span class="token punctuation">:</span> special<span class="token punctuation">-</span>config
 				<span class="token key atrule">key</span><span class="token punctuation">:</span> SPECIAL_TYPE
 <span class="token key atrule">restartPolicy</span><span class="token punctuation">:</span> Never
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-通过-env-使用-cm-和-secret" tabindex="-1"><a class="header-anchor" href="#_9-通过-env-使用-cm-和-secret" aria-hidden="true">#</a> <strong>9.通过 env 使用 CM 和 Secret</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> secret<span class="token punctuation">-</span>env<span class="token punctuation">-</span>pod
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
 	<span class="token key atrule">containers</span><span class="token punctuation">:</span>
 	<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mycontainer
 	 	<span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
   	<span class="token key atrule">env</span><span class="token punctuation">:</span>
   	<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SECRET_USERNAME
   	 	<span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
     		<span class="token punctuation">-</span> <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
       		<span class="token key atrule">name</span><span class="token punctuation">:</span> mycm
       		<span class="token key atrule">key</span><span class="token punctuation">:</span> username
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> SECRET_password
      <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">secretKeyRef</span><span class="token punctuation">:</span>
       	<span class="token key atrule">name</span><span class="token punctuation">:</span> mysecret
       	<span class="token key atrule">key</span><span class="token punctuation">:</span> password
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-通过-envfrom-使用-cm-和-secret" tabindex="-1"><a class="header-anchor" href="#_10-通过-envfrom-使用-cm-和-secret" aria-hidden="true">#</a> <strong>10.通过 envFrom 使用 CM 和 Secret</strong></h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apiVersion: v1
kind: Pod
metadata:
 	name: dapi-test-pod
spec:
	containers:
 	- name: test-container
 		image: busybox
 		command: [ &quot;/bin/sh&quot;, &quot;-c&quot;, &quot;env&quot; ]
 		envFrom:
 		- configMapRef:
 				name: mycm
 		- secretRef:
 				name: mysecret
 restartPolicy: Never
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-通过-volume-使用-cm-和-secrets" tabindex="-1"><a class="header-anchor" href="#_11-通过-volume-使用-cm-和-secrets" aria-hidden="true">#</a> <strong>11.通过 Volume 使用 CM 和 Secrets</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> secret<span class="token punctuation">-</span>test<span class="token punctuation">-</span>pod
 <span class="token key atrule">labels</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> secret<span class="token punctuation">-</span>test
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
 	<span class="token key atrule">volumes</span><span class="token punctuation">:</span>
 	<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secret<span class="token punctuation">-</span>volume
 	 	<span class="token key atrule">secret</span><span class="token punctuation">:</span>
   		<span class="token key atrule">secretName</span><span class="token punctuation">:</span> ssh<span class="token punctuation">-</span>key<span class="token punctuation">-</span>secret
 	<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> cm<span class="token punctuation">-</span>volume
 	 	<span class="token key atrule">configMap</span><span class="token punctuation">:</span>
 			<span class="token key atrule">name</span><span class="token punctuation">:</span> mycm
	<span class="token key atrule">containers</span><span class="token punctuation">:</span>
 	<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ssh<span class="token punctuation">-</span>test<span class="token punctuation">-</span>container
 		<span class="token key atrule">image</span><span class="token punctuation">:</span> busybox
 		<span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secret<span class="token punctuation">-</span>volume
 			<span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
 			<span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/etc/secret-volume&quot;</span>
 		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> cm<span class="token punctuation">-</span>volume
 			<span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/etc/cm-volume&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,56),l=[i];function c(p,o){return a(),s("div",null,l)}const u=n(t,[["render",c],["__file","k8s-12-Configmap和Secret.html.vue"]]);export{u as default};
