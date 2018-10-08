<template>
  <div id="order_wait">
    <div class="order_wait_content">
      <div class="order_wait_info">
        <div class="order_wait_top">
          <img src="../images/timer.png" alt="">
          <div class="order_wait_right">
            <p class="order_wait_num"><span>{{uid}}</span>号桌订单详情</p>
            <p>如有问题，请及时联系服务员</p>
          </div>
        </div>
        <p class="order_wait_food" v-show="!flag">已点菜品<span class="order_num">{{total_num}}</span>份,合计:<span
          class="order_price">{{total_price}}元</span>
        </p>
      </div>

      <div class="order_wait_list" v-show="!flag">
        <h3>菜品详情</h3>
        <ul>
          <li v-for="item in list">
            <div class="title">{{item.title}}</div>
            <div class="num">{{item.num}}份</div>
            <div class="price">{{item.total_price}}元</div>
          </li>
        </ul>
      </div>

      <div class="order_wait_handle clearfix" v-show="!flag">
        <button class="pay_btn" @click="payOrder">立即支付</button>
        <button class="cancel_btn" @click="tipShow=true">取消订单</button>
      </div>

      <!--取消订单提示-->
      <div class="delete_tip" v-if="tipShow">
        <div class="tip_content">
          <h3>确定取消该订单？</h3>
          <button class="no_btn" @click="tipShow=false">否</button>
          <button class="yes_btn" @click="cancelOrder">是</button>
        </div>
      </div>
    </div>

    <!--没有订单的提示-->
    <div class="order_tip" v-show="flag">
      <h3>您尚未有提交的订单</h3>
      <p>可以点击下方的<span>菜单</span>继续点菜</p>
    </div>

    <v-navfooter></v-navfooter>

    <!--底部继续点菜按钮-->
    <router-link to="/home">
      <div class="footer_book" id="footer_book" style="left:90%;">
        <img src="../images/book.png" alt="">
        <p>菜单</p>
      </div>
    </router-link>

  </div>

</template>

<script>
  import '../css/order_wait.scss';

  //引入组件
  import NavFooter from './public/NavFooter';


  //引入自定义模块
  import Config from '../../model/config';
  import Storage from '../../model/storage';

  export default {
    data() {
      return {
        apiUrl: Config.apiUrl,
        uid: Storage.get('uid'),
        total_num: 0,
        total_price: 0,
        list: [],
        tipShow: false,
        flag: false,
        order_id: ''
      }
    },
    sockets: {
      updateOrder: function () {
        this.flag = false;
        this.getOrderId();
      },
      cancelOrder: function () {
        this.flag = true;
      }
    },
    methods: {
      getOrderId() {
        let url = this.apiUrl + 'api/getOrderInfo?uid=' + this.uid;
        this.$http.get(url).then(res => {
          if (res.body.code == '0') {
            this.flag = true;
          } else {
            this.order_id = res.body.order_id;
            this.getOrderData(this.order_id);
          }
        })
      },
      getOrderData() {
        let url = this.apiUrl + 'api/getOrderList?order_id=' + this.order_id;
        this.$http.get(url).then(res => {
          this.total_num = res.body.order_info[0].total_num;
          this.total_price = res.body.order_info[0].total_price;
          this.list = res.body.order_list;
        }, err => {
          console.log(err);
        })
      },
      //取消订单
      cancelOrder() {
        this.tipShow = false;
        let url = this.apiUrl + 'api/deleteOrder?order_id=' + this.order_id;
        this.$http.get(url).then(res => {
          if (res.body.success == 'true') {
            this.$socket.emit('cancelOrder', 'cancelOrder');
            this.$router.push({path: '/home'});//删除成功后跳转到点餐页面
          }
        })
      },
      //立即支付
      payOrder() {
        let order_id = this.order_id;
        let url = this.apiUrl + 'api/doPay';
        let data = {
          uid: this.uid,
          order_id,
          total_price: this.total_price,
          return_url: 'http://192.168.1.118:8002/#/paySuccess'
        }

        this.$http.post(url, data).then(res => {
          if (res.body.result.message == 'success') {
            this.$socket.emit('cancelOrder', 'cancelOrder');
            location.href = res.body.result.data;
          }
        }, err => {
          console.log(err);
        })
      }
    },
    components: {
      'v-navfooter': NavFooter
    },
    mounted() {
      this.getOrderId();
    }
  }
</script>

<style lang="scss" scoped>

</style>
