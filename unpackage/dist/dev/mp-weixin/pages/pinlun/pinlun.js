"use strict";
require("../../app.js");
var common_http = require("../../common/http.js");
var common_vendor = require("../../common/vendor.js");
require("../../store/index.js");
require("../../common/config.js");
const musichead = () => "../../components/musichead/musichead.js";
const _sfc_main = {
  data() {
    return {
      name: "\u8BC4\u8BBA\u533A",
      songComment: []
    };
  },
  components: {
    musichead
  },
  onLoad(e) {
    console.log(e.id);
    this.getComment(e.id);
  },
  methods: {
    async getComment(id) {
      const res = await common_http.myRequest({ url: `/comment/music?id=${id}` });
      this.songComment = res.data.hotComments;
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
      title: $data.name,
      icon: "true",
      color: "white"
    }),
    b: common_vendor.f($data.songComment, (item, index, i0) => {
      return {
        a: item.user.avatarUrl,
        b: common_vendor.t(item.user.nickname),
        c: common_vendor.t(item.timeStr),
        d: common_vendor.t(item.likedCount),
        e: common_vendor.t(item.content),
        f: index
      };
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-94569874"], ["__file", "E:/WebCase/Uni-app/NetEaseCloudMusic/neteaseMusic/pages/pinlun/pinlun.vue"]]);
wx.createPage(MiniProgramPage);
