import{_ as a,o as e,c as i,a as d}from"./app-999de8cb.js";const r={},t=d('<h1 id="字典树" tabindex="-1"><a class="header-anchor" href="#字典树" aria-hidden="true">#</a> 字典树</h1><h2 id="一、概念" tabindex="-1"><a class="header-anchor" href="#一、概念" aria-hidden="true">#</a> 一、概念</h2><p>Trie树，即字典树，又称单词查找树或键树，是一种树形结构，是一种哈希树的变种。典型应用是用于统计和排序大量的字符串（但不仅限于字符串），所以经常被搜索引擎系统用于文本词频统计。它的优点是：最大限度地减少无谓的字符串比较，查询效率比哈希表高。</p><p>Trie的核心思想是空间换时间。利用字符串的公共前缀来降低查询时间的开销以达到提高效率的目的。</p><h2 id="二、3个基本性质" tabindex="-1"><a class="header-anchor" href="#二、3个基本性质" aria-hidden="true">#</a> 二、3个基本性质</h2><ol><li>根节点不包含字符，除根节点外每一个节点都只包含一个字符。</li><li>从根节点到某一节点，路径上经过的字符连接起来，为该节点对应的字符串。</li><li>每个节点的所有子节点包含的字符都不相同。</li></ol><h2 id="三、trie树的构建" tabindex="-1"><a class="header-anchor" href="#三、trie树的构建" aria-hidden="true">#</a> 三、Trie树的构建</h2><p>本质上，Trie是一颗存储多个字符串的树。相邻节点间的边代表一个字符，这样树的每条分支代表一则子串，而树的叶节点则代表完整的字符串。和普通树不同的地方是，相同的字符串前缀共享同一条分支。举一个例子。给出一组单词，inn, int, at, age, adv, ant, 我们可以得到下面的Trie：</p><p>搭建Trie的基本算法很简单，无非是逐一把每则单词的每个字母插入Trie。插入前先看前缀是否存在。如果存在，就共享，否则创建对应的节点和边。比如要插入单词add，就有下面几步：</p><ol><li>考察前缀&quot;a&quot;，发现边a已经存在。于是顺着边a走到节点a。</li><li>考察剩下的字符串&quot;dd&quot;的前缀&quot;d&quot;，发现从节点a出发，已经有边d存在。于是顺着边d走到节点ad</li><li>考察最后一个字符&quot;d&quot;，这下从节点ad出发没有边d了，于是创建节点ad的子节点add，并把边ad-&gt;add标记为d。</li></ol><h3 id="插入" tabindex="-1"><a class="header-anchor" href="#插入" aria-hidden="true">#</a> 插入：</h3><p>插入操作就是将单词的每个字母都逐一插入Trie树，插入前看这个字母对应的节点是否存在，若不存在就新建一个节点，否则就共享那一个节点</p><h3 id="查询" tabindex="-1"><a class="header-anchor" href="#查询" aria-hidden="true">#</a> 查询：</h3><p>查询操作和插入操作其实差不多，就是在Trie树中找这个单词的每个字母，若找到了就继续找下去，若没有找到就可以直接退出了，因为若没找到就说明没有这个单词</p><h3 id="复杂度分析" tabindex="-1"><a class="header-anchor" href="#复杂度分析" aria-hidden="true">#</a> 复杂度分析</h3><p>Trie树其实是一种用空间换时间的算法，前面也提到过，它占用的空间一般很大，但时间是非常高效的，插入和查询的时间复杂度都是O（n）的</p>',16),h=[t];function n(o,l){return e(),i("div",null,h)}const s=a(r,[["render",n],["__file","字典树.html.vue"]]);export{s as default};
