<template>
  <view class="my-settle-coontainer">
    <label class="radio" @click="changeAllState">
      <radio :checked="isFullCheck" color="#C00000"/>
      <text>全选</text>
    </label>

    <view class="amount-box">
      合计:
      <text class="amount">￥{{ checkedGoodsAmount }}</text>
    </view>

    <view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: "my-settle",
  data() {
    return {
      seconds: 3,
      timer: null
    };
  },
  computed: {
    ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
    ...mapGetters('m_user', ['addstr']),
    ...mapState('m_user', ['token']),
    ...mapState('m_cart', ['cart']),
    isFullCheck() {
      return this.total === this.checkedCount;
    }
  },
  methods: {
    ...mapMutations('m_cart', ['updateAllGoodsState']),
    ...mapMutations('m_user', ['updateRedirectInfo']),
    changeAllState() {
      this.updateAllGoodsState(!this.isFullCheck);
    },
    settlement() {
      if (!this.checkedCount) {
        return uni.$showMsg("请选择商品")
      }
      if (!this.addstr) {
        return uni.$showMsg("请选择收货地址")
      }
      if (!this.token) {
        // return uni.$showMsg("请先登录")
        return this.delayNavigate()
      }

      this.payOrder()
    },
    async payOrder() {
      const orderInfo = {
        // order_price: this.checkedGoodsAmount,
        order_price: 0.01,
        consignee_addr: this.addstr,
        goods: this.cart.filter(x => x.goods_state).map(x => ({
          goods_id: x.goods_id,
          goods_number: x.goods_count,
          goods_price: x.goods_price
        }))
      }
      let {date: res} = await uni.$http.post("/api/public/v1/my/orders/create", orderInfo);
      res = {
        "message": {
          "order_number": "HMDD20190802000000000422"
        },
        "meta": {
          "msg": "创建订单成功",
          "status": 200
        }
      }
      if (res.meta.status !== 200) {
        return uni.$showMsg("创建订单失败")
      }
      const orderNumber = res.message.order_number;
      let {data: res2} = await uni.$http.post("/api/public/v1/my/orders/req_unifiedorder", {order_number: orderNumber});
      res2 = {
        "message": {
          "pay": {
            "timeStamp": "1564729859",
            "nonceStr": "5d44f5f3a9c3e",
            "package": "prepay_id=wx02162419591294f9f3f1f6b41013224000",
            "signType": "MD5",
            "paySign": "B3F2B4F2B4F2B4F2B4F2B4F2B4F2B4F2"
          }
        },
        "meta": {
          "msg": "获取支付参数成功",
          "status": 200
        }
      }
      if (res2.meta.status !== 200) {
        return uni.$showMsg("获取支付参数失败")
      }
      const payInfo = res2.message.pay;

      const [err, succ] = await uni.requestPayment(payInfo);
      if (err) {
        return uni.$showMsg("订单未支付");
      }
      let {data: res3} = await uni.$http.post("/api/public/v1/my/orders/chkOrder", {order_number: orderNumber});
      res3 = {
        "message": {
          "pay": {
            "timeStamp": "1564729859",
            "nonceStr": "5d44f5f3a9c3e",
            "package": "prepay_id=wx02162419591294f9f3f1f6b41013224000",
            "signType": "MD5",
            "paySign": "B3F2B4F2B4F2B4F2B4F2B4F2B4F2B4F2"
          }
        },
        "meta": {
          "msg": "获取支付参数成功",
          "status": 200
        }
      }

      if (res3.meta.status !== 200) {
        return uni.$showMsg("订单未支付")
      }
      uni.showToast({
        title: "支付成功",
        icon: 'success'
      })
    },
    delayNavigate() {
      this.seconds = 3;
      this.showTip(this.seconds)
      this.timer = setInterval(() => {
        this.seconds--;
        if (this.seconds <= 0) {
          clearInterval(this.timer)
          uni.switchTab({
            url: '/pages/my/my',
            success: () => {
              this.updateRedirectInfo({
                openType: 'switchTab',
                from: '/pages/cart/cart'
              })
            }
          })
          return;
        }
        this.showTip(this.seconds);
      }, 1000)
    },
    showTip(n) {
      uni.showToast({
        title: "请先登录! " + n + "秒后跳转到登录页面",
        icon: 'none',
        mask: true,
        duration: 1500
      })
    }

  },
}
</script>

<style lang="scss">
.my-settle-coontainer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;

  .radio {
    display: flex;
    align-items: center;

    .radio-text {
      margin-left: 5px;
    }
  }

  .amount-box {
    .amount {
      color: #C00000;
      font-weight: bold;
    }
  }

  .btn-settle {
    background-color: #C00000;
    height: 50px;
    color: white;
    line-height: 50px;
    padding: 0 10px;
    min-width: 100px;
    text-align: center;
  }


}
</style>