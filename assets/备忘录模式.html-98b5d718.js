import{_ as i,o as e,c as n,a as l}from"./app-999de8cb.js";const d={},s=l(`<h1 id="备忘录模式" tabindex="-1"><a class="header-anchor" href="#备忘录模式" aria-hidden="true">#</a> 备忘录模式</h1><p>​ 在开发过程中，经常需要保存对象的中间状态，当需要的时候，可以恢复到这个状态。比如，在编程时假如编写失误，例如不小心误删除了几行代码，我们希望返回删除前的状态，便可以使用 Ctrl+Z 来进行返回，这时我们便可以使用备忘录模式来实现。</p><h2 id="一、什么是备忘录模式" tabindex="-1"><a class="header-anchor" href="#一、什么是备忘录模式" aria-hidden="true">#</a> 一、什么是备忘录模式：</h2><p>​ 备忘录模式提供了一种恢复状态的机制，在不破坏封装的前提下，捕获对象的内部状态，并保存在该对象之外，保证该对象能够恢复到某个历史状态；备忘录模式将保存的细节封装在备忘录中，除了创建它的创建者之外其他对象都不能访问它，并且实现了即使要改变保存的细节也不影响客户端。但是备忘录模式都是多状态和多备份的，会早用较多的内存，消耗资源。</p><h2 id="二、结构图" tabindex="-1"><a class="header-anchor" href="#二、结构图" aria-hidden="true">#</a> 二、结构图：</h2><blockquote><ul><li>Originator：原发器，负责创建一个备忘录，用于记录当前对象的内部状态，也可以使用它来利用备忘录恢复内部状态，同时原发器还可以根据需要决定 Memento 存储 Originator 的哪些内部状态。</li><li>Memento：备忘录，用于存储 Originator 的内部状态，并且可以防止 Originator 以外的对象访问Memento。在备忘录 Memento 中有两个接口，其中 Caretaker 只能看到备忘录中的窄接口，它只能将备忘录传递给其他对象。Originator可以看到宽接口，允许它访问返回到先前状态的所有数据。</li><li>Caretaker: 负责人，对备忘录 Memento 进行管理，保存和提供备忘录，但不能对备忘录的内容进行操作和访问，只能够将备忘录传递给其他对象。</li></ul></blockquote><p>备忘录模式的核心就是备忘录 Memento，在备忘录中存储的就是原发器 Originator 的部分或者所有的状态信息，而这些状态信息是不能够被其他对象所访问的，也就是说我们是不能使用备忘录之外的对象来存储这些状态信息，如果暴漏了内部状态信息就违反了封装的原则，故备忘录除了原发器外其他对象都不可以访问。所以为了实现备忘录模式的封装，我们需要对备忘录的访问做些控制：</p><p>（1）对原发器：可以访问备忘录里的所有信息。</p><p>（2）对负责人：不可以访问备忘录里面的数据，但是他可以保存备忘录并且可以将备忘录传递给其他对象。</p><p>（3）其他对象：不可访问也不可以保存，它只负责接收从负责人那里传递过来的备忘录同时恢复原发器的状态。</p><p>所以备忘录模式最理想的情况就是只允许生成该备忘录的那个原发器访问备忘录的内部状态，典型的备忘录代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class Memento {
    private String state;
    public Memento(Originator o){
    　　state = o.state;
    }
    public void setState(String state){
       this.state=state;
    }
    public String getState(){
       return this.state;
    }　　
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="三、代码实现" tabindex="-1"><a class="header-anchor" href="#三、代码实现" aria-hidden="true">#</a> 三、代码实现：</h3><p>​ 我们以游戏挑战BOSS为实现场景：在挑战BOSS之前，角色的血量、蓝量都是满值，然后存档，在大战BOSS时，由于操作失误导致血量和蓝量大量损耗，所以只好恢复到刚刚开始的存档点，继续进行大战BOSS了。</p><p>首先是游戏角色类：Role.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Role{    
    private int bloodFlow;
    private int magicPoint;
    
    public Role(int bloodFlow,int magicPoint){
        this.bloodFlow = bloodFlow;
        this.magicPoint = magicPoint;
    }
 
    public int getBloodFlow() {
        return bloodFlow;
    }
 
    public void setBloodFlow(int bloodFlow) {
        this.bloodFlow = bloodFlow;
    }
 
    public int getMagicPoint() {
        return magicPoint;
    }
 
    public void setMagicPoint(int magicPoint) {
        this.magicPoint = magicPoint;
    }
    
    /**
     * @desc 展示角色当前状态
     */
    public void display(){
        System.out.println(&quot;用户当前状态:&quot;);
        System.out.println(&quot;血量:&quot; + getBloodFlow() + &quot;;蓝量:&quot; + getMagicPoint());
    }
    
    /**
     * @desc 保持存档、当前状态
     */
    public Memento saveMemento(){
        return new Memento(getBloodFlow(), getMagicPoint());
    }
    
    /**
     * @desc 恢复存档
     */
    public void restoreMemento(Memento memento){
        this.bloodFlow = memento.getBloodFlow();
        this.magicPoint = memento.getMagicPoint();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>备忘录：Memento.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class Memento {
    private int bloodFlow;
    private int magicPoint;
 
    public int getBloodFlow() {
        return bloodFlow;
    }
 
    public void setBloodFlow(int bloodFlow) {
        this.bloodFlow = bloodFlow;
    }
 
    public int getMagicPoint() {
        return magicPoint;
    }
 
    public void setMagicPoint(int magicPoint) {
        this.magicPoint = magicPoint;
    }
    
    public Memento(int bloodFlow,int magicPoint){
        this.bloodFlow = bloodFlow;
        this.magicPoint = magicPoint;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>负责人：Caretaker.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Caretaker {
    Memento memento;
 
    public Memento getMemento() {
        return memento;
    }
 
    public void setMemento(Memento memento) {
        this.memento = memento;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端：Client.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Client {
    public static void main(String[] args) {
        //打BOSS之前：血、蓝全部满值
        Role role = new Role(100, 100);
        System.out.println(&quot;----------大战BOSS之前----------&quot;);
        role.display();
        
        //保持进度
        Caretaker caretaker = new Caretaker();
        caretaker.memento = role.saveMemento();
        
        //大战BOSS，快come Over了
        role.setBloodFlow(20);
        role.setMagicPoint(20);
        System.out.println(&quot;----------大战BOSS----------&quot;);
        role.display();
        
        //恢复存档
        role.restoreMemento(caretaker.getMemento());
        System.out.println(&quot;----------恢复----------&quot;);
        role.display();
        
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="四、备忘录模式小结" tabindex="-1"><a class="header-anchor" href="#四、备忘录模式小结" aria-hidden="true">#</a> 四、备忘录模式小结：</h3><p>1、优点：</p><p>（1）实现了信息的封装，用户不需要关心状态的保存细节，窄接口保证了只有发起者才能访问备忘录对象的状态；</p><p>（2）简化了原发器，把备忘录对象保存到原发器对象之外，这样原发器角色就不需要对各个备份的状态进行管理。</p><p>2、缺点：</p><p>​ 在实际应用中，备忘录模式都是多状态和多备份的，每保存一次对象状态都需要消耗一定的系统资源，如果需要保存的原发器类的成员变量太多，就不可避免需要占用大量的内存存储空间，消耗资源。</p><p>3、适用场景：</p><p>（1）如果有需要提供回滚操作的需求，使用备忘录模式非常适合，比如jdbc的事务操作，文本编辑器的Ctrl+Z恢复等。</p><p>（2）保存一个对象在某一个时刻的全部状态或部分状态，这样以后需要时它能够恢复到先前的状态，实现撤销操作。防止外界对象破坏一个对象历史状态的封装性。</p>`,31),a=[s];function v(t,r){return e(),n("div",null,a)}const o=i(d,[["render",v],["__file","备忘录模式.html.vue"]]);export{o as default};
