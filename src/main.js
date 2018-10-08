import Vue from 'vue'
import App from './App.vue'

//引入自定义模块
import Storage from './model/storage';

//引入路由并配置路由
import VueRouter from 'vue-router';
Vue.use(VueRouter);

//引入请求数据vue-resource
import VueResource from 'vue-resource';
Vue.use(VueResource);


//获取桌号
var key = window.location.hash.split('?')[0].split('/')[1];
var uid = window.location.hash.split('=')[1];

if(key == 'start'){
  Storage.set('uid',uid);
}

//引入vue-socketio
import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio,'http://localhost:8001?uid=' + uid);


//引入组件
import Start from './assets/components/Start';
import EditStart from './assets/components/Edit_start';
import Home from './assets/components/Home';
import Cart from './assets/components/Cart';
import Cart_no_data from './assets/components/Cart_nodata';
import Content from './assets/components/Content';
import Order_wait from './assets/components/Order_wait';
import Search from './assets/components/Search';
import Pay_success from './assets/components/Pay_success';

//配置组件路由
const routes = [
  { path: '/start', component: Start },
  { path : '/editStart', component: EditStart},
  { path: '/home', component: Home },
  { path: '/cart' , component: Cart},
  { path: '/cartTip', component: Cart_no_data },
  { path: '/content', component: Content },
  { path: '/orderWait', component: Order_wait },
  { path: '/search' , component: Search},
  { path: '/paySuccess' , component: Pay_success},
  { path : '*' , redirect : '/start'}
];

//实例化路由
const router = new VueRouter({
  routes // short for `routes: routes`
});

//挂载路由
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
