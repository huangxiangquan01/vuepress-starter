import{_ as n,o as s,c as a,a as e}from"./app-999de8cb.js";const t={},p=e(`<h1 id="部署中间件" tabindex="-1"><a class="header-anchor" href="#部署中间件" aria-hidden="true">#</a> 部署中间件</h1><h2 id="_1-mysql" tabindex="-1"><a class="header-anchor" href="#_1-mysql" aria-hidden="true">#</a> <strong>1.Mysql</strong></h2><h3 id="mysql-复制原理" tabindex="-1"><a class="header-anchor" href="#mysql-复制原理" aria-hidden="true">#</a> <strong>Mysql 复制原理</strong></h3><p>master 将改变记录到二进制日志(binary log)中(这些记录叫做二进制日志事件，binary log events)；slave 将 master 的 binary log events 拷贝到它的中继日志(relay log)；slave 重做中继日志中的事件，将改变反映它自己的数据。</p><p>Mysql 内建的复制功能是构建大型，高性能应用程序的基础。将 Mysql 的数据分布到多个系统上去，这种分布的机制，是通过将 Mysql 的某一台主机的数据复制到其它主机(slaves)上，并重新执行一遍来实现的。复制过程中一个服务器充当主服务器，而一个或多个其它服务器充当从服务器。主服务器将更新写入二进制日志文件，并维护文件的一个索引以跟踪日志循环。这些日志可以记录发送到从服务器的更新。当一个从服务器连接主服务器时，它通知主服务器从服务器在日志中读取的最后一次成功更新的位置。从服务器接收从那时起发生的任何更新，然后封锁并等待主服务器通知新的更新接触点开始更新。</p><p>需要使用 show master status; 查看当时的 binlog 状态点</p><p><strong>Binlog 三种模式</strong></p><ul><li>基于SQL语句的复制（statement-based replication, SBR）: 在主服务器上执行的SQL语句，在从服务器上执行同样的SQL语句，效率比较高。</li><li>基于行的复制（Row-based replication, RBR）： 主服务器把表的行变化作为事件写入到二进制日志中，主服务器把代表了行变化的事件复制到从服务器中。</li><li>混合模式复制（mixed-based replication, MBR）: 先采用基于语句的复制，一旦发现基于语句无法精确复制时，再采用行复制。</li></ul><h3 id="k8s-部署-1-主-1-从" tabindex="-1"><a class="header-anchor" href="#k8s-部署-1-主-1-从" aria-hidden="true">#</a> <strong>K8s 部署-1 主 1 从</strong></h3><h4 id="主数据库设置" tabindex="-1"><a class="header-anchor" href="#主数据库设置" aria-hidden="true">#</a> <strong>主数据库设置</strong></h4><p>Mysql 数据库的设置文件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[client]
port		= 3306
socket		= /var/run/mysqld/mysqld.sock

[mysqld_safe]
pid-file	= /var/run/mysqld/mysqld.pid
socket		= /var/run/mysqld/mysqld.sock
nice		= 0

[mysqld]
skip-host-cache
skip-name-resolve
user		= mysql
pid-file	= /var/run/mysqld/mysqld.pid
socket		= /var/run/mysqld/mysqld.sock
port		= 3306
basedir		= /usr
datadir		= /var/lib/mysql
tmpdir		= /tmp
lc-messages-dir	= /usr/share/mysql
explicit_defaults_for_timestamp

# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
#bind-address	= 127.0.0.1

#log-error	= /var/log/mysql/error.log

# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

# * IMPORTANT: Additional settings that can override those from this file!
#   The files must end with &#39;.cnf&#39;, otherwise they&#39;ll be ignored.
#
#!includedir /etc/mysql/conf.d/
#启用二进制日志
log_bin=mysql-bin
#主服务器唯一ID
server_id=1
#不需要复制的数据库
binlog-ignore-db=mysql
#需要复制的数据库
binlog-do-db=test
binlog-do-db=nacos_config
#设置binlog的格式
binlog-format=STATEMENT
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>mysql-master.yaml</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>master
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>master
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3306</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>master
  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysecret
<span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">password</span><span class="token punctuation">:</span> MTIzNDU2
  <span class="token key atrule">username</span><span class="token punctuation">:</span> cm9vdA==
<span class="token comment">#user/pass=root/123456</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>master
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> <span class="token string">&quot;mysql-master&quot;</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>local<span class="token punctuation">-</span>storage
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">volume.beta.kubernetes.io/storage-class</span><span class="token punctuation">:</span> <span class="token string">&quot;nfs&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">&quot;ReadWriteOnce&quot;</span> <span class="token punctuation">]</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 25Gi
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>master
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">labels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>master
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> master<span class="token punctuation">-</span>cm
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
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/etc/mysql&quot;</span>
<span class="token comment">#      initContainers:</span>
<span class="token comment">#      - name: init-wordpress-mysql</span>
<span class="token comment">#        image: busybox</span>
<span class="token comment">#        imagePullPolicy: IfNotPresent</span>
<span class="token comment">##        command: [&#39;sh&#39;, &#39;-c&#39;, &#39;rm -rf /data/*&#39;, &#39;until nslookup mysql-master; do echo waiting for mysql-master; sleep 2; done;&#39;]</span>
<span class="token comment">#        volumeMounts:</span>
<span class="token comment">#        - name: mysql-local-storage</span>
<span class="token comment">#          readOnly: false</span>
<span class="token comment">#          mountPath: /data</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl create cm master-cm --from-file<span class="token operator">=</span>my.cnf 
kubectl apply <span class="token parameter variable">-f</span> mysql-master.yaml

<span class="token comment"># 主数据库上用户的设置</span>
kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> mysql-master-0 -- mysql <span class="token parameter variable">-h</span> mysql-master <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p123456</span>

<span class="token comment"># Slave 数据库使用来连接的账户并授权</span>
grant all privileges on *.* to <span class="token string">&#39;myslave&#39;</span>@<span class="token string">&#39;mysql-slave-0.mysql-slave&#39;</span> identified by <span class="token string">&#39;myslave@123AC&#39;</span> with grant option<span class="token punctuation">;</span>

<span class="token comment">#root 账户授权 </span>
GRANT ALL PRIVILEGES ON *.* TO <span class="token string">&#39;root&#39;</span>@<span class="token string">&#39;%&#39;</span> IDENTIFIED BY <span class="token string">&#39;123456&#39;</span><span class="token punctuation">;</span>
flush privileges<span class="token punctuation">;</span>

<span class="token comment"># 查看用户状态</span>
use mysql<span class="token punctuation">;</span>
<span class="token keyword">select</span> host,user from user<span class="token punctuation">;</span>
show master status<span class="token punctuation">;</span> <span class="token comment"># 同步位置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="从数据库设置" tabindex="-1"><a class="header-anchor" href="#从数据库设置" aria-hidden="true">#</a> <strong>从数据库设置</strong></h4><p>从数据库用户的设置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[client]
port		= 3306
socket		= /var/run/mysqld/mysqld.sock

[mysqld_safe]
pid-file	= /var/run/mysqld/mysqld.pid
socket		= /var/run/mysqld/mysqld.sock
nice		= 0

[mysqld]
skip-host-cache
skip-name-resolve
user		= mysql
pid-file	= /var/run/mysqld/mysqld.pid
socket		= /var/run/mysqld/mysqld.sock
port		= 3306
basedir		= /usr
datadir		= /var/lib/mysql
tmpdir		= /tmp
lc-messages-dir	= /usr/share/mysql
explicit_defaults_for_timestamp

# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
#bind-address	= 127.0.0.1

#log-error	= /var/log/mysql/error.log

# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

# * IMPORTANT: Additional settings that can override those from this file!
#   The files must end with &#39;.cnf&#39;, otherwise they&#39;ll be ignored.
#
#!includedir /etc/mysql/conf.d/
relay-log=mysql-relay
server_id=2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>mysql-slave.yaml</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>slave
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>slave
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3306</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>slave
  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysecret
<span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">password</span><span class="token punctuation">:</span> MTIzNDU2
  <span class="token key atrule">username</span><span class="token punctuation">:</span> cm9vdA==
<span class="token comment">#user/pass=root/123456</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>slave
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> <span class="token string">&quot;mysql-slave&quot;</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>local<span class="token punctuation">-</span>storage
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">volume.beta.kubernetes.io/storage-class</span><span class="token punctuation">:</span> <span class="token string">&quot;nfs&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">&quot;ReadWriteOnce&quot;</span> <span class="token punctuation">]</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 25Gi
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>slave
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">labels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> mysql<span class="token punctuation">-</span>slave
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> slave<span class="token punctuation">-</span>cm
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
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/etc/mysql&quot;</span>
<span class="token comment">#      initContainers:</span>
<span class="token comment">#      - name: init-wordpress-mysql</span>
<span class="token comment">#        image: busybox</span>
<span class="token comment">#        imagePullPolicy: IfNotPresent</span>
<span class="token comment">##        command: [&#39;sh&#39;, &#39;-c&#39;, &#39;rm -rf /data/*&#39;, &#39;until nslookup mysql-master; do echo waiting for mysql-master; sleep 2; done;&#39;]</span>
<span class="token comment">#        volumeMounts:</span>
<span class="token comment">#        - name: mysql-local-storage</span>
<span class="token comment">#          readOnly: false</span>
<span class="token comment">#          mountPath: /data</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl create cm slave-cm --from-file<span class="token operator">=</span>my.cnf 
kubectl apply <span class="token parameter variable">-f</span> mysql-slave.yaml

kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> mysql-slave-0 -- mysql <span class="token parameter variable">-h</span> mysql-slave <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p123456</span>

GRANT ALL PRIVILEGES ON *.* TO <span class="token string">&#39;root&#39;</span>@<span class="token string">&#39;%&#39;</span> IDENTIFIED BY <span class="token string">&#39;123456&#39;</span><span class="token punctuation">;</span>
flush privileges<span class="token punctuation">;</span>
<span class="token keyword">select</span> host,user from mysql.user<span class="token punctuation">;</span>

<span class="token comment"># Slave 数据库连接主数据库设置 master_log_pos=具体值;</span>
change master to <span class="token assign-left variable">master_host</span><span class="token operator">=</span><span class="token string">&#39;mysql-master&#39;</span>, <span class="token assign-left variable">master_user</span><span class="token operator">=</span><span class="token string">&#39;myslave&#39;</span>, <span class="token assign-left variable">master_password</span><span class="token operator">=</span><span class="token string">&#39;myslave@123AC&#39;</span>, <span class="token assign-left variable">master_log_file</span><span class="token operator">=</span><span class="token string">&#39;mysql-bin.000003&#39;</span>, <span class="token assign-left variable">master_log_pos</span><span class="token operator">=</span><span class="token number">911</span><span class="token punctuation">;</span>

<span class="token comment"># 启动 slave 功能</span>
start slave<span class="token punctuation">;</span>
<span class="token comment"># 查看 slave 配置</span>
show slave status <span class="token punctuation">\\</span>G<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>注意如果 master 已经创建了库和表，从数据库需要自己建立相应的库和表。</p></blockquote><h3 id="mysql-主从复制验证" tabindex="-1"><a class="header-anchor" href="#mysql-主从复制验证" aria-hidden="true">#</a> <strong>Mysql 主从复制验证</strong></h3><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">show</span> <span class="token keyword">databases</span><span class="token punctuation">;</span>
<span class="token keyword">show</span> <span class="token keyword">tables</span><span class="token punctuation">;</span>

<span class="token comment"># @@hostname 测试</span>
<span class="token keyword">create</span> <span class="token keyword">database</span> test<span class="token punctuation">;</span> 
<span class="token keyword">use</span> test<span class="token punctuation">;</span>
<span class="token keyword">create</span> <span class="token keyword">table</span> mytbl<span class="token punctuation">(</span>id <span class="token keyword">INT</span><span class="token punctuation">,</span>name <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">insert</span> <span class="token keyword">into</span> mytbl <span class="token keyword">values</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span>@<span class="token variable">@hostname</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">use</span> test<span class="token punctuation">;</span>
<span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> mytbl<span class="token punctuation">;</span>
<span class="token keyword">insert</span> <span class="token keyword">into</span> mytbl <span class="token keyword">values</span> <span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span>@<span class="token variable">@server_id</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">SHOW</span> SLAVE HOSTS<span class="token punctuation">;</span>

<span class="token keyword">drop</span> <span class="token keyword">database</span> test<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-redis-cluster" tabindex="-1"><a class="header-anchor" href="#_2-redis-cluster" aria-hidden="true">#</a> 2.<strong>Redis Cluster</strong></h2><h3 id="集群原理" tabindex="-1"><a class="header-anchor" href="#集群原理" aria-hidden="true">#</a> <strong>集群原理</strong></h3><p>Redis Cluster 集群分区方案采用去中心化的方式，包括：sharding（分区）、replication（复制）、failover（故障转移）。</p><h3 id="集群安装" tabindex="-1"><a class="header-anchor" href="#集群安装" aria-hidden="true">#</a> <strong>集群安装</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> redis<span class="token punctuation">-</span>cluster
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">update-node.sh</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
    #!/bin/sh
    REDIS_NODES=&quot;/data/nodes.conf&quot;
    sed -i -e &quot;/myself/ s/[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}/\${POD_IP}/&quot; \${REDIS_NODES}
    exec &quot;$@&quot;</span>
  <span class="token key atrule">redis.conf</span><span class="token punctuation">:</span> <span class="token punctuation">|</span>+
    cluster<span class="token punctuation">-</span>enabled yes
    cluster<span class="token punctuation">-</span>require<span class="token punctuation">-</span>full<span class="token punctuation">-</span>coverage no
    cluster<span class="token punctuation">-</span>node<span class="token punctuation">-</span>timeout 15000
    cluster<span class="token punctuation">-</span>config<span class="token punctuation">-</span>file /data/nodes.conf
    cluster<span class="token punctuation">-</span>migration<span class="token punctuation">-</span>barrier 1
    appendonly yes
    protected<span class="token punctuation">-</span>mode no
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> redis
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">6379</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">6379</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> client
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">16379</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">16379</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> gossip
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> redis<span class="token punctuation">-</span>cluster
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> redis
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> redis
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">6</span>
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> data
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">volume.beta.kubernetes.io/storage-class</span><span class="token punctuation">:</span> <span class="token string">&quot;course-nfs-storage&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">&quot;ReadWriteOnce&quot;</span> <span class="token punctuation">]</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 5Gi
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> redis<span class="token punctuation">-</span>cluster
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> redis<span class="token punctuation">-</span>cluster
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> redis
        <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span>5.0.5<span class="token punctuation">-</span>alpine
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">6379</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> client
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">16379</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> gossip
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;/conf/update-node.sh&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;redis-server&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;/conf/redis.conf&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> POD_IP
          <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
            <span class="token key atrule">fieldRef</span><span class="token punctuation">:</span>
              <span class="token key atrule">fieldPath</span><span class="token punctuation">:</span> status.podIP
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> conf
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /conf
          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> data
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /data
          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> conf
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> redis<span class="token punctuation">-</span>cluster
          <span class="token key atrule">defaultMode</span><span class="token punctuation">:</span> <span class="token number">075</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="初始化-redis-集群" tabindex="-1"><a class="header-anchor" href="#初始化-redis-集群" aria-hidden="true">#</a> <strong>初始化 redis 集群</strong></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pods <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>redis-cluster <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">&#39;{range.items[*]}{.status.podIP}:6379 &#39;</span>

kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> redis-0 <span class="token parameter variable">-n</span> demo-project  -- <span class="token function">sh</span> redis-cli <span class="token parameter variable">--cluster</span> create <span class="token number">10.244</span>.2.124:6379 <span class="token number">10.244</span>.2.125:6379 <span class="token number">10.244</span>.2.126:6379 <span class="token number">10.244</span>.2.127:6379 <span class="token number">10.244</span>.2.128:6379 <span class="token number">10.244</span>.2.129:6379 --cluster-replicas <span class="token number">1</span>

<span class="token comment"># redis-cli --cluster create --cluster-replicas 1</span>
<span class="token comment"># kubectl exec -it redis-0 -n demo-project  -- redis-cli --cluster create --cluster-replicas 1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>必须使用 IP add. 域名不好使</strong></p><p>无法解析，换成无头服务后，也不可以，使用 service name 也不可以了。</p></blockquote><h4 id="更新-redis-配置" tabindex="-1"><a class="header-anchor" href="#更新-redis-配置" aria-hidden="true">#</a> 更新 redis 配置</h4><p>需要在初始化集群一切正常后配置，configMap 中加入下面的配置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>masterauth “123!@#”
requirepass “123!@#”
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="集群访问并验证" tabindex="-1"><a class="header-anchor" href="#集群访问并验证" aria-hidden="true">#</a> <strong>集群访问并验证</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> redis-0 -- redis-cli <span class="token parameter variable">-h</span> redis <span class="token parameter variable">-p</span> <span class="token number">6379</span> <span class="token parameter variable">-c</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>cluster nodes ：列出集群当前已知的所有节点（ node），以及这些节点的相关信息。</p><p><strong>节点</strong></p><ul><li><p>cluster meet ip port ：将 ip 和 port 所指定的节点添加到集群当中，让它成为集群的一份子。</p></li><li><p>cluster forget node_id ：从集群中移除 node_id 指定的节点。</p></li><li><p>cluster replicate node_id ：将当前节点设置为 node_id 指定的节点的从节点。</p></li><li><p>cluster saveconfig ：将节点的配置文件保存到硬盘里面。</p></li></ul><p><strong>槽(slot)</strong></p><ul><li><p>cluster addslots slot [slot ...] ：将一个或多个槽（ slot）指派（ assign）给当前节点。</p></li><li><p>cluster delslots slot [slot ...] ：移除一个或多个槽对当前节点的指派。</p></li><li><p>cluster flushslots ：移除指派给当前节点的所有槽，让当前节点变成一个没有指派任何槽的节点。</p></li><li><p>cluster setslot slot node node_id ：将槽 slot 指派给 node_id 指定的节点，如果槽已经指派给<strong>另一个节点，那么先让另一个节点删除该槽</strong>&gt;，然后再进行指派。</p></li><li><p>cluster setslot slot migrating node_id ：将本节点的槽 slot 迁移到 node_id 指定的节点中。</p></li><li><p>cluster setslot slot importing node_id ：从 node_id 指定的节点中导入槽 slot 到本节点。</p></li><li><p>cluster setslot slot stable ：取消对槽 slot 的导入（ import）或者迁移（ migrate）。</p></li></ul><p><strong>键</strong></p><ul><li><p>cluster keyslot key ：计算键 key 应该被放置在哪个槽上。</p></li><li><p>cluster countkeysinslot slot ：返回槽 slot 目前包含的键值对数量。</p></li><li><p>cluster getkeysinslot slot count ：返回 count 个 slot 槽中的键</p></li></ul><h2 id="_3-rocketmq" tabindex="-1"><a class="header-anchor" href="#_3-rocketmq" aria-hidden="true">#</a> 3.<strong>Rocketmq</strong></h2><h3 id="部署说明" tabindex="-1"><a class="header-anchor" href="#部署说明" aria-hidden="true">#</a> <strong>部署说明</strong></h3><blockquote><p>RocketMQ 主要有四大组成部分：NameServer、Broker、Producer、Consumer。</p></blockquote><h4 id="nameserver-作用" tabindex="-1"><a class="header-anchor" href="#nameserver-作用" aria-hidden="true">#</a> <strong>Nameserver</strong> <strong>作用</strong></h4><p>NameServer 可以说是 Broker 的注册中心，Broker 在启动的时候，会根据配置信息向所有的 NameServer 进行注册，NameServer 会和每次前来注册的 Broker 保持长连接，并每30s 检查 Broker 是否还存活，对于宕机的 Broker，NameServer 会将其从列表中剔除。当生产者需要向 Broker 发送消息的时候，就会先从 NameServer 里面获取 Broker 的地址列表，然后负载均衡，选择一台消息服务器进行发送。</p><h4 id="rocketmq-的部署方式有多种" tabindex="-1"><a class="header-anchor" href="#rocketmq-的部署方式有多种" aria-hidden="true">#</a> <strong>RocketMQ</strong> <strong>的部署方式有多种</strong></h4><ul><li>2m-noslave： 多 Master 模式，无 Slave。[双主模式]</li><li>2m-2s-sync： 多 Master 多 Slave 模式，同步双写 [双主双从+同步模式]</li><li>2m-2s-async：多 Master 多 Slave 模式，异步复制 [双主双从+异步模式]</li></ul><h4 id="rocketmq提供了三种方式发送消息" tabindex="-1"><a class="header-anchor" href="#rocketmq提供了三种方式发送消息" aria-hidden="true">#</a> <strong>RocketMQ提供了三种方式发送消息</strong></h4><ul><li><p>同步发送: 指消息发送方发出数据后会在收到接收方发回响应之后才发下一个数据包。</p></li><li><p>异步发送: 指发送方发出数据后，不等接收方发回响应，接着发送下个数据包, 异步方式也需要 Broker 返回确认信息。</p></li><li><p>单向发送: 指只负责发送消息而不等待服务器回应且没有回调函数触发。</p></li></ul><h4 id="rocketmq-端口" tabindex="-1"><a class="header-anchor" href="#rocketmq-端口" aria-hidden="true">#</a> <strong>RocketMQ 端口：</strong></h4><p>rocketmq 默认端口：9876（即 nameserver 端口）</p><p>非 vip 通道端口：10911</p><p>vip 通道端口：10909</p><p>10909 是 VIP 通道对应的端口，在 JAVA 中的消费者对象或者是生产者对象中关闭 VIP 通道即可，无需开放 10909 端口</p><h3 id="集群部署" tabindex="-1"><a class="header-anchor" href="#集群部署" aria-hidden="true">#</a> 集群<strong>部署</strong></h3><p><strong>broker-a.properties</strong></p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token key attr-name">brokerClusterName</span><span class="token punctuation">=</span><span class="token value attr-value">rocketmq-cluster</span>
<span class="token key attr-name">brokerName</span><span class="token punctuation">=</span><span class="token value attr-value">broker-a</span>
<span class="token key attr-name">brokerId</span><span class="token punctuation">=</span><span class="token value attr-value">0</span>
<span class="token key attr-name">namesrvAddr</span><span class="token punctuation">=</span><span class="token value attr-value">rocketmq-0.rocketmq:9876</span>
<span class="token key attr-name">defaultTopicQueueNums</span><span class="token punctuation">=</span><span class="token value attr-value">4</span>
<span class="token key attr-name">autoCreateTopicEnable</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token key attr-name">autoCreateSubscriptionGroup</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token key attr-name">listenPort</span><span class="token punctuation">=</span><span class="token value attr-value">20911</span>
<span class="token key attr-name">deleteWhen</span><span class="token punctuation">=</span><span class="token value attr-value">04</span>
<span class="token key attr-name">fileReservedTime</span><span class="token punctuation">=</span><span class="token value attr-value">120</span>
<span class="token key attr-name">mapedFileSizeCommitLog</span><span class="token punctuation">=</span><span class="token value attr-value">1073741824</span>
<span class="token key attr-name">mapedFileSizeConsumeQueue</span><span class="token punctuation">=</span><span class="token value attr-value">300000</span>
<span class="token key attr-name">diskMaxUsedSpaceRatio</span><span class="token punctuation">=</span><span class="token value attr-value">88</span>
<span class="token key attr-name">storePathRootDir</span><span class="token punctuation">=</span><span class="token value attr-value">/data/rocketmq/store</span>
<span class="token key attr-name">maxMessageSize</span><span class="token punctuation">=</span><span class="token value attr-value">65536</span>
<span class="token key attr-name">brokerRole</span><span class="token punctuation">=</span><span class="token value attr-value">MASTER</span>
<span class="token key attr-name">flushDiskType</span><span class="token punctuation">=</span><span class="token value attr-value">SYNC_FLUSH</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>broker-a-s.properties</strong></p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token key attr-name">brokerClusterName</span><span class="token punctuation">=</span><span class="token value attr-value">rocketmq-cluster</span>
<span class="token key attr-name">brokerName</span><span class="token punctuation">=</span><span class="token value attr-value">broker-a</span>
<span class="token key attr-name">brokerId</span><span class="token punctuation">=</span><span class="token value attr-value">1</span>
<span class="token key attr-name">namesrvAddr</span><span class="token punctuation">=</span><span class="token value attr-value">rocketmq-0.rocketmq:9876</span>
<span class="token key attr-name">defaultTopicQueueNums</span><span class="token punctuation">=</span><span class="token value attr-value">4</span>
<span class="token key attr-name">autoCreateTopicEnable</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token key attr-name">autoCreateSubscriptionGroup</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token key attr-name">listenPort</span><span class="token punctuation">=</span><span class="token value attr-value">20911</span>
<span class="token key attr-name">deleteWhen</span><span class="token punctuation">=</span><span class="token value attr-value">04</span>
<span class="token key attr-name">fileReservedTime</span><span class="token punctuation">=</span><span class="token value attr-value">120</span>
<span class="token key attr-name">mapedFileSizeCommitLog</span><span class="token punctuation">=</span><span class="token value attr-value">1073741824</span>
<span class="token key attr-name">mapedFileSizeConsumeQueue</span><span class="token punctuation">=</span><span class="token value attr-value">300000</span>
<span class="token key attr-name">diskMaxUsedSpaceRatio</span><span class="token punctuation">=</span><span class="token value attr-value">88</span>
<span class="token key attr-name">storePathRootDir</span><span class="token punctuation">=</span><span class="token value attr-value">/data/rocketmq/store</span>
<span class="token key attr-name">maxMessageSize</span><span class="token punctuation">=</span><span class="token value attr-value">65536</span>
<span class="token key attr-name">brokerRole</span><span class="token punctuation">=</span><span class="token value attr-value">SLAVE</span>
<span class="token key attr-name">flushDiskType</span><span class="token punctuation">=</span><span class="token value attr-value">SYNC_FLUSH</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>broker-b.properties</strong></p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token key attr-name">brokerClusterName</span><span class="token punctuation">=</span><span class="token value attr-value">rocketmq-cluster</span>
<span class="token key attr-name">brokerName</span><span class="token punctuation">=</span><span class="token value attr-value">broker-b</span>
<span class="token key attr-name">brokerId</span><span class="token punctuation">=</span><span class="token value attr-value">0</span>
<span class="token key attr-name">namesrvAddr</span><span class="token punctuation">=</span><span class="token value attr-value">rocketmq-0.rocketmq:9876</span>
<span class="token key attr-name">defaultTopicQueueNums</span><span class="token punctuation">=</span><span class="token value attr-value">4</span>
<span class="token key attr-name">autoCreateTopicEnable</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token key attr-name">autoCreateSubscriptionGroup</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token key attr-name">listenPort</span><span class="token punctuation">=</span><span class="token value attr-value">20911</span>
<span class="token key attr-name">deleteWhen</span><span class="token punctuation">=</span><span class="token value attr-value">04</span>
<span class="token key attr-name">fileReservedTime</span><span class="token punctuation">=</span><span class="token value attr-value">120</span>
<span class="token key attr-name">mapedFileSizeCommitLog</span><span class="token punctuation">=</span><span class="token value attr-value">1073741824</span>
<span class="token key attr-name">mapedFileSizeConsumeQueue</span><span class="token punctuation">=</span><span class="token value attr-value">300000</span>
<span class="token key attr-name">diskMaxUsedSpaceRatio</span><span class="token punctuation">=</span><span class="token value attr-value">88</span>
<span class="token key attr-name">storePathRootDir</span><span class="token punctuation">=</span><span class="token value attr-value">/data/rocketmq/store</span>
<span class="token key attr-name">maxMessageSize</span><span class="token punctuation">=</span><span class="token value attr-value">65536</span>
<span class="token key attr-name">brokerRole</span><span class="token punctuation">=</span><span class="token value attr-value">MASTER</span>
<span class="token key attr-name">flushDiskType</span><span class="token punctuation">=</span><span class="token value attr-value">SYNC_FLUSH</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>broker-b-s.properties</strong></p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token key attr-name">brokerClusterName</span><span class="token punctuation">=</span><span class="token value attr-value">rocketmq-cluster</span>
<span class="token key attr-name">brokerName</span><span class="token punctuation">=</span><span class="token value attr-value">broker-b</span>
<span class="token key attr-name">brokerId</span><span class="token punctuation">=</span><span class="token value attr-value">1</span>
<span class="token key attr-name">namesrvAddr</span><span class="token punctuation">=</span><span class="token value attr-value">rocketmq-0.rocketmq:9876</span>
<span class="token key attr-name">defaultTopicQueueNums</span><span class="token punctuation">=</span><span class="token value attr-value">4</span>
<span class="token key attr-name">autoCreateTopicEnable</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token key attr-name">autoCreateSubscriptionGroup</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token key attr-name">listenPort</span><span class="token punctuation">=</span><span class="token value attr-value">20911</span>
<span class="token key attr-name">deleteWhen</span><span class="token punctuation">=</span><span class="token value attr-value">04</span>
<span class="token key attr-name">fileReservedTime</span><span class="token punctuation">=</span><span class="token value attr-value">120</span>
<span class="token key attr-name">mapedFileSizeCommitLog</span><span class="token punctuation">=</span><span class="token value attr-value">1073741824</span>
<span class="token key attr-name">mapedFileSizeConsumeQueue</span><span class="token punctuation">=</span><span class="token value attr-value">300000</span>
<span class="token key attr-name">diskMaxUsedSpaceRatio</span><span class="token punctuation">=</span><span class="token value attr-value">88</span>
<span class="token key attr-name">storePathRootDir</span><span class="token punctuation">=</span><span class="token value attr-value">/data/rocketmq/store</span>
<span class="token key attr-name">maxMessageSize</span><span class="token punctuation">=</span><span class="token value attr-value">65536</span>
<span class="token key attr-name">brokerRole</span><span class="token punctuation">=</span><span class="token value attr-value">SLAVE</span>
<span class="token key attr-name">flushDiskType</span><span class="token punctuation">=</span><span class="token value attr-value">SYNC_FLUSH</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>namesrv.yaml</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>namesrv
  <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9876</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">9876</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> namesrv<span class="token punctuation">-</span>port
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>namesrv
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> rocketmq
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>namesrv
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">labels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>namesrv
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">affinity</span><span class="token punctuation">:</span>
        <span class="token key atrule">podAntiAffinity</span><span class="token punctuation">:</span>
          <span class="token key atrule">requiredDuringSchedulingIgnoredDuringExecution</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">labelSelector</span><span class="token punctuation">:</span>
                <span class="token key atrule">matchExpressions</span><span class="token punctuation">:</span>
                  <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token string">&quot;app&quot;</span>
                    <span class="token key atrule">operator</span><span class="token punctuation">:</span> In
                    <span class="token key atrule">values</span><span class="token punctuation">:</span>
                      <span class="token punctuation">-</span> mq<span class="token punctuation">-</span>namesrv
              <span class="token key atrule">topologyKey</span><span class="token punctuation">:</span> <span class="token string">&quot;kubernetes.io/hostname&quot;</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>namesrv
        <span class="token key atrule">image</span><span class="token punctuation">:</span> liuyi71sinacom/rocketmq<span class="token punctuation">-</span>4.8.0
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/usr/local/rocketmq-4.8.0/bin/mqnamesrv&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9876</span>
          <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> JAVA_OPT
          <span class="token comment">#value: &quot;-server -XX:ParallelGCThreads=1 -XX:MaxRAMPercentage=80.0&quot;</span>
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;-XX:MaxRAMPercentage=80.0&quot;</span>
        <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span>
          <span class="token key atrule">postStart</span><span class="token punctuation">:</span>
            <span class="token key atrule">exec</span><span class="token punctuation">:</span>
              <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;touch /tmp/health&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">exec</span><span class="token punctuation">:</span>
            <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-e&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/tmp/health&quot;</span><span class="token punctuation">]</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>
        <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">tcpSocket</span><span class="token punctuation">:</span>
            <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9876</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">15</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">20</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>broker-a.yaml</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a
  <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20911</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">20911</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>port
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">labels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">affinity</span><span class="token punctuation">:</span>
        <span class="token key atrule">podAntiAffinity</span><span class="token punctuation">:</span>
          <span class="token key atrule">requiredDuringSchedulingIgnoredDuringExecution</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">labelSelector</span><span class="token punctuation">:</span>
                <span class="token key atrule">matchExpressions</span><span class="token punctuation">:</span>
                  <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token string">&quot;app&quot;</span>
                    <span class="token key atrule">operator</span><span class="token punctuation">:</span> In
                    <span class="token key atrule">values</span><span class="token punctuation">:</span>
                      <span class="token punctuation">-</span> broker<span class="token punctuation">-</span>a
              <span class="token key atrule">topologyKey</span><span class="token punctuation">:</span> <span class="token string">&quot;kubernetes.io/hostname&quot;</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a
        <span class="token key atrule">image</span><span class="token punctuation">:</span> liuyi71sinacom/rocketmq<span class="token punctuation">-</span>4.8.0
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;mqbroker  -c /usr/local/rocketmq-4.8.0/conf/broker-a.properties&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> JAVA_OPT
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;-server -XX:ParallelGCThreads=1 -Xms1g -Xmx1g -Xmn512m&quot;</span>
          <span class="token comment">#value: &quot;-XX:MaxRAMPercentage=80.0&quot;</span>
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /root/logs
            <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>brokeroptlogs
          <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /data/rocketmq
            <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>brokeroptstore
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>config
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/local/rocketmq<span class="token punctuation">-</span>4.8.0/conf/broker<span class="token punctuation">-</span>a.properties
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a.properties
        <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span>
          <span class="token key atrule">postStart</span><span class="token punctuation">:</span>
            <span class="token key atrule">exec</span><span class="token punctuation">:</span>
              <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;touch /tmp/health&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">exec</span><span class="token punctuation">:</span>
            <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-e&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/tmp/health&quot;</span><span class="token punctuation">]</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>
        <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">tcpSocket</span><span class="token punctuation">:</span>
            <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20911</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">15</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">20</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>config
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>config
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">volume.beta.kubernetes.io/storage-class</span><span class="token punctuation">:</span> <span class="token string">&quot;course-nfs-storage&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> ReadWriteMany
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 10Gi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>broker-a-s.yaml</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
  <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20911</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">20911</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>port
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">labels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">affinity</span><span class="token punctuation">:</span>
        <span class="token key atrule">podAntiAffinity</span><span class="token punctuation">:</span>
          <span class="token key atrule">requiredDuringSchedulingIgnoredDuringExecution</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">labelSelector</span><span class="token punctuation">:</span>
                <span class="token key atrule">matchExpressions</span><span class="token punctuation">:</span>
                  <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token string">&quot;app&quot;</span>
                    <span class="token key atrule">operator</span><span class="token punctuation">:</span> In
                    <span class="token key atrule">values</span><span class="token punctuation">:</span>
                      <span class="token punctuation">-</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
              <span class="token key atrule">topologyKey</span><span class="token punctuation">:</span> <span class="token string">&quot;kubernetes.io/hostname&quot;</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s
        <span class="token key atrule">image</span><span class="token punctuation">:</span> liuyi71sinacom/rocketmq<span class="token punctuation">-</span>4.8.0
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;mqbroker  -c /usr/local/rocketmq-4.8.0/conf/broker-a-s.properties&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> JAVA_OPT
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;-server -XX:ParallelGCThreads=1 -Xms1g -Xmx1g -Xmn512m&quot;</span>
          <span class="token comment">#value: &quot;-XX:MaxRAMPercentage=80.0&quot;</span>
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /root/logs
            <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>brokeroptlogs
          <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /data/rocketmq
            <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>brokeroptstore
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>config
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/local/rocketmq<span class="token punctuation">-</span>4.8.0/conf/broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s.properties
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s.properties
        <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span>
          <span class="token key atrule">postStart</span><span class="token punctuation">:</span>
            <span class="token key atrule">exec</span><span class="token punctuation">:</span>
              <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;touch /tmp/health&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">exec</span><span class="token punctuation">:</span>
            <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-e&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/tmp/health&quot;</span><span class="token punctuation">]</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>
        <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">tcpSocket</span><span class="token punctuation">:</span>
            <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20911</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">15</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">20</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>config
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>config
          <span class="token key atrule">items</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s.properties
            <span class="token key atrule">path</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>a<span class="token punctuation">-</span>s.properties
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">volume.beta.kubernetes.io/storage-class</span><span class="token punctuation">:</span> <span class="token string">&quot;coures-nfs-storage&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> ReadWriteMany
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 10Gi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>broker-b.yaml</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b
  <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20911</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">20911</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>port
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">labels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">affinity</span><span class="token punctuation">:</span>
        <span class="token key atrule">podAntiAffinity</span><span class="token punctuation">:</span>
          <span class="token key atrule">requiredDuringSchedulingIgnoredDuringExecution</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">labelSelector</span><span class="token punctuation">:</span>
                <span class="token key atrule">matchExpressions</span><span class="token punctuation">:</span>
                  <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token string">&quot;app&quot;</span>
                    <span class="token key atrule">operator</span><span class="token punctuation">:</span> In
                    <span class="token key atrule">values</span><span class="token punctuation">:</span>
                      <span class="token punctuation">-</span> broker<span class="token punctuation">-</span>b
              <span class="token key atrule">topologyKey</span><span class="token punctuation">:</span> <span class="token string">&quot;kubernetes.io/hostname&quot;</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b
        <span class="token key atrule">image</span><span class="token punctuation">:</span> liuyi71sinacom/rocketmq<span class="token punctuation">-</span>4.8.0
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;mqbroker  -c /usr/local/rocketmq-4.8.0/conf/broker-b.properties&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> JAVA_OPT
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;-server -XX:ParallelGCThreads=1 -Xms1g -Xmx1g -Xmn512m&quot;</span>
          <span class="token comment">#value: &quot;-XX:MaxRAMPercentage=80.0&quot;</span>
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /root/logs
            <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>brokeroptlogs
          <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /data/rocketmq
            <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>brokeroptstore
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>config
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/local/rocketmq<span class="token punctuation">-</span>4.8.0/conf/broker<span class="token punctuation">-</span>b.properties
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b.properties
        <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span>
          <span class="token key atrule">postStart</span><span class="token punctuation">:</span>
            <span class="token key atrule">exec</span><span class="token punctuation">:</span>
              <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;touch /tmp/health&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">exec</span><span class="token punctuation">:</span>
            <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-e&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/tmp/health&quot;</span><span class="token punctuation">]</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>
        <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">tcpSocket</span><span class="token punctuation">:</span>
            <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20911</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">15</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">20</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>config
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>config
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">volume.beta.kubernetes.io/storage-class</span><span class="token punctuation">:</span> <span class="token string">&quot;course-nfs-storage&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> ReadWriteMany
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 10Gi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>broker-a-b.yaml</strong></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
  <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20911</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">20911</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>port
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
     <span class="token key atrule">labels</span><span class="token punctuation">:</span>
       <span class="token key atrule">app</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">affinity</span><span class="token punctuation">:</span>
        <span class="token key atrule">podAntiAffinity</span><span class="token punctuation">:</span>
          <span class="token key atrule">requiredDuringSchedulingIgnoredDuringExecution</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">labelSelector</span><span class="token punctuation">:</span>
                <span class="token key atrule">matchExpressions</span><span class="token punctuation">:</span>
                  <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token string">&quot;app&quot;</span>
                    <span class="token key atrule">operator</span><span class="token punctuation">:</span> In
                    <span class="token key atrule">values</span><span class="token punctuation">:</span>
                      <span class="token punctuation">-</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
              <span class="token key atrule">topologyKey</span><span class="token punctuation">:</span> <span class="token string">&quot;kubernetes.io/hostname&quot;</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s
        <span class="token key atrule">image</span><span class="token punctuation">:</span> liuyi71sinacom/rocketmq<span class="token punctuation">-</span>4.8.0
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;mqbroker -c /usr/local/rocketmq-4.8.0/conf/broker-b-s.properties&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> JAVA_OPT
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;-server -XX:ParallelGCThreads=1 -Xms1g -Xmx1g -Xmn512m&quot;</span>
          <span class="token comment">#value: &quot;-XX:MaxRAMPercentage=80.0&quot;</span>
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /root/logs
            <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>brokeroptlogs
          <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /data/rocketmq
            <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> mq<span class="token punctuation">-</span>brokeroptstore
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>config
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/local/rocketmq<span class="token punctuation">-</span>4.8.0/conf/broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s.properties
            <span class="token key atrule">subPath</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s.properties
        <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span>
          <span class="token key atrule">postStart</span><span class="token punctuation">:</span>
            <span class="token key atrule">exec</span><span class="token punctuation">:</span>
              <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;touch /tmp/health&quot;</span><span class="token punctuation">]</span>
        <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">exec</span><span class="token punctuation">:</span>
            <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;-e&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/tmp/health&quot;</span><span class="token punctuation">]</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>
        <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
          <span class="token key atrule">tcpSocket</span><span class="token punctuation">:</span>
            <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">20911</span>
          <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">15</span>
          <span class="token key atrule">timeoutSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
          <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">20</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>config
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>config
          <span class="token key atrule">items</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s.properties
            <span class="token key atrule">path</span><span class="token punctuation">:</span> broker<span class="token punctuation">-</span>b<span class="token punctuation">-</span>s.properties
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>data
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">volume.beta.kubernetes.io/storage-class</span><span class="token punctuation">:</span> <span class="token string">&quot;coures-nfs-storage&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> ReadWriteMany
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 10Gi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rockermq-的-console-可视化界面" tabindex="-1"><a class="header-anchor" href="#rockermq-的-console-可视化界面" aria-hidden="true">#</a> <strong>Rockermq 的 Console 可视化界面</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">creationTimestamp</span><span class="token punctuation">:</span> <span class="token null important">null</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> console
  <span class="token key atrule">name</span><span class="token punctuation">:</span> console
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> console
  <span class="token key atrule">strategy</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">creationTimestamp</span><span class="token punctuation">:</span> <span class="token null important">null</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> console
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> styletang/rocketmq<span class="token punctuation">-</span>console<span class="token punctuation">-</span>ng
        <span class="token key atrule">name</span><span class="token punctuation">:</span> rocketmq<span class="token punctuation">-</span>console<span class="token punctuation">-</span>ng
        <span class="token key atrule">env</span><span class="token punctuation">:</span> 
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> JAVA_OPTS
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;-Drocketmq.namesrv.addr=rocketmq:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false&quot;</span>
        <span class="token key atrule">resources</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token key atrule">status</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">creationTimestamp</span><span class="token punctuation">:</span> <span class="token null important">null</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> console
  <span class="token key atrule">name</span><span class="token punctuation">:</span> console
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> console
<span class="token key atrule">status</span><span class="token punctuation">:</span>
  <span class="token key atrule">loadBalancer</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="集群测试" tabindex="-1"><a class="header-anchor" href="#集群测试" aria-hidden="true">#</a> <strong>集群测试</strong></h3><h4 id="测试发送消息" tabindex="-1"><a class="header-anchor" href="#测试发送消息" aria-hidden="true">#</a> <strong>测试发送消息</strong></h4><p>在发送/接收消息之前，我们需要告诉客户名称服务器的位置。RocketMQ 提供了多种方法来实现这一点。为了简单起见，我们使用环境变量 NAMESRV_ADDR。通过使用 bin/tools.sh工具类，实现测试发送消息。命令行操作如下：</p><p>进入 mqbroker</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> mqbroker-0 -- <span class="token function">sh</span>
<span class="token comment"># 设置 Namesrv 服务器的地址</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">NAMESRV_ADDR</span><span class="token operator">=</span>rocketmq:9876
<span class="token builtin class-name">echo</span> <span class="token variable">$NAMESRV_ADDR</span>
<span class="token builtin class-name">cd</span> /usr/local/rocketmq-4.8.0/bin/

<span class="token comment"># 执行生产者 Producer 发送测试消息</span>

<span class="token function">sh</span> ./tools.sh org.apache.rocketmq.example.quickstart.Producer
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="测试消费消息" tabindex="-1"><a class="header-anchor" href="#测试消费消息" aria-hidden="true">#</a> <strong>测试消费消息</strong></h4><p>通过使用 bin/tools.sh 工具类，实现测试消费消息。命令行操作如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 设置 Namesrv 服务器的地址</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">NAMESRV_ADDR</span><span class="token operator">=</span> rocketmq:9876
<span class="token comment"># 执行消费者 Consumer 消费测试消息</span>
<span class="token function">sh</span> ./tools.sh org.apache.rocketmq.example.quickstart.Consumer
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用-rocketmq-命令" tabindex="-1"><a class="header-anchor" href="#常用-rocketmq-命令" aria-hidden="true">#</a> <strong>常用 rocketmq 命令</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#查看集群情况</span>
./mqadmin clusterList <span class="token parameter variable">-n</span> rocketmq:9876 
<span class="token comment">#查看 broker 状态</span>
./mqadmin brokerStatus <span class="token parameter variable">-n</span> rocketmq:9876 <span class="token parameter variable">-b</span> <span class="token number">172.19</span>.152.208:10911<span class="token punctuation">(</span>注意换成你的 broker 地址<span class="token punctuation">)</span> 
<span class="token comment">#查看 topic 列表</span>
./mqadmin topicList <span class="token parameter variable">-n</span> <span class="token number">1</span> rocketmq:9876 
<span class="token comment">#查看 topic 状态</span>
./mqadmin topicStatus <span class="token parameter variable">-n</span> rocketmq:9876 <span class="token parameter variable">-t</span> MyTopic<span class="token punctuation">(</span>换成你想查询的 topic<span class="token punctuation">)</span>
<span class="token comment">#查看 topic 路由</span>
./mqadmin topicRoute <span class="token parameter variable">-n</span> rocketmq:9876 <span class="token parameter variable">-t</span> MyTopic
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-nacos-cluster" tabindex="-1"><a class="header-anchor" href="#_4-nacos-cluster" aria-hidden="true">#</a> 4.<strong>Nacos cluster</strong></h2><h3 id="mysql-数据库" tabindex="-1"><a class="header-anchor" href="#mysql-数据库" aria-hidden="true">#</a> <strong>MySQL 数据库</strong></h3><p>使用先前创建好的数据库,并做好 nacos-config 数据库的初始化。</p><h3 id="相关资源的配置" tabindex="-1"><a class="header-anchor" href="#相关资源的配置" aria-hidden="true">#</a> <strong>相关资源的配置</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos<span class="token punctuation">-</span>cm
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">mysql.db.name</span><span class="token punctuation">:</span> <span class="token string">&quot;nacos_config&quot;</span>
  <span class="token key atrule">mysql.host</span><span class="token punctuation">:</span> <span class="token string">&quot;db&quot;</span>
  <span class="token key atrule">mysql.port</span><span class="token punctuation">:</span> <span class="token string">&quot;3306&quot;</span>
  <span class="token key atrule">mysql.user</span><span class="token punctuation">:</span> <span class="token string">&quot;root&quot;</span>
  <span class="token key atrule">mysql.password</span><span class="token punctuation">:</span> <span class="token string">&quot;123456&quot;</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nacos
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">service.alpha.kubernetes.io/tolerate-unready-endpoints</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8848</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> server
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8848</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">7848</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> rpc
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">7848</span>
  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nacos
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> nacos
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> nacos
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">pod.alpha.kubernetes.io/initialized</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">tolerations</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token string">&quot;node-role.kubernetes.io/master&quot;</span>
        <span class="token key atrule">operator</span><span class="token punctuation">:</span> <span class="token string">&quot;Exists&quot;</span>
        <span class="token key atrule">effect</span><span class="token punctuation">:</span> <span class="token string">&quot;NoSchedule&quot;</span>
      <span class="token key atrule">affinity</span><span class="token punctuation">:</span>
        <span class="token key atrule">podAntiAffinity</span><span class="token punctuation">:</span>
          <span class="token key atrule">requiredDuringSchedulingIgnoredDuringExecution</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">labelSelector</span><span class="token punctuation">:</span>
                <span class="token key atrule">matchExpressions</span><span class="token punctuation">:</span>
                  <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token string">&quot;app&quot;</span>
                    <span class="token key atrule">operator</span><span class="token punctuation">:</span> In
                    <span class="token key atrule">values</span><span class="token punctuation">:</span>
                      <span class="token punctuation">-</span> nacos
              <span class="token key atrule">topologyKey</span><span class="token punctuation">:</span> <span class="token string">&quot;kubernetes.io/hostname&quot;</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> k8snacos
          <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
          <span class="token key atrule">image</span><span class="token punctuation">:</span> nacos/nacos<span class="token punctuation">-</span>server<span class="token punctuation">:</span>1.4.2
          <span class="token key atrule">resources</span><span class="token punctuation">:</span>
            <span class="token key atrule">requests</span><span class="token punctuation">:</span>
              <span class="token key atrule">memory</span><span class="token punctuation">:</span> <span class="token string">&quot;200Mi&quot;</span>
              <span class="token key atrule">cpu</span><span class="token punctuation">:</span> <span class="token string">&quot;10m&quot;</span>
          <span class="token key atrule">ports</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8848</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> client
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">7848</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> rpc
          <span class="token key atrule">env</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> NACOS_REPLICAS
              <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;3&quot;</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_SERVICE_HOST
              <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
                <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos<span class="token punctuation">-</span>cm
                  <span class="token key atrule">key</span><span class="token punctuation">:</span> mysql.host
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_SERVICE_DB_NAME
              <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
                <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos<span class="token punctuation">-</span>cm
                  <span class="token key atrule">key</span><span class="token punctuation">:</span> mysql.db.name
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_SERVICE_PORT
              <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
                <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos<span class="token punctuation">-</span>cm
                  <span class="token key atrule">key</span><span class="token punctuation">:</span> mysql.port
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_SERVICE_USER
              <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
                <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos<span class="token punctuation">-</span>cm
                  <span class="token key atrule">key</span><span class="token punctuation">:</span> mysql.user
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MYSQL_SERVICE_PASSWORD
              <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
                <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos<span class="token punctuation">-</span>cm
                  <span class="token key atrule">key</span><span class="token punctuation">:</span> mysql.password
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> MODE
              <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;cluster&quot;</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> NACOS_SERVER_PORT
              <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;8848&quot;</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> PREFER_HOST_MODE
              <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;hostname&quot;</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> NACOS_SERVERS
              <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">&quot;nacos-0.nacos:8848 nacos-1.nacos:8848 nacos-2.nacos:8848&quot;</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> nacos
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ingress-访问" tabindex="-1"><a class="header-anchor" href="#ingress-访问" aria-hidden="true">#</a> <strong>Ingress 访问</strong></h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ingressClassName</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> nacos.test.com
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/&quot;</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> nacos
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">8848</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,96),l=[p];function c(i,o){return s(),a("div",null,l)}const r=n(t,[["render",c],["__file","k8s-15-部署中间件.html.vue"]]);export{r as default};
