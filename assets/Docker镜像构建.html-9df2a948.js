import{_ as s,o as n,c as a,a as e}from"./app-999de8cb.js";const i={},l=e(`<h1 id="docker镜像构建" tabindex="-1"><a class="header-anchor" href="#docker镜像构建" aria-hidden="true">#</a> Docker镜像构建</h1><h2 id="一、概述" tabindex="-1"><a class="header-anchor" href="#一、概述" aria-hidden="true">#</a> <strong>一、概述</strong></h2><blockquote><p><code>Dockerfile</code> 是一个用来<strong>构建镜像的文本文件</strong>，文本内容包含了一条条构建镜像所需的指令和说明。</p></blockquote><p><strong>官方文档：</strong></p><blockquote><p>https://docs.docker.com/engine/reference/builder/</p></blockquote><p><strong>Dockerfile 示例：</strong></p><blockquote><p>https://github.com/dockerfile/</p></blockquote><h2 id="二、dockerfile-结构" tabindex="-1"><a class="header-anchor" href="#二、dockerfile-结构" aria-hidden="true">#</a> <strong>二、Dockerfile 结构</strong></h2><p>Dockerfile 结构主要分为四部分：</p><ul><li>基础镜像信息</li><li>维护者信息</li><li>镜像操作指令</li><li>容器启动时执行指令 （CMD/ENTRYPOINT)</li></ul><blockquote><p>【温馨提示】Dockerfile 每行支持一条指令，每条指令可携带多个参数(支持&amp;&amp;），支持使用以“#“号开头的注释（jason 文件不支持#注释），但是也非必须满足上面的四点。</p></blockquote><h2 id="三、常用-dockerfile-操作指令" tabindex="-1"><a class="header-anchor" href="#三、常用-dockerfile-操作指令" aria-hidden="true">#</a> <strong>三、常用 Dockerfile 操作指令</strong></h2><ul><li><code>ARG</code>—— 定义创建镜像过程中使用的变量 ，唯一一个可以在 FROM 之前定义 。</li><li><code>FROM</code>——基于某个镜像， <code>FROM</code>前面只能有一个或多个<code>ARG</code>指令 。</li><li><code>MAINTAINER</code>（已弃用） —— 镜像维护者姓名或邮箱地址 。</li><li><code>VOLUME</code> —— 指定容器挂载点到宿主机自动生成的目录或其他容器</li><li><code>RUN</code>——执行镜像里的命令，跟在 liunx 执行命令一样，只需要在前面加上 RUN 关键词就行。</li><li><code>COPY</code>——复制本地（宿主机）上的文件到镜像。</li><li><code>ADD</code>——复制并解压（宿主机）上的压缩文件到镜像。</li><li><code>ENV</code>——设置环境变量。</li><li><code>WORKDIR</code> —— 为 RUN、CMD、ENTRYPOINT、COPY 和 ADD 设置工作目录，就是切换目录 。</li><li><code>USER</code> —— 为 RUN、CMD、和 ENTRYPOINT 执行命令指定运行用户。</li><li><code>EXPOSE</code> —— 声明容器的服务端口（仅仅是声明） 。</li><li><code>CMD</code>—— 容器启动后执行的命令 ，多个 CMD 只会执行最后一个，跟 ENTRYPOINT 的区别是，CMD 可以作为 ENTRYPOINT 的参数，且会被 yaml 文件里的 command 覆盖。</li><li><code>ENTRYPOINT</code>—— 容器启动后执行的命令 ，多个只会执行最后一个。</li><li><code>HEALTHCHECH</code> —— 健康检查 。</li><li><code>ONBUILD</code>——它后面跟的是其它指令，比如 <code>RUN</code>, <code>COPY</code> 等，而这些指令，在当前镜像构建时并不会被执行。只有当以当前镜像为基础镜像，去构建下一级镜像的时候才会被执行。</li><li><code>LABEL</code>——LABEL 指令用来给镜像添加一些元数据（metadata），以键值对的形式 ，替换 MAINTAINER。</li></ul><h3 id="_1-镜像构建-docker-build" tabindex="-1"><a class="header-anchor" href="#_1-镜像构建-docker-build" aria-hidden="true">#</a> <strong>1）镜像构建（docker build）</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> build <span class="token parameter variable">-t</span> text:v1 <span class="token builtin class-name">.</span> --no-cache
<span class="token comment"># 要在构建后将映像标记到多个存储库中，请在运行命令-t时添加多个参数</span>
<span class="token function">docker</span> build <span class="token parameter variable">-t</span> shykes/myapp:1.0.2 <span class="token parameter variable">-t</span> shykes/myapp:latest <span class="token builtin class-name">.</span>

<span class="token comment">### 参数解释</span>
<span class="token comment"># -t：指定镜像名称</span>
<span class="token comment"># . ：当前目录Dockerfile</span>
<span class="token comment"># -f：指定Dockerfile路径</span>
<span class="token comment">#  --no-cache：不缓存</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-运行容器测试-docker-run" tabindex="-1"><a class="header-anchor" href="#_2-运行容器测试-docker-run" aria-hidden="true">#</a> <strong>2）运行容器测试（docker run）</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 非交互式运行</span>
<span class="token function">docker</span> run centos:7.4.1708 /bin/echo <span class="token string">&quot;Hello world&quot;</span>

<span class="token comment">### 交互式执行</span>
<span class="token comment"># -t: 在新容器内指定一个伪终端或终端。</span>
<span class="token comment">#-i: 允许你对容器内的标准输入 (STDIN) 进行交互。</span>
<span class="token comment"># 会登录到docker环境中，交互式</span>
<span class="token function">docker</span> run <span class="token parameter variable">-it</span> centos:7.4.1708 /bin/bash
<span class="token comment"># -d：后台执行，加了 -d 参数默认不会进入容器</span>
<span class="token function">docker</span> run <span class="token parameter variable">-itd</span> centos:7.4.1708 /bin/bash

<span class="token comment">### 进入容器</span>
<span class="token comment"># 在使用 -d 参数时，容器启动后会进入后台。此时想要进入容器，可以通过以下指令进入：</span>
<span class="token comment">#docker exec -it ：推荐大家使用 docker exec -it 命令，因为此命令会退出容器终端，但不会导致容器的停止。</span>
<span class="token comment">#docker attach：容器退出，会导致容器的停止。</span>
<span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span>  b2c0235dc53 /bin/bash
<span class="token function">docker</span> attach  b2c0235dc53
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-arg" tabindex="-1"><a class="header-anchor" href="#_3-arg" aria-hidden="true">#</a> <strong>3）ARG</strong></h3><blockquote><p>构建参数，与 ENV 作用一致。不过作用域不一样。ARG 设置的环境变量仅对 Dockerfile 内有效，也就是说只有 docker build 的过程中有效，构建好的镜像内不存在此环境变量。唯一一个可以在 FROM 之前定义 。构建命令 docker build 中可以用 --build-arg &lt;参数名&gt;=&lt;值&gt; 来覆盖。</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ARG <span class="token operator">&lt;</span>参数名<span class="token operator">&gt;</span><span class="token punctuation">[</span><span class="token operator">=</span><span class="token operator">&lt;</span>默认值<span class="token operator">&gt;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 在FROM之前定义ARG，只在 FROM 中生效</span>
ARG <span class="token assign-left variable">VERSION</span><span class="token operator">=</span>laster
FROM centos:<span class="token variable">\${VERSION}</span>
<span class="token comment"># 在FROM之后使用，得重新定义，不需要赋值</span>
ARG VERSION
RUN <span class="token builtin class-name">echo</span> <span class="token variable">$VERSION</span> <span class="token operator">&gt;</span>/tmp/image_version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-from" tabindex="-1"><a class="header-anchor" href="#_4-from" aria-hidden="true">#</a> <strong>4）FROM</strong></h3><blockquote><p>定制的镜像都是基于 FROM 的镜像 ，【必选项】</p></blockquote><p>语法格式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FROM [--platform=&lt;platform&gt;] &lt;image&gt; [AS &lt;name&gt;]
FROM [--platform=&lt;platform&gt;] &lt;image&gt;[:&lt;tag&gt;] [AS &lt;name&gt;]
FROM [--platform=&lt;platform&gt;] &lt;image&gt;[@&lt;digest&gt;] [AS &lt;name&gt;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>如果引用多平台图像，可选<code>--platform</code>标志可用于指定图像的平台。<code>FROM</code>例如，<code>linux/amd64</code>、 <code>linux/arm64</code>或<code>windows/amd64</code>。默认情况下，使用构建请求的目标平台。全局构建参数可用于此标志的值，例如允许您将阶段强制为原生构建平台 ( <code>--platform=$BUILDPLATFORM</code>)，并使用它交叉编译到阶段内的目标平台。</p></blockquote><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ARG <span class="token assign-left variable">VERSION</span><span class="token operator">=</span>latest
FROM busybox:<span class="token variable">$VERSION</span>
<span class="token comment"># FROM --platform=&quot;linux/amd64&quot; busybox:$VERSION</span>
ARG VERSION
RUN <span class="token builtin class-name">echo</span> <span class="token variable">$VERSION</span> <span class="token operator">&gt;</span> image_version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-maintainer-已弃用" tabindex="-1"><a class="header-anchor" href="#_5-maintainer-已弃用" aria-hidden="true">#</a> <strong>5）MAINTAINER（已弃用）</strong></h3><blockquote><p>镜像维护者信息</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>MAINTAINER <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>LABEL <span class="token assign-left variable">org.opencontainers.image.authors</span><span class="token operator">=</span><span class="token string">&quot;SvenDowideit@home.org.au&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_6-volume" tabindex="-1"><a class="header-anchor" href="#_6-volume" aria-hidden="true">#</a> <strong>6）VOLUME</strong></h3><blockquote><p>定义匿名数据卷。在启动容器时忘记挂载数据卷，会自动挂载到匿名卷。</p></blockquote><p>作用：</p><ul><li>避免重要的数据，因容器重启而丢失，这是非常致命的。</li><li>避免容器不断变大。</li><li>在启动容器 docker run 的时候，我们可以通过 -v 参数修改挂载点。</li></ul><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 后面路径是容器内的路径，对应宿主机的目录是随机的</span>
VOLUME <span class="token punctuation">[</span><span class="token string">&quot;&lt;路径1&gt;&quot;</span>, <span class="token string">&quot;&lt;路径2&gt;&quot;</span><span class="token punctuation">..</span>.<span class="token punctuation">]</span>
VOLUME <span class="token operator">&lt;</span>路径<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>FROM ubuntu
RUN <span class="token function">mkdir</span> /myvol
RUN <span class="token builtin class-name">echo</span> <span class="token string">&quot;hello world&quot;</span> <span class="token operator">&gt;</span> /myvol/greeting
VOLUME /myvol
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-run" tabindex="-1"><a class="header-anchor" href="#_7-run" aria-hidden="true">#</a> <strong>7）RUN</strong></h3><blockquote><p>用于执行后面跟着的命令行命令。</p></blockquote><p>语法格式：</p><ul><li><code>RUN</code> （<em>shell</em>形式，命令在 shell 中运行，默认<code>/bin/sh -c</code>在 Linux 或<code>cmd /S /C</code>Windows 上）</li><li><code>RUN [&quot;executable&quot;, &quot;param1&quot;, &quot;param2&quot;]</code>（<em>执行</em>形式）</li></ul><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 以下三种写法等价</span>
RUN /bin/bash <span class="token parameter variable">-c</span> <span class="token string">&#39;source $HOME/.bashrc; \\
echo $HOME&#39;</span>

RUN /bin/bash <span class="token parameter variable">-c</span> <span class="token string">&#39;source $HOME/.bashrc; echo $HOME&#39;</span>

RUN <span class="token punctuation">[</span><span class="token string">&quot;/bin/bash&quot;</span>, <span class="token string">&quot;-c&quot;</span>, <span class="token string">&quot;source <span class="token environment constant">$HOME</span>/.bashrc; echo <span class="token environment constant">$HOME</span>&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-copy" tabindex="-1"><a class="header-anchor" href="#_8-copy" aria-hidden="true">#</a> <strong>8）COPY</strong></h3><blockquote><p>拷贝（宿主机）文件或目录到容器中，跟 ADD 类似，但不具备自动下载或解压的功能 。所有新文件和目录都使用 0 的 UID 和 GID 创建，除非可选<code>--chown</code>标志指定给定的用户名、组名或 UID/GID 组合以请求复制内容的特定所有权。</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>COPY <span class="token punctuation">[</span>--chown<span class="token operator">=</span><span class="token operator">&lt;</span>user<span class="token operator">&gt;</span>:<span class="token operator">&lt;</span>group<span class="token operator">&gt;</span><span class="token punctuation">]</span> <span class="token operator">&lt;</span>src<span class="token operator">&gt;</span><span class="token punctuation">..</span>. <span class="token operator">&lt;</span>dest<span class="token operator">&gt;</span>
COPY <span class="token punctuation">[</span>--chown<span class="token operator">=</span><span class="token operator">&lt;</span>user<span class="token operator">&gt;</span>:<span class="token operator">&lt;</span>group<span class="token operator">&gt;</span><span class="token punctuation">]</span> <span class="token punctuation">[</span><span class="token string">&quot;&lt;src&gt;&quot;</span>,<span class="token punctuation">..</span>. <span class="token string">&quot;&lt;dest&gt;&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 添加所有以“hom”开头的文件：</span>
COPY hom* /mydir/
<span class="token comment"># ?替换为任何单个字符，例如“home.txt”。</span>
COPY hom?.txt /mydir/
<span class="token comment"># 使用相对路径，并将“test.txt”添加到&lt;WORKDIR&gt;/relativeDir/：</span>
COPY test.txt relativeDir/
<span class="token comment"># 使用绝对路径，并将“test.txt”添加到/absoluteDir/</span>
COPY test.txt /absoluteDir/

<span class="token comment"># 修改文件权限</span>
COPY <span class="token parameter variable">--chown</span><span class="token operator">=</span><span class="token number">55</span>:mygroup files* /somedir/
COPY <span class="token parameter variable">--chown</span><span class="token operator">=</span>bin files* /somedir/
COPY <span class="token parameter variable">--chown</span><span class="token operator">=</span><span class="token number">1</span> files* /somedir/
COPY <span class="token parameter variable">--chown</span><span class="token operator">=</span><span class="token number">10</span>:11 files* /somedir/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-add" tabindex="-1"><a class="header-anchor" href="#_9-add" aria-hidden="true">#</a> <strong>9）ADD</strong></h3><blockquote><p>拷贝文件或目录到容器中，如果是 URL 或压缩包便会自动下载或自动解压 。</p></blockquote><p>ADD 指令和 COPY 的使用格类似（同样需求下，官方推荐使用 COPY）。功能也类似，不同之处如下：</p><ul><li><strong>ADD 的优点</strong>：在执行 &lt;源文件&gt; 为 tar 压缩文件的话，压缩格式为 gzip, bzip2 以及 xz 的情况下，会自动复制并解压到 &lt;目标路径&gt;。</li><li><strong>ADD 的缺点</strong>：在不解压的前提下，无法复制 tar 压缩文件。会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢。具体是否使用，可以根据是否需要自动解压来决定。</li></ul><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ADD <span class="token punctuation">[</span>--chown<span class="token operator">=</span><span class="token operator">&lt;</span>user<span class="token operator">&gt;</span>:<span class="token operator">&lt;</span>group<span class="token operator">&gt;</span><span class="token punctuation">]</span> <span class="token operator">&lt;</span>src<span class="token operator">&gt;</span><span class="token punctuation">..</span>. <span class="token operator">&lt;</span>dest<span class="token operator">&gt;</span>
ADD <span class="token punctuation">[</span>--chown<span class="token operator">=</span><span class="token operator">&lt;</span>user<span class="token operator">&gt;</span>:<span class="token operator">&lt;</span>group<span class="token operator">&gt;</span><span class="token punctuation">]</span> <span class="token punctuation">[</span><span class="token string">&quot;&lt;src&gt;&quot;</span>,<span class="token punctuation">..</span>. <span class="token string">&quot;&lt;dest&gt;&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：s</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 通配符</span>
ADD hom* /mydir/
<span class="token comment"># 相对路径，拷贝到WORKDIR目录下relativeDir/</span>
ADD test.txt relativeDir/
<span class="token comment"># 绝对路径</span>
ADD test.txt /absoluteDir/

<span class="token comment"># 更改权限</span>
ADD <span class="token parameter variable">--chown</span><span class="token operator">=</span><span class="token number">55</span>:mygroup files* /somedir/
ADD <span class="token parameter variable">--chown</span><span class="token operator">=</span>bin files* /somedir/
ADD <span class="token parameter variable">--chown</span><span class="token operator">=</span><span class="token number">1</span> files* /somedir/
ADD <span class="token parameter variable">--chown</span><span class="token operator">=</span><span class="token number">10</span>:11 files* /somedir/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ADD 和 COPY 的区别和使用场景：</p><ul><li>ADD 支持添加远程 url 和自动提取压缩格式的文件，COPY 只允许从本机中复制文件</li><li>COPY 支持从其他构建阶段中复制源文件(--from)</li><li>根据官方 Dockerfile 最佳实践，除非真的需要从远程 url 添加文件或自动提取压缩文件才用 ADD，其他情况一律使用 COPY</li></ul><h3 id="_10-env" tabindex="-1"><a class="header-anchor" href="#_10-env" aria-hidden="true">#</a> <strong>10）ENV</strong></h3><blockquote><p>设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ENV <span class="token operator">&lt;</span>key<span class="token operator"><span class="token file-descriptor important">1</span>&gt;</span><span class="token operator">=</span><span class="token operator">&lt;</span>value<span class="token operator"><span class="token file-descriptor important">1</span>&gt;</span> <span class="token operator">&lt;</span>key<span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token operator">=</span><span class="token operator">&lt;</span>value<span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token punctuation">..</span>.
<span class="token comment"># 省略&quot;=&quot;此语法不允许在单个ENV指令中设置多个环境变量，并且可能会造成混淆。</span>
ENV <span class="token operator">&lt;</span>key<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>value<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ENV <span class="token assign-left variable">JAVA_HOME</span><span class="token operator">=</span>/usr/local/jdk
ENV <span class="token assign-left variable">MY_NAME</span><span class="token operator">=</span><span class="token string">&quot;John Doe&quot;</span> <span class="token assign-left variable">MY_DOG</span><span class="token operator">=</span>Rex<span class="token punctuation">\\</span> The<span class="token punctuation">\\</span> Dog <span class="token punctuation">\\</span>
    <span class="token assign-left variable">MY_CAT</span><span class="token operator">=</span>fluffy
<span class="token comment"># 此语法不允许在单个ENV指令中设置多个环境变量，并且可能会造成混淆。</span>
ENV JAVA_HOME /usr/local/jdk
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-workdir" tabindex="-1"><a class="header-anchor" href="#_11-workdir" aria-hidden="true">#</a> <strong>11）WORKDIR</strong></h3><blockquote><p>指定工作目录。用 WORKDIR 指定的工作目录，会在构建镜像的每一层中都存在。（WORKDIR 指定的工作目录，必须是提前创建好的）。</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>WORKDIR <span class="token operator">&lt;</span>工作目录路径<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>FROM busybox
ENV <span class="token assign-left variable">FOO</span><span class="token operator">=</span>/bar
WORKDIR <span class="token variable">\${FOO}</span>   <span class="token comment"># WORKDIR /bar</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_12-user" tabindex="-1"><a class="header-anchor" href="#_12-user" aria-hidden="true">#</a> <strong>12）USER</strong></h3><blockquote><p>用于指定执行后续命令的用户和用户组，这边只是切换后续命令执行的用户（用户和用户组必须提前已经存在）。</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token environment constant">USER</span> <span class="token operator">&lt;</span>用户名<span class="token operator">&gt;</span><span class="token punctuation">[</span>:<span class="token operator">&lt;</span>用户组<span class="token operator">&gt;</span><span class="token punctuation">]</span>
<span class="token environment constant">USER</span> <span class="token operator">&lt;</span><span class="token environment constant">UID</span><span class="token operator">&gt;</span><span class="token punctuation">[</span>:<span class="token operator">&lt;</span>GID<span class="token operator">&gt;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>FROM busybox
RUN <span class="token function">groupadd</span> <span class="token parameter variable">--system</span> <span class="token parameter variable">--gid</span><span class="token operator">=</span><span class="token number">9999</span> admin <span class="token operator">&amp;&amp;</span> <span class="token function">useradd</span> <span class="token parameter variable">--system</span> --home-dir /home/admin <span class="token parameter variable">--uid</span><span class="token operator">=</span><span class="token number">9999</span> <span class="token parameter variable">--gid</span><span class="token operator">=</span>admin admin
<span class="token environment constant">USER</span> admin:admin
<span class="token comment"># USER 9999:9999</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_13-expose" tabindex="-1"><a class="header-anchor" href="#_13-expose" aria-hidden="true">#</a> <strong>13）EXPOSE</strong></h3><blockquote><p>暴露端口 ，仅仅只是声明端口。</p></blockquote><p>作用：</p><ul><li>帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射。</li><li>在运行时使用随机端口映射时，也就是 docker run -P 时，会自动随机映射 EXPOSE 的端口。</li></ul><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 默认情况下，EXPOSE假定 TCP。</span>
EXPOSE <span class="token operator">&lt;</span>port<span class="token operator">&gt;</span> <span class="token punctuation">[</span><span class="token operator">&lt;</span>port<span class="token operator">&gt;</span>/<span class="token operator">&lt;</span>protocol<span class="token operator">&gt;</span><span class="token punctuation">..</span>.<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>EXPOSE <span class="token number">80</span>/TCP <span class="token number">443</span>/TCP
EXPOSE <span class="token number">80</span> <span class="token number">443</span>
EXPOSE <span class="token number">80</span>/tcp
EXPOSE <span class="token number">80</span>/udp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_14-cmd" tabindex="-1"><a class="header-anchor" href="#_14-cmd" aria-hidden="true">#</a> <strong>14）CMD</strong></h3><blockquote><p>类似于 RUN 指令，用于运行程序，但二者运行的时间点不同：CMD 在构建镜像时不会执行，在容器运行 时运行。</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>CMD <span class="token operator">&lt;</span>shell 命令<span class="token operator">&gt;</span>
CMD <span class="token punctuation">[</span><span class="token string">&quot;&lt;可执行文件或命令&gt;&quot;</span>,<span class="token string">&quot;&lt;param1&gt;&quot;</span>,<span class="token string">&quot;&lt;param2&gt;&quot;</span>,<span class="token punctuation">..</span>.<span class="token punctuation">]</span>
CMD <span class="token punctuation">[</span><span class="token string">&quot;&lt;param1&gt;&quot;</span>,<span class="token string">&quot;&lt;param2&gt;&quot;</span>,<span class="token punctuation">..</span>.<span class="token punctuation">]</span>  <span class="token comment"># 该写法是为 ENTRYPOINT 指令指定的程序提供默认参数</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>推荐使用第二种格式，执行过程比较明确。第一种格式实际上在运行的过程中也会自动转换成第二种格式运行，并且默认可执行文件是 sh。</p></blockquote><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>CMD <span class="token function">cat</span> /etc/profile
CMD <span class="token punctuation">[</span><span class="token string">&quot;/bin/sh&quot;</span>,<span class="token string">&quot;-c&quot;</span>,<span class="token string">&quot;/etc/profile&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>注意</strong>：如果 Dockerfile 中如果存在多个 CMD 指令，仅最后一个生效。</p></blockquote><h3 id="_15-entrypoint" tabindex="-1"><a class="header-anchor" href="#_15-entrypoint" aria-hidden="true">#</a> <strong>15）ENTRYPOINT</strong></h3><blockquote><p>类似于 CMD 指令，但其不会被 docker run 的命令行参数指定的指令所覆盖，而且这些命令行参数会被当作参数送给 ENTRYPOINT 指令指定的程序。但是, 如果运行 docker run 时使用了 --entrypoint 选项，将覆盖 ENTRYPOINT 指令指定的程序。在 k8s 中 command 也会覆盖 ENTRYPOINT 指令指定的程序</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># exec形式，这是首选形式：</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;executable&quot;</span>, <span class="token string">&quot;param1&quot;</span>, <span class="token string">&quot;param2&quot;</span><span class="token punctuation">]</span>
<span class="token comment"># 外壳形式：</span>
ENTRYPOINT <span class="token builtin class-name">command</span> param1 param2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>FROM ubuntu
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;top&quot;</span>, <span class="token string">&quot;-b&quot;</span><span class="token punctuation">]</span>
<span class="token comment"># CMD作为ENTRYPOINT参数</span>
CMD <span class="token punctuation">[</span><span class="token string">&quot;-c&quot;</span><span class="token punctuation">]</span>
<span class="token comment"># 与下面的等价</span>
ENTRYPOINT <span class="token punctuation">[</span><span class="token string">&quot;top&quot;</span>, <span class="token string">&quot;-b -c&quot;</span><span class="token punctuation">]</span>
ENTRYPOINT  <span class="token function">top</span> <span class="token parameter variable">-b</span> <span class="token parameter variable">-c</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-healthcheck" tabindex="-1"><a class="header-anchor" href="#_16-healthcheck" aria-hidden="true">#</a> <strong>16）HEALTHCHECK</strong></h3><blockquote><p>用于指定某个程序或者指令来监控 docker 容器服务的运行状态。</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>HEALTHCHECK <span class="token punctuation">[</span>OPTIONS<span class="token punctuation">]</span> CMD command（通过在容器内运行命令检查容器运行状况）
HEALTHCHECK NONE（禁用从基础映像继承的任何运行状况检查）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>选项<code>CMD</code>有：</p><ul><li><code>--interval=DURATION</code>（默认<code>30s</code>：）：间隔，频率</li><li><code>--timeout=DURATION</code>（默认<code>30s</code>：）：超时时间</li><li><code>--start-period=DURATION</code>（默认<code>0s</code>：）：为需要时间引导的容器提供初始化时间， 在此期间探测失败将不计入最大重试次数。</li><li><code>--retries=N</code>（默认<code>3</code>：）：重试次数</li></ul><p>命令的<code>exit status</code>指示容器的运行状况。可能的值为：</p><ul><li>0：健康状态，容器健康且已准备完成。</li><li>1：不健康状态，容器工作不正常。</li><li>2：保留，不要使用此退出代码。</li></ul><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>FROM nginx
MAINTAINER Securitit
HEALTHCHECK <span class="token parameter variable">--interval</span><span class="token operator">=</span>5s <span class="token parameter variable">--timeout</span><span class="token operator">=</span>3s <span class="token punctuation">\\</span>
  CMD <span class="token function">curl</span> <span class="token parameter variable">-f</span> http://localhost/ <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token number">1</span>
CMD <span class="token punctuation">[</span><span class="token string">&quot;usr/sbin/nginx&quot;</span>, <span class="token string">&quot;-g&quot;</span>, <span class="token string">&quot;daemon off;&quot;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_17-onbuild" tabindex="-1"><a class="header-anchor" href="#_17-onbuild" aria-hidden="true">#</a> <strong>17）ONBUILD</strong></h3><blockquote><p><code>ONBUILD</code> 是一个特殊的指令，它后面跟的是其它指令，比如 <code>RUN</code>, <code>COPY</code> 等，而这些指令，在当前镜像构建时并不会被执行。只有当以当前镜像为基础镜像，去构建下一级镜像的时候才会被执行。</p></blockquote><p>语法格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ONBUILD <span class="token operator">&lt;</span>其它指令<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>FROM node:slim
RUN <span class="token function">mkdir</span> /app
WORKDIR /app
ONBUILD COPY ./package.json /app
ONBUILD RUN <span class="token punctuation">[</span> <span class="token string">&quot;npm&quot;</span>, <span class="token string">&quot;install&quot;</span> <span class="token punctuation">]</span>
ONBUILD COPY <span class="token builtin class-name">.</span> /app/
CMD <span class="token punctuation">[</span> <span class="token string">&quot;npm&quot;</span>, <span class="token string">&quot;start&quot;</span> <span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_18-label" tabindex="-1"><a class="header-anchor" href="#_18-label" aria-hidden="true">#</a> <strong>18）LABEL</strong></h3><blockquote><p>LABEL 指令用来给镜像添加一些元数据（metadata），以键值对的形式。用来替代 MAINTAINER。</p></blockquote><p>语法格式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LABEL &lt;key&gt;=&lt;value&gt; &lt;key&gt;=&lt;value&gt; &lt;key&gt;=&lt;value&gt; ...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>示例：比如我们可以添加镜像的作者</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LABEL org.opencontainers.image.authors=&quot;runoob&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="四、arg-和-env-的区别" tabindex="-1"><a class="header-anchor" href="#四、arg-和-env-的区别" aria-hidden="true">#</a> <strong>四、ARG 和 ENV 的区别</strong></h2><ul><li>ARG 定义的变量只会存在于镜像构建过程，启动容器后并不保留这些变量</li><li>ENV 定义的变量在启动容器后仍然保留</li></ul><h2 id="五、cmd-entrypoint-command-args-场景测试" tabindex="-1"><a class="header-anchor" href="#五、cmd-entrypoint-command-args-场景测试" aria-hidden="true">#</a> <strong>五、CMD，ENTRYPOINT，command，args 场景测试</strong></h2><p>当用户同时在 kubernetes 中的 yaml 文件中写了<code>command</code>和<code>args</code>的时候，默认是会覆盖<code>DockerFile</code>中的命令行和参数，完整的情况分类如下：</p><h3 id="_1-command-和-args-不存在场景测试" tabindex="-1"><a class="header-anchor" href="#_1-command-和-args-不存在场景测试" aria-hidden="true">#</a> <strong>1）command 和 args 不存在场景测试</strong></h3><blockquote><p>如果 command 和 args 都没有写，那么用<code>DockerFile</code>默认的配置。</p></blockquote><p>Dockerfile</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FROM centos

COPY test.sh /

RUN chmod +x /test.sh
### ENTRYPOINT将作为的子命令启动/bin/sh -c，它不会传递参数，要传递参数只能这样传参
# ENTRYPOINT [&quot;/bin/sh&quot;,&quot;-c&quot;,&quot;/test.sh ENTRYPOINT&quot;]
ENTRYPOINT [&quot;/test.sh&quot;,&quot;ENTRYPOINT&quot;]
CMD [&quot;CMD&quot;]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>/tmp/test.sh</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#!/bin/bash

echo $*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>构建</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker build -t test1:v1 -f Dockerfile .
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>yaml 编排</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">&gt;</span> test1.yaml</span>
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test
  template:
    metadata:
      labels:
        app: test
    spec:
      nodeName: local-168-182-110
      containers:
      - name: test
        image: test:v1
        #command: [&#39;/bin/sh&#39;,&#39;-c&#39;,&#39;/test.sh&#39;]
        #args: [&#39;args&#39;]
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl apply -f test.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-command-存在-但-args-存在场景测试" tabindex="-1"><a class="header-anchor" href="#_2-command-存在-但-args-存在场景测试" aria-hidden="true">#</a> <strong>2）command 存在，但 args 存在场景测试</strong></h3><blockquote><p>如果 command 写了，但 args 没有写，那么 Docker 默认的配置会被忽略而且仅仅执行<code>.yaml</code>文件的 command（不带任何参数的）。</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cat &lt;&lt; EOF &gt; test2.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test2
  template:
    metadata:
      labels:
        app: test2
    spec:
      nodeName: local-168-182-110
      containers:
      - name: test2
        image: test:v1
        # [&#39;/bin/sh&#39;,&#39;-c&#39;,&#39;/test.sh command&#39;,&#39;hello&#39;]，加了&#39;/bin/sh&#39;,&#39;-c&#39;,也是不能外部传参，不会输出hello，只能通过这样传参，[&#39;/bin/sh&#39;,&#39;-c&#39;,&#39;/test.sh command&#39;]；CMD里面的参数会被忽略
        command: [&#39;/test.sh&#39;]
        # command带参数
        # command: [&#39;/test.sh&#39;,&#39;command&#39;]
        #args: [&#39;args&#39;]
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-command-不存在-但-args-存在场景测试" tabindex="-1"><a class="header-anchor" href="#_3-command-不存在-但-args-存在场景测试" aria-hidden="true">#</a> <strong>3）command 不存在，但 args 存在场景测试</strong></h3><blockquote><p>如果 command 没写，但 args 写了，那么 Docker 默认配置的 ENTRYPOINT 的命令行会被执行，但是调用的参数是<code>.yaml</code>中的 args，CMD 的参数会被覆盖，但是 ENTRYPOINT 自带的参数还是会执行的。</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cat &lt;&lt; EOF &gt; test3.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test3
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test3
  template:
    metadata:
      labels:
        app: test3
    spec:
      nodeName: local-168-182-110
      containers:
      - name: test3
        image: test:v1
        # [&#39;/bin/sh&#39;,&#39;-c&#39;,&#39;/test.sh command&#39;,&#39;hello&#39;]，加了&#39;/bin/sh&#39;,&#39;-c&#39;,也是不能外部传参，不会输出hello，只能通过这样传参，[&#39;/bin/sh&#39;,&#39;-c&#39;,&#39;/test.sh command&#39;]；CMD里面的参数会被忽略
        # command: [&#39;/test.sh&#39;]
        # command带参数
        # command: [&#39;/test.sh&#39;,&#39;command&#39;]
        args: [&#39;args&#39;]
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-command-和-args-都存在场景测试" tabindex="-1"><a class="header-anchor" href="#_4-command-和-args-都存在场景测试" aria-hidden="true">#</a> <strong>4）command 和 args 都存在场景测试</strong></h3><blockquote><p>如果如果 command 和 args 都写了，那么 Docker 默认的配置被忽略，使用<code>.yaml</code>的配置。</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cat &lt;&lt; EOF &gt; test4.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test4
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test4
  template:
    metadata:
      labels:
        app: test4
    spec:
      nodeName: local-168-182-110
      containers:
      - name: test4
        image: test:v1
        # [&#39;/bin/sh&#39;,&#39;-c&#39;,&#39;/test.sh command&#39;,&#39;hello&#39;]，加了&#39;/bin/sh&#39;,&#39;-c&#39;,也是不能外部传参，不会输出hello，只能通过这样传参，[&#39;/bin/sh&#39;,&#39;-c&#39;,&#39;/test.sh command&#39;]；CMD里面的参数会被忽略
        # command: [&#39;/test.sh&#39;]
        # command带参数，command和args都会带上
        command: [&#39;/test.sh&#39;,&#39;command&#39;]
        args: [&#39;args&#39;]
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,153),t=[l];function o(c,d){return n(),a("div",null,t)}const p=s(i,[["render",o],["__file","Docker镜像构建.html.vue"]]);export{p as default};
