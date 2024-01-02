<template>
  <view>
    <swiper :autoplay="true" :circular="true" :duration="1000" :indicator-dots="true" :interval="3000">
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id" class="swiper-item">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <view class="nav-list">
      <view v-for="(item,i) in navList" :key="i" class="nav-item" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>

    <view class="floor-list">
      <view v-for="(item,i) in floorList" :key="i" class="floor-item">
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <view class="floor-img-box">
          <navigator :url="item.product_list[0].url" class="left-img-box">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
                   mode="widthFix"></image>
          </navigator>
          <view class="right-img-box">
            <navigator v-for="(item2,i2) in item.product_list" v-if="i2 !== 0" :key="i2" :url="item2.url"
                       class="right-img-item">
              <image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>

  </view>


</template>

<script>
export default {
  data() {
    return {
      swiperList: [],
      navList: [],
      floorList: []
    };
  },
  onLoad() {
    this.getSwiperList();
    this.getNavList();
    this.getFloorList();
  },
  methods: {
    async getSwiperList() {
      const {data: res} = await uni.$http.get('/api/public/v1/home/swiperdata');
      if (res.meta.status !== 200) {
        return uni.$showMsg();
      }
      this.swiperList = res.message;
    },

    async getNavList() {
      const {data: res} = await uni.$http.get("/api/public/v1/home/catitems");
      if (res.meta.status !== 200) {
        return uni.$showMsg();
      }
      this.navList = res.message;
    },

    navClickHandler(item) {
      if (item.name === "分类") {
        uni.switchTab({
          url: "/pages/cate/cate"
        });
      }
    },

    async getFloorList() {
      const {data: res} = await uni.$http.get("/api/public/v1/home/floordata");
      if (res.meta.status !== 200) {
        return uni.$showMsg();
      }
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = "/subpkg/goods_list/goods_list?" + prod.navigator_url.split('?')[1];
        });
      });
      this.floorList = res.message;
    }
  }
}
</script>

<style lang="scss">
swiper {
  height: 300rpx;

  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}

.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

.floor-title {
  width: 100%;
  height: 60rpx;
}

.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
</style>
