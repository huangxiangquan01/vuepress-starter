# 集合
## HashMap
### 数据结构
> 数组+链表+(红黑树jdk>=8)

### 源码原理分析
**重要成员变量**
   - DEFAULT_INITIAL_CAPACITY = 1 << 4; Hash表默认初始容量 
   - MAXIMUM_CAPACITY = 1 << 30; 最大Hash表容量 
   - DEFAULT_LOAD_FACTOR = 0.75f；默认加载因子 
   - TREEIFY_THRESHOLD = 8；链表转红黑树阈值 
   - UNTREEIFY_THRESHOLD = 6；红黑树转链表阈值 
   - MIN_TREEIFY_CAPACITY = 64；链表转红黑树时hash表最小容量阈值，达不到优先扩容。

    HashMap是线程不安全的，不安全的具体原因就是在高并发场景下，扩容可能产生死锁 (Jdk1.7存在)以及get操作可能带来的数据丢失。

 ### Jdk8-扩容
 Java8 HashMap扩容跳过了Jdk7扩容的坑，对源码进行了优化，采用高低位拆分转移方 式，避免了链表环的产生。

# ConcurrentHashMap

### 数据结构
ConcurrentHashMap的数据结构与HashMap基本类似，区别在于：
   1. 内部在数据写入时加了同步机制(分段锁)保证线程安全，读操作是无锁操作；
   1. 扩容时老数据的转移 是并发执行的，这样扩容的效率更高。

### 并发安全控制
Java7 ConcurrentHashMap基于ReentrantLock实现分段锁.

Java8中 ConcurrentHashMap基于分段锁 + CAS保证线程安全，分段锁基于synchronized关键字实现；
### 源码原理分析
**重要成员变量**:

   - LOAD_FACTOR: 负载因子, 默认75%, 当table使用率达到75%时, 为减少table的hash碰撞, tabel长度将扩容一倍。

        >  负载因子计算: 元素总个数 % table.lengh 

   - TREEIFY_THRESHOLD: 默认8, 当链表长度达到8时, 将结构转变为红黑树。 

   - UNTREEIFY_THRESHOLD: 默认6, 红黑树转变为链表的阈值。 

   - MIN_TRANSFER_STRIDE: 默认16, table扩容时, 每个线程最少迁移table的槽位 个数。

   - MOVED: 值为-1, 当Node.hash为MOVED时, 代表着table正在扩容 

   - TREEBIN, 置为-2, 代表此元素后接红黑树。 

   - nextTable: table迁移过程临时变量, 在迁移过程中将元素全部迁移到nextTable上。
        > 1. 0: table还没有被初始化 
        > 1. -1: table正在初始化 
        > 1. 小于-1: 实际值为resizeStamp(n) <<RESIZE_STAMP_SHIFT+2, 表明table正在扩容 
        > 1. 大于0: 初始化完成后, 代表table最大存放元素 的个数, 默认为0.75 * n
        
   - transferIndex: table容量从n扩到2n时, 是从索引n->1的元素开始迁移, transferIndex代表当前已经迁移的元素下标 

   - ForwardingNode: 一个特殊的Node节点, 其hashcode=MOVED, 代表着此时 table正在做扩容操作。扩容期间, 若table某个元素为null, 那么该元素设置为 ForwardingNode, 当下个线程向这个元素插入数据时, 检查hashcode=MOVED, 就会帮着扩容。

ConcurrentHashMap由三部分构成, table + 链表 + 红黑树, 其中table是一个数组, 既然是 数组, 必须要在使用时确定数组的大小, 当table存放的元素过多时, 就需要扩容, 以减少碰撞发生次数, 本文就讲解扩容的过程。扩容检查主要发生在插入元素(putVal())的过程:
   - 一个线程插完元素后, 检查table使用率, 若超过阈值, 调用transfer进行扩容
   - 一个线程插入数据时, 发现table对应元素的hash=MOVED, 那么调用 helpTransfer()协助扩容。

### 协助扩容helpTransfer
主要做了如下事情:
   - 检查是否扩容完成 对sizeCtrl = sizeCtrl+1,
   - 然后调用transfer()进行真正的扩容。

### 扩容transfer
扩容的整体步骤就是新建一个nextTab, size是之前的2倍, 将table上的非空元素 迁移到nextTab上面去。

**两个变量**: 
   - advance: 表示是否可以向下一个轮元素进行迁移。 
   - finishing: table所有元素是否迁移完成。

大致做了如下事情: 
   - 确定线程每轮迁移元素的个数stride, 比如进来一个线程, 确定扩容table下标为 (a,b]之间元素, 下一个线程扩容(b,c]。这里对b-a或者c-b也是由最小值16限制的。也就是说每个线程最少扩容连续16个table的元素。而标志当前迁移的下标保存在 transferIndex里面。 
   - 检查nextTab是否完成初始化, 若没有的话, 说明是第一个迁移的线程, 先初始化 nextTab, size是之前table的2倍。 
   - 进入while循环查找本轮迁移的table下标元素区间, 保存在(bound, i]中, 注意这 里是半开半闭区间。 
   - 从i -> bound开始遍历table中每个元素, 

这里是从大到小遍历的:
   1. 若该元素为空, 则向该元素标写入ForwardingNode, 然后检查下一个元素。 当别 的线程向这个元素插入数据时, 根据这个标志符知道了table正在被别的线程迁移, 在 putVal中就会调用helpTransfer帮着迁移。
   1. 若该元素的hash=MOVED, 代表次table正在处于迁移之中, 跳过。按道理不会跑 着这里的。 
   1. 否则说明该元素跟着的是一个链表或者是个红黑树结构, 若hash>0, 则说明是个链表, 若f instanceof TreeBin, 则说明是个红黑树结构。
       - 链表迁移原理如下: 遍历链表每个节点。 若节点的f.hash&n==0成立, 则将节点放在i, 否则, 则将节点放在n+i上面。
       - 迁移前, 对该元素进行加锁。 遍历链表时, 这里使用lastRun变量, 保留的是上次hash的 值, 假如整个链表全部节点f.hash&n==0, 那么第二次遍历, 只要找到lastRun的值, 那么认为之后的节点都是相同值, 减少了不必要的f.hash&n取值。遍历完所有的节点后, 此时形成了两条链表, ln存放的是f.hash&n=0的节点, hn存放的是非0的节点, 然后将ln存放在 nextTable第i元素的位置, n+i存放在n+i的位置。
       - 蓝色节点代表:f.hash&n==0, 绿色节点代表f.hash&n!=0。 最终蓝色的节点仍在存放在(0, n)范围里, 绿的节点存放在(n, 2n-1)的范围之内。
       - 迁移链表和红黑树的原理是一样的, 在红黑树中, 我们记录了每个红黑树的 first(这个节点不是hash最小的节点)和每个节点的next, 根据这两个元素, 我们可以访问红黑树所有的元素, 红黑树此时也是一个链表, 红黑树和链表迁移的过程一样。红黑树根据迁移后拆分成了hn和ln, 根据链表长度确定链表是红黑树结构还是退化为了链 表。
   1. 第一个线程开始迁移时, 设置了sizeCtl= resizeStamp(n) << RESIZE_STAMP_SHIFT+2, 此后每个新来帮助迁移的线程都会sizeCtl=sizeCtl+1, 完成迁移 后,sizeCtl-1, 那么只要有一个线程还处于迁移状态, 那么sizeCtl> resizeStamp(n) << RESIZE_STAMP_SHIFT+2一直成立, 当只有最后一个线程完成迁移之后, 等式两边才成立。
      可能大家会有疑问, 第一个线程并没有对sizeCtl=sizeCtl+1, 此时完成后再减一, 那不是不相等了吗, 注意这里, sizeCtl在减一前, 将值赋给了sc, 等式比较的是sc。
 ### 总结
 table扩容过程就是将table元素迁移到新的table上, 在元素迁移时, 可以并发完成, 加快了迁移速度, 同时不至于阻塞线程。所有元素迁移完成后, 旧的table直接丢失, 直接使用新的 table。

 # CopyOnWrite机制
 核心思想：读写分离，空间换时间，避免为保证并发安全导致的激烈的锁竞争。    
 划关键点：
   1. CopyOnWrite适用于读多写少的情况，最大程度的提高读的效率； 
   1. CopyOnWrite是最终一致性，在写的过程中，原有的读的数据是不会发生更新的，只有新的读 才能读到最新数据； 
   1. 如何使其他线程能够及时读到新的数据，需要使用volatile变量； 
   1. 写的时候不能并发写，需要对写操作进行加锁； 
    

