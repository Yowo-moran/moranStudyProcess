//声明构造函数
function MyPromise(executor){
    //添加属性
    this.PromiseState = "penging";
    this.PromiseResult = null;

    //声明属性
    this.callbacks = [];
    
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

        //调用成功的回调函数
        self.callbacks.forEach(item=>{
            item.onResolved(data);
        })
    }

    //reject 函数
    function reject(data){
        //判断状态
        if(self.PromiseState !== "penging") return;

        //1.修改对象的状态(promiseState)
        self.PromiseState = "rejected";

        //2.设置对象结果值(promiseResult)
        self.PromiseResult = data;

        //调用失败的回调函数
        self.callbacks.forEach(item=>{
            item.onRejected(data);
        })
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
MyPromise.prototype.then = function(onResolved,onRejected){
    const self = this;
    return new MyPromise((resolve,reject)=>{
        //封装回调函数
        function callback(type){
            try{
                //获取回调函数的执行结果
                let result = type(self.PromiseResult);

                //判读结果的类型
                if(result instanceof MyPromise){
                    //如果是promise对象，就可以直接调用then方法
                    result.then(fulfilled=>{
                        resolve(fulfilled);
                    },rejected=>{
                        reject(rejected);
                    })
                }else{
                    //如果不是promise对象，直接调用resole来改变状态
                    resolve(this.PromiseResult);
                }
            }catch(e){
                //抛出错误时的处理
                reject(e);
            }
        }
        //调用回调函数（以PromiseState判断）
        if(this.PromiseState==='fulfilled'){
            callback(onResolved);
        }else if(this.PromiseState==='rejected'){
            callback(onRejected)
        }else{
            //保存回调函数
            this.callbacks.push({
                onResolved:function(){
                    callback(onResolved);
                },
                onRejected:function(){
                    callback(onRejected);
                },
            });
        }
    })
}