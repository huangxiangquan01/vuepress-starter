import{_ as n,o as s,c as a,a as t}from"./app-999de8cb.js";const e={},p=t(`<h1 id="命令模式" tabindex="-1"><a class="header-anchor" href="#命令模式" aria-hidden="true">#</a> 命令模式</h1><p><strong>前言：</strong></p><p>​ 在开发中，我们可能需要向某些对象发送一些请求，但我们不知道请求的具体接收者是谁，也不知道被请求的操作是哪个，只知道在系统运行中指定具体的请求接收者即可，打个比方，电视遥控器，我们只需知道按哪个按钮能够打开电视、关闭电视和换台即可，并不需要知道是怎么开电视、关电视和换台的，对于这种情况，我们可以采用命令模式来进行设计。</p><h2 id="一、定义" tabindex="-1"><a class="header-anchor" href="#一、定义" aria-hidden="true">#</a> 一、定义：</h2><p>​ 命令模式的本质是将请求封装成对象，将发出命令与执行命令的责任分开，命令的发送者和接收者完全解耦，发送者只需知道如何发送命令，不需要关心命令是如何实现的，甚至是否执行成功都不需要理会。命令模式的关键在于引入了抽象命令接口，发送者针对抽象命令接口编程，只有实现了抽象命令接口的具体命令才能与接收者相关联。另外命令可以像强对象一样可以被存储和传递，所以可支持撤销的操作</p><p>​ 使用命令模式的优势在于降低了系统的耦合度，而且新命令可以很方便添加到系统中，也容易设计一个组合命令。但缺点在于会导致某些系统有过多的具体命令类，因为针对每一个命令都需要设计一个具体命令类。所以命令模式适用于以下场景：</p><ul><li>（1）需要将请求调用者和请求接收者解耦，使得调用者和接收者不直接交互。</li><li>（2）系统需要在不同的时间指定请求、将请求排队和执行请求。</li><li>（3）系统需要支持命令的撤销(Undo)操作和恢复(Redo)操作。</li><li>（4）系统需要将一组操作组合在一起，即支持宏命令。</li></ul><h2 id="二、结构图" tabindex="-1"><a class="header-anchor" href="#二、结构图" aria-hidden="true">#</a> 二、结构图：</h2><blockquote><ul><li>Receiver：接收者，执行命令的对象，任何类都可能成为一个接收者，只要它能够实现命令要求实现的相应功能。</li><li>Command：抽象命令类，声明需要执行的方法。</li><li>ConcreteCommand：具体命令类，通常会持有接收者，并调用接收者的功能完成命令要执行的操作。</li><li>Invoker：调用者，通常会持有命令对象，可以持有多个命令对象，是客户端真正触发命令并要求命令执行相应操作的地方，就是相当于使用命令对象的入口。</li><li>Client：客户类，创建具体的命令对象，并且设置命令对象的接收者。注意这里不是指常规意义上的客户端，把这个 Client 称为装配者会合适，主要用于组装命令对象和接收者。</li></ul></blockquote><p><strong>三、代码实现：</strong></p><p>​ 这里以电视机为例。电视是请求的接受者，遥控器是请求的发送者，遥控器上有一些按钮，不同的按钮对应着不同的操作。在这里遥控器需要执行三个命令：打开电视机、关闭电视机、换台。</p><p>抽象命令类：Command.java</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Command命令接口，为所有的命令声明一个接口。所有的命令都应该实现它
 */</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Command</span> <span class="token punctuation">{</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>电视机类：Television.java</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Television</span> <span class="token punctuation">{</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token keyword">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;打开电视机......&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;关闭电视机......&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>		
	<span class="token punctuation">}</span>
	
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">changeChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;切换电视频道......&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>遥控器类：Controller.java</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Controller</span> <span class="token punctuation">{</span>
	<span class="token keyword">private</span> <span class="token class-name">Command</span> openTVCommand<span class="token punctuation">;</span>
	<span class="token keyword">private</span> <span class="token class-name">Command</span> closeTVCommand<span class="token punctuation">;</span>
	<span class="token keyword">private</span> <span class="token class-name">Command</span> changeChannelCommand<span class="token punctuation">;</span>
	
	<span class="token keyword">public</span> <span class="token class-name">Controller</span><span class="token punctuation">(</span><span class="token class-name">Command</span> openTvCommand<span class="token punctuation">,</span><span class="token class-name">Command</span> closeTvCommand<span class="token punctuation">,</span><span class="token class-name">Command</span> changeChannelCommand<span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>openTVCommand <span class="token operator">=</span> openTvCommand<span class="token punctuation">;</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>closeTVCommand <span class="token operator">=</span> closeTvCommand<span class="token punctuation">;</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>changeChannelCommand <span class="token operator">=</span> changeChannelCommand<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token doc-comment comment">/**
	 * 打开电视剧
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token keyword">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		openTVCommand<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token doc-comment comment">/**
	 * 关闭电视机
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		closeTVCommand<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token doc-comment comment">/**
	 * 换频道
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">change</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		changeChannelCommand<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>遥控器的三个按钮：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OpenTvCommand</span> <span class="token keyword">implements</span> <span class="token class-name">Command</span><span class="token punctuation">{</span>
	<span class="token keyword">private</span> <span class="token class-name">Television</span> tv<span class="token punctuation">;</span>
	
	<span class="token keyword">public</span> <span class="token class-name">OpenTvCommand</span><span class="token punctuation">(</span><span class="token class-name">Television</span> tv<span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>tv <span class="token operator">=</span> tv<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		tv<span class="token punctuation">.</span><span class="token keyword">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ChangeChannelCommand</span> <span class="token keyword">implements</span> <span class="token class-name">Command</span><span class="token punctuation">{</span>
	<span class="token keyword">private</span> <span class="token class-name">Television</span> tv<span class="token punctuation">;</span>
	
	<span class="token keyword">public</span> <span class="token class-name">ChangeChannelCommand</span><span class="token punctuation">(</span><span class="token class-name">Television</span> tv<span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>tv <span class="token operator">=</span> tv<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		tv<span class="token punctuation">.</span><span class="token function">changeChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CloseTvCommand</span> <span class="token keyword">implements</span> <span class="token class-name">Command</span><span class="token punctuation">{</span>
	<span class="token keyword">private</span> <span class="token class-name">Television</span> tv<span class="token punctuation">;</span>
	
	<span class="token keyword">public</span> <span class="token class-name">CloseTvCommand</span><span class="token punctuation">(</span><span class="token class-name">Television</span> tv<span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>tv <span class="token operator">=</span> tv<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		tv<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端：Client.java</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span>
		<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span> a<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
		<span class="token punctuation">{</span>
			<span class="token class-name">Television</span> tv <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Television</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token class-name">Command</span> openCommand<span class="token punctuation">,</span>closeCommand<span class="token punctuation">,</span>changeCommand<span class="token punctuation">;</span>
			
			openCommand <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">OpenTvCommand</span><span class="token punctuation">(</span>tv<span class="token punctuation">)</span><span class="token punctuation">;</span>
			closeCommand <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CloseTvCommand</span><span class="token punctuation">(</span>tv<span class="token punctuation">)</span><span class="token punctuation">;</span>
			changeCommand <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ChangeChannelCommand</span><span class="token punctuation">(</span>tv<span class="token punctuation">)</span><span class="token punctuation">;</span>
			
			<span class="token class-name">Controller</span> control <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Controller</span><span class="token punctuation">(</span>openCommand<span class="token punctuation">,</span>closeCommand<span class="token punctuation">,</span>changeCommand<span class="token punctuation">)</span><span class="token punctuation">;</span>
			
			control<span class="token punctuation">.</span><span class="token keyword">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>           <span class="token comment">//打开电视机</span>
			control<span class="token punctuation">.</span><span class="token function">change</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>         <span class="token comment">//换频道</span>
			control<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>          <span class="token comment">//关闭电视机</span>
		<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 命令模式扩展：前面说过，命令模式支持撤销命令：在电视遥控器中，我们还有这样一个按钮，那就是返回。用于切换到上面一个频道中去。在命令模式中也支持撤销操作，在这里我们只需要记录上一个频道，然后将上一个频道传入即可。在这里将 Command 进行一个简单的修改：将 execute() 改为 execute(int i); i表示频道，用于进行频道切换。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Command命令接口，为所有的命令声明一个接口。所有的命令都应该实现它
 */</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Command</span> <span class="token punctuation">{</span>
	<span class="token doc-comment comment">/**
	 * 为了方便切换频道，这里使用参数i将频道传递
	 * <span class="token keyword">@param</span> <span class="token parameter">i</span>
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在Controller中添加channelUndo()方法，用于进行频道返回。并且需要进行一些简单的修改。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Controller</span> <span class="token punctuation">{</span>
	<span class="token keyword">private</span> <span class="token class-name">Command</span> openTVCommand<span class="token punctuation">;</span>
	<span class="token keyword">private</span> <span class="token class-name">Command</span> closeTVCommand<span class="token punctuation">;</span>
	<span class="token keyword">private</span> <span class="token class-name">Command</span> changeChannelCommand<span class="token punctuation">;</span>
	
	<span class="token keyword">public</span> <span class="token keyword">int</span> nowChannel <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>       <span class="token comment">//当前频道</span>
	<span class="token keyword">public</span> <span class="token keyword">int</span> priorChannel<span class="token punctuation">;</span>     <span class="token comment">//前一个频道，用于执行返回操作</span>
	
	<span class="token keyword">public</span> <span class="token class-name">Controller</span><span class="token punctuation">(</span><span class="token class-name">Command</span> openTvCommand<span class="token punctuation">,</span><span class="token class-name">Command</span> closeTvCommand<span class="token punctuation">,</span><span class="token class-name">Command</span> changeChannelCommand<span class="token punctuation">)</span><span class="token punctuation">{</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>openTVCommand <span class="token operator">=</span> openTvCommand<span class="token punctuation">;</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>closeTVCommand <span class="token operator">=</span> closeTvCommand<span class="token punctuation">;</span>
		<span class="token keyword">this</span><span class="token punctuation">.</span>changeChannelCommand <span class="token operator">=</span> changeChannelCommand<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token doc-comment comment">/**
	 * 打开电视剧
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token keyword">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		openTVCommand<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token doc-comment comment">/**
	 * 关闭电视机
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		closeTVCommand<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token doc-comment comment">/**
	 * 换频道：只在当前频道递增
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">change</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		priorChannel <span class="token operator">=</span> nowChannel<span class="token punctuation">;</span>            <span class="token comment">//换频道前记录当前频道</span>
		nowChannel<span class="token operator">++</span><span class="token punctuation">;</span>       <span class="token comment">//频道+1</span>
		changeChannelCommand<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>nowChannel<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	
	<span class="token doc-comment comment">/**
	 * 频道返回
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token class-name">ChannelUndo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
		changeChannelCommand<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>priorChannel<span class="token punctuation">)</span><span class="token punctuation">;</span>          <span class="token comment">//将以前的频道传入</span>
		<span class="token comment">//当前频道与前一个频道进行互换</span>
		<span class="token keyword">int</span> tempChannel<span class="token punctuation">;</span>
		tempChannel <span class="token operator">=</span> priorChannel<span class="token punctuation">;</span>
		priorChannel <span class="token operator">=</span> nowChannel<span class="token punctuation">;</span>
		nowChannel <span class="token operator">=</span> tempChannel<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span>
		<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span> a<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
		<span class="token punctuation">{</span>
			<span class="token class-name">Television</span> tv <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Television</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token class-name">Command</span> openCommand<span class="token punctuation">,</span>closeCommand<span class="token punctuation">,</span>changeCommand<span class="token punctuation">;</span>
			
			openCommand <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">OpenTvCommand</span><span class="token punctuation">(</span>tv<span class="token punctuation">)</span><span class="token punctuation">;</span>
			closeCommand <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CloseTvCommand</span><span class="token punctuation">(</span>tv<span class="token punctuation">)</span><span class="token punctuation">;</span>
			changeCommand <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ChangeChannelCommand</span><span class="token punctuation">(</span>tv<span class="token punctuation">)</span><span class="token punctuation">;</span>
			
			<span class="token class-name">Controller</span> control <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Controller</span><span class="token punctuation">(</span>openCommand<span class="token punctuation">,</span>closeCommand<span class="token punctuation">,</span>changeCommand<span class="token punctuation">)</span><span class="token punctuation">;</span>
			
			control<span class="token punctuation">.</span><span class="token keyword">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>           <span class="token comment">//打开电视机</span>
			control<span class="token punctuation">.</span><span class="token function">change</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>         <span class="token comment">//换频道</span>
			control<span class="token punctuation">.</span><span class="token function">change</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token class-name"><span class="token namespace">control<span class="token punctuation">.</span></span>ChannelUndo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token class-name"><span class="token namespace">control<span class="token punctuation">.</span></span>ChannelUndo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token class-name"><span class="token namespace">control<span class="token punctuation">.</span></span>ChannelUndo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			control<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>          <span class="token comment">//关闭电视机</span>
		<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,29),o=[p];function c(l,i){return s(),a("div",null,o)}const d=n(e,[["render",c],["__file","命令模式.html.vue"]]);export{d as default};
