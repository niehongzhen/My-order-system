<template>
  <div id="search">
    <header class="hot_header">
      <router-link to="/home">
        <em ref="back"></em>
      </router-link>
      <input type="search" class="search" placeholder="请输入菜品名" v-model="msg" v-on:keydown.delete="preventInput"
             v-on:input="getList">
      <img src="../images/sousuo.png" alt="搜索">
      <span class="search_text" @click.enter="getList">搜索</span>
    </header>

    <!--热门搜索-->
    <div class="hot_search" v-if="search_flag">
      <h3>热门搜索</h3>
      <ul class="hot_list">
        <li @click="getSearchList($event)"><span>烤鸭</span></li>
        <li @click="getSearchList($event)"><span>风味毛血旺</span></li>
        <li @click="getSearchList($event)"><span>鸭梨秘制凉皮</span></li>
        <li @click="getSearchList($event)"><span>老干妈蒸鱼块</span></li>
      </ul>
    </div>

    <!--历史搜索-->
    <div class="history_search" v-if="search_flag">
      <h3>历史搜索</h3>
      <img src="../images/delete.png" class="delete_btn" alt="删除" @click="history_tip=true">
      <ul class="history_list">
        <li v-for="item in history_list" @click="getSearchList($event)">
          <span>{{item.msg}}</span>
        </li>
      </ul>
    </div>

    <!--搜索到的商品列表-->
    <div class="hot_content" v-if="food_flag">
      <ul class="hot_list">
        <li v-for="item in list" @click="getContent(item._id)">
          <img class="item_img" :src="apiUrl + item.img_url" alt=""/>
          <div class="inner">
            <p class="title">{{item.title}}</p>
            <div v-html="item.content" class="detail"></div>
            <p class="price">¥{{item.price}}</p>
          </div>
        </li>
      </ul>
    </div>

    <!--搜索不到商品时的提示-->
    <div class="nodata_tip" v-if="tip_flag">
      <img src="../images/nodata_tip.jpg" alt="">
      <p>该商店内没有相关的商品哦~</p>
      <p>更多商品开发中，敬请期待</p>
    </div>

    <!--删除搜索历史记录的提示-->
    <div class="delete_tip" v-if="history_tip">
      <div class="tip_content">
        <h3>确定删除历史记录？</h3>
        <button class="no_btn" @click="history_tip=false">否</button>
        <button class="yes_btn" @click="cancelHistory">是</button>
      </div>
    </div>

    <v-navfooter></v-navfooter>

    <!--底部购物车-->
    <v-footercart></v-footercart>

  </div>

</template>

<script>
  import '../css/search.scss';

  //引入组件
  import NavFooter from './public/NavFooter';
  import FooterCart from './public/FooterCart';

  //引入自定义组件
  import Config from '../../model/config';
  import Storage from '../../model/storage';

  export default {
    data() {
      return {
        uid: Storage.get('uid'),
        apiUrl: Config.apiUrl,
        msg: '',
        food_flag: false,
        search_flag: true,
        tip_flag: false,
        history_tip: false,
        list: [],
        history_list: [],
        input_flag: true
      }
    },
    methods: {
      //获取搜索的商品列表，如果没有则显示提示信息
      getList() {
        if (this.input_flag) {
          this.getHistoryData();
          let msg = this.msg.replace(/\s*/g, "");//去掉输入内容全部空格
          if (msg == '') {
            this.food_flag = false;
            this.tip_flag = false;
            this.search_flag = true;
            if (this.$route.query.searchMsg) {
              location.hash = '#/search';
            }
            return;
          }
          let url = this.apiUrl + 'api/getSearchList?msg=' + msg + '&uid=' + this.uid;
          this.$http.get(url).then(res => {
            if (res.body.code == 0) {//表示没有搜索到商品
              this.search_flag = false;
              this.food_flag = false;
              this.tip_flag = true;
            } else if (res.body.code == 1) {//搜索到了商品
              this.search_flag = false;
              this.tip_flag = false;
              this.food_flag = true;
              this.list = res.body.result;
            }
          }, err => {
            console.log(err);
          })
        }
      },
      //菜品详情页
      getContent(_id) {
        let path = this.$route.path;
        this.$router.push({path: '/content?id=' + _id + '&path=' + path + '&msg=' + this.msg});
      },
      //点击热门搜索中的内容，进行搜索列表渲染
      getSearchList(e) {
        this.msg = $(e.target).text();
        this.getList();
      },
      //历史记录
      getHistoryData() {
        let url = this.apiUrl + 'api/getHistory?uid=' + this.uid;
        this.$http.get(url).then(res => {
          if (res.body.code == 0) {//没有历史搜索记录
            $('.history_search').hide();
          } else {
            this.history_list = res.body.result
          }
        }, err => {
          console.log(err);
        })
      },
      //删除历史记录
      cancelHistory() {
        let url = this.apiUrl + 'api/cancelHistory?uid=' + this.uid;
        this.$http.get(url).then(res => {
          if (res.body.success == 'true') {//删除成功
            this.history_tip = false;
            this.getHistoryData();
          }
        }, err => {
          console.log(err);
        })
      },
      preventInput() {
        //搜索删除功能中的难点：
        //表单的input事件不管是输入还是delete都会触发，那么此时搜索历史中就会出现单个的字，这不是想要的，所以要在触发键盘的
        //delete按键时禁止触发input事件，此时就要考虑两点：一是表单事件的触发顺序（onfocus,onkeydown,onkeypress,oninput
        // onkeyup,onchange,onblur）;选择合适时间的事件，要在oninput之前触发；二是删除到最后一个字符长度时要恢复input事件
        this.input_flag = false;
        if (this.msg.length <= 1) {
          this.input_flag = true;
        }
      }
    },
    components: {
      'v-navfooter': NavFooter,
      'v-footercart': FooterCart
    },
    mounted() {
      this.getHistoryData();
      let searchMsg = this.$route.query.searchMsg;
      if (searchMsg != undefined) {
        this.msg = searchMsg;
        this.getList();
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
