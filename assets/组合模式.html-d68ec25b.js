import{_ as n,o as s,c as a,a as p}from"./app-999de8cb.js";const e={},t=p(`<h1 id="组合模式" tabindex="-1"><a class="header-anchor" href="#组合模式" aria-hidden="true">#</a> 组合模式</h1><h2 id="一、什么是组合模式" tabindex="-1"><a class="header-anchor" href="#一、什么是组合模式" aria-hidden="true">#</a> 一、什么是组合模式：</h2><pre><code>	组合模式将叶子对象和容器对象进行递归组合，形成树形结构以表示“部分-整体”的层次结构，使得用户对单个对象和组合对象的使用具有一致性，能够像处理叶子对象一样来处理组合对象，无需进行区分，从而使用户程序能够与复杂元素的内部结构进行解耦。
</code></pre><p>​ 组合模式最关键的地方是叶子对象和组合对象实现了相同的抽象构建类，它既可表示叶子对象，也可表示容器对象，客户仅仅需要针对这个抽象构建类进行编程，这就是组合模式能够将叶子节点和对象节点进行一致处理的原因。</p><p>​ 通过组合模式，可以清晰地定义复杂对象的层次结构，叶子对象可以被组合成更复杂的容器对象，而容器对象又可以被组合，这样不断递归从而形成复杂的树形结构；同时在组合模式中加入新的对象构建也更容易，客户端不必因为加入了新的对象构件而更改原有代码。</p><h2 id="二、结构图" tabindex="-1"><a class="header-anchor" href="#二、结构图" aria-hidden="true">#</a> 二、结构图</h2><ul><li>Component ：抽象构建类，组合中的对象声明接口，在适当的情况下，实现所有类共有接口的默认行为。声明一个接口用于访问和管理Component子部件。</li><li>Leaf：叶子对象。叶子结点没有子结点。</li><li>Composite：容器对象，定义有枝节点行为，用来存储子部件，在Component接口中实现与子部件有关操作，如增加(add)和删除(remove)等。</li></ul><h2 id="三、代码实现" tabindex="-1"><a class="header-anchor" href="#三、代码实现" aria-hidden="true">#</a> 三、代码实现</h2><p>​ 在文件系统中，可能存在很多种格式的文件，如果图片，文本文件、视频文件等等，这些不同的格式文件的浏览方式都不同，同时对文件夹的浏览就是对文件夹中文件的浏览，但是对于客户而言都是浏览文件，两者之间不存在什么差别，现在只用组合模式来模拟浏览文件。</p><p>首先是文件类：File.java</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">File</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> name<span class="token punctuation">;</span>
    
    <span class="token keyword">public</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
 
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setName</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
 
    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">display</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是文件夹类：Folder.java，该类包含对文件的增加、删除和浏览三个方法</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Folder</span> <span class="token keyword">extends</span> <span class="token class-name">File</span><span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">&gt;</span></span> files<span class="token punctuation">;</span>
    
    <span class="token keyword">public</span> <span class="token class-name">Folder</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
        files <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">File</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token doc-comment comment">/**
     * 浏览文件夹中的文件
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">display</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token class-name">File</span> file <span class="token operator">:</span> files<span class="token punctuation">)</span><span class="token punctuation">{</span>
            file<span class="token punctuation">.</span><span class="token function">display</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@desc</span> 向文件夹中添加文件
     * <span class="token keyword">@param</span> <span class="token parameter">file</span>
     * <span class="token keyword">@return</span> void
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">File</span> file<span class="token punctuation">)</span><span class="token punctuation">{</span>
        files<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@desc</span> 从文件夹中删除文件
     * <span class="token keyword">@param</span> <span class="token parameter">file</span>
     * <span class="token keyword">@return</span> void
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token class-name">File</span> file<span class="token punctuation">)</span><span class="token punctuation">{</span>
        files<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是三个文件类：TextFile.java、ImageFile.java、VideoFile.java</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TextFile</span> <span class="token keyword">extends</span> <span class="token class-name">File</span><span class="token punctuation">{</span>
 
    <span class="token keyword">public</span> <span class="token class-name">TextFile</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
 
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">display</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;这是文本文件，文件名：&quot;</span> <span class="token operator">+</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
 
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ImagerFile</span> <span class="token keyword">extends</span> <span class="token class-name">File</span><span class="token punctuation">{</span>
 
    <span class="token keyword">public</span> <span class="token class-name">ImagerFile</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
 
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">display</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;这是图像文件，文件名：&quot;</span> <span class="token operator">+</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
 
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">VideoFile</span> <span class="token keyword">extends</span> <span class="token class-name">File</span><span class="token punctuation">{</span>
 
    <span class="token keyword">public</span> <span class="token class-name">VideoFile</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
 
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">display</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;这是影像文件，文件名：&quot;</span> <span class="token operator">+</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后是客户端：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token doc-comment comment">/**
         * 我们先建立一个这样的文件系统
         *                  总文件
         *                  
         *   a.txt    b.jpg                   c文件夹              
         *                      c_1.text  c_1.rmvb    c_1.jpg                                                      
         */</span> 
        <span class="token comment">//总文件夹</span>
        <span class="token class-name">Folder</span> zwjj <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Folder</span><span class="token punctuation">(</span><span class="token string">&quot;总文件夹&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//向总文件夹中放入三个文件：1.txt、2.jpg、1文件夹</span>
        <span class="token class-name">TextFile</span> aText<span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TextFile</span><span class="token punctuation">(</span><span class="token string">&quot;a.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ImagerFile</span> bImager <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ImagerFile</span><span class="token punctuation">(</span><span class="token string">&quot;b.jpg&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Folder</span> cFolder <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Folder</span><span class="token punctuation">(</span><span class="token string">&quot;C文件夹&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        zwjj<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>aText<span class="token punctuation">)</span><span class="token punctuation">;</span>
        zwjj<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>bImager<span class="token punctuation">)</span><span class="token punctuation">;</span>
        zwjj<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cFolder<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">//向C文件夹中添加文件：c_1.txt、c_1.rmvb、c_1.jpg </span>
        <span class="token class-name">TextFile</span> cText <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TextFile</span><span class="token punctuation">(</span><span class="token string">&quot;c_1.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ImagerFile</span> cImage <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ImagerFile</span><span class="token punctuation">(</span><span class="token string">&quot;c_1.jpg&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">VideoFile</span> cVideo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VideoFile</span><span class="token punctuation">(</span><span class="token string">&quot;c_1.rmvb&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        cFolder<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cText<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cFolder<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cImage<span class="token punctuation">)</span><span class="token punctuation">;</span>
        cFolder<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cVideo<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">//遍历C文件夹</span>
        cFolder<span class="token punctuation">.</span><span class="token function">display</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//将c_1.txt删除</span>
        cFolder<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>cText<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;-----------------------&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        cFolder<span class="token punctuation">.</span><span class="token function">display</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17),c=[t];function o(l,i){return s(),a("div",null,c)}const k=n(e,[["render",o],["__file","组合模式.html.vue"]]);export{k as default};
