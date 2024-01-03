<template>
  <view>
    <view v-if="JSON.stringify(address) === '{}'" class="address-choose-box">
      <button class="btnChooseAddress" size="mini" type="primary" @click="chooseAddress">请选择收货地址+</button>
    </view>

    <view v-else class="address-info-box" @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：{{ address.userName }}</view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{ address.telNumber }}</view>
          <uni-icons size="16" type="arrowright"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{ addstr }}</view>
      </view>
    </view>

    <image class="address-border" src="/static/cart_border@2x.png"></image>
  </view>
</template>

<script>
import {mapState, mapMutations, mapGetters} from "vuex"
import UniIcons from "../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";

export default {
  name: "my-address",
  components: {UniIcons},
  data() {
    return {
      // address:{}
    };
  },
  methods: {
    ...mapMutations('m_user', ['updateAddress']),
    async chooseAddress() {
      const [err, succ] = await uni.chooseAddress().catch(err => err);
      if (err === null && succ.errMsg === "chooseAddress:ok") {
        // this.address = succ;
        this.updateAddress(succ);
      }

      if (err && (err.errMsg === "chooseAddress:fail auth deny") || (err.errMsg === "chooseAddress:fail authorize no response")) {
        this.reAuth()
      }
    },
    async reAuth() {
      const [err2, confirmResult] = await uni.showModal({
        content: '请先授权',
        confirmText: '确认',
        cancelText: '取消',
      })

      if (err2) return;

      if (confirmResult.cancel) {
        return uni.$showMsg("您取消了授权!");
      }
      if (confirmResult.confirm) {
        return uni.openSetting({
          success: (settingResult) => {
            if (!settingResult.authSetting["scope.address"]) {
              return uni.$showMsg("您取消了授权!");
            }
            if (settingResult.authSetting["scope.address"]) {
              return uni.$showMsg("授权成功!");
            }
          }
        })
      }
    }
  },
  computed: {
    ...mapState('m_user', ['address']),
    ...mapGetters('m_user', ['addstr'])
  }
}
</script>

<style lang="scss">
.address-border {
  display: block;
  width: 100%;
  height: 5px;
}

.address-choose-box {
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;

  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      justify-content: space-between;

    }
  }

  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>