# 类加载运行全过程
当我们用java命令运行某个类的main函数启动程序时，首先需要通过类加载器把主类加载到JVM
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
其中loadClass的类加载过程有如下几部:
- **加载**：在硬盘上查询并通过IO读入字节码文件，使用到类时才会加载，例如调用类的main()方法，new对象等等，在加载阶段会在内存中生成一个代表这个类等java.lang.Class对象，作为方法区这个类的各种数据入口。                                                                                                        
- **验证**：校验字节码文件的正确性
    1.  文件格式验证：基于字节流验证
    1.  元数据验证：基于方法区的存储结构验证
    1.  字节码验证：基于方法区的存储结构验证
    1.  符号应用验证：基于方法区的存储结构验证
- **准备**：给类的静态变量分配内存，并赋予默认值
- **解析**：将**符号引用**替换为直接引用，该阶段会把一些静态方法(符号引用，比如main()方法)替换为指向数据所存内存的指针或者句柄等(直接应用)，这是所谓静态链接过程(类加载期间完成)，动态链接是程序运行期间完成将符号引用替换为直接引用
- **初始化**：对类的静态变量初始化为指定对值，执行静态代码块
- **使用**：
- **卸载**：

类被加载到方法区中主要包含
  1. 运行时常量迟
  1. 类型信息
  1. 字段信息
  1. 方法信息
  1. 类加载器的引用(这个类到类加载器实例的引用)
  1. class实例的引用()

## 类加载器和双亲委派机制
- **启动类加载器**：Bootstrap ClassLoader，负责加载存放在JDK\jre\lib(JDK代表JDK的安装目录，下同)下，或被-Xbootclasspath参数指定的路径中的，并且能被虚拟机识别的类库（如rt.jar，所有的java.*开头的类均被Bootstrap ClassLoader加载）。启动类加载器是无法被Java程序直接引用的。

- **扩展类加载器**：Extension ClassLoader，该加载器由sun.misc.Launcher$ExtClassLoader实现，它负责加载DK\jre\lib\ext目录中，或者由java.ext.dirs系统变量指定的路径中的所有类库（如javax.*开头的类），开发者可以直接使用扩展类加载器。

- **应用程序类加载器**：Application ClassLoader，该类加载器由sun.misc.Launcher$AppClassLoader来实现，它负责加载用户类路径（ClassPath）所指定的类，开发者可以直接使用该类加载器，如果应用程序中没有自定义过自己的类加载器，一般情况下这个就是程序中默认的类加载器。

## 类加载器初始化过程
  1. 创建JVM虚拟机启动实例sun.misc.Launcher
  1. sun.misc.Launcher初始化使用单例模式，保存一个JVM虚拟机内只有一个sun.misc.Launcher实例
  1. 在Launcher构造方法内部，其创建了两个类加载器放别是sun.misc.Launcher.ExtClassLoader和sun.misc.Launcher.AppClassLoader
  1. JVM使用Launcher的getClassLoader()方法返回类加载器AppClassLoader实例加载应用程序
```
//Launcher 的构造方法
public Launcher() {
    Launcher.ExtClassLoader var1;
        try {
            //构造扩展类加载器
            var1 = Launcher.ExtClassLoader.getExtClassLoader();
        } catch (IOException var10) {
            throw new InternalError("Could not create extension class loader", var10);
        }

        try {
            //构造引用类加载器
            this.loader = Launcher.AppClassLoader.getAppClassLoader(var1);
        } catch (IOException var9) {
            throw new InternalError("Could not create application class loader", var9);
        }

        Thread.currentThread().setContextClassLoader(this.loader);
        String var2 = System.getProperty("java.security.manager");
        if (var2 != null) {
            SecurityManager var3 = null;
            if (!"".equals(var2) && !"default".equals(var2)) {
                try {
                    var3 = (SecurityManager)this.loader.loadClass(var2).newInstance();
                } catch (IllegalAccessException var5) {
                } catch (InstantiationException var6) {
                } catch (ClassNotFoundException var7) {
                } catch (ClassCastException var8) {
                }
            } else {
                var3 = new SecurityManager();
            }

            if (var3 == null) {
                throw new InternalError("Could not create SecurityManager: " + var2);
            }

            System.setSecurityManager(var3);
        }
    }
```

## 双亲委派机制
JVM类加载器是有亲子层级结构的
![类加载](https://upload-images.jianshu.io/upload_images/13202633-4c819649aebff4df.png?imageMogr2/auto-orient/strip%7CimageView2/2)

> 双亲委派模型的工作流程是：如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把请求委托给父加载器去完成，依次向上，因此，所有的类加载请求最终都应该被传递到顶层的启动类加载器中，只有当父加载器在它的搜索范围中没有找到所需的类时，即无法完成该加载，子加载器才会尝试自己去加载该类。

双亲委派机制:
1. 当AppClassLoader加载一个class时，它首先不会自己去尝试加载这个类，而是把类加载请求委派给父类加载器ExtClassLoader去完成。

1. 当ExtClassLoader加载一个class时，它首先也不会自己去尝试加载这个类，而是把类加载请求委派给BootStrapClassLoader去完成。

1. 如果BootStrapClassLoader加载失败（例如在$JAVA_HOME/jre/lib里未查找到该class），会使用ExtClassLoader来尝试加载；

1. 若ExtClassLoader也加载失败，则会使用AppClassLoader来加载，如果AppClassLoader也加载失败，则会报出异常ClassNotFoundException。

```
protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }  
````
### 为什么要设计双亲委派机制
- 沙箱安全机制：防止核心API库被随意篡改
- 避免类的重复加载

### 全盘负责委托机制
​		"全盘负责"是指当一个ClassLoader装载一个类时，除非显示的使用另外一个ClassLoader，该类所依赖及引用的类也由这个ClassLoader载入。

### 自定义类加载示例
​		自定义类加载只需要继承java.lang.CLassLoader类，该类有两个核心方法，一个是loadClass(String, boolean),实现临双亲委派机制，还有一个方法是findClass，
默认实现是空方法，自定义类加载器主要的是重写findClass();

```java
public class MyClassLoaderTest {
    public static class MyClassLoader extends ClassLoader {
        private String calssPath;

        public MyClassLoader(String calssPath) {
            this.calssPath = calssPath;
        }

        protected Class<?> findClass(String name) {
            try {
                byte[] data = loadByte(name);

                return defineClass(name, data, 0, data.length);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        private byte[] loadByte(String name) throws Exception {
            name = name.replaceAll("\\.", "/");
            FileInputStream fis = new FileInputStream(calssPath + "/" + name + ".class");
            int len = fis.available();
            byte[] data = new byte[len];

            fis.read(data);
            fis.close();

            return data;
        }
    }

    public static void main(String[] args) throws Exception{
        MyClassLoader classLoader = new MyClassLoader("/Users/huangxq/Desktop");
        Class clazz = classLoader.loadClass("cn.xqhuang.dps.classLoader.User");
        Object obj = clazz.newInstance();
        Method method = clazz.getDeclaredMethod("sout", null);
        method.invoke(obj, null);

        System.out.println(clazz.getClassLoader().getClass().getName());
    }
}
```

### 打破双亲委派机制

tomcat是一个web容器，它需要解决下面这几个问题：
1. 版本隔离：一个web容器可能需要部署多个应用程序，不同的应用程序可能会依赖同一个第三方类库的不同版本，不能要求同一个类库在同一个服务器只有一份，因此要保证每个应用程序的类库都是独立的，保证相互隔离。
1. 版本共享：部署在同一个web容器中相同的类库相同的版本可以共享。否则，如果服务器有20个应用程 序，那么要有20份相同的类库加载进虚拟机。
1. 类库隔离：web容器也有自己依赖的类库，不能与应用程序的类库混淆。基于安全考虑，应该让容器的类库和程序的类库隔离开来。
1. jsp修改：web容器要支持jsp的修改，jsp 文件最终也是要编译成class文件才能在虚拟机中运行，但程序运行后修改jsp常见的事情， web容器需要支持 jsp 修改后不用重启。
版本隔离，如果tomcat使用默认的双亲委派加载机制，肯定是无法加载多个相同类库的不同版本的，默认的加载器只认权限定类名，并且只有一份。
版本共享，使用默认的双亲委派加载机制是可以实现的。
类库隔离，同样的也需要打破双亲委派机制。
jsp修改，其实就是实现jsp的热加载，实现机制就是每个jsp文件对应一个唯一的类加载器，当jsp文件修改了，我们就将其对应的类加载器给卸载了，然后再重新为其创建一个类加载器，重新加载jsp。

**tomcat几个主要的类加载器**：
1. CommonLoader类加载器：Tomcat最基本的类加载器，加载路径中的class可以被Tomcat容 器本身以及各个Webapp访问。
1. CatalinaLoader类加载器：Tomcat容器私有的类加载器，加载路径中的class对于Webapp不 可见。
1. sharedLoader：各个Webapp共享的类加载器，加载路径中的class对于所有 Webapp可见，但是对于Tomcat容器不可见。
1. WebappClassLoader：各个Webapp私有的类加载器，加载路径中的class只对当前 Webapp可见，比如加载war包里相关的类，每个war包应用都有自己的WebappClassLoader，实现相互隔离，比如不同war包应用引入了不同的spring版本， 这样实现就能加载各自的spring版本。

**tomcat自定义加载器详解图**：
![image](https://xqhuang.oss-cn-beijing.aliyuncs.com/study/tomcat类加载器.jpeg?versionId=CAEQERiBgID0oMHc0xciIDY0NzA2NjIwYzg1OTRjM2E5Zjk1MDE0MGQ1MmRlNGFj)
图中可以看出：
1. CommonClassLoader能加载的类都可以被CatalinaClassLoader和SharedClassLoader使用， 从而实现了公有类库的共用。
1. CatalinaClassLoader和SharedClassLoader自己能加载的类则与对方相互隔离。
1. WebAppClassLoader可以使用SharedClassLoader加载到的类，但各个WebAppClassLoader 实例之间相互隔离。
1. JasperLoader的加载范围仅仅是这个JSP文件所编译出来的那一个.Class文件，它出现的目的就是为了被丢弃：当Web容器检测到JSP文件被修改时，会替换掉目前的JasperLoader的实例， 并通过再建立一个新的Jsp类加载器来实现JSP文件的热加载功能。
很显然，tomcat这种加载机制违背了双亲委派机制模型，它为了实现隔离性，每个 webappClassLoader加载自己的目录下的class文件，不会传递给父类加载器，打破了双亲委派机制。
最后，用代码模拟一下tomcat打破双亲委派机制，实现webappClassLoader加载自己war包应用内不同版本类实现相互共存与隔离。
```
/**
* 重写类加载方法，实现自己的加载逻辑
*/
protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
        
                if (c == null) {
                    if (name.startsWith("")) {
                         c = findClass(name);
                    } else {
                        c = this.getParent().loadClass(name);
                    }
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
           
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }  
```
