<template>
  <div id="footerCart">
      <div class="footer_cart" id="footer_cart" @click="jumpPage">
        <img src="../../images/cart.png" alt="">
        <p>购物车</p>
        <span>{{cartNum}}</span>
      </div>
  </div>
</template>

<script>
  //引入自定义模块
  import Config from '../../../model/config';
  import Storage from '../../../model/storage';

  export default {
    data() {
      return {
        cartNum: 0,
        apiUrl: Config.apiUrl,
        uid:Storage.get('uid')
      }
    },
    sockets:{
      updateData:function(uid){
        this.requestNum(uid);
      }
    },
    methods: {
      requestNum() {
        let url = this.apiUrl + 'api/cartCount?uid=' + this.uid;
        this.$http.get(url).then(res => {
          this.cartNum = res.body.result;
        }, err => {
          console.log(err);
        })
      },
      jumpPage(){
        let url = this.apiUrl + 'api/cartlist?uid=' + this.uid;
        this.$http.get(url).then(res=>{
          var listNum = res.body.result.length;
          if(listNum > 0){
            this.$router.push({path:'/cart'});
          }else{
            this.$router.push({path:'/cartTip'});
          }
        },err=>{
          console.log(err);
        })
      }
    },
    mounted() {
      this.requestNum();
    }
  }
</script>

<style scoped>

</style>
