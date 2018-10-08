<template>
  <div id="content">
    <div class="back" @click="getBack">返回</div>
    <div class="content">
      <div class="info">
        <img :src="apiUrl + list.img_url"/>
        <h2>{{list.title}}</h2>
        <p class="price">￥{{list.price}}/份</p>
      </div>
      <div class="detail">
        <h3>商品详情</h3>
        <div class="contain" v-html="list.content"></div>
      </div>
    </div>
    <div class="footer clearfix">
      <div class="cart">
        <p>数量:</p>
        <div class="cate_num">
          <span class="reduce" @click="redNum">-</span>
          <span class="num">
                <input type="text" readonly v-model="num">
            </span>
          <span class="increase" @click="incNum">+</span>
        </div>
      </div>
      <button class="add_cart" @click="addCart">加入购物车</button>
    </div>
    <!--购物车-->
    <v-footercart ref="cart"></v-footercart>
  </div>

</template>

<script>
  import '../css/content.scss';

  //引入模板
  import FooterCart from './public/FooterCart';

  //引入自定义模块
  import Config from '../../model/config';
  import Storage from '../../model/storage';

  export default {
    data() {
      return {
        apiUrl: Config.apiUrl,
        num: 1,
        list: {},
        uid: Storage.get('uid'),
        cateId: 0,
        scrollTop: 0,
        path: '',
        searchMsg:''
      }
    },
    methods: {
      requestData(id) {
        let url = this.apiUrl + 'api/productcontent?id=' + id;
        this.$http.get(url).then(res => {
          this.list = res.body.result[0];
        }, error => {
          console.log(error);
        })
      },
      redNum() {
        if (this.num > 1) {
          --this.num;
        }
      },
      incNum() {
        ++this.num;
      },
      addCart() {
        let url = this.apiUrl + 'api/addCart';
        this.$http.post(url, {
          uid: this.uid,//桌号，会从扫描二维码的url得到该参数，并且是唯一的
          title: this.list.title,
          cate_id: this.list.cate_id,
          product_id: this.list._id,
          img_url: this.list.img_url,
          price: this.list.price,
          num: this.num
        }).then(res => {
          if (res.body.success == 'true') {//表示增加数据成功
            //向服务器进行广播通信
            this.$refs.cart.requestNum();//调用子组件的方法更新购物车数量
            this.$socket.emit('addCart', 'addCart');
          }
        }, error => {
          console.log(error);
        })
      },
      getBack() {
        if (this.path == '/home') {
          this.$router.push({path: '/home?cateId=' + this.cateId + '&scrollTop=' + this.scrollTop})
        }else if(this.path == '/search'){
          this.$router.push({path:'/search?searchMsg=' + this.searchMsg});
        }else{
          this.$router.push({path:this.path});
        }
      }
    },
    components: {
      'v-footercart': FooterCart
    },
    mounted() {
      let id = this.$route.query.id;
      let path = this.$route.query.path;
      let msg = this.$route.query.msg;
      this.cateId = this.$route.query.cateId;
      this.scrollTop = this.$route.query.scrollTop;
      this.path = path;
      this.searchMsg = msg;
      this.requestData(id);
    }
  }
</script>
<style lang="scss" scoped>
  //在父组件中修改子组件中的样式且不会污染全局样式的写法（/deep/渗透）
  #footerCart /deep/ .footer_cart {
    bottom: 5rem;
  }
</style>
