<template>
  <div id="cart">
    <div class="cart_content">

      <div class="cart_info">
        <h3>购物车</h3>
        <div class="p_info">
          <div class="p_info_left">
            <p class="p_number">用餐人数:{{p_num}}</p>
            <p class="p_mode">用餐方式:{{p_mode}}</p>
            <p class="p_mark">备注:{{p_mark}}</p>
          </div>

          <div class="p_info_right">
            <router-link to="/editStart">
              <img src="../images/edit.png" alt="编辑">
            </router-link>
            <p>修改</p>
          </div>

        </div>
        <div class="order_info">
          <p class="order_food">您的购物车共有{{totalNum}}个菜品</p>
          <p>合计:<span class="order_price">¥{{totalPrice}}</span></p>
          <button @click="uploadOrder">提交订单</button>
        </div>
      </div>


      <div class="cart_list">
        <h3>美食在乡</h3>
        <div class="handle">
          <label>
            <input type="checkbox" v-model="all_checked" @click="selectAll">全选
          </label>
          <img src="../images/delete.png" alt="删除" @click="cancelCart">
        </div>
        <ul>
          <li class="item" v-for="(item,index) in list">
            <input type="checkbox" v-model="item.checked" @click="selectItem">
            <div class="item_left">
              <img class="item_img" :src="apiUrl + item.img_url"/>
              <div class="inner">
                <p class="title">{{item.title}}</p>
                <p class="price">¥{{item.price}}</p>
              </div>
            </div>
            <div class="item_right">
              <span class="reduce" @click="decNum(item,index,$event)">-</span>
              <span class="num">
                        <input type="text" readonly v-model="item.num">
                    </span>
              <span class="increase" @click="incNum(item,$event)">+</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="hot_food">
        <h3>推荐菜品</h3>
        <div class="item_list_outer">
          <ul class="item_list">
            <li v-for="item in hot_list" @click="getContent(item._id)">
              <div class="inner">
                <img :src="apiUrl + item.img_url" alt="">
                <p>{{item.title}}</p>
                <p>¥{{item.price}}</p>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <v-navfooter></v-navfooter>

    <!--底部继续点菜按钮-->
    <router-link to="/home">
      <div class="footer_book" id="footer_book">
        <img src="../images/book.png" alt="">
        <p>继续点菜</p>
      </div>
    </router-link>

  </div>

</template>

<script>
  import '../css/cart.scss';

  //引入组件
  import NavFooter from './public/NavFooter';

  //引入自定义模块
  import Config from '../../model/config';
  import Storage from '../../model/storage';

  export default {
    data() {
      return {
        apiUrl: Config.apiUrl,
        all_checked:false,
        list: [],
        totalNum: 0,
        totalPrice: 0,
        p_num: '1人',
        p_mode: '堂食',
        p_mark: '微辣',
        uid: Storage.get('uid'),
        hot_list: []
      }
    },
    sockets: {
      updateData: function (uid) {
        this.requestList(uid);
      },
      mealsInfo: function (uid) {
        this.requestUserInfo(uid);
      }
    },
    methods: {
      requestList() {
        let url = this.apiUrl + 'api/cartlist?uid=' + this.uid;
        this.$http.get(url).then(res => {
          if (res.body.result.length == 0) {
            this.$router.push({path: '/cartTip'});
            return;
          }
          this.list = res.body.result;
          this.totalNum = 0;
          this.totalPrice = 0;
          this.list.forEach(item => {
            item.checked = false;
            this.totalNum += Number(item.num);
            this.totalPrice += Number(item.num) * Number(item.price);
          });

        }, error => {
          console.log(error);
        })
      },
      decNum(item, index, e) {
        if (Number(item.num) == 1) {
          this.list.splice(index, 1);
        }

        //购物车没有菜品时跳转到'提示'页面
        if (this.list.length == 0) {
          this.$router.push({path: '/cartTip'});
        }

        let redUrl = this.apiUrl + 'api/decCart?uid=' + this.uid + '&product_id=' + item.product_id + '&num=' + item.num;
        this.$http.get(redUrl).then(res => {
          if (res.body.success == 'true') {
            this.$socket.emit('addCart', 'addCart');
          }
        }, error => {
          console.log(error);
        });
        --this.totalNum;
        this.totalPrice = this.totalPrice - Number(item.price);
        --item.num;
      },
      incNum(item, e) {
        let incUrl = this.apiUrl + 'api/incCart?uid=' + this.uid + '&product_id=' + item.product_id + '&num=' + item.num;
        this.$http.get(incUrl).then(res => {
          if (res.body.success == 'true') {
            this.$socket.emit('addCart', 'addCart');
          }
        }, err => {
          console.log(err);
        });
        ++this.totalNum;
        this.totalPrice = this.totalPrice + Number(item.price);
        ++item.num;
      },
      requestUserInfo() {
        let url = this.apiUrl + 'api/peopleInfoList?uid=' + this.uid;
        this.$http.get(url).then(res => {
          if (res.body.success == 'true') {
            this.p_num = res.body.result[0].p_num;
            this.p_mode = res.body.result[0].p_mode;
            this.p_mark = res.body.result[0].p_mark;
          }
        }, err => {
          console.log(err);
        })
      },
      //提交订单
      uploadOrder() {
        let uid = this.uid;
        let p_num = this.p_num;
        let p_mode = this.p_mode;
        let p_mark = this.p_mark;
        let total_num = this.totalNum;
        let total_price = this.totalPrice;
        let order_list = JSON.stringify(this.list);
        var data = {
          uid, p_num, p_mode, p_mark, total_num, total_price, order_list
        };
        let url = this.apiUrl + 'api/addOrder';
        this.$http.post(url, data).then(res => {
          if (res.body.success == 'true') {
            this.$socket.emit('addCart', 'addCart');
            this.$socket.emit('updateOrder', 'updateOrder');
            this.$router.push({path: '/orderWait'});
          }
        }, err => {
          console.log(err);
        })

      },
      //热销菜品
      getHotList() {
        let url = this.apiUrl + 'api/hotProduct';
        this.$http.get(url).then(res => {
          this.hot_list = res.body.result;
          //动态控制ul的宽度
          $('.item_list').css({width: this.hot_list.length * 8 + 'rem'});
        }, err => {
          console.log(err);
        })
      },
      //跳转到详情页
      getContent(_id) {
        let path = this.$route.path;
        this.$router.push({path: '/content?id=' + _id + '&path=' + path});
      },

      //复选框删除购物车菜品
      selectAll(){
        this.list.forEach(item=>{
          item.checked = !this.all_checked;
        })
      },
      selectItem(){
        if($('.item input[type=checkbox]:checked').length == this.list.length){
          this.all_checked = true;
        }else{
          this.all_checked = false;
        }
      },
      cancelCart(){
        let productArr = [];
        this.list.forEach(item=>{
          if(item.checked == true){
            productArr.push(item._id);
          }
        });
        let url = this.apiUrl + 'api/deleteCartData';
        let data = JSON.stringify(productArr);
        this.$http.post(url,data).then(res=>{
          if(res.body.success == 'true'){
            this.$socket.emit('addCart', 'addCart');
            this.requestList();
          }
        },err=>{
          console.log(err);
        })
      }
    },
    components: {
      'v-navfooter': NavFooter
    },
    mounted() {
      this.requestList();
      this.requestUserInfo();
      this.getHotList();
    }
  }
</script>

<style lang="scss" scoped>
  .footer_book {
    left: 90%;
  }
</style>
