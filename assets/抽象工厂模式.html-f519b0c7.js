import{_ as n,o as s,c as a,a as t}from"./app-999de8cb.js";const p={},e=t(`<h1 id="抽象工厂模式" tabindex="-1"><a class="header-anchor" href="#抽象工厂模式" aria-hidden="true">#</a> 抽象工厂模式</h1><h2 id="一、基本介绍" tabindex="-1"><a class="header-anchor" href="#一、基本介绍" aria-hidden="true">#</a> 一、基本介绍</h2><ol><li><p>为访问类提供一个创建一组相关或相互依赖对象的接口，且访问类无须指定所要产品的具体类就能得到同族的不同等级的产品的模式结构；</p></li><li><p>抽象工厂模式是工厂方法模式的升级版本，工厂方法模式只生产一个等级的产品，而抽象工厂模式可生产多个等级的产品；</p></li><li><p>使用抽象工厂模式一般要满足以下条件：</p></li></ol><ul><li>系统中有多个产品族， 每个具体工厂创建同族但属于不同等级的产品；</li><li>系统一次只可能消费其中某一族产品，即同族的产品一起使用。</li></ul><div class="language-mermaid line-numbers-mode" data-ext="mermaid"><pre class="language-mermaid"><code><span class="token keyword">classDiagram</span>
    <span class="token keyword">class</span> Pizza
    <span class="token keyword">class</span> AbsFactory
    Pizza<span class="token operator">:</span>  perpare<span class="token punctuation">(</span><span class="token punctuation">)</span> void
    Pizza<span class="token operator">:</span>  bake<span class="token punctuation">(</span><span class="token punctuation">)</span> void
    Pizza<span class="token operator">:</span>  cut<span class="token punctuation">(</span><span class="token punctuation">)</span> void 
    Pizza<span class="token operator">:</span>  box<span class="token punctuation">(</span><span class="token punctuation">)</span> void
    Pizza <span class="token arrow operator">&lt;--</span> BJCheesePizza
    Pizza <span class="token arrow operator">&lt;--</span> BJPepperPizza
    BJCheesePizza <span class="token arrow operator">&lt;--</span> BJFactory
    BJPepperPizza <span class="token arrow operator">&lt;--</span> BJFactory
    AbsFactory<span class="token operator">:</span> createPizza<span class="token punctuation">(</span><span class="token punctuation">)</span> Pizza
    BJFactory <span class="token arrow operator">&lt;--</span> AbsFactory
    AbsFactory <span class="token arrow operator">--&gt;</span> OrderPizza
    Pizza <span class="token arrow operator">&lt;--</span> LDCheesePizza
    Pizza <span class="token arrow operator">&lt;--</span> LDPepperPizza
    LDCheesePizza <span class="token arrow operator">&lt;--</span> LDFactory
    LDPepperPizza <span class="token arrow operator">&lt;--</span> LDFactory
    LDFactory <span class="token arrow operator">&lt;--</span> AbsFactory
    AbsFactory <span class="token arrow operator">--&gt;</span> OrderPizza2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、抽象工厂模式的结构" tabindex="-1"><a class="header-anchor" href="#二、抽象工厂模式的结构" aria-hidden="true">#</a> 二、抽象工厂模式的结构</h2><p>抽象工厂模式同工厂方法模式一样，也是由抽象工厂、具体工厂、抽象产品和具体产品等 4 个要素构成，但抽象工厂中方法个数不同，抽象产品的个数也不同。</p><p>抽象工厂模式的主要角色如下：</p><h3 id="_1、抽象工厂" tabindex="-1"><a class="header-anchor" href="#_1、抽象工厂" aria-hidden="true">#</a> 1、抽象工厂</h3><p>提供了创建产品的接口，它包含多个创建产品的方法 newProduct()，可以创建多个不同等级的产品。</p><h3 id="_2、具体工厂" tabindex="-1"><a class="header-anchor" href="#_2、具体工厂" aria-hidden="true">#</a> 2、具体工厂</h3><p>主要是实现抽象工厂中的多个抽象方法，完成具体产品的创建。</p><h3 id="_3、抽象产品" tabindex="-1"><a class="header-anchor" href="#_3、抽象产品" aria-hidden="true">#</a> 3、抽象产品</h3><p>定义了产品的规范，描述了产品的主要特性和功能，抽象工厂模式有多个抽象产品。</p><h3 id="_4、具体产品" tabindex="-1"><a class="header-anchor" href="#_4、具体产品" aria-hidden="true">#</a> 4、具体产品</h3><p>实现了抽象产品角色所定义的接口，由具体工厂来创建，它 同具体工厂之间是多对一的关系。</p><h1 id="三、优缺点" tabindex="-1"><a class="header-anchor" href="#三、优缺点" aria-hidden="true">#</a> 三、优缺点</h1><h3 id="_1、优点" tabindex="-1"><a class="header-anchor" href="#_1、优点" aria-hidden="true">#</a> 1、优点</h3><p>可以在类的内部对产品族中相关联的多等级产品共同管理，而不必专门引入多个新的类进行管理； 当增加一个新的产品族时不需要修改原代码，满足开闭原则。</p><h3 id="_2、缺点" tabindex="-1"><a class="header-anchor" href="#_2、缺点" aria-hidden="true">#</a> 2、缺点</h3><p>当产品族中需要增加一个新的产品时，所有的工厂类都需要进行修改。</p><h1 id="四、《head-first-设计模式》读后感" tabindex="-1"><a class="header-anchor" href="#四、《head-first-设计模式》读后感" aria-hidden="true">#</a> 四、《Head First 设计模式》读后感</h1><ol><li><p>抽象工厂模式提供了一个接口，用于创建相关或依赖对象的家族，而不需要明确指定具体类。</p></li><li><p>工厂方法模式运用的是继承，抽象工厂模式运用的是对象的组合。</p></li></ol><h1 id="五-代码示例" tabindex="-1"><a class="header-anchor" href="#五-代码示例" aria-hidden="true">#</a> 五 代码示例</h1><h3 id="_1、uml类图" tabindex="-1"><a class="header-anchor" href="#_1、uml类图" aria-hidden="true">#</a> 1、UML类图</h3><h3 id="_2、具体代码" tabindex="-1"><a class="header-anchor" href="#_2、具体代码" aria-hidden="true">#</a> 2、具体代码</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//一个抽象工厂模式的抽象层(接口)</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">AbsFactory</span> <span class="token punctuation">{</span>
	<span class="token comment">//让下面的工厂子类来 具体实现</span>
	<span class="token keyword">public</span> <span class="token class-name">Pizza</span> <span class="token function">createPizza</span><span class="token punctuation">(</span><span class="token class-name">String</span> orderType<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//这是工厂子类</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">BJFactory</span> <span class="token keyword">implements</span> <span class="token class-name">AbsFactory</span> <span class="token punctuation">{</span>
	<span class="token annotation punctuation">@Override</span>
	<span class="token keyword">public</span> <span class="token class-name">Pizza</span> <span class="token function">createPizza</span><span class="token punctuation">(</span><span class="token class-name">String</span> orderType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;~使用的是抽象工厂模式~&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token class-name">Pizza</span> pizza <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
		<span class="token keyword">if</span><span class="token punctuation">(</span>orderType<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span><span class="token string">&quot;cheese&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
			pizza <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BJCheesePizza</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>orderType<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span><span class="token string">&quot;pepper&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
			pizza <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BJPepperPizza</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token punctuation">}</span>
		<span class="token keyword">return</span> pizza<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">LDFactory</span> <span class="token keyword">implements</span> <span class="token class-name">AbsFactory</span> <span class="token punctuation">{</span>
	<span class="token annotation punctuation">@Override</span>
	<span class="token keyword">public</span> <span class="token class-name">Pizza</span> <span class="token function">createPizza</span><span class="token punctuation">(</span><span class="token class-name">String</span> orderType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;~使用的是抽象工厂模式~&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token class-name">Pizza</span> pizza <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
		<span class="token keyword">if</span> <span class="token punctuation">(</span>orderType<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span><span class="token string">&quot;cheese&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
			pizza <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LDCheesePizza</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>orderType<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span><span class="token string">&quot;pepper&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
			pizza <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LDPepperPizza</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token punctuation">}</span>
		<span class="token keyword">return</span> pizza<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OrderPizza</span> <span class="token punctuation">{</span>
	<span class="token class-name">AbsFactory</span> factory<span class="token punctuation">;</span>
	<span class="token comment">// 构造器</span>
	<span class="token keyword">public</span> <span class="token class-name">OrderPizza</span><span class="token punctuation">(</span><span class="token class-name">AbsFactory</span> factory<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token function">setFactory</span><span class="token punctuation">(</span>factory<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
 
	<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">setFactory</span><span class="token punctuation">(</span><span class="token class-name">AbsFactory</span> factory<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">Pizza</span> pizza <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
		<span class="token class-name">String</span> orderType <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span> <span class="token comment">// 用户输入</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>factory <span class="token operator">=</span> factory<span class="token punctuation">;</span>
		<span class="token keyword">do</span> <span class="token punctuation">{</span>
			orderType <span class="token operator">=</span> <span class="token function">getType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token comment">// factory 可能是北京的工厂子类，也可能是伦敦的工厂子类</span>
			pizza <span class="token operator">=</span> factory<span class="token punctuation">.</span><span class="token function">createPizza</span><span class="token punctuation">(</span>orderType<span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token keyword">if</span> <span class="token punctuation">(</span>pizza <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 订购ok</span>
				pizza<span class="token punctuation">.</span><span class="token function">prepare</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
				pizza<span class="token punctuation">.</span><span class="token function">bake</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
				pizza<span class="token punctuation">.</span><span class="token function">cut</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
				pizza<span class="token punctuation">.</span><span class="token function">box</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
				<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;订购失败&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
				<span class="token keyword">break</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
 
	<span class="token comment">// 写一个方法，可以获取客户希望订购的披萨种类</span>
	<span class="token keyword">private</span> <span class="token class-name">String</span> <span class="token function">getType</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">try</span> <span class="token punctuation">{</span>
			<span class="token class-name">BufferedReader</span> strin <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BufferedReader</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">InputStreamReader</span><span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span>in<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;input pizza 种类:&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token class-name">String</span> str <span class="token operator">=</span> strin<span class="token punctuation">.</span><span class="token function">readLine</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token keyword">return</span> str<span class="token punctuation">;</span>
		<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IOException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
			e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token keyword">return</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,30),c=[e];function o(i,l){return s(),a("div",null,c)}const r=n(p,[["render",o],["__file","抽象工厂模式.html.vue"]]);export{r as default};
