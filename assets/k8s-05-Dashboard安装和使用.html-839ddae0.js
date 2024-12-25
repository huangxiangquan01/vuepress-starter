import{_ as a,o as s,c as n,a as e}from"./app-999de8cb.js";const t={},i=e(`<h1 id="dashboard" tabindex="-1"><a class="header-anchor" href="#dashboard" aria-hidden="true">#</a> Dashboard</h1><h2 id="dashboard-安装和介绍" tabindex="-1"><a class="header-anchor" href="#dashboard-安装和介绍" aria-hidden="true">#</a> <strong>Dashboard 安装和介绍</strong></h2><h3 id="_1-dashboard-安装" tabindex="-1"><a class="header-anchor" href="#_1-dashboard-安装" aria-hidden="true">#</a> <strong>1 dashboard 安装</strong></h3><p>第一步：安装文件和 image</p><blockquote><p>Dashboard project</p><p>https://github.com/kubernetes/dashboard</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token function">wget</span> <span class="token parameter variable">-y</span>
<span class="token function">wget</span> https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml
change image pull and <span class="token function">service</span> <span class="token builtin class-name">type</span>
kubectl apply <span class="token parameter variable">-f</span> kubernetes-dashboard.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步：查看 dashboard 的 POD 是否正常启动，如果正常说明安装成功</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> kubectl get pods <span class="token parameter variable">--namespace</span><span class="token operator">=</span>kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第三步：配置外网访问（不配置的话默认只能集群内访问）</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 修改 service 配置，将 type: ClusterIP 改成 NodePort </span>
kubectl edit <span class="token function">service</span> kubernetes-dashboard <span class="token parameter variable">--namespace</span><span class="token operator">=</span>kube-system
<span class="token comment"># 查看外网暴露端口(我们可以看到外网端口是 32240)</span>
 kubectl get <span class="token function">service</span> <span class="token parameter variable">--namespace</span><span class="token operator">=</span>kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-访问-dashboard" tabindex="-1"><a class="header-anchor" href="#_2-访问-dashboard" aria-hidden="true">#</a> <strong>2.访问 dashboard</strong></h3><ul><li><p>创建 dashboard 用户</p><p>​ 创建 admin-token.yaml 文件，文件内容如下：</p></li></ul><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRoleBinding
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1beta1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> dashboard<span class="token punctuation">-</span>admin
 <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
  <span class="token key atrule">rbac.authorization.kubernetes.io/autoupdate</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
 <span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
 <span class="token key atrule">name</span><span class="token punctuation">:</span> cluster<span class="token punctuation">-</span>admin
 <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
  <span class="token key atrule">name</span><span class="token punctuation">:</span> dashboard<span class="token punctuation">-</span>admin
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kube<span class="token punctuation">-</span>system
<span class="token punctuation">---</span> 
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
 <span class="token key atrule">name</span><span class="token punctuation">:</span> dashboard<span class="token punctuation">-</span>admin
 <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kube<span class="token punctuation">-</span>system
 <span class="token key atrule">labels</span><span class="token punctuation">:</span>
   <span class="token key atrule">kubernetes.io/cluster-service</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>
   <span class="token key atrule">addonmanager.kubernetes.io/mode</span><span class="token punctuation">:</span> Reconcile
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>创建用户</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> kubectl create <span class="token parameter variable">-f</span> admin-token.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>获取登陆 token</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> kubectl describe secret/<span class="token variable"><span class="token variable">$(</span>kubectl get secret <span class="token parameter variable">-n</span><span class="token operator">=</span>kube-system <span class="token operator">|</span><span class="token function">grep</span> admin<span class="token operator">|</span><span class="token function">awk</span> <span class="token string">&#39;{print $1}&#39;</span><span class="token variable">)</span></span> <span class="token parameter variable">-n</span><span class="token operator">=</span>kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>使用 kubeconf 登陆</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token assign-left variable">DASH_TOCKEN</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl get secret <span class="token parameter variable">-n</span> kube-system dashboard-admin-token-5kzp5 <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token punctuation">{</span>.data.token<span class="token punctuation">}</span><span class="token operator">|</span>base64 <span class="token parameter variable">-d</span><span class="token variable">)</span></span>

kubectl config set-cluster kubernetes <span class="token parameter variable">--server</span><span class="token operator">=</span><span class="token number">192.168</span>.56.5:6443 <span class="token parameter variable">--kubeconfig</span><span class="token operator">=</span>/root/dashbord-admin.conf

kubectl config set-credentials dashboard-admin <span class="token parameter variable">--token</span><span class="token operator">=</span><span class="token variable">$DASH_TOCKEN</span> <span class="token parameter variable">--kubeconfig</span><span class="token operator">=</span>/root/dashbord-admin.conf

kubectl config set-context dashboard-admin@kubernetes <span class="token parameter variable">--cluster</span><span class="token operator">=</span>kubernetes <span class="token parameter variable">--user</span><span class="token operator">=</span>dashboard-admin <span class="token parameter variable">--kubeconfig</span><span class="token operator">=</span>/root/dashbord-admin.conf

kubectl config use-context dashboard-admin@kubernetes <span class="token parameter variable">--kubeconfig</span><span class="token operator">=</span>/root/dashbord-admin.conf<span class="token punctuation">\\</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生成的 dashbord-admin.conf 即可用于登录 dashboard</p><ul><li>使用用户名和密码登陆。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 如果你的环境内不止一个 master,那 basic-auth-file 这个文件要在每一个 master 上生成,并 保证路径及内容和其他 master 一致！并且每个 master 都要修改 kube-apiserver.yaml 文件！</span>

<span class="token comment"># 创建用户文件 user,password,userID userID 不可重复</span>
<span class="token builtin class-name">echo</span> <span class="token string">&#39;admin,admin,1&#39;</span> <span class="token operator">&gt;</span> /etc/kubernetes/pki/basic_auth_file
<span class="token comment"># 修改配置</span>
<span class="token function">vim</span> /etc/kubernetes/manifests/kube-apiserver.yaml
<span class="token comment"># 增加如下参数</span>
- --basic-auth-file<span class="token operator">=</span>/etc/kubernetes/pki/basic_auth_file
<span class="token comment"># 重启 api-server</span>

<span class="token comment"># 更新配置</span>
kubectl apply <span class="token parameter variable">-f</span> /etc/kubernetes/manifests/kube-apiserver.yaml

<span class="token comment"># 将用户与权限绑定</span>
kubectl create clusterrolebinding login-on-dashboard-with-cluster-admin <span class="token parameter variable">--clusterrole</span><span class="token operator">=</span>cluster-admin <span class="token parameter variable">--user</span><span class="token operator">=</span>admin

<span class="token comment"># 查看绑定</span>
kubectl get clusterrolebinding login-on-dashboard-with-cluster-admin

<span class="token comment"># 修改 kubernetes-dashboard.yaml</span>
<span class="token comment"># 开启 authentication-mode=basic 配置</span>
args:
 - --auto-generate-certificates
 - <span class="token parameter variable">--namespace</span><span class="token operator">=</span>kubernetes-dashboard
 - --token-ttl<span class="token operator">=</span><span class="token number">43200</span>
 - --authentication-mode<span class="token operator">=</span>basic
 
<span class="token comment"># 更新 kubernetes-dashboard</span>
kubectl apply <span class="token parameter variable">-f</span> kubernetes-dashboard.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-dashboard-使用" tabindex="-1"><a class="header-anchor" href="#_3-dashboard-使用" aria-hidden="true">#</a> <strong>3.dashboard 使用</strong></h4><p>创建 pod,service,deployment and application</p><p>​</p>`,25),l=[i];function r(p,o){return s(),n("div",null,l)}const d=a(t,[["render",r],["__file","k8s-05-Dashboard安装和使用.html.vue"]]);export{d as default};
