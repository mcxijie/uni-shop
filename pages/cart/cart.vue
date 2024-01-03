<template>
  <view v-if="cart.length !== 0" class="cart-container">
    <my-address></my-address>

    <view class="cart-title">
      <uni-icons size="18" type="shop"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>

    <uni-swipe-action>
      <block v-for="(goods,i) in cart" :key="i">
        <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
          <my-goods :goods="goods" :show-num="true" :show-radio="true" @radio-change="radioChangeHandler"
                    @num-change="numChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <my-settle></my-settle>
  </view>

  <view v-else class="empty-cart">
    <image class="empty-img" src="/static/cart_empty@2x.png"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
import badgeMix from "@/mixins/tabbar-badge.js"
import {mapState, mapMutations} from 'vuex'
import MyGoods from "../../components/my-goods/my-goods.vue";
import UniSwipeAction from "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue";
import UniSwipeActionItem
  from "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.vue";
import MyAddress from "../../components/my-address/my-address.vue";

export default {
  components: {MyAddress, UniSwipeActionItem, UniSwipeAction, MyGoods},
  mixins: [badgeMix],
  computed: {
    ...mapState("m_cart", ["cart"])
  },
  data() {
    return {
      options: [{
        text: "删除",
        style: {
          backgroundColor: "#C00000"
        }
      }]
    };
  },
  methods: {
    ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
    radioChangeHandler(e) {
      this.updateGoodsState(e);
    },
    numChangeHandler(e) {
      this.updateGoodsCount(e);
    },
    swipeItemClickHandler(goods) {
      this.removeGoodsById(goods.goods_id);
    }
  }

}
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
}

.cart-title {
  width: 750rpx;
  box-sizing: border-box;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;

  .cart-title-text {
    font-size: 14px;
    margin-left: 10px;
  }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;

  .empty-img {
    width: 90px;
    height: 90px;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}

</style>
