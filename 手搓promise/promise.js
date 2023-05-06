//声明构造函数
function Promise(executor){
    //添加属性
    this.PromiseState = "penging";
    this.PromiseResult = null;

    //保存实例对象的 this 的值
    const self = this;

    //resolve 函数
    function resolve(data){
        //判断状态
        if(self.PromiseState !== "penging") return;
        //1.修改对象的状态(promiseState)
        self.PromiseState = "fulfilled";//resolved
        //2.设置对象结果值(promiseResult)
        self.PromiseResult = data;
    }

    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== "penging") return;
        //1.修改对象的状态(promiseState)
        self.PromiseState = "rejected";
        //2.设置对象结果值(promiseResult)
        self.PromiseResult = data;
    }
    
    try{
        //同步调用“执行器函数”
        executor(resolve,reject);
    }catch(e){
        //修改promise对象状态为“失败”
        reject(e);
    }

}

//添加 then 方法
Promise.prototype.then = function(onResolved,onRejected){
    //调用回调函数（以PromiseState判断）
    if(this.PromiseState==='fulfilled'){
        onResolved(this.PromiseResult);
    }
    if(this.PromiseState==='rejected'){
        onRejected(this.PromiseResult);
    }
}