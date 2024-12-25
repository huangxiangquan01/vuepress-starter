import{_ as n,o as s,c as a,a as e}from"./app-999de8cb.js";const i={},c=e(`<h1 id="docker-compose" tabindex="-1"><a class="header-anchor" href="#docker-compose" aria-hidden="true">#</a> Docker-Compose</h1><h2 id="docker-compose的安装" tabindex="-1"><a class="header-anchor" href="#docker-compose的安装" aria-hidden="true">#</a> Docker-Compose的安装</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Step 1: 以ubuntu为例，下载docker-compose</span>
<span class="token function">sudo</span> <span class="token function">curl</span> <span class="token parameter variable">-L</span> https://github.com/docker/compose/releases/download/1.17.0/docker-compose-<span class="token variable"><span class="token variable">\`</span><span class="token function">uname</span> <span class="token parameter variable">-s</span><span class="token variable">\`</span></span>-<span class="token variable"><span class="token variable">\`</span><span class="token function">uname</span> <span class="token parameter variable">-m</span><span class="token variable">\`</span></span> <span class="token parameter variable">-o</span> /usr/local/bin/docker-compose
<span class="token comment"># Step 2: 给予docker-compose可执行权限</span>
<span class="token function">sudo</span> <span class="token function">chmod</span> +x /usr/local/bin/docker-compose
<span class="token comment"># Step 3: 查看docker-compose版本</span>
<span class="token function">docker-compose</span> <span class="token parameter variable">--version</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker-compose-yml配置文件" tabindex="-1"><a class="header-anchor" href="#docker-compose-yml配置文件" aria-hidden="true">#</a> Docker-compose.yml配置文件</h2><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3&#39;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token comment"># 第一部分: Building(构建镜像)</span>
  <span class="token key atrule">web</span><span class="token punctuation">:</span>
    <span class="token comment"># 使用当前目录下的Dockerfile</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span> .
    <span class="token key atrule">args</span><span class="token punctuation">:</span> <span class="token comment"># 增加额外参数</span>
      <span class="token key atrule">APP_HOME</span><span class="token punctuation">:</span> app
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span> <span class="token comment"># 目录挂载</span>
      <span class="token punctuation">-</span> .<span class="token punctuation">:</span>/code
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span> <span class="token comment"># 依赖db和redis</span>
      <span class="token punctuation">-</span> db
      <span class="token punctuation">-</span> redis

    <span class="token comment"># 使用定制化的Dockerfile，指定新目录相对路径和文件名</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./dir 
      <span class="token key atrule">dockerfile</span><span class="token punctuation">:</span> Dockerfile.dev
      <span class="token key atrule">container_name</span><span class="token punctuation">:</span> app <span class="token comment"># 自定义容器名</span>

    <span class="token comment"># 基于现有镜像构建</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> ubuntu
    <span class="token key atrule">image</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">:</span><span class="token number">14.04</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> remote<span class="token punctuation">-</span>registry<span class="token punctuation">:</span>4000/postgresql
    <span class="token key atrule">image</span><span class="token punctuation">:</span> bcbc65fd

  <span class="token comment"># 第二部分: Ports(端口)</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span> <span class="token comment"># 指定端口映射，HOST:Container</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;6379&quot;</span> <span class="token comment"># 指定容器的端口6379，宿主机会随机映射端口</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;8080:80&quot;</span>  <span class="token comment"># 宿主机端口8080，对应容器80</span>

    <span class="token comment"># 暴露端口给-link或处于同一网络的容器，不暴露给宿主机。</span>
    <span class="token key atrule">expose</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;3000&quot;</span><span class="token punctuation">]</span>

  <span class="token comment"># 第三部分: Environment Variables(环境变量)</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token key atrule">MODE</span><span class="token punctuation">:</span> development
      <span class="token key atrule">SHOW</span><span class="token punctuation">:</span> <span class="token string">&#39;true&#39;</span>

    <span class="token comment"># 等同于</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> MODE=development
      <span class="token punctuation">-</span> <span class="token key atrule">SHOW</span><span class="token punctuation">:</span> <span class="token string">&#39;true&#39;</span>

    <span class="token comment"># 使用环境变量.env文件</span>
    <span class="token key atrule">env_file</span><span class="token punctuation">:</span> .env
    <span class="token key atrule">env_file</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./common.env
      <span class="token punctuation">-</span> ./apps/web.env

  <span class="token comment"># 第四部分：commands (命令)</span>
    <span class="token comment"># 容器启动后默认执行命令</span>
    <span class="token key atrule">command</span><span class="token punctuation">:</span> bundle exec thin <span class="token punctuation">-</span>p 3000
    <span class="token key atrule">command</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;/bin/bash/&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;start.sh&#39;</span><span class="token punctuation">]</span>

    <span class="token comment"># 容器启动后程序入口</span>
    <span class="token key atrule">entrypoint</span><span class="token punctuation">:</span> /code/entrypoint.sh

  <span class="token comment"># 第五部分：Networks(网络)</span>
    <span class="token key atrule">networks</span><span class="token punctuation">:</span> <span class="token comment"># 使用bridge驱动创建名为frontend的网络</span>
      <span class="token key atrule">frontend</span><span class="token punctuation">:</span>
        <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge

      <span class="token key atrule">networks</span><span class="token punctuation">:</span> <span class="token comment"># 使用创建的网络进行通信</span>
        <span class="token punctuation">-</span> frontend

      <span class="token comment"># 加入已经存在的外部网络</span>
      <span class="token key atrule">networks</span><span class="token punctuation">:</span> 
        <span class="token key atrule">default</span><span class="token punctuation">:</span>
          <span class="token key atrule">external</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>pre<span class="token punctuation">-</span>existing<span class="token punctuation">-</span>network

  <span class="token comment"># 第六部分：Volumes(数据卷)</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span> <span class="token comment"># 创建名为postgres_data的数据卷</span>
      <span class="token key atrule">postgres_data</span><span class="token punctuation">:</span>

      <span class="token key atrule">db</span><span class="token punctuation">:</span>
        <span class="token key atrule">image</span><span class="token punctuation">:</span> postgres<span class="token punctuation">:</span>latest
        <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> postgres_data<span class="token punctuation">:</span>/var/lib/postgresql/data

  <span class="token comment"># 第七部分：External Links(外部链接)</span>
  <span class="token comment"># 目的是让Compose能够连接那些不在docker-compose.yml中定义的单独运行容器</span>
    <span class="token key atrule">services</span><span class="token punctuation">:</span>
      <span class="token key atrule">web</span><span class="token punctuation">:</span>
        <span class="token key atrule">external_links</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> redis_1
          <span class="token punctuation">-</span> project_db_1<span class="token punctuation">:</span>mysql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker-compose命令大全" tabindex="-1"><a class="header-anchor" href="#docker-compose命令大全" aria-hidden="true">#</a> Docker-compose命令大全</h2><h3 id="构建镜像" tabindex="-1"><a class="header-anchor" href="#构建镜像" aria-hidden="true">#</a> 构建镜像</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 默认使用docker-compose.yml构建镜像</span>
<span class="token function">docker-compose</span> build
<span class="token function">docker-compose</span> build --no-cache <span class="token comment"># 不带缓存的构建</span>

<span class="token comment"># 指定不同yml文件模板用于构建镜像</span>
<span class="token function">docker-compose</span> build <span class="token parameter variable">-f</span> docker-compose1.yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="列出构建的镜像-compose文件" tabindex="-1"><a class="header-anchor" href="#列出构建的镜像-compose文件" aria-hidden="true">#</a> 列出构建的镜像(Compose文件)</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> images 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="启动所有编排容器服务" tabindex="-1"><a class="header-anchor" href="#启动所有编排容器服务" aria-hidden="true">#</a> 启动所有编排容器服务</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="查看正在运行中的容器" tabindex="-1"><a class="header-anchor" href="#查看正在运行中的容器" aria-hidden="true">#</a> 查看正在运行中的容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> <span class="token function">ps</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="查看所有编排容器" tabindex="-1"><a class="header-anchor" href="#查看所有编排容器" aria-hidden="true">#</a> 查看所有编排容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> <span class="token function">docker-compose</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="进入指定容器" tabindex="-1"><a class="header-anchor" href="#进入指定容器" aria-hidden="true">#</a> 进入指定容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> <span class="token builtin class-name">exec</span> nginx <span class="token function">bash</span> 
<span class="token function">docker-compose</span> <span class="token builtin class-name">exec</span> web python manage.py migrate <span class="token parameter variable">--noinput</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="查看容器的实时日志" tabindex="-1"><a class="header-anchor" href="#查看容器的实时日志" aria-hidden="true">#</a> 查看容器的实时日志</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> logs <span class="token parameter variable">-f</span> web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="停止启动的容器" tabindex="-1"><a class="header-anchor" href="#停止启动的容器" aria-hidden="true">#</a> 停止启动的容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 停止所有up命令启动的容器</span>
<span class="token function">docker-compose</span> down 

<span class="token comment"># 停止所有up命令启动的容器,并移除数据卷</span>
<span class="token function">docker-compose</span> down <span class="token parameter variable">-v</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="重新启动容器" tabindex="-1"><a class="header-anchor" href="#重新启动容器" aria-hidden="true">#</a> 重新启动容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> restart web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="暂停容器" tabindex="-1"><a class="header-anchor" href="#暂停容器" aria-hidden="true">#</a> 暂停容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> pause web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="恢复容器" tabindex="-1"><a class="header-anchor" href="#恢复容器" aria-hidden="true">#</a> 恢复容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> unpause web
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="删除容器" tabindex="-1"><a class="header-anchor" href="#删除容器" aria-hidden="true">#</a> 删除容器</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 删除web容器，删除前必需停止stop web容器服务</span>
<span class="token function">docker-compose</span> <span class="token function">rm</span> web  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="查看各个服务容器内运行的进程" tabindex="-1"><a class="header-anchor" href="#查看各个服务容器内运行的进程" aria-hidden="true">#</a> 查看各个服务容器内运行的进程</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> <span class="token function">top</span>    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,32),l=[c];function t(o,p){return s(),a("div",null,l)}const r=n(i,[["render",t],["__file","Docker-compose命令大全.html.vue"]]);export{r as default};
