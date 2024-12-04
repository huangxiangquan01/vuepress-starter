# Executor线程池
## 线程
​		线程是调度CPU资源的最小单位，线程模型分为KLT模型与ULT模型，JVM使用的KLT模型，Java线程与OS线程保持1:1的映射关系，也就是说有一个java线程也会在操作系统里有一个对应的线程。Java线程有多种生命状态
   - NEW 新建 
   - RUNNABLE 运行 
   - BLOCKED 阻塞 
   - WAITING 等待
   - TIMED_WAITING 超时等待 
   - TERMINATED 终结

 #### 协程
 		协程 (纤程，用户级线程)，目的是为了追求最大力度的发挥硬件性能和提升软件的速 度，协程基本原理是:在某个点挂起当前的任务，并且保存栈信息，去执行另一个任 务；等完成或达到某个条件时，再还原原来的栈信息并继续执行(整个过程线程不需要 上下文切换)。

>  Java原生不支持协程，在纯java代码里需要使用协程的话需要引入第三方包,如：quasar

 #### 线程池
 		“线程池”，顾名思义就是一个线程缓存，线程是稀缺资源，如果被无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，因此Java中提供线程池对线程进行统一分配、 调优和监控

 ### 线程池介绍
​		如果并发的请求数量非常多，但每个线程执行的时间很短，这样就会频繁的创建和销毁 线程，如此一来会大大降低系统的效率。可能出现服务器在为每个请求创建新线程和销毁线
​    	程上花费的时间和消耗的系统资源要比处理实际的用户请求的时间和资源更多。

   - 单个任务处理时间比较短 
   - 需要处理的任务数量很大 
   - 线程池优势重用存在的线程，减少线程创建，消亡的开销，提高性能 
   - 提高响应速度。当任务到达时，任务可以不需要的等到线程创建就能立即执行。 
   - 提高线程的可管理性。线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。

### 线程的实现方式
```java
    //  实现Runnable接口的类将被Thread执行，表示一个基本的任务
    public interface Runnable {
        // run方法就是它所有的内容，就是实际执行的任务 
        public abstract void run(); 
     } 
     //  Callable同样是任务，与Runnable接口的区别在于它接收泛型，同时它执行 任务后带有返回内容 
     public interface Callable<V> { 
        // 相对于run方法的带有返回值的call方法 
        V call() throws Exception; 
    }
```

### Executor框架

Executor下有一个重要子接口ExecutorService，其中定义了线程池的具体 行为:
 1. execute（Runnable command）：履行Ruannable类型的任务, 
 1. submit（task）：可用来提交Callable或Runnable任务，并返回代表此任务的Future 对象
 1. shutdown（）：在完成已提交的任务后封闭办事，不再接管新任务, 
 1. shutdownNow（）：停止所有正在履行的任务并封闭办事。 
 1. isTerminated（）：测试是否所有任务都履行完毕了。 
 1. isShutdown（）：测试是否该ExecutorService已被关闭。

### 线程池重点属性
```java
    public class ThreadPoolExecutor extends AbstractExecutorService {
        private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
        private static final int COUNT_BITS = Integer.SIZE - 3;  // 29
        private static final int CAPACITY = (1 << COUNT_BITS) - 1;  //  (00001111 11111111 11111111 11111111)
    }
```

​		ctl 是对线程池的运行状态和线程池中有效线程的数量进行控制的一个字段， 它包含两 部分的信息: 线程池的运行状态 (runState) 和线程池内有效线程的数量 (workerCount)，这里可以看到，使用了Integer类型来保存，高3位保存runState，低29位保存 workerCount。COUNT_BITS 就是29，CAPACITY就是1左移29位减1（29个1），这个常 量表示workerCount的上限值，大约是5亿。

### ctl相关方法
```java
    public class ThreadPoolExecutor extends AbstractExecutorService {
        private static int runStateOf(int c) { return c & ~CAPACITY; } 
        private static int workerCountOf(int c) { return c & CAPACITY; } 
        private static int ctlOf(int rs, int wc) { return rs | wc; }
    }
```
   - runStateOf：获取运行状态；
   - workerCountOf：获取活动线程数； 
   - ctlOf：获取运行状态和活动线程数的值。
### 线程池存在5种状态
``` java
     // runState is stored in the high-order bits
    private static final int RUNNING = ‐1 << COUNT_BITS; // 高3位为111  (11100000 00000000 00000000 00000000)
    private static final int SHUTDOWN = 0 << COUNT_BITS; //高3位为000   (00000000 00000000 00000000 00000000)
    private static final int STOP = 1 << COUNT_BITS; //高3位为001       (00100000 00000000 00000000 00000000)
    private static final int TIDYING = 2 << COUNT_BITS; //高3位为010    (01000000 00000000 00000000 00000000)
    private static final int TERMINATED = 3 << COUNT_BITS; //高3位为011 (01100000 00000000 00000000 00000000)
```
> 1、RUNNING
> > 状态说明：线程池处在RUNNING状态时，能够接收新任务，以及对已添加的任务进行 处理。 
> > 状态切换：线程池的初始化状态是RUNNING。换句话说，线程池被一旦被创建，就处 于RUNNING状态，并且线程池中的任务数为0！
>
> 2、SHUTDOWN
> > 状态说明：线程池处在SHUTDOWN状态时，不接收新任务，但能处理已添加的任务。 
> > 状态切换：调用线程池的shutdown()接口时，线程池由RUNNING -> SHUTDOWN。
> 
> 3、STOP
> > 状态说明：线程池处在STOP状态时，不接收新任务，不处理已添加的任务，并且会中 断正在处理的任务。
> > 状态切换：调用线程池的shutdownNow()接口时，线程池由(RUNNING or SHUTDOWN ) -> STOP。
>
> 4、TIDYING
> > 状态说明：当所有的任务已终止，ctl记录的”任务数量”为0，线程池会变为TIDYING 状态。当线程池变为TIDYING状态时，会执行钩子函数terminated()。terminated()在 ThreadPoolExecutor类中是空的，若用户想在线程池变为TIDYING时，进行相应的处理； 可以通过重载terminated()函数来实现。
> > 状态切换：当线程池在SHUTDOWN状态下，阻塞队列为空并且线程池中执行的任务也 为空时，就会由 SHUTDOWN -> TIDYING。 当线程池在STOP状态下，线程池中执行的 任务为空时，就会由STOP -> TIDYING。
>
> 5、TERMINATED
> > 状态说明：线程池彻底终止，就变成TERMINATED状态。
> > 状态切换：线程池处在TIDYING状态时，执行完terminated()之后，就会由 TIDYING - > TERMINATED。

进入TERMINATED的条件如下：
   - 线程池不是RUNNING状态； 
   - 线程池状态不是TIDYING状态或TERMINATED状态； 
   - 如果线程池状态是SHUTDOWN并且workerQueue为空； 
   - workerCount为0； 
   - 设置TIDYING状态成功。

### 线程池的具体实现   
   - ThreadPoolExecutor 默认线程池
   - ScheduledThreadPoolExecutor 定时线程池

# ThreadPoolExecutor
### 线程池的创建
```
    public ThreadPoolExecutor(int corePoolSize,
                                  int maximumPoolSize,
                                  long keepAliveTime,
                                  TimeUnit unit,
                                  BlockingQueue<Runnable> workQueue,
                                  ThreadFactory threadFactory,
                                  RejectedExecutionHandler handler) {}
```

### 任务提交
```
    //提交任务无返回值
    public void execute() 

    //任务执行完成后有返回值
    public Future<?> submit() 
```

### 参数解释
#### corePoolSize
​		线程池中的核心线程数，当提交一个任务时，线程池创建一个新线程执行任务，直到当 前线程数等于corePoolSize；如果当前线程数为corePoolSize，继续提交的任务被保存到 阻塞队列中，等待被执行；如果执行了线程池的prestartAllCoreThreads()方法，线程池会提前创建并启动所有核心线程。

#### maximumPoolSize 
​		线程池中允许的最大线程数。如果当前阻塞队列满了，且继续提交任务，则创建新的线程执行任务，前提是当前线程数小于maximumPoolSize；

#### keepAliveTime 
​		线程池维护线程所允许的空闲时间。当线程池中的线程数量大于corePoolSize的时 候，如果这时没有新的任务提交，核心线程外的线程不会立即销毁，而是会等待，直到等待 的时间超过了keepAliveTime；

#### unit
​		keepAliveTime的单位；

#### workQueue 
​		用来保存等待被执行的任务的阻塞队列，且任务必须实现Runable接口，在JDK中提供了如下阻塞队列：
   - ArrayBlockingQueue：基于数组结构的有界阻塞队列，按FIFO排序任务； 
   - LinkedBlockingQueue：基于链表结构的阻塞队列，按FIFO排序任务，吞吐量通常要高于ArrayBlockingQuene；
   - SynchronousQueue：一个不存储元素的阻塞队列，每个插入操作必须等到 另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量通常要高于 LinkedBlockingQuene； 
   - priorityBlockingQueue：具有优先级的无界阻塞队列；
#### threadFactory
​		它是ThreadFactory类型的变量，用来创建新线程。默认使用 Executors.defaultThreadFactory() 来创建线程。使用默认的ThreadFactory来创建线程 时，会使新创建的线程具有相同的NORM_PRIORITY优先级并且是非守护线程，同时也设 置了线程的名称。

#### handler
​		线程池的饱和策略，当阻塞队列满了，且没有空闲的工作线程，如果继续提交任务，必 须采取一种策略处理该任务，线程池提供了4种策略：
   - AbortPolicy：直接抛出异常，默认策略；
   - CallerRunsPolicy：用调用者所在的线程来执行任务； 
   - DiscardOldestPolicy：丢弃阻塞队列中靠最前的任务，并执行当前任务； 
   - DiscardPolicy：直接丢弃任务；

 上面的4种策略都是ThreadPoolExecutor的内部类。

 当然也可以根据应用场景实现RejectedExecutionHandler接口，自定义饱和策略，如 记录日志或持久化存储不能处理的任务。

 ### 线程池监控
 ```java
    /**
    * 
    /
    public long getTaskCount() //线程池已执行与未执行的任务总数 
    public long getCompletedTaskCount() //已完成的任务数
    public int getPoolSize() //线程池当前的线程数 
    public int getActiveCount() //线程池中正在执行任务的线程数量
 ```

# ScheduledThreadPoolExecutor
它用来处理延时任务或定时任务。
它接收ScheduledFutureTask类型的任务，是线程池调度任务的最小单位，有三种提交任务 的方式：

   - schedule 
   - scheduledAtFixedRate 
   - scheduledWithFixedDelay

它采用DelayQueue存储等待的任务 
   - DelayQueue内部封装了一个PriorityQueue，它会根据time的先后时间排序，若 time相同则根据sequenceNumber排序； 
   - DelayQueue也是一个无界队列；

### ScheduledFutureTask
ScheduledFutureTask接收的参数(成员变量)：
```
    private long time：// 任务开始的时间 
    private final long sequenceNumber; //任务的序号 
    private final long period：// 任务执行的时间间隔
```
工作线程的执行过程：
   - 工作线程会从DelayQueue取已经到期的任务去执行； 
   - 执行结束后重新设置任务的到期时间，再次放回DelayQueue

      	ScheduledThreadPoolExecutor会把待执行的任务放到工作队列DelayQueue中， DelayQueue封装了一个PriorityQueue，PriorityQueue会对队列中的 ScheduledFutureTask进行排序，具体的排序算法实现如下：

```
    public int compareTo(Delayed other) { 
         if (other == this) // compare zero if same object 
            return 0; 
         if (other instanceof ScheduledFutureTask) { 
              ScheduledFutureTask<?> x = (ScheduledFutureTask<?>)other; 
              long diff = time ‐ x.time; 
              if (diff < 0) 
                  return ‐1; 
              else if (diff > 0) 
              return 1;
         else if (sequenceNumber < x.sequenceNumber) 
             return ‐1; 
         else 
             return 1;
         } 
         long diff = getDelay(NANOSECONDS) ‐ other.getDelay(NANOSECONDS); 
             return (diff < 0) ? ‐1 : (diff > 0) ? 1 : 0; 
         }
```
    > 1. 首先按照time排序，time小的排在前面，time大的排在后面； 
    > 1. 如果time相同，按照sequenceNumber排序，sequenceNumber小的排在前 面，sequenceNumber大的排在后面，换句话说，如果两个task的执行时间相同， 优先执行先提交的task。

### ScheduledFutureTask之run方法实现 
run方法是调度task的核心，task的执行实际上是run方法的执行。    
```java 
        /**
         * Overrides FutureTask version so as to reset/requeue if periodic.
         */
        public void run() {
            boolean periodic = isPeriodic();
            //如果当前线程池已经不支持执行任务，则取消
            if (!canRunInCurrentRunState(periodic))
                cancel(false);
            //如果不需要周期性执行，则直接执行run方法然后结束
            else if (!periodic)
                ScheduledFutureTask.super.run();
            //如果需要周期执行，则在执行完任务以后，设置下一次执行时间
            else if (ScheduledFutureTask.super.runAndReset()) {
                // 计算下次执行该任务的时间
                setNextRunTime();
                //重复执行任务
                reExecutePeriodic(outerTask);
            }
        }
```
    1. 如果当前线程池运行状态不可以执行任务，取消该任务，然后直接返回，否则执行 步骤
    2. 如果不是周期性任务，调用FutureTask中的run方法执行，会设置执行结果，然后 直接返回，否则执行步骤3； 
    3. 如果是周期性任务，调用FutureTask中的runAndReset方法执行，不会设置执行 结果，然后直接返回，否则执行步骤4和步骤5； 
    4. 计算下次执行该任务的具体时间； 
    5. 重复执行任务。

### reExecutePeriodic方法
```
    /**
     * Requeues a periodic task unless current run state precludes it.
     * Same idea as delayedExecute except drops task rather than rejecting.
     *
     * @param task the task
     */
    void reExecutePeriodic(RunnableScheduledFuture<?> task) {
        if (canRunInCurrentRunState(true)) {
            super.getQueue().add(task);
            if (!canRunInCurrentRunState(true) && remove(task))
                task.cancel(false);
            else
                ensurePrestart();
        }
    }
```
该方法和delayedExecute方法类似，不同的是： 
   1. 由于调用reExecutePeriodic方法时已经执行过一次周期性任务了，所以不会 reject当前任务；
   1. 传入的任务一定是周期性任务

### 线程池任务的提交
首先是schedule方法，该方法是指任务在指定延迟时间到达后触发，只会执行一次。
```
    /**
     * @throws RejectedExecutionException {@inheritDoc}
     * @throws NullPointerException       {@inheritDoc}
     */
    public ScheduledFuture<?> schedule(Runnable command,
                                       long delay,
                                       TimeUnit unit) {
        if (command == null || unit == null)
            throw new NullPointerException();

        //这里是一个嵌套结构，首先把用户提交的任务包装成ScheduledFutureTask 
        //然后在调用decorateTask进行包装，该方法是留给用户去扩展的，默认是个 空方法
        RunnableScheduledFuture<?> t = decorateTask(command,
            new ScheduledFutureTask<Void>(command, null,
                                         triggerTime(delay, unit)));

        //包装好任务以后，就进行提交了
        delayedExecute(t);
        return t;
    }
```
任务提交方法：
```
    private void delayedExecute(RunnableScheduledFuture<?> task) {
        //如果线程池已经关闭，则使用拒绝策略把提交任务拒绝掉
        if (isShutdown())
            reject(task);
        else {
            //与ThreadPoolExecutor不同，这里直接把任务加入延迟队列
            super.getQueue().add(task);

             //如果当前状态无法执行任务，则取消
            if (isShutdown() &&
                !canRunInCurrentRunState(task.isPeriodic()) &&
                remove(task))
                task.cancel(false);
            else
                //这里是增加一个worker线程，避免提交的任务没有worker去执行 
                //原因就是该类没有像ThreadPoolExecutor一样，woker满了才放入队列
                ensurePrestart();
        }
    }
```

### DelayedWorkQueue
​		ScheduledThreadPoolExecutor之所以要自己实现阻塞的工作队列，是因为 ScheduledThreadPoolExecutor要求的工作队列有些特殊。 

​		DelayedWorkQueue是一个基于堆的数据结构，类似于DelayQueue和 PriorityQueue。在执行定时任务的时候，每个任务的执行时间都不同，所以 DelayedWorkQueue的工作就是按照执行时间的升序来排列，执行时间距离当前时间越近 的任务在队列的前面（注意：这里的顺序并不是绝对的，堆中的排序只保证了子节点的下次 执行时间要比父节点的下次执行时间要大，而叶子节点之间并不一定是顺序的）。

# 总结
   - 与Timer执行定时任务的比较，相比Timer，ScheduedThreadPoolExecutor有 什么优点； 
   - ScheduledThreadPoolExecutor继承自ThreadPoolExecutor，所以它也是一 个线程池，也有coorPoolSize和workQueue，ScheduledThreadPoolExecutor特 殊的地方在于，自己实现了优先工作队列DelayedWorkQueue； 
   - ScheduledThreadPoolExecutor实现了ScheduledExecutorService，所以就有 了任务调度的方法，如schedule，scheduleAtFixedRate和 scheduleWithFixedDelay，同时注意他们之间的区别； 
   - 内部类ScheduledFutureTask继承自FutureTask，实现了任务的异步执行并且 可以获取返回结果。同时也实现了Delayed接口，可以通过getDelay方法获取将要执 行的时间间隔； 
   - 周期任务的执行其实是调用了FutureTask类中的runAndReset方法，每次执行 完不设置结果和状态。 
   - 详细分析了DelayedWorkQueue的数据结构，它是一个基于最小堆结构的优先 队列，并且每次出队时能够保证取出的任务是当前队列中下次执行时间最小的任务。 同时注意一下优先队列中堆的顺序，堆中的顺序并不是绝对的，但要保证子节点的值 要比父节点的值要大，这样就不会影响出队的顺序。
