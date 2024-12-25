import{_ as l,r as a,o as r,c,b as i,d as e,e as s,a as d}from"./app-999de8cb.js";const v={},t=d(`<h1 id="访问者模式" tabindex="-1"><a class="header-anchor" href="#访问者模式" aria-hidden="true">#</a> 访问者模式</h1><p><strong>背景：</strong></p><p>​ 去医院看病时，医生会给你一个处方单要你去拿药，拿药我们可以分为两步走：</p><ul><li>（1）去柜台交钱，划价人员会根据处方单上的药进行划价，交钱。</li><li>（2）去药房拿药，药房工作者同样根据处方单给你相对应的药。</li></ul><p>​ 这里我们就划价和拿药两个步骤进行讨论，这里有三个类，处方单（药）、划价人员、药房工作者。同时划价人员和药房工作者都各自有一个动作：划价、拿药。这里进行最初步的设计如下：</p><p>划价人员：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Charge {
    public void action(){
        public void action(){
            if(&quot;A药&quot;.equals(medicine)){
                //A的价格
            }
            if(&quot;B药&quot;.equals(medicine)){
                //B的价格
            }
            if(&quot;C药&quot;.equals(medicine)){
                //C的价格
            }
            if(&quot;D药&quot;.equals(medicine)){
                //D的价格
            }
            if(&quot;E药&quot;.equals(medicine)){
                //E的价格
            }
            ............
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>药房工作者：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class WorkerOfPharmacy {
    public void action(){
        if(&quot;A药&quot;.equals(medicine)){
            //给你A药
        }
        if(&quot;B药&quot;.equals(medicine)){
            //给你B药
        }
        if(&quot;C药&quot;.equals(medicine)){
            //给你C药
        }
        if(&quot;D药&quot;.equals(medicine)){
            //给你D药
        }
        if(&quot;E药&quot;.equals(medicine)){
            //给你E药
        }
        ............
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),u={href:"https://so.csdn.net/so/search?q=%E8%AE%BF%E9%97%AE%E8%80%85%E6%A8%A1%E5%BC%8F&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},m=d('<p>​ 在实际开发过程中，我们对同个对象可能存在不同的操作方式，如处方单，划价人员要根据它来划价，药房工作者要根据它来给药。而且可能会随时增加新的操作，如医院增加新的药物，但是这里有两个元素是保持不变的，或者说很少变：划价人员和药房工作中，变的只不过是他们的操作。所以我们想如果能够将他们的操作抽象化就好了，这里访问者模式就是一个值得考虑的解决方案了。</p><h2 id="一、什么是访问者模式" tabindex="-1"><a class="header-anchor" href="#一、什么是访问者模式" aria-hidden="true">#</a> 一、什么是访问者模式</h2><p>​ 访问者模式适用于数据结构相对稳定的系统，将数据结构与基于数据的操作进行分离，使得添加作用于这些数据结构的新操作变得简单，并且不需要改变各数据结构，为不同类型的数据结构提供多种访问操作方式，这样是访问者模式的设计动机。</p><p>​ 除了使新增访问操作变得更加简单，也能够在不修改现有类的层次结构下，定义该类层次结构的操作，并将有关元素对象的访问行为集中到一个访问者对象中，而不是分散搞一个个的元素类中。</p><p>​ 但访问者模式的缺点在于让增加新的元素类变得困难，每增加一个新的元素类都意味着要在抽象访问者角色中增加一个新的抽象操作，并在每一个具体访问者类中增加相应的具体操作，违背了“开闭原则”的要求；</p><p>​ 所以访问者模式适用于对象结构中很少改变，但经常需要在此对象结构上定义新的操作的系统，使得算法操作的增加变得简单；或者需要对一个对象结构中进行很多不同并且不相关的操作，并且需要避免让这些操作污染这些对象，也不希望在增加新操作时修改这些类的场景</p><h2 id="二、结构图" tabindex="-1"><a class="header-anchor" href="#二、结构图" aria-hidden="true">#</a> 二、结构图</h2><blockquote><ul><li>Vistor：抽象访问者，声明了对 ConcreteElement 类的一些操作</li><li>ConcreteVisitor：具体访问者，实现抽象访问者中声明的每一个操作</li><li>Element：抽象元素，定义一个 accept 操作，用于接收具体访问者</li><li>ConcreteElement：具体元素 ，实现 accept 操作。</li><li>ObjectStructure：对象结构，提供一个高层接口来允许访问者枚举它的元素</li></ul></blockquote>',8),b={href:"https://so.csdn.net/so/search?q=%E5%B1%82%E6%AC%A1&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},o=i("p",null,"​ 在访问者模式使用了双分派技术，所谓双分派技术就是在选择方法的时候，不仅仅要根据消息接收者的运行时区别，还要根据参数的运行时区别。在访问者模式中，客户端将具体状态当做参数传递给具体访问者，这里完成第一次分派，然后具体访问者作为参数的“具体状态”中的方法，同时也将自己this作为参数传递进去，这里就完成了第二次分派。双分派意味着得到的执行操作决定于请求的种类和接受者的类型。",-1),p=i("h2",{id:"三、模式的实现",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#三、模式的实现","aria-hidden":"true"},"#"),e(" 三、模式的实现")],-1),h=i("p",null,"​ 以上面在医院付费、取药为实例。在这个实例中划价员和药房工作者作为访问者，药品作为访问元素、处方单作为对象结构",-1),g={href:"https://so.csdn.net/so/search?q=java&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},q=d(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public abstract class Visitor {
    protected String name;
 
    public void setName(String name) {
        this.name = name;
    }
    
    public abstract void visitor(MedicineA a);
    
    public abstract void visitor(MedicineB b);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体访问者：划价员、Charger.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Charger extends Visitor{
 
    public void visitor(MedicineA a) {
        System.out.println(&quot;划价员：&quot; + name +&quot;给药&quot; + a.getName() +&quot;划价:&quot; + a.getPrice());
    }
 
    public void visitor(MedicineB b) {
        System.out.println(&quot;划价员：&quot; + name +&quot;给药&quot; + b.getName() +&quot;划价:&quot; + b.getPrice());
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体访问者：药房工作者、WorkerOfPharmacy.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class WorkerOfPharmacy extends Visitor{
 
    public void visitor(MedicineA a) {
        System.out.println(&quot;药房工作者：&quot; + name + &quot;拿药 ：&quot; + a.getName());
    }
 
    public void visitor(MedicineB b) {
        System.out.println(&quot;药房工作者：&quot; + name + &quot;拿药 ：&quot; + b.getName());
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>抽象元素：Medicine.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public abstract class Medicine {
    protected String name;
    protected double price;
 
    public Medicine (String name,double price){
        this.name = name;
        this.price = price;
    }
    
    public String getName() {
        return name;
    }
 
    public void setName(String name) {
        this.name = name;
    }
 
    public double getPrice() {
        return price;
    }
    
    public void setPrice(double price) {
        this.price = price;
    }
    
    public abstract void accept(Visitor visitor);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体元素：MedicineA.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class MedicineA extends Medicine{
 
    public MedicineA(String name, double price) {
        super(name, price);
    }
 
    public void accept(Visitor visitor) {
        visitor.visitor(this);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体元素：MedicineB.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class MedicineB extends Medicine{
 
    public MedicineB(String name, double price) {
        super(name, price);
    }
 
    public void accept(Visitor visitor) {
        visitor.visitor(this);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>药单：Presciption.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Presciption {
    List&lt;Medicine&gt; list = new ArrayList&lt;Medicine&gt;();
    
    public void accept(Visitor visitor){
        Iterator&lt;Medicine&gt; iterator = list.iterator();
        
        while (iterator.hasNext()) {
            iterator.next().accept(visitor);
        }
    }
    
    public void addMedicine(Medicine medicine){
        list.add(medicine);
    }
    
    public void removeMedicien(Medicine medicine){
        list.remove(medicine);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端：Client.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Client {
    public static void main(String[] args) {
        Medicine a = new MedicineA(&quot;板蓝根&quot;, 11.0);
        Medicine b = new MedicineB(&quot;感康&quot;, 14.3);
        
        Presciption presciption = new Presciption();
        presciption.addMedicine(a);
        presciption.addMedicine(b);
        
        Visitor charger = new Charger();
        charger.setName(&quot;张三&quot;);
        
        Visitor workerOfPharmacy = new WorkerOfPharmacy();
        workerOfPharmacy.setName(&quot;李四&quot;);
        
        presciption.accept(charger);
        System.out.println(&quot;-------------------------------------&quot;);
        presciption.accept(workerOfPharmacy);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15);function x(_,f){const n=a("ExternalLinkIcon");return r(),c("div",null,[t,i("p",null,[e("​ 这样的代码写法，在药品种类少的情况没什么问题，但也存在这么多的 if…else，而且我们可以想象医院里的药是那么多，而且随时都会增加的，增加了药就要改变划价人员和药房工作者的代码，这是我们最不希望改变的。那么有没有办法来解决呢？有，"),i("a",u,[e("访问者模式"),s(n)]),e("提供一中比较好的解决方案。")]),m,i("p",null,[e("​ 从上面的 UML结构图中我们可以看出，访问者模式主要分为两个"),i("a",b,[e("层次"),s(n)]),e("结构，一个是访问者层次结构，提供了抽象访问者和具体访问者，主要用于声明一些操作；一个是元素层次结构，提供了抽象元素和具体元素，主要用于声明 accept 操作；而对象结构作为两者的桥梁，存储了不同类型的对象，以便不同的访问者来访问，相同访问者可以以不同的方式访问不同的元素，所以在访问者模式中增加新的访问者无需修改现有代码，可扩展行强。")]),o,p,h,i("p",null,[e("抽象访问者：Visitor."),i("a",g,[e("java"),s(n)])]),q])}const E=l(v,[["render",x],["__file","访问者模式.html.vue"]]);export{E as default};
