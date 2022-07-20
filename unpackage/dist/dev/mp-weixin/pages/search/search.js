"use strict";
var common_vendor = require("../../common/vendor.js");
require("../../app.js");
var common_http = require("../../common/http.js");
require("../../common/config.js");
const _sfc_main = {
  data() {
    return {
      searchHots: [],
      searchWords: "",
      searchHistory: [],
      searchType: 1,
      searchlist: [],
      searchSuggests: []
    };
  },
  onLoad() {
    this.searchHot();
    common_vendor.index.getStorage({
      key: "searchHistory",
      success: (res) => {
        this.searchHistory = res.data;
      }
    });
  },
  methods: {
    async searchHot() {
      const res = await common_http.myRequest({ url: `/search/hot/detail` });
      this.searchHots = res.data.data;
    },
    async searchWord(value) {
      const res = await common_http.myRequest({ url: `/search?keywords=${value}` });
      this.searchlist = res.data.result.songs;
      this.searchType = 2;
      common_vendor.index.hideLoading();
    },
    async searchSuggest(value) {
      const res = await common_http.myRequest({ url: `/search/suggest?keywords=${value}&type=mobile` });
      this.searchSuggests = res.data.result.allMatch;
      this.searchType = 3;
    },
    handleToWord(value) {
      this.searchWords = value;
      this.handleToSearch(value);
      common_vendor.index.showLoading({
        title: "\u73A9\u547D\u52A0\u8F7D\u4E2D...",
        icon: "loading",
        mask: true
      });
    },
    handleToSearch(value) {
      this.searchHistory.unshift(value);
      this.searchHistory = [...new Set(this.searchHistory)];
      if (this.searchHistory.length > 10) {
        this.searchHistory.length = 10;
      }
      common_vendor.index.setStorage({
        key: "searchHistory",
        data: this.searchHistory
      });
      common_vendor.index.showLoading({
        title: "\u73A9\u547D\u52A0\u8F7D\u4E2D...",
        icon: "loading",
        mask: true
      });
      this.getSearchList(value);
    },
    handleToClear() {
      common_vendor.index.clearStorage({
        key: "searchHistory",
        success: (res) => {
          this.searchHistory = [];
        }
      });
    },
    getSearchList(value) {
      this.searchWord(value);
    },
    handleToClose() {
      this.searchWords = "";
      this.searchType = 1;
    },
    handleToDetail(valueId) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${valueId}`
      });
    },
    handleToSuggest(e) {
      let value = e.detail.value;
      if (!value) {
        this.searchType = 1;
        return;
      }
      this.searchSuggest(value);
    }
  }
};
if (!Array) {
  const _easycom_musichead2 = common_vendor.resolveComponent("musichead");
  _easycom_musichead2();
}
const _easycom_musichead = () => "../../components/musichead/musichead.js";
if (!Math) {
  _easycom_musichead();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "\u6B4C\u5355",
      icon: true,
      iconblack: true
    }),
    b: common_vendor.o(($event) => $options.handleToSearch($data.searchWords)),
    c: common_vendor.o([($event) => $data.searchWords = $event.detail.value, (...args) => $options.handleToSuggest && $options.handleToSuggest(...args)]),
    d: $data.searchWords,
    e: $data.searchType !== 1,
    f: common_vendor.o((...args) => $options.handleToClose && $options.handleToClose(...args)),
    g: $data.searchType === 1
  }, $data.searchType === 1 ? {
    h: common_vendor.o((...args) => $options.handleToClear && $options.handleToClear(...args)),
    i: common_vendor.f($data.searchHistory, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.o(($event) => $options.handleToWord(item))
      };
    }),
    j: common_vendor.f($data.searchHots, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.searchWord),
        c: item.iconUrl,
        d: common_vendor.t(item.content),
        e: common_vendor.t(item.score),
        f: index,
        g: common_vendor.o(($event) => $options.handleToWord(item.searchWord))
      };
    })
  } : $data.searchType === 2 ? {
    l: common_vendor.f($data.searchlist, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.artists[0].name),
        c: common_vendor.t(item.album.name),
        d: index,
        e: common_vendor.o(($event) => $options.handleToDetail(item.id))
      };
    })
  } : {}, {
    k: $data.searchType === 2,
    m: $data.searchType === 3
  }, $data.searchType === 3 ? {
    n: common_vendor.t($data.searchWords),
    o: common_vendor.f($data.searchSuggests, (item, index, i0) => {
      return {
        a: common_vendor.t(item.keyword),
        b: index,
        c: common_vendor.o(($event) => $options.handleToWord(item.keyword))
      };
    })
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4cedc0c6"], ["__file", "E:/WebCase/Uni-app/NetEaseCloudMusic/neteaseMusic/pages/search/search.vue"]]);
wx.createPage(MiniProgramPage);
