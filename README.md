# vue-project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

这是一个使用vue-cli + webpack-simple搭建的基于CMS系统（https://github.com/niehongzhen/CMS） 的到店点餐系统，所以在运行此项目之前要先运行CMS项目。
项目须知：
1）电脑上要安装node，项目下载完成后，运行npm install或者cnpm install (淘宝镜像安装，请自行百度)，安装项目所需包；
2）运行CMS项目(详情请阅读 https://github.com/niehongzhen/CMS )；
3) npm run build 打包项目，
   npm run dev 运行项目；
4）支付功能需要连接服务器使用，只在本地无法使用；

项目亮点：
1）使用vue-cli搭建项目，结构清晰，代码没有过多冗余；
2）借助CMS系统管理页面内容，可以实时更新；
3）使用Socket.io，实现无刷新状态下同一桌号所有购物车以及订单的实时更新；
4）使用koa2-core实现跨域，通过alipay-mobile实现支付宝支付功能。


