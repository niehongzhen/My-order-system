<template>
  <div id="start">
    <div class="start_content">
      <div class="start_header">
        <img src="../images/canju.png" alt="">
        <span>用餐人数</span>
      </div>
      <p class="notice">请选择正确的用餐人数，小二马上给您送餐具</p>
      <div class="content">
        <ul class="user_list clearfix">
          <li><span>1人</span></li>
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
        <div class="start_btn" @click="saveUserInfo">
          <span style="margin:2.5rem auto;">保存</span>
        </div>
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
        uid:Storage.get('uid')
      }
    },
    sockets:{
      mealsInfo:function(uid){
        this.requestUserInfo(uid)
      }
    },
    methods: {
      userInfoEvent() {
        //选取用餐人数
        let that = this;//保存this
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
      saveUserInfo() {//提交用户信息
        let url = this.apiUrl + 'api/addPeopleInfo';
        this.$http.post(url, {
          uid: this.uid,
          p_num: this.p_num,
          p_mode: this.p_mode,
          p_mark: this.p_mark
        }).then(res => {
          if(res.body.success == 'true'){
            this.$router.push({path : '/cart'});
            this.$socket.emit('mealsInfo','mealsInfo')
          }
        }, err => {
          console.log(err);
        })
      },
      requestUserInfo() {//初始化时获取用户信息
        let url = this.apiUrl + 'api/peopleInfoList?uid=' + this.uid;
        this.$http.get(url).then(res => {
          if (res.body.success == 'true') {
            this.p_num = res.body.result[0].p_num;
            this.p_mode = res.body.result[0].p_mode;
            this.p_mark = res.body.result[0].p_mark;
            let userLis = $('.user_list li').find('span');
            let modeLis = $('.mode_list li').find('span');
            for (let i = 0; i < userLis.length; i++) {
              $(userLis[i]).removeClass('active');
              if ($(userLis[i]).text() == this.p_num) {
                $(userLis[i]).addClass('active');
              }
            }
            ;
            for (let j = 0; j < modeLis.length; j++) {
              $(modeLis[j]).removeClass('active');
              if ($(modeLis[j]).text() == this.p_mode) {
                $(modeLis[j]).addClass('active');
              }
            }
          }
        }, err => {
          console.log(err);
        })
      }
    },
    mounted() {
      this.userInfoEvent();
      this.requestUserInfo();
    }
  }
</script>

<style lang="scss" scoped>

</style>
