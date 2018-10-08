<template>
  <div id="order_pay">
    <div class="ordered_content">
      <div class="ordered_info">
        <div class="ordered_top">
          <p>
            <em>&radic;</em>
            <span>支付成功！</span>
          </p>
          <div class="ordered_list">
            <h3>支付详情</h3>
            <ul>
              <li>
                <div class="title">桌号</div>
                <div class="content">{{uid}}</div>
              </li>
              <li>
                <div class="title">订单号</div>
                <div class="content">{{order_id}}</div>
              </li>
              <li>
                <div class="title">支付时间</div>
                <div class="content">{{order_time}}</div>
              </li>
              <li>
                <div class="title">总金额</div>
                <div class="content">¥{{total_price}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <router-link to="/home">
        <button class="back_home">返回首页</button>
      </router-link>
    </div>

  </div>

</template>

<script>
  import '../css/order_pay.scss';

  //引入自定义模块
  import Stroage from '../../model/storage';

  export default {
    data() {
      return {
        uid: Stroage.get('uid'),
        order_id: 'e1232re',
        order_time:'',
        total_price: 100
      }
    },
    methods: {
      initPage() {
        let params = this.$route.query;
        this.order_id = params.out_trade_no;
        this.order_time = params.timestamp;
        this.total_price = params.total_amount;
      }
    },
    mounted() {
      this.initPage();
    }
  }
</script>

<style lang="scss" scoped>

</style>
