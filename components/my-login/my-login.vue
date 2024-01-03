<template>
  <view class="login-container">
    <uni-icons color="#AFAFAF" size="100" type="contact-filled"></uni-icons>
    <button class="btn-login" open-type="getUserInfo" type="primary" @getuserinfo="getUserInfo">一键登录</button>
    <!--    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>-->
    <text class="tip-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import UniIcons from "../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";

export default {
  name: "my-login",
  components: {UniIcons},
  data() {
    return {};
  },
  computed: {
    ...mapState('m_user', ['redirectInfo'])
  },
  methods: {
    ...mapMutations('m_user', ['updateUserInfo', "updateToken", 'updateRedirectInfo']),
    getUserInfo(e) {
      if (e.detail.errMsg === "getUserInfo:fail auth deny") {
        return uni.$showMsg("您取消了授权")
      }
      this.updateUserInfo(e.detail.userInfo)
      this.getToken(e.detail)
    },
    async getToken(info) {
      const [err, res] = await uni.login();
      if (err || res.errMsg !== "login:ok") {
        return uni.$showMsg("登录失败")
      }

      const query = {
        code: res.code,
        encryptedData: info.encryptedData,
        iv: info.iv,
        rawData: info.rawData,
        signature: info.signature
      }
      let {data: loginReuslt} = await uni.$http.post("/api/public/v1/users/wxlogin", query);
      if (loginReuslt.meta.status === 200) {
        return uni.$showMsg("登录成功");
      }
      loginReuslt.message = {
        token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnP"
      };
      this.updateToken(loginReuslt.message.token);
      this.navigateBack();
    },
    navigateBack() {
      if (this.redirectInfo && this.redirectInfo.openType === "switchTab") {
        uni.switchTab({
          url: this.redirectInfo.from,
          complete: () => {
            this.updateRedirectInfo(null)
          }
        })
      }
    },

  }
}
</script>

<style lang="scss">
.login-container {
  height: 750rpx;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 40px;
    background-color: white;
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 100%;
    transform: translateY(50%);
  }

  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #C00000;
  }

  .tip-text {
    font-size: 12px;
    color: grey;
  }
}
</style>