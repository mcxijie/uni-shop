<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
import MyGoods from "../../components/my-goods/my-goods.vue";

export default {
  components: {MyGoods},
  data() {
    return {
      queryObj: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0,
      isloading: false
    };
  },
  onLoad(options) {
    this.queryObj.query = options.query || '';
    this.queryObj.cid = options.cid || '';

    this.getGoodsList();
  },
  methods: {
    async getGoodsList(cb) {
      this.isloading = true;
      const {data: res} = await uni.$http.get("/api/public/v1/goods/search", this.queryObj);
      this.isloading = false;
      cb && cb();
      if (res.meta.status !== 200) {
        return uni.$showMsg();
      }
      this.goodsList = [...this.goodsList, ...res.message.goods];
      this.total = res.message.total;
    },
    gotoDetail(goods) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
      })
    }
  },

  onReachBottom() {
    if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
      return uni.$showMsg("没有更多数据了");
    }
    if (this.isloading) return;
    this.queryObj.pagenum++;
    this.getGoodsList();
  },
  onPullDownRefresh() {
    this.queryObj.pagenum = 1;
    this.total = 0;
    this.isloading = false;
    this.goodsList = [];

    this.getGoodsList(() => uni.stopPullDownRefresh());
  }
}
</script>

<style lang="scss">

</style>
