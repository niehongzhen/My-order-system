<template>
  <div id="home">
    <header class="menu_header">
      <input type="search" class="search"  v-on:focus="jumpPage" placeholder="请输入菜品名">
      <img src="../images/sousuo.png" alt="搜索">
      <span class="search_text">搜索</span>
    </header>
    <div class="menu_content">
      <div class="item" v-for="item in list" :id="item._id">
        <h3 class="item_cate">{{item.title}}</h3>
        <ul class="item_list clearfix">
          <li v-for="value in item.list" @click="getContent(value._id,value.cate_id)">
            <div class="inner">
              <img class="item_img" :src="apiUrl + value.img_url" alt="">
              <p class="title">{{value.title}}</p>
              <p class="price">￥{{value.price}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!--左侧边栏分类-->
    <div class="left_cate" id="left_cate" ref="left_cate">
      <ul>
        <li v-for="(item,index) in list">
          <a :href="'#' + item._id" @click="active($event)" :class="{'active':index==0}">{{item.title}}</a>
        </li>
      </ul>
      <div class="cate_btn" id="cate_btn" @click="slideShow">
        <img src="../images/nav.png" alt="">
        <p>菜单</p>
      </div>
    </div>

    <!--遮罩层-->
    <div class="bg_mask" id="bg_mask" ref="bg_mask"></div>

    <!--底部导航-->
    <v-navfooter></v-navfooter>


    <!--底部购物车-->
    <v-footercart></v-footercart>

  </div>

</template>

<script>
  import '../css/home.scss';

  //引入组件
  import NavFooter from './public/NavFooter';
  import FooterCart from './public/FooterCart';

  //引入自定义模块
  import config from '../../model/config';

  export default {
    data() {
      return {
        flag: true,
        apiUrl: config.apiUrl,
        list: []
      }
    },
    methods: {
      slideShow() {
        //获取左侧边栏
        var leftCate = this.$refs.left_cate;
        //获取遮罩层
        var bgMask = this.$refs.bg_mask;

        if (this.flag) {
          this.flag = false;
          leftCate.style.transform = 'translate(0,0)';
          bgMask.style.display = 'block';
        } else {
          this.flag = true;
          leftCate.style.transform = 'translate(-100%,0)';
          bgMask.style.display = 'none';
        }
      },
      requestData() {
        let url = this.apiUrl + 'api/productlist';
        this.$http.get(url).then(res => {
          this.list = res.body.result;
        }, error => {
          console.log(error);
        });
      },
      getContent(id, cateId) {
        var path = this.$route.path;
        var scrollTop = document.documentElement.scrollTop;
        this.$router.push({path: '/content?id=' + id + '&cateId=' + cateId + '&scrollTop=' + scrollTop + '&path=' + path});
      },
      active(event) {
        $(event.target).parent().siblings('li').find('a').removeClass('active');
        $(event.target).addClass('active');
      },
      //监听页面滚动事件
      scrollEvent() {
        window.onscroll = function () {
          var scrollTop = document.documentElement.scrollTop;
          var itemCatesDom = document.querySelectorAll('.item_cate');
          var leftCateDom = document.querySelectorAll('#left_cate a');
          var gap = [];
          itemCatesDom.forEach((item, key) => {
            var temp = {};
            temp.key = key;
            temp.value = Math.abs(scrollTop - item.offsetTop);
            gap.push(temp);
          });
          if (gap.length > 0) {
            var minGap = gap[0].value;
            var minKey = gap[0].key;
            gap.forEach(item => {
              if (item.value < minGap) {
                minGap = item.value;
                minKey = item.key;
              }
            });
            itemCatesDom[minKey].innerText;
            leftCateDom.forEach(item => {
              item.className = '';
            });
            leftCateDom[minKey].className = 'active';
          }
        }
      },
      initPosition() {
        let cateId = this.$route.query.cateId;
        let scrollTop = this.$route.query.scrollTop + 'px';
        let leftCateDom = document.querySelectorAll('#left_cate a');
        leftCateDom.forEach(item => {
          $(item).removeClass('active');
          if ($(item).attr('href') == '#' + cateId) {
            $(item).addClass('active');
          }
        });
        $("html,body").animate({"scrollTop": scrollTop}, 50);
      },
      jumpPage(){
        this.$router.push({path:'/search'});
      }
    },
    components: {
      'v-navfooter': NavFooter,
      'v-footercart': FooterCart
    },
    mounted() {
      this.requestData();
      this.scrollEvent();
      this.initPosition();
    }
  }
</script>

<style lang="scss" scoped>
  .active {
    background: #009944;
    color: #fff;
  }

</style>
