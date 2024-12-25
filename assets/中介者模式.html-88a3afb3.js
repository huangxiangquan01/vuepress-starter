import{_ as e,o as n,c as i,a as s}from"./app-999de8cb.js";const d={},a=s(`<h1 id="中介者模式" tabindex="-1"><a class="header-anchor" href="#中介者模式" aria-hidden="true">#</a> 中介者模式</h1><blockquote><p>前言： 在我们的生活中处处充斥着“中介者”，比如你租房、买房、找工作、旅游等等可能都需要那些中介者的帮助，地球上国与国之间的关系异常复杂，会因为各种各样的利益关系来结成盟友或者敌人，国与国之间的关系同样会随着时间、环境因为利益而发生改变，而地球上最大的中介者就是联合国了，它主要用来维护国际和平与安全、解决国际间经济、社会、文化和人道主义性质的问题。软件开发过程也同样如此，对象与对象之间存在着很强、复杂的关联关系，如果没有类似于联合国这样的“机构”会很容易出问题的，譬如： （1）系统的结构变得很复杂，对象与对象之间存在大量的关联，若一个对象发生改变，与之关联的对象也需要做出相应的处理。 （2）对象之间的连接增加导致对象可复用性降低 （3）系统的可扩展性低，增加一个新对象，我们需要在其相关连的对象上面加上引用，这样就会导致系统的耦合性增高，使系统的灵活性和可扩展都降低。 如果两个类不必彼此通信，那么这两个类就不应当发生直接关联的关系，如果一个类需要调用另一个类中的方法，我们可以通过第三方来转发这个调用。所以对于关系比较复杂的系统，为了减少对象之间的关联关系，使之成为一个松耦合系统，我们就需要使用中介者模式。</p></blockquote><h2 id="一、什么是中介者模式" tabindex="-1"><a class="header-anchor" href="#一、什么是中介者模式" aria-hidden="true">#</a> 一、什么是中介者模式：</h2><p>中介者模式通过中介者对 象来封装一系列的对象交互，将对象间复杂的关系网状结构变成结构简单的以中介者为核心的星形结构， 对象间一对多的关联转变为一对一的关联，简化对象间的关系，便于理解；各个对象之间的关系被解耦，每个对象不再和它关联的对象直接发生相互作用，而是通过中介者对象来与关联的对象进行通讯，使得对象可以相对独立地使用，提高了对象的可复用和系统的可扩展性。 在中介者模式中，中介者类处于核心地位，它封装了系统中所有对象类之间的关系，除了简化对象间的关系， 还可以对对象间的交互进行进一步的控制。</p><h2 id="二、结构图" tabindex="-1"><a class="header-anchor" href="#二、结构图" aria-hidden="true">#</a> 二、结构图：</h2><blockquote><ul><li>Mediator：抽象中介者，定义了同事对象到中介者对象之间的接口</li><li>ConcreteMediator：具体中介者，实现抽象中介者的方法，它需要知道所有的具体同事类，同时需要从具体的同事类那里接收信息，并且向其他具体的同事类发送信息</li><li>Colleague：抽象同事类</li><li>ConcreteColleague：具体同事类，每个具体同事类都只需要知道自己的行为即可，但是他们都需要认识中介者。</li></ul></blockquote><p>从UML结构类图中可以看出，在系统中，中介者类主要承担中转和协调两个方面的责任：</p><ul><li><p>结构上起到中转作用：通过中介者类对关系的封装，使得对象类不再需要显示的引用其他对象，只需要通过中介者就可以与其他对象类进行的通信。</p></li><li><p>行为上起到协调作用：通过中介者类对关系的封装，对象类可以在不知道其他对象的情况下通过中介者与其他对象完成通信。在这个过程中对象类是不需要告诉中介者该如何做，中介者可以根据自身的逻辑来进行协调，对同事的请求进一步处理，将同事成员之间的关系行为进行分离和封装。</p></li></ul><p>​ 但是，中介者对象封装了对象之间的关联关系，导致中介者对象变得比较庞大复杂，所承担的责任也比较多，维护起来也比较困难，它需要知道每个对象和他们之间的交互细节，如果它出问题，将会导致整个系统都会出问题。</p><p>​ 最后，中介者模式也比较容易被误用，故当系统中出现了“多对多”交互复杂的关系群时，千万别急着使用中介者模式，你首先需要做的就是反思你的系统在设计上是不是合理。</p><h2 id="三、代码实现" tabindex="-1"><a class="header-anchor" href="#三、代码实现" aria-hidden="true">#</a> 三、代码实现</h2><p>我们就以租房为例，中介机构充当租房者与房屋所有者之间的中介者。</p><p>首先是抽象中介者:Mediator.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public abstract class Mediator {
    //申明一个联络方法
    public abstract void constact(String message,Person person);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是抽象同事对象:Person.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class HouseOwner extends Person{
 
    HouseOwner(String name, Mediator mediator) {
        super(name, mediator);
    }
    
    /**
     * @desc 与中介者联系
     * @param message
     * @return void
     */
    public void constact(String message){
        mediator.constact(message, this);
    }
 
    /**
     * @desc 获取信息
     * @param message
     * @return void
     */
    public void getMessage(String message){
        System.out.println(&quot;房主:&quot; + name +&quot;,获得信息：&quot; + message);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Tenant.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Tenant extends Person{
    
    Tenant(String name, Mediator mediator) {
        super(name, mediator);
    }
    
    /**
     * @desc 与中介者联系
     * @param message
     * @return void
     */
    public void constact(String message){
        mediator.constact(message, this);
    }
 
    /**
     * @desc 获取信息
     * @param message
     * @return void
     */
    public void getMessage(String message){
        System.out.println(&quot;租房者:&quot; + name +&quot;,获得信息：&quot; + message);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体中介者对象：中介结构、MediatorStructure.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class MediatorStructure extends Mediator{
    //首先中介结构必须知道所有房主和租房者的信息
    private HouseOwner houseOwner;
    private Tenant tenant;
 
    public HouseOwner getHouseOwner() {
        return houseOwner;
    }
 
    public void setHouseOwner(HouseOwner houseOwner) {
        this.houseOwner = houseOwner;
    }
 
    public Tenant getTenant() {
        return tenant;
    }
 
    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }
 
    public void constact(String message, Person person) {
        if(person == houseOwner){          //如果是房主，则租房者获得信息
            tenant.getMessage(message);
        }
        else{       //反之则是获得房主信息
            houseOwner.getMessage(message);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端：Client.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Client {
    public static void main(String[] args) {
        //一个房主、一个租房者、一个中介机构
        MediatorStructure mediator = new MediatorStructure();
        
        //房主和租房者只需要知道中介机构即可
        HouseOwner houseOwner = new HouseOwner(&quot;张三&quot;, mediator);
        Tenant tenant = new Tenant(&quot;李四&quot;, mediator);
        
        //中介结构要知道房主和租房者
        mediator.setHouseOwner(houseOwner);
        mediator.setTenant(tenant);
        
        tenant.constact(&quot;听说你那里有三室的房主出租.....&quot;);
        houseOwner.constact(&quot;是的!请问你需要租吗?&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,22),l=[a];function r(v,t){return n(),i("div",null,l)}const c=e(d,[["render",r],["__file","中介者模式.html.vue"]]);export{c as default};
