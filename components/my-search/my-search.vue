<template>
  <view :style="{'background-color': bgcolor}" class="my-search-container" @click="searchBoxHandler">
    <view :style="{'border-radius' : radius + 'px'}" class="my-search-box">
      <uni-icons size="17" type="search"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
import UniIcons from "../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";

export default {
  name: "my-search",
  components: {UniIcons},
  props: {
    bgcolor: {
      type: String,
      default: "#c00000"
    },
    radius: {
      type: Number,
      default: 18
    }
  },
  data() {
    return {};
  },
  methods: {
    searchBoxHandler() {
      this.$emit("click");
    }
  }
}
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  //background-color: #c00000;
  display: flex;
  align-items: center;
  padding: 0 10px;

  .my-search-box {
    height: 36px;
    background-color: #FFFFFF;
    //border-radius: 18px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>