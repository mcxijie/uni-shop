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

    <view class="btn-settle">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "my-settle",
  data() {
    return {};
  },
  computed: {
    ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
    isFullCheck() {
      return this.total === this.checkedCount;
    }
  },
  methods: {
    ...mapMutations('m_cart', ['updateAllGoodsState']),
    changeAllState() {
      this.updateAllGoodsState(!this.isFullCheck);
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