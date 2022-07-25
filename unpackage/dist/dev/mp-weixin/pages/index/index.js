"use strict";
var common_vendor = require("../../common/vendor.js");
require("../../app.js");
var common_http = require("../../common/http.js");
require("../../store/index.js");
require("../../common/config.js");
const _sfc_main = {
  data() {
    return {
      topList: []
    };
  },
  onLoad() {
    this.getList();
  },
  methods: {
    handleToList(value) {
      common_vendor.index.navigateTo({
        url: `/pages/list/list?id=${value}`
      });
    },
    async getList() {
      const data = await common_http.myRequest({ url: "/toplist/detail" });
      this.topList = data.data.list;
    },
    handleToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/search"
      });
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
  return {
    a: common_vendor.p({
      title: "\u4E0D\u77E5\u540D\u7684\u5C0F\u97F3\u4E50",
      icon: false
    }),
    b: common_vendor.o((...args) => $options.handleToSearch && $options.handleToSearch(...args)),
    c: common_vendor.f($data.topList, (item, index, i0) => {
      return {
        a: item.coverImgUrl,
        b: common_vendor.t(item.updateFrequency),
        c: common_vendor.f(item.tracks, (item2, index2, i1) => {
          return {
            a: common_vendor.t(index2 + 1),
            b: common_vendor.t(item2.first),
            c: common_vendor.t(item2.second),
            d: index2
          };
        }),
        d: index,
        e: common_vendor.o(($event) => $options.handleToList(item.id))
      };
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-57280228"], ["__file", "E:/WebCase/Uni-app/NetEaseCloudMusic/neteaseMusic/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
