import{_ as i,o,c as r,a}from"./app-999de8cb.js";const n={},e=a(`<h1 id="synchronized-md" tabindex="-1"><a class="header-anchor" href="#synchronized-md" aria-hidden="true">#</a> Synchronized.md</h1><h2 id="设计同步器的意义" tabindex="-1"><a class="header-anchor" href="#设计同步器的意义" aria-hidden="true">#</a> 设计同步器的意义</h2><p>多线程编程中，有可能会出现多个线程同时访问同一个共享、可变资源的情况，这个资源我们称之其为临界资源；这种资源可能是： 对象、变量、文件等。</p><ul><li>共享：资源可以由多个线程同时访问</li><li>可变：资源可以在其生命周期内被修改 引出的问题： 由于线程执行的过程是不可控的，所以需要采用同步机制来协同对对象可变状态的访问。</li></ul><h3 id="如何解决线程并发安全问题" tabindex="-1"><a class="header-anchor" href="#如何解决线程并发安全问题" aria-hidden="true">#</a> 如何解决线程并发安全问题</h3><p>实际上，所有的并发模式在解决线程安全问题时，采用的方案都是序列化访问临界资源。即在同一时刻，只能有一个线程访问临 界资源，也称作<strong>同步互斥访问</strong>。</p><p><strong>Java 中，提供了两种方式来实现同步互斥访问：synchronized 和 Lock</strong></p><h3 id="同步器的本质就是加锁" tabindex="-1"><a class="header-anchor" href="#同步器的本质就是加锁" aria-hidden="true">#</a> 同步器的本质就是加锁</h3><p>加锁目的：序列化访问临界资源，即同一时刻只能有一个线程访问临界资源(同步互斥访问) 不过有一点需要区别的是：当多个线程执行一个方法时，该方法内部的局部变量并不是临界资源，因为这些局部变量是在每个线程的 私有栈中，因此不具有共享性，不会导致线程安全问题。</p><h1 id="synchronized原理详解" tabindex="-1"><a class="header-anchor" href="#synchronized原理详解" aria-hidden="true">#</a> synchronized原理详解</h1><p><strong>synchronized内置锁是一种对象锁(锁的是对象而非引用)，作用粒度是对象，可以用来实现对临界资源的同步互斥访问，是可重入的。</strong></p><p>加锁的方式：</p><ul><li>同步实例方法，锁是当前实例对象</li><li>同步类方法，锁是当前类对象</li><li>同步代码块，锁是括号里面的对象</li></ul><h3 id="synchronized底层原理" tabindex="-1"><a class="header-anchor" href="#synchronized底层原理" aria-hidden="true">#</a> synchronized底层原理</h3><p>synchronized是基于JVM内置锁实现，通过内部对象Monitor(监视器锁)实现，基于进入与退出Monitor对象实现方法与代码 块同步，监视器锁的实现依赖底层操作系统的Mutex lock（互斥锁）实现，它是一个重量级锁性能较低。当然，JVM内置锁在1.5 之后版本做了重大的优化，如锁粗化（Lock Coarsening）、锁消除（Lock Elimination）、轻量级锁（Lightweight Locking）、偏向锁（Biased Locking）、适应性自旋（Adaptive Spinning）等技术来减少锁操作的开销，，内置锁的并发性能已经基本与 Lock持平。</p><p>synchronized关键字被编译成字节码后会被翻译成monitorenter 和 monitorexit 两条指令分别在同步块逻辑代码的起始位置 与结束位置。</p><h3 id="monitor监视器锁" tabindex="-1"><a class="header-anchor" href="#monitor监视器锁" aria-hidden="true">#</a> Monitor监视器锁</h3><p>任何一个对象都有一个Monitor与之关联，当且一个Monitor被持有后，它将处于锁定状态。Synchronized在JVM里的实现都是 基于进入和退出Monitor对象来实现方法同步和代码块同步，虽然具体实现细节不一样，但是都可以通过成对的MonitorEnter和 MonitorExit指令来实现。</p><ul><li>monitorenter：每个对象都是一个监视器锁（monitor）。当monitor被占用时就会处于锁定状态，线程执行 monitorenter指令时尝试获取monitor的所有权，过程如下： <ol><li>如果monitor的进入数为0，则该线程进入monitor，然后将进入数设置为1，该线程即为monitor 的所有者；</li><li>如果线程已经占有该monitor，只是重新进入，则进入monitor的进入数加1；</li><li>如果其他线程已经占用了monitor，则该线程进入阻塞状态，直到monitor的进入数为0，再重新尝 试获取monitor的所有权；</li></ol></li><li>monitorexit：执行monitorexit的线程必须是objectref所对应的monitor的所有者。指令执行时，monitor的进入数减 1，如果减1后进入数为0，那线程退出monitor，不再是这个monitor的所有者。其他被这个monitor阻塞的线程可以尝试去 获取这个 monitor 的所有权。</li></ul><p>monitorexit，指令出现了两次，第1次为同步正常退出释放锁；第2次为发生异步退出释放锁； 通过上面两段描述，我们应该能很清楚的看出Synchronized的实现原理，Synchronized的语义底层是通过一个monitor的对象来 完成，其实wait/notify等方法也依赖于monitor对象，这就是为什么只有在同步的块或者方法中才能调用wait/notify等方法，否则 会抛出java.lang.IllegalMonitorStateException的异常的原因。</p><p>方法的同步并没有通过指令 monitorenter 和 monitorexit 来完成（理论上其实也可以通过这两条指令来 实现），不过相对于普通方法，其常量池中多了 ACC_SYNCHRONIZED 标示符。JVM就是根据该标示符来实现方法的同步的： 当方法调用时，调用指令将会检查方法的 ACC_SYNCHRONIZED 访问标志是否被设置，如果设置了，执行线程将先获取 monitor，获取成功之后才能执行方法体，方法执行完后再释放monitor。在方法执行期间，其他任何线程都无法再获得同一个 monitor对象。</p><p>两种同步方式本质上没有区别，只是方法的同步是一种隐式的方式来实现，无需通过字节码来完成。两个指令的执行是JVM通 过调用操作系统的互斥原语mutex来实现，被阻塞的线程会被挂起、等待重新调度，会导致“用户态和内核态”两个态之间来回切 换，对性能有较大影响。</p><h3 id="什么是monitor" tabindex="-1"><a class="header-anchor" href="#什么是monitor" aria-hidden="true">#</a> 什么是monitor</h3><p>可以把它理解为 一个同步工具，也可以描述为 一种同步机制，它通常被 描述为一个对象。与一切皆对象一样，所有的Java对象 是天生的Monitor，每一个Java对象都有成为Monitor的潜质，因为在Java的设计中 ，每一个Java对象自打娘胎里出来就带了一把 看不见的锁，它叫做内部锁或者Monitor锁。也就是通常说Synchronized的对象锁，MarkWord锁标识位为10，其中指针指向的 是Monitor对象的起始地址。在Java虚拟机（HotSpot）中，Monitor是由ObjectMonitor实现的，</p><p>ObjectMonitor中有两个队列，_WaitSet 和 _EntryList，用来保存ObjectWaiter对象列表（ 每个等待锁的线程都会被封装成 ObjectWaiter对象 ），_owner指向持有ObjectMonitor对象的线程，当多个线程同时访问一段同步代码时：</p><ol><li>首先会进入 _EntryList 集合，当线程获取到对象的monitor后，进入 _Owner区域并把monitor中的owner变量设置为当 前线程，同时monitor中的计数器count加1；</li><li>若线程调用 wait() 方法，将释放当前持有的monitor，owner变量恢复为null，count自减1，同时该线程进入 WaitSet 集合中等待被唤醒；</li><li>若当前线程执行完毕，也将释放monitor（锁）并复位count的值，以便其他线程进入获取monitor(锁)；</li></ol><p>同时，Monitor对象存在于每个Java对象的对象头Mark Word中（存储的指针的指向），Synchronized锁便是通过这种方式 获取锁的，也是为什么Java中任意对象可以作为锁的原因，同时notify/notifyAll/wait等方法会使用到Monitor锁对象，所以必须在同步代码块中使用。监视器Monitor有两种同步方式：互斥与协作。多线程环境下线程之间如果需要共享数据，需要解决互斥访问 数据的问题，监视器可以确保监视器上的数据在同一时刻只会有一个线程在访问。</p><h3 id="对象的内存布局" tabindex="-1"><a class="header-anchor" href="#对象的内存布局" aria-hidden="true">#</a> 对象的内存布局</h3><p>HotSpot虚拟机中，对象在内存中存储的布局可以分为三块区域：对象头（Header）、实例数据（Instance Data）和对齐填充 （Padding）。</p><ul><li>对象头：比如 hash码，对象所属的年代，对象锁，锁状态标志，偏向锁（线程）ID，偏向时间，数组长度（数组对象） 等。Java对象头一般占有2个机器码（在32位虚拟机中，1个机器码等于4字节，也就是32bit，在64位虚拟机中，1个机器码 是8个字节，也就是64bit），但是 如果对象是数组类型，则需要3个机器码，因为JVM虚拟机可以通过Java对象的元数据信 息确定Java对象的大小，但是无法从数组的元数据来确认数组的大小，所以用一块来记录数组长度。</li><li>实例数据：存放类的属性数据信息，包括父类的属性信息；</li><li>对齐填充：由于虚拟机要求 对象起始地址必须是8字节的整数倍。填充数据不是必须存在的，仅仅是为了字节对齐；</li></ul><h4 id="对象头" tabindex="-1"><a class="header-anchor" href="#对象头" aria-hidden="true">#</a> 对象头</h4><p>HotSpot虚拟机的对象头包括两部分信息，第一部分是“Mark Word”，用于存储对象自身的运行时数据， 如哈希码 （HashCode）、GC分代年龄、锁状态标志、线程持有的锁、偏向线程ID、偏向时间戳等等，它是实现轻量级锁和偏向锁的关 键。，这部分数据的长度在32位和64位的虚拟机（暂 不考虑开启压缩指针的场景）中分别为32个和64个Bits，官方称它为“Mark Word”。对象需要存储的运行时数据很多，其实已经超出了32、64位Bitmap结构所能记录的限度，但是对象头信息是与对象自身 定义的数据无关的额 外存储成本，考虑到虚拟机的空间效率，Mark Word被设计成一个非固定的数据结构以便在极小的空间内存储 尽量多的信息，它会根据对象的状态复用自己的存储空间。例如在32位的HotSpot虚拟机 中对象未被锁定的状态下，Mark Word的 32个Bits空间中的25Bits用于存储对象哈希码（HashCode），4Bits用于存储对象分代年龄，2Bits用于存储锁标志位，1Bit固定为 0，在其他状态（轻量级锁定、重量级锁定、GC标记、可偏向）下对象的存储内容如下表所示。 但是如果对象是数组类型，则需要三个机器码，因为JVM虚拟机可以通过Java对象的元数据信息确定Java对象的大小，但是无 法从数组的元数据来确认数组的大小，所以用一块来记录数组长度。 对象头信息是与对象自身定义的数据无关的额外存储成本，但是考虑到虚拟机的空间效率，Mark Word被设计成一个非固定的 数据结构以便在极小的空间内存存储尽量多的数据，它会根据对象的状态复用自己的存储空间，也就是说，Mark Word会随着程序 的运行发生变化。</p><h3 id="锁的膨胀升级过程" tabindex="-1"><a class="header-anchor" href="#锁的膨胀升级过程" aria-hidden="true">#</a> 锁的膨胀升级过程</h3><p>锁的状态总共有四种，无锁状态、偏向锁、轻量级锁和重量级锁。随着锁的竞争，锁可以从偏向锁升级到轻量级锁，再升级的重 量级锁，但是锁的升级是单向的，也就是说只能从低到高升级，不会出现锁的降级。从JDK 1.6 中默认是开启偏向锁和轻量级锁 的，可以通过-XX:-UseBiasedLocking来禁用偏向锁。下图为锁的升级全过程：</p><h4 id="偏向锁" tabindex="-1"><a class="header-anchor" href="#偏向锁" aria-hidden="true">#</a> 偏向锁</h4><p>偏向锁是Java 6之后加入的新锁，它是一种针对加锁操作的优化手段，经过研究发现，在大多数情况下，锁不仅不存在多线程竞 争，而且总是由同一线程多次获得，因此为了减少同一线程获取锁(会涉及到一些CAS操作,耗时)的代价而引入偏向锁。偏向锁的核心 思想是，如果一个线程获得了锁，那么锁就进入偏向模式，此时Mark Word 的结构也变为偏向锁结构，当这个线程再次请求锁时， 无需再做任何同步操作，即获取锁的过程，这样就省去了大量有关锁申请的操作，从而也就提供程序的性能。所以，对于没有锁竞争 的场合，偏向锁有很好的优化效果，毕竟极有可能连续多次是同一个线程申请相同的锁。但是对于锁竞争比较激烈的场合，偏向锁就 失效了，因为这样场合极有可能每次申请锁的线程都是不相同的，因此这种场合下不应该使用偏向锁，否则会得不偿失，需要注意的 是，偏向锁失败后，并不会立即膨胀为重量级锁，而是先升级为轻量级锁。</p><blockquote><p>默认开启偏向锁 开启偏向锁：-XX:+UseBiasedLocking -XX:BiasedLockingStartupDelay=0 关闭偏向锁：-XX:-UseBiasedLocking</p></blockquote><h3 id="轻量级锁" tabindex="-1"><a class="header-anchor" href="#轻量级锁" aria-hidden="true">#</a> 轻量级锁</h3><p>倘若偏向锁失败，虚拟机并不会立即升级为重量级锁，它还会尝试使用一种称为轻量级锁的优化手段(1.6之后加入的)，此时 Mark Word 的结构也变为轻量级锁的结构。轻量级锁能够提升程序性能的依据是“对绝大部分的锁，在整个同步周期内都不存在竞 争”，注意这是经验数据。需要了解的是，轻量级锁所适应的场景是线程交替执行同步块的场合，如果存在同一时间访问同一锁的场 合，就会导致轻量级锁膨胀为重量级锁。</p><h3 id="自旋锁" tabindex="-1"><a class="header-anchor" href="#自旋锁" aria-hidden="true">#</a> 自旋锁</h3><p>轻量级锁失败后，虚拟机为了避免线程真实地在操作系统层面挂起，还会进行一项称为自旋锁的优化手段。这是基于在大多数情 况下，线程持有锁的时间都不会太长，如果直接挂起操作系统层面的线程可能会得不偿失，毕竟操作系统实现线程之间的切换时需要 从用户态转换到核心态，这个状态之间的转换需要相对比较长的时间，时间成本相对较高，因此自旋锁会假设在不久将来，当前的线 程可以获得锁，因此虚拟机会让当前想要获取锁的线程做几个空循环(这也是称为自旋的原因)，一般不会太久，可能是50个循环或 100循环，在经过若干次循环后，如果得到锁，就顺利进入临界区。如果还不能获得锁，那就会将线程在操作系统层面挂起，这就是 自旋锁的优化方式，这种方式确实也是可以提升效率的。最后没办法也就只能升级为重量级锁了。</p><h3 id="锁消除" tabindex="-1"><a class="header-anchor" href="#锁消除" aria-hidden="true">#</a> 锁消除</h3><p>消除锁是虚拟机另外一种锁的优化，这种优化更彻底，Java虚拟机在JIT编译时(可以简单理解为当某段代码即将第一次被执行时 进行编译，又称即时编译)，通过对运行上下文的扫描，去除不可能存在共享资源竞争的锁，通过这种方式消除没有必要的锁，可以 节省毫无意义的请求锁时间，如下StringBuffer的append是一个同步方法，但是在add方法中的StringBuffer属于一个局部变量，并 且不会被其他线程所使用，因此StringBuffer不可能存在共享资源竞争的情景，JVM会自动将其锁消除。锁消除的依据是逃逸分析的 数据支持。</p><pre><code>锁消除，前提是java必须运行在server模式（server模式会比client模式作更多的优化），同时必须开启逃逸分析
</code></pre><blockquote><p>-XX:+DoEscapeAnalysis 开启逃逸分析 -XX:+EliminateLocks 表示开启锁消除。</p></blockquote><h4 id="逃逸分析" tabindex="-1"><a class="header-anchor" href="#逃逸分析" aria-hidden="true">#</a> 逃逸分析</h4><p>使用逃逸分析，编译器可以对代码做如下优化：</p><blockquote><ol><li>同步省略。如果一个对象被发现只能从一个线程被访问到，那么对于这个对象的操作可以不考虑同步。</li><li>将堆分配转化为栈分配。如果一个对象在子程序中被分配，要使指向该对象的指针永远不会逃逸，对象可能是栈分配的候选，而不是堆分 配。</li><li>分离对象或标量替换。有的对象可能不需要作为一个连续的内存结构存在也可以被访问到，那么对象的部分（或全部）可以不存储在内存， 而是存储在CPU寄存器中。</li></ol></blockquote>`,48),t=[e];function d(h,c){return o(),r("div",null,t)}const s=i(n,[["render",d],["__file","Synchronized.html.vue"]]);export{s as default};
