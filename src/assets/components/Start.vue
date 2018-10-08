<template>
  <div id="start">
    <div class="loading" v-show="!showLoading">
      <img src="../images/loading.gif" alt="">
    </div>
    <div class="start_content" v-show="showLoading">
      <div class="start_header">
        <img src="../images/canju.png" alt="">
        <span>用餐人数</span>
      </div>
      <p class="notice">请选择正确的用餐人数，小二马上给您送餐具</p>
      <div class="content">
        <ul class="user_list clearfix">
          <li><span class="active">1人</span></li>
          <li><span>2人</span></li>
          <li><span>3人</span></li>
          <li><span>4人</span></li>
          <li><span>5人</span></li>
          <li><span>6人</span></li>
          <li><span>7人</span></li>
          <li><span>8人</span></li>
          <li><span>9人</span></li>
          <li><span>10人</span></li>
          <li><span>11人</span></li>
          <li><span>12人</span></li>
        </ul>
        <div class="mode">
          <ul class="mode_list clearfix">
            <li><span class="active">堂食</span></li>
            <li><span>外带</span></li>
          </ul>
        </div>
        <div class="remarks">
          <p>备注:</p>
          <input type="text" name="p_mark" id="p_mark" v-model="p_mark">
        </div>
      </div>
      <router-link to="/home">
        <div class="start_btn" @click="addUserInfo">
          <span>开始点菜</span>
        </div>
      </router-link>
    </div>
  </div>

</template>

<script>
  import '../css/start.scss';

  //引入自定义模块
  import Config from '../../model/config';
  import Storage from '../../model/storage';

  export default {
    data() {
      return {
        apiUrl: Config.apiUrl,
        p_num: '',
        p_mode: '堂食',
        p_mark: '',
        uid: Storage.get('uid'),
        showLoading:false
      }
    },
    methods: {
      userInfoEvent() {
        //选取用餐人数
        let that = this;
        let userLis = $('.user_list li').find('span');
        let modeLis = $('.mode_list li').find('span')
        for (let i = 0; i < userLis.length; i++) {
          $(userLis[i]).on('click', function () {
            $(this).parent().siblings('li').find('span').removeClass('active');
            $(this).addClass('active');
            that.p_num = $(this).text();
          });
        }
        ;

        //选择用餐方式
        for (let i = 0; i < modeLis.length; i++) {
          $(modeLis[i]).on('click', function () {
            $(this).parent().siblings('li').find('span').removeClass('active');
            $(this).addClass('active');
            that.p_mode = $(this).text();
          });
        }
        ;

      },
      addUserInfo() {//提交用户信息
        let url = this.apiUrl + 'api/addPeopleInfo';
        this.$http.post(url, {
          uid: this.uid,
          p_num: this.p_num,
          p_mode: this.p_mode,
          p_mark: this.p_mark
        }).then(res => {
          if (res.body.success == 'true') {
            this.$socket.emit('mealsInfo', 'mealsInfo');
          } else {
            alert('选取失败，请重试！');
          }
        }, err => {
          console.log(err);
        })
      },
      requestUserInfo() {//获取用户信息
        let orderUrl = this.apiUrl + 'api/getOrderInfo?uid=' + this.uid;
        let url = this.apiUrl + 'api/peopleInfoList?uid=' + this.uid;
        this.$http.get(url).then(res => {
          //请求完数据之后loading图片消失
          this.showLoading = true;
          //如果已经有人选取了用餐人数，直接跳转到home页面
          if (res.body.result.length > 0) {
            this.$http.get(orderUrl).then(res=>{
              if(res.body.code == '1'){//表示有已经提交待支付的订单
                this.$router.push({path:'/orderWait'});
              }else if(res.body.code == '0'){//表示没有提交待支付的订单
                this.$router.push({path:'/home'});
              }
            })
          }
        }, err => {
          console.log(err);
        })
      }
    },
    created(){
      this.requestUserInfo();
    },
    mounted() {
      this.userInfoEvent();
    }
  }
</script>

<style lang="scss" scoped>

</style>
