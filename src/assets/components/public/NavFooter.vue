<template>
  <div id="navFooter">
    <!--底部导航-->
    <div class="footer_nav" id="footer_nav" @click="navFlag=!navFlag">
      <img src="../../images/navigation.png" alt="">
      <p>导航</p>
    </div>

    <!--导航弹出层-->
    <div class="footer_nav_show" id="footer_nav_show" ref="footer_nav_show" v-show="navFlag">
      <ul class="list">

        <li nodemark="home" @click="jumpPage($event)">
            <img src="../../images/menu.png"/>
            <p>菜单</p>
        </li>
        <li nodemark="cart" @click="jumpPage($event)">
            <img src="../../images/cart.png"/>
            <p>购物车</p>
        </li>

        <li nodemark="orderWait" @click="jumpPage($event)">
            <img src="../../images/order.png"/>
            <p>我的订单</p>
        </li>
        <li id="footer_back" @click="navFlag=!navFlag">
          <img src="../../images/close.png"/>
          <p>返回</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        navFlag: false
      }
    },
    methods:{
      jumpPage(e){
        var path = this.$route.path;
        var nodemark ='/' + $(e.currentTarget).attr('nodemark');
        if(path == nodemark){//表示在当前页面
          this.navFlag = false;
        }else{//不在当前页面则跳转到相应页面
          this.$router.push({path:nodemark});
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
