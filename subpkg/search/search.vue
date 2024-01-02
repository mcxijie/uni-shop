<template>
  <view>
    <view class="search-box">
      <uni-search-bar :radius="100" cancel-button="none" @input="input"></uni-search-bar>
    </view>

    <view v-if="searchResult.length !== 0" class="sugg-list">
      <view v-for="(item,i) in searchResult" :key="i" class="sugg-item" @click="gotoDetail(item)">
        <view class="goods-name">{{ item.goods_name }}</view>
        <uni-icons size="16" type="arrowright"></uni-icons>
      </view>
    </view>

    <view v-else class="history-box">
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons size="17" type="trash" @click="clean"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag v-for="(item,i) in histories" :key="i" :text="item" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
import UniIcons from "../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import UniTag from "../../uni_modules/uni-tag/components/uni-tag/uni-tag.vue";

export default {
  components: {UniTag, UniIcons},
  data() {
    return {
      timer: null,
      kw: "",
      searchResult: [],
      historyList: []
    };
  },
  onLoad() {
    this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]');
  },
  methods: {
    input(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.kw = e;
        this.getSearchList();
      }, 500);
    },
    async getSearchList() {
      if (this.kw.length === 0) {
        this.searchResult = [];
        return;
      }

      const {data: res} = await uni.$http.get("/api/public/v1/goods/qsearch", {query: this.kw});
      if (res.meta.status !== 200) {
        return uni.$showMsg();
      }
      this.searchResult = res.message;
      this.saveSearchHistory();
    },
    gotoDetail(item) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
      })
    },
    saveSearchHistory() {
      // this.historyList.push(this.kw);
      const set = new Set(this.historyList);
      set.delete(this.kw);
      set.add(this.kw);
      this.historyList = Array.from(set);
      uni.setStorageSync('kw', JSON.stringify(this.historyList));
    },
    clean() {
      this.historyList = [];
      uni.setStorageSync('kw', "[]");
    },
    gotoGoodsList(kw) {
      uni.navigateTo({
        url: '/subpkg/goods_list/goods_list?query=' + kw
      })
    }
  },
  computed: {
    histories() {
      return [...this.historyList].reverse();
    }
  }
}
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}

.sugg-list {
  padding: 0 5px;

  .sugg-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;

    .goods-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
