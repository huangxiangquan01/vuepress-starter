# AQS工具类

## BlockingQueue

### 概要
BlockingQueue，是java.util.concurrent 包提供的用于解决并发生产者 - 消费者问题 的最有用的类，它的特性是在任意时刻只有一个线程可以进行take或者put操作，并且 BlockingQueue提供了超时return null的机制，在许多生产场景里都可以看到这个工具的 身影。

### 队列类型
   - 无限队列 （unbounded queue ） - 几乎可以无限增长 
   - 有限队列 （ bounded queue ） - 定义了最大容量
   
### 队列数据结构
    > 队列实质就是一种存储数据的结构

   - 通常用链表或者数组实现 
   - 一般而言队列具备FIFO先进先出的特性，当然也有双端队列（Deque）优先级 
   - 队列主要操作：入队（EnQueue）与出队（Dequeue）

### 常见的4种阻塞队列
   - ArrayBlockingQueue 由数组支持的有界队列 
   - LinkedBlockingQueue 由链接节点支持的可选有界队列 
   - PriorityBlockingQueue 由优先级堆支持的无界优先级队列 
   - DelayQueue 由优先级堆支持的、基于时间的调度队列
   
### ArrayBlockingQueue
队列基于数组实现,容量大小在创建ArrayBlockingQueue对象时已定义好数据结构。

#### 应用场景
在线程池中有比较多的应用，生产者消费者场景
#### 工作原理
基于ReentrantLock保证线程安全，根据Condition实现队列满时的阻塞

### LinkedBlockingQueue
是一个基于链表的无界队列(理论上有界， blockingQueue 的容量将设置为 Integer.MAX_VALUE 。)

向无限队列添加元素的所有操作都将永远不会阻塞，[注意这里不是说不会加锁保证线程安全]，因此它可以增长到非常大的容量。 使用无限 BlockingQueue 设计生产者 - 消费者模型时最重要的是 消费者应该能够像生产 者向队列添加消息一样快地消费消息 。否则，内存可能会填满，然后就会得到一 个 OutOfMemory 异常。

### DelayQueue
由优先级堆支持的、基于时间的调度队列，内部基于无界队列PriorityQueue实现，而无界 队列基于数组的扩容实现。

#### 要求
入队的对象必须要实现Delayed接口,而Delayed集成自Comparable接口 
### 应用场景
电影票
### 工作原理
队列内部会根据时间优先级进行排序。延迟类线程池周期执行。


#Semaphore
Semaphore 字面意思是信号量的意思，它的作用是控制访问特定资源的线程数目，底层依 赖AQS的状态State，是在生产当中比较常用的一个工具类。
### 构造方法
```
    public Semaphore(int permits)  
    public Semaphore(int permits, boolean fair)
```
   - permits 表示许可线程的数量 
   - fair 表示公平性，如果这个设为 true 的话，下次执行的线程会是等待最久的线程

### 重要方法
```
    public void acquire() throws InterruptedException 
    public void release() 
    tryAcquire（long timeout, TimeUnit unit）
```
   - acquire() 表示阻塞并获取许可 
   - release() 表示释放许可
   
### 基本使用
#### 需求场景
资源访问，服务限流(Hystrix里限流就有基于信号量方式)。

# CountDownLatch
CountDownLatch这个类能够使一个线程等待其他线程完成各自的工作后再执行。例 如，应用程序的主线程希望在负责启动框架服务的线程已经启动所有的框架服务之后再执 行。

### 使用场景：
Zookeeper分布式锁,Jmeter模拟高并发等

### CountDownLatch如何工作？
CountDownLatch是通过一个计数器来实现的，计数器的初始值为线程的数量。每当 一个线程完成了自己的任务后，计数器的值就会减1。当计数器值到达0时，它表示所有的 线程已经完成了任务，然后在闭锁上等待的线程就可以恢复执行任务。

### API
```
    CountDownLatch.countDown() 
    CountDownLatch.await();
```

# CyclicBarrier
栅栏屏障，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程 到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续运行。

CyclicBarrier默认的构造方法是CyclicBarrier（int parties），其参数表示屏障拦截的线 程数量，每个线程调用await方法告CyclicBarrier我已经到达了屏障，然后当前线程被阻塞。

### API
```
    cyclicBarrier.await();
```
# Executors
主要用来创建线程池，代理了线程池的创建，使得你的创建入口参数变得简单
### 重要方法
   - newCachedThreadPool 创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程。 
   - newFixedThreadPool 创建一个定长线程池，可控制线程最大并发数，超出的线程会在队列中等待。 
   - newScheduledThreadPool 创建一个定长线程池，支持定时及周期性任务执行。
   - newSingleThreadExecutor 创建一个单线程化的线程池，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行。
   
# Exchanger
当一个线程运行到exchange()方法时会阻塞，另一个线程运行到exchange()时，二者 交换数据，然后执行后面的程序。
