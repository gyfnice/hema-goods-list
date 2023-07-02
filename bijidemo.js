
// const promise1 =  await axios.get('', params);
// 核心 专注度分离
const promise1 = () => {
   return new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve("我是获取第一页数据");
     }, 3000);
   });
}
const promise2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("我是获取第二页数据");
    }, 2000);
  });
};
const promise3 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("我是获取第三页数据");
    }, 3000);
  });
};
/* promise1.then(res => {
  // res => 我是1秒后执行
  console.log('res :>> ', res);
  promise2.then((res) => {
    // res => 我是200ms后执行
    console.log("res :>> ", res);
  });

}) */
const run = () => {
  /*  promise2().then((res) => {
    console.log("res :>> ", res);
  }).catch(err => {
    console.log('err :>> ', err);
  }); */
  /* promise1().then(res => {
    console.log('res :>> ', res);
  });
  promise2().then(res => {
    console.log('res :>> ', res);
  });
  promise3().then(res => {
    console.log('res :>> ', res);
  }); */
  Promise.allSettled([promise1(), promise2(), promise3()]).then((res) => {
    // res => [promise1, promise2, promise3]
    console.log("res :>> ", res);
  });
  //Promise.all
  //Promise.all 中间一个请求  出错会怎么样
  //Promise.allSettled 是什么意思
  //说一下异步编程的理解
  //说一下async,await的理解
}
