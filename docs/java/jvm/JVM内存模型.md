# JVM内存模型

## Java语言的跨平台特性
![跨平台特性](https://xqhuang.oss-cn-beijing.aliyuncs.com/study/java跨平台特性.png?versionId=CAEQERiBgMC3wLDw0xciIDY1ZjllYjg5NDRhOTRkMzA4NDI3ZDEwMDM2MDMxYTM5)
## JVM整体结构及内存模型

```java
public class Math {
    public static final int initData = 666;
    public static User user = new User();

    public static void main(String[] args) {
        Math math = new Math();
        math.compute();
    }
    public int compute() {
        int a = 1;
        int b = 2;
        int c = (a + b) * 10;
        return c;
    }
}
```

![内存模型](https://xqhuang.oss-cn-beijing.aliyuncs.com/study/JVM内存模型.png?versionId=CAEQERiBgICGwbDw0xciIGM0MGJhYTcxN2I3YTRkYzY4MmNjY2JmNDhkMGMzNjRj)


## JVM内存参数设置
![内存参数设置](https://xqhuang.oss-cn-beijing.aliyuncs.com/study/JVM内存参数设置.png?versionId=CAEQERiBgICvwLDw0xciIGU3MDUzNTY5MDQ4NjRlMGU5OGY4OGFmMDQxZWEyYmZk)
    
- -Xss：每个线程的栈大小
- -Xms：初始堆大小，默认物理内存的1/64 
- -Xmx：最大堆大小，默认物理内存的1/4
- -Xmn：新生代大小
- -XX:NewSize：设置新生代初始大小
- -XX:NewRatio：默认2表示新生代占年老代的1/2，占整个堆内存的1/3。
- -XX:SurvivorRatio：默认8表示一个survivor区占用1/8的Eden内存，即1/10的新生代内存。
- -XX：MaxMetaspaceSize： 设置元空间最大值， 默认是-1， 即不限制， 或者说只受限于本地内存大小。
- -XX：MetaspaceSize： 指定元空间触发Fullgc的初始阈值(元空间无固定初始大小)， 以字节为单位，默认是21M左右，达到该值就会触发full gc进行类型卸载， 同时收集器会对该值进行调整： 如果释放了大量的空间， 就适当降低该值； 如果释放了很少的空间， 那么在不超过-XX：MaxMetaspaceSize（如果设置了的话） 的情况下， 适当提高该值。这个跟早期jdk版本的-XX:PermSize参数意思不一样，
- -XX:PermSize代表永久代的初始容量。由于调整元空间的大小需要Full GC，这是非常昂贵的操作，如果应用在启动的时候发生大量Full GC，通常都是由于永久代或元空间发生了大小调整，基于这种情况，一般建议在JVM参数中将MetaspaceSize和MaxMetaspaceSize设置成一样的值，并设置得比初始值要大，对于8G物理内存的机器来说，一般我会将这两个值都设置为256M。