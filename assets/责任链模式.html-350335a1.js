import{_ as e,o as n,c as i,a as s}from"./app-999de8cb.js";const d={},l=s(`<h1 id="责任链模式" tabindex="-1"><a class="header-anchor" href="#责任链模式" aria-hidden="true">#</a> 责任链模式</h1><p><strong>背景：</strong></p><p>​ 学校规定参加校招的同学必须要请假，且要有相关人员的签字，三天以下需辅导员签字、三到七天需要系主任签字，一个星期以上需要院长签字，更多的则需要校长签字！</p><h2 id="一、什么是责任链模式" tabindex="-1"><a class="header-anchor" href="#一、什么是责任链模式" aria-hidden="true">#</a> 一、什么是责任链模式</h2><pre><code>职责链可以将请求的处理者组织成一条链，并将请求沿着链传递，如果某个处理者能够处理请求则处理，否则将该请求交由上级处理。客户端只需将请求发送到职责链上，无须关注请求的处理细节，通过职责链将请求的发送者和处理者解耦了，这也是职责链的设计动机。    
</code></pre><p>​ 职责链模式可以简化对象间的相互连接，因为客户端和处理者都没有对方明确的信息，同时处理者也不知道职责链中的结构，处理者只需保存一个指向后续者的引用，而不需要保存所有候选者的引用。</p><pre><code>另外职责链模式增加了系统的灵活性，我们可以任意增加或更改处理者，甚至更改处理者的顺序，不过有可能会导致一个请求无论如何也得不到处理，因为它可能被放置在链末端。
</code></pre><blockquote><p>所以责任链模式有以下几个优点：</p><ul><li>（1）降低耦合度，将请求的发送者和接收者解耦。反映在代码上就是不需要在类中写很多丑陋的 if….else 语句，如果用了职责链，相当于我们面对一个黑箱，只需将请求递交给其中一个处理者，然后让黑箱内部去负责传递就可以了。</li><li>（2）简化了对象，使得对象不需要链的结构。</li><li>（3）增加系统的灵活性，通过改变链内的成员或者调动他们的次序，允许动态地新增或者删除处理者</li><li>（4）增加新的请求处理类很方便。</li></ul><p>但是责任链模式也存在一些缺点：</p><ul><li>（1）不能保证请求一定被成功处理</li><li>（2）系统性能将受到一定影响，并且可能会造成循环调用。</li><li>（3）可能不容易观察运行时的特征，而且在进行代码调试时不太方便，有碍于除错。</li></ul></blockquote><h2 id="二、结构图" tabindex="-1"><a class="header-anchor" href="#二、结构图" aria-hidden="true">#</a> 二、结构图</h2><blockquote><ul><li>（1）Handler：抽象处理者，定义了一个处理请求的方法。所有的处理者都必须实现该抽象类。</li><li>（2）ConcreteHandler：具体处理者，处理它所负责的请求，同时也可以访问它的后继者，如果它能够处理该请求则处理，否则将请求传递到它的后继者。</li><li>（3）Client: 客户类</li></ul></blockquote><p>下面是最典型的具体处理者类：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class ConcreteHandler extends Handler
{
    public void handleRequest(String request)
    {
        if(请求request满足条件)
        {
            ......  //处理请求；
        }
        else
        {
            this.successor.handleRequest(request); //转发请求
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、代码实现" tabindex="-1"><a class="header-anchor" href="#三、代码实现" aria-hidden="true">#</a> 三、代码实现</h2><p>我们将使用开头那个请假的实例。请假：3天以下辅导员签字、3到5天系主任签字、6到10天院长签字、11-15天校长签字、15天以上不允签字。</p><p>首先是请假条：LeaveNode.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class LeaveNode {
    /** 请假天数 **/
    private  int number;
    
    /** 请假人 **/
    private String person;
    
    public LeaveNode(String person,int number){
        this.person = person;
        this.number = number;
    }
 
    public int getNumber() {
        return number;
    }
 
    public void setNumber(int number) {
        this.number = number;
    }
 
    public String getPerson() {
        return person;
    }
 
    public void setPerson(String person) {
        this.person = person;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>抽象处理者：Leader.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public abstract class Leader {
    /** 姓名 **/
    public String name;
    
    /** 后继者 **/
    protected Leader successor;
    
    public Leader(String name){
        this.name = name;
    }
 
    public void setSuccessor(Leader successor) {
        this.successor = successor;
    }
    
    public abstract void handleRequest(LeaveNode LeaveNode);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>四个具体处理者：辅导员：Instructor.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Instructor extends Leader{
 
    public Instructor(String name){
        super(name);
    }
    
    public void handleRequest(LeaveNode LeaveNode) {
        if(LeaveNode.getNumber() &lt;= 3){   //小于3天辅导员审批
            System.out.println(&quot;辅导员&quot; + name + &quot;审批&quot; +LeaveNode.getPerson() + &quot;同学的请假条,请假天数为&quot; + LeaveNode.getNumber() + &quot;天。&quot;);
        }
        else{     //否则传递给系主任
            if(this.successor != null){
                this.successor.handleRequest(LeaveNode);
            }
        }
    }
 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>系主任： DepartmentHead.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class DepartmentHead extends Leader{
 
    public DepartmentHead(String name) {
        super(name);
    }
 
    public void handleRequest(LeaveNode LeaveNode) {
        if(LeaveNode.getNumber() &lt;= 7){   //小于7天系主任审批
            System.out.println(&quot;系主任&quot; + name + &quot;审批&quot; +LeaveNode.getPerson() + &quot;同学的请假条,请假天数为&quot; + LeaveNode.getNumber() + &quot;天。&quot;);
        }
        else{     //否则传递给院长
            if(this.successor != null){
                this.successor.handleRequest(LeaveNode);
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>院长：Dean.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Dean extends Leader{
 
    public Dean(String name) {
        super(name);
    }
 
    public void handleRequest(LeaveNode LeaveNode) {
        if(LeaveNode.getNumber() &lt;= 10){   //小于10天院长审批
            System.out.println(&quot;院长&quot; + name + &quot;审批&quot; +LeaveNode.getPerson() + &quot;同学的请假条,请假天数为&quot; + LeaveNode.getNumber() + &quot;天。&quot;);
        }
        else{     //否则传递给校长
            if(this.successor != null){
                this.successor.handleRequest(LeaveNode);
            }
        }
    }
 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>校长：President.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class President extends Leader{
 
    public President(String name) {
        super(name);
    }
 
    public void handleRequest(LeaveNode LeaveNode) {
        if(LeaveNode.getNumber() &lt;= 15){   //小于15天校长长审批
            System.out.println(&quot;校长&quot; + name + &quot;审批&quot; +LeaveNode.getPerson() + &quot;同学的请假条,请假天数为&quot; + LeaveNode.getNumber() + &quot;天。&quot;);
        }
        else{     //否则不允批准
            System.out.println(&quot;请假天天超过15天,不批准...&quot;);
        }
    }
 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端：Client.java</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Client {
    public static void main(String[] args) {
        Leader instructor = new Instructor(&quot;陈毅&quot;);       //辅导员
        Leader departmentHead = new DepartmentHead(&quot;王明&quot;);    //系主任
        Leader dean = new Dean(&quot;张强&quot;);      //院长
        Leader president = new President(&quot;王晗&quot;);     //校长
        
        instructor.setSuccessor(departmentHead);       //辅导员的后续者是系主任
        departmentHead.setSuccessor(dean);             //系主任的后续者是院长
        dean.setSuccessor(president);                  //院长的后续者是校长
        
        //请假3天的请假条
        LeaveNode leaveNode1 = new LeaveNode(&quot;张三&quot;, 3);
        instructor.handleRequest(leaveNode1);     
        
        //请假9天的请假条
        LeaveNode leaveNode2 = new LeaveNode(&quot;李四&quot;, 9);
        instructor.handleRequest(leaveNode2);
        
        //请假15天的请假条
        LeaveNode leaveNode3 = new LeaveNode(&quot;王五&quot;, 15);
        instructor.handleRequest(leaveNode3);
        
        //请假20天的请假条
        LeaveNode leaveNode4 = new LeaveNode(&quot;赵六&quot;, 20);
        instructor.handleRequest(leaveNode4);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、纯的与不纯的责任链模式" tabindex="-1"><a class="header-anchor" href="#四、纯的与不纯的责任链模式" aria-hidden="true">#</a> 四、纯的与不纯的责任链模式</h2><p>（1）纯的责任链模式要求处理者对象只能在两个行为中选择一个：一是承担责任，二是把责任推给下家，不允许出现某一个具体处理者对象在承担了一部分责任后又把责任向下传的情况。</p><p>（2）在纯的责任链模式里面，请求必须被某一个处理者对象所接收；在不纯的责任链模式里面，一个请求可以最终不被任何接收端对象所接收。</p>`,31),a=[l];function v(r,u){return n(),i("div",null,a)}const t=e(d,[["render",v],["__file","责任链模式.html.vue"]]);export{t as default};
