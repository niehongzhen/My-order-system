<template>
  <div id="cart_nodata">
    <div class="cart_content">
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

    <div class="cart_tip">
      <h3>购物车空空如也</h3>
      <p>您可以点击下方的<span>菜单</span>继续点菜</p>
    </div>

    <v-navfooter></v-navfooter>

    <!--底部继续点菜按钮-->
    <router-link to="/home">
      <div class="footer_book" id="footer_book">
        <img src="../images/book.png" alt="">
        <p>菜单</p>
      </div>
    </router-link>

  </div>

</template>

<script>
  import '../css/cart.scss';

  //引入自定义模块
  import Config from '../../model/config';
  import Storage from '../../model/storage';

  //引入组件
  import NavFooter from './public/NavFooter';
  import FooterCart from './public/FooterCart';

  export default {
    data() {
      return {
        uid:Storage.get('uid'),
        apiUrl:Config.apiUrl,
        hot_list:[]
      }
    },
    sockets:{
      updateData:function(){
        this.requestList();
      }
    },
    methods: {
      requestList() {
        let url = this.apiUrl + 'api/cartlist?uid=' + this.uid;
        this.$http.get(url).then(res => {
          if(res.body.result.length > 0){
            this.$router.push({path:'/cart'});
          }
        }, error => {
          console.log(error);
        })
      },
      //推荐菜品
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
    },
    components: {
      'v-navfooter': NavFooter
    },
    mounted(){
      this.requestList();
      this.getHotList();
    }
  }
</script>

<style lang="scss" scoped>
.footer_book{
  left:90%;
}
</style>
