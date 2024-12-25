import{_ as i,o as e,c as n,a as s}from"./app-999de8cb.js";const l={},d=s(`<h1 id="状态模式" tabindex="-1"><a class="header-anchor" href="#状态模式" aria-hidden="true">#</a> 状态模式</h1><p><strong>背景：</strong></p><p>​ 介绍状态模式前，我们先看这样一个实例：公司力排万难终于获得某个酒店的系统开发项目，并且最终落到了你的头上。下图是他们系统的主要工作：</p><p>​ 当第一眼看到这个系统时你就看出这是一个状态图，每个框都代表了房间的状态，箭头表示房间状态的转换。分析如下：房间有三个状态：空闲、已预订、已入住，状态与状态之间可以根据客户的动作来进行转换，定义每个状态的值。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    public static final int FREEMTIME_STATE = 0;  //空闲状态
    public static final int BOOKED_STATE = 1;     //已预订状态
    public static final int CHECKIN_STATE = 2;    //入住状态
 
    int state = FREEMTIME_STATE;     //初始状态
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><pre><code>通过客户的动作将每个状态整合起来，实现这个功能最简单的方式肯定是 if…else 啦！所以这里我们就通过动作将所有的状态全面整合起来。分析得这里有四个动作：预订、入住、退订、退房。如下：
</code></pre><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    /**
     * @desc 预订
     */
    public void bookRoom(){
        if(state == FREEMTIME_STATE){   //空闲可预订
            if(count &gt; 0){
                System.out.println(&quot;空闲房间，完成预订...&quot;);
                state =  BOOKED_STATE;     //改变状态：已预订
                count --;
                //房间预订完了,提示客户没有房源了
                if(count == 0){
                    System.out.println(&quot;不好意思,房间已经预订完,欢迎您下次光临...&quot;);
                }
            }
            else{
                System.out.println(&quot;不好意思,已经没有房间了....&quot;);
            }
        }
        else if(state == BOOKED_STATE){
            System.out.println(&quot;该房间已经被预订了...&quot;);
        }
        else if(state == CHECKIN_STATE){
            System.out.println(&quot;该房间已经有人入住了...&quot;);
        }
    }
    
    /**
     * @desc 入住
     */
    public void checkInRoom(){
        if(state == FREEMTIME_STATE){
            if(count &gt; 0){
                System.out.println(&quot;空闲房间，入住...&quot;);
                state =  CHECKIN_STATE;     //改变状态：已预订
                count --;
                //房间预订完了,提示客户没有房源了
                if(count == 0){
                    System.out.println(&quot;不好意思,房间已经预订完,欢迎您下次光临...&quot;);
                }
            }
            else{
                System.out.println(&quot;不好意思,已经没有房间了....&quot;);
            }
            
        }
        else if(state == BOOKED_STATE){
            if(&quot;如果该房间是您预订的&quot;){
                System.out.println(&quot;入住....&quot;);
                state = CHECKIN_STATE;
            }
            else{
                System.out.println(&quot;您没有预订该房间,请先预订...&quot;);
            }
        }
        else if(state == CHECKIN_STATE){
            System.out.println(&quot;该房间已经入住了...&quot;);
        }
    }
    
    /**
     * @desc 退订
     */
    public void unsubscribeRoom(){
        if(state == FREEMTIME_STATE){}
        else if(state == CHECKIN_STATE){}
        else if(state == BOOKED_STATE){
            System.out.println(&quot;已退订房间...&quot;);
            state = FREEMTIME_STATE;
            count ++;
        }
    }
    
    /**
     * @desc 退房
     */
    public void checkOutRoom(){
        if(state == FREEMTIME_STATE){}
        else if(state == BOOKED_STATE){}
        else if(state == CHECKIN_STATE){
            System.out.println(&quot;已退房..&quot;);
            state = FREEMTIME_STATE;
            count++;
        }
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 正当你完成这个 “复杂” 的 if..else 时，客户增加需求说需要将某些房间保留下来以作为备用(standbyState)，于是悲剧了，因为你发现要在所有的操作里都要判断该房间是否为备用房间。当你老大经过你身边的时候发现你正在纠结怎么改的时候，你老大就问你为什么不换一个角度思考以状态为原子来改变它的行为，而不是通过行为来改变状态呢？于是你就学到了状态模式。</p><h2 id="一、什么是状态模式" tabindex="-1"><a class="header-anchor" href="#一、什么是状态模式" aria-hidden="true">#</a> 一、什么是状态模式</h2><p>​ 状态模式，就是允许对象在内部状态发生改变时改变它的行为，对象看起来就好像修改了它的类，也就是说以状态为原子来改变它的行为，而不是通过行为来改变状态。</p><p>​ 当对象的行为取决于它的属性时，我们称这些属性为状态，那该对象就称为状态对象。对于状态对象而言，它的行为依赖于它的状态，比如要预订房间，只有当该房间空闲时才能预订，想入住该房间也只有当你预订了该房间或者该房间为空闲时。对于这样的一个对象，当它的外部事件产生互动的时候，其内部状态就会发生变化，从而使得他的行为也随之发生变化。</p><h2 id="二、结构图" tabindex="-1"><a class="header-anchor" href="#二、结构图" aria-hidden="true">#</a> 二、结构图</h2><blockquote><ul><li>Context：环境类，可以包括一些内部状态</li><li>State：抽象状态类，定义了所有具体状态的共同接口，任何状态都需要实现这个接口，从而实现状态间的互相转换</li><li>ConcreteState：具体状态类，处理来自 Context 的请求，每一个 ConcreteState 都提供了它对自己请求的实现，所以，当 Context 改变状态时行为也会跟着改变</li></ul></blockquote><p>但是状态模式的缺点在于：</p><p>（1）需要在枚举状态之前需要确定状态种类</p><p>（2）会导致增加系统类和对象的个数。</p><p>（3）对 “开闭原则” 的支持并不友好，新增状态类需要修改那些负责状态转换的源代码，否则无法切换到新增状态；而且修改某个状态类的行为也需修改对应类的源代码。</p><p>所以状态模式适用于：代码中包含大量与对象状态有关的条件语句，以及对象的行为依赖于它的状态，并且可以根据它的状态改变而改变它的相关行为。</p><blockquote><p>策略模式和状态模式比较：策略模式和状态模式的结构几乎完全一致，但是它们的目的和本质完全不一样。策略模式是围绕可以互换的算法来创建业务的，而状态模式是通过改变对象内部的状态来帮助对象控制自己行为的。前者行为是彼此独立、可以相互替换的，后者行为是不可以相互替换的。</p></blockquote><h2 id="三、代码实现" tabindex="-1"><a class="header-anchor" href="#三、代码实现" aria-hidden="true">#</a> 三、代码实现</h2><p>首先是状态接口：State</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public interface State {
    /**
     * @desc 预订房间
     */
    public void bookRoom();
    
    /**
     * @desc 退订房间
     */
    public void unsubscribeRoom();
    
    /**
     * @desc 入住
     */
    public void checkInRoom();
    
    /**
     * @desc 退房
     */
    public void checkOutRoom();
    
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是房间类：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Room {
    /*
     * 房间的三个状态
     */
    State freeTimeState;    //空闲状态
    State checkInState;     //入住状态
    State bookedState;      //预订状态
 
    State state ;  
    
    public Room(){
        freeTimeState = new FreeTimeState(this);
        checkInState = new CheckInState(this);
        bookedState = new BookedState(this);
        
        state = freeTimeState ;  //初始状态为空闲
    }
    
    /**
     * @desc 预订房间
     */
    public void bookRoom(){
        state.bookRoom();
    }
    
    /**
     * @desc 退订房间
     */
    public void unsubscribeRoom(){
        state.unsubscribeRoom();
    }
    
    /**
     * @desc 入住
     */
    public void checkInRoom(){
        state.checkInRoom();
    }
    
    /**
     * @desc 退房
     */
    public void checkOutRoom(){
        state.checkOutRoom();
    }
 
    public String toString(){
        return &quot;该房间的状态是:&quot;+getState().getClass().getName();
    }
    
    /*
     * getter和setter方法
     */
    public State getFreeTimeState() {
        return freeTimeState;
    }
 
    public void setFreeTimeState(State freeTimeState) {
        this.freeTimeState = freeTimeState;
    }
 
    public State getCheckInState() {
        return checkInState;
    }
 
    public void setCheckInState(State checkInState) {
        this.checkInState = checkInState;
    }
 
    public State getBookedState() {
        return bookedState;
    }
 
    public void setBookedState(State bookedState) {
        this.bookedState = bookedState;
    }
 
    public State getState() {
        return state;
    }
 
    public void setState(State state) {
        this.state = state;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是3个状态类,这个三个状态分别对于这:空闲、预订、入住。其中空闲可以完成预订和入住两个动作，预订可以完成入住和退订两个动作，入住可以退房。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/** 
 * @Description: 空闲状态只能预订和入住
 */
public class FreeTimeState implements State {
    
    Room hotelManagement;
    
    public FreeTimeState(Room hotelManagement){
        this.hotelManagement = hotelManagement;
    }
    
    
    public void bookRoom() {
        System.out.println(&quot;您已经成功预订了...&quot;);
        hotelManagement.setState(hotelManagement.getBookedState());   //状态变成已经预订
    }
 
    public void checkInRoom() {
        System.out.println(&quot;您已经成功入住了...&quot;);
        hotelManagement.setState(hotelManagement.getCheckInState());   //状态变成已经入住
    }
 
    public void checkOutRoom() {
        //不需要做操作
    }
 
    public void unsubscribeRoom() {
        //不需要做操作
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/** 
 * @Description: 入住状态房间只能退房
 */
public class BookedState implements State {
    Room hotelManagement;
    
    public BookedState(Room hotelManagement) {
        this.hotelManagement = hotelManagement;
    }
 
    public void bookRoom() {
        System.out.println(&quot;该房间已近给预定了...&quot;);
    }
 
    public void checkInRoom() {
        System.out.println(&quot;入住成功...&quot;); 
        hotelManagement.setState(hotelManagement.getCheckInState());         //状态变成入住
    }
 
    public void checkOutRoom() {
        //不需要做操作
    }
 
    public void unsubscribeRoom() {
        System.out.println(&quot;退订成功,欢迎下次光临...&quot;);
        hotelManagement.setState(hotelManagement.getFreeTimeState());   //变成空闲状态
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/** 
 * @Description: 入住可以退房
 */
public class CheckInState implements State {
    Room hotelManagement;
    public CheckInState(Room hotelManagement) {
        this.hotelManagement = hotelManagement;
    }
 
    public void bookRoom() {
        System.out.println(&quot;该房间已经入住了...&quot;);
    }
 
    public void checkInRoom() {
        System.out.println(&quot;该房间已经入住了...&quot;);
    }
 
    public void checkOutRoom() {
        System.out.println(&quot;退房成功....&quot;);
        hotelManagement.setState(hotelManagement.getFreeTimeState());     //状态变成空闲
    }
 
    public void unsubscribeRoom() {
        //不需要做操作
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后是测试类：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Test {
    public static void main(String[] args) {
        //有3间房
        Room[] rooms = new Room[2];
        //初始化
        for(int i = 0 ; i &lt; rooms.length ; i++){
            rooms[i] = new Room();
        }
        //第一间房
        rooms[0].bookRoom();    //预订
        rooms[0].checkInRoom();   //入住
        rooms[0].bookRoom();    //预订
        System.out.println(rooms[0]);
        System.out.println(&quot;---------------------------&quot;);
        
        //第二间房
        rooms[1].checkInRoom();
        rooms[1].bookRoom();
        rooms[1].checkOutRoom();
        rooms[1].bookRoom();
        System.out.println(rooms[1]);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,30),v=[d];function a(t,c){return e(),n("div",null,v)}const r=i(l,[["render",a],["__file","状态模式.html.vue"]]);export{r as default};
