"use strict";
var common_vendor = require("../../common/vendor.js");
require("../../app.js");
var common_http = require("../../common/http.js");
require("../../common/config.js");
const _sfc_main = {
  data() {
    return {
      playlist: {
        coverImgUrl: " ",
        creator: {
          avatarUrl: " "
        },
        trackCount: " "
      },
      privileges: [],
      isLoading: true
    };
  },
  onLoad(e) {
    common_vendor.index.showLoading({
      title: "\u73A9\u547D\u52A0\u8F7D\u4E2D...",
      icon: "loading",
      mask: true
    });
    this.isLoading = true;
    this.getList(e.id);
  },
  methods: {
    handleToDetail(value) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${value}`
      });
    },
    async getList(id) {
      const res = await common_http.myRequest({ url: `/playlist/detail?id=${id}` });
      this.playlist = res.data.playlist;
      this.privileges = res.data.privileges;
      this.isLoading = false;
      common_vendor.index.hideLoading();
    }
  },
  watch: {
    "playlist.playCount"(value) {
      if (value >= 1e4 && value <= 1e8) {
        value /= 1e3;
        this.playlist.playCount = value.toFixed(1) + "\u4E07";
      } else if (value > 1e8) {
        value /= 1e8;
        this.playlist.playCount = value.toFixed(1) + "\u4EBF";
      } else {
        this.playlist.playCount = value;
      }
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
    a: `url('${$data.playlist.coverImgUrl}')`,
    b: common_vendor.p({
      title: "\u6B4C\u5355",
      icon: true,
      color: "white"
    }),
    c: $data.playlist.coverImgUrl !== " "
  }, $data.playlist.coverImgUrl !== " " ? {
    d: $data.playlist.coverImgUrl
  } : {}, {
    e: common_vendor.t($data.playlist.playCount),
    f: common_vendor.t($data.playlist.name),
    g: $data.playlist.creator.avatarUrl !== " "
  }, $data.playlist.creator.avatarUrl !== " " ? {
    h: $data.playlist.creator.avatarUrl
  } : {}, {
    i: common_vendor.t($data.playlist.creator.nickname),
    j: common_vendor.t($data.playlist.description),
    k: common_vendor.t($data.playlist.trackCount),
    l: common_vendor.f($data.playlist.tracks, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.name),
        c: $data.privileges[index].flag > 60 && $data.privileges[index].flag < 70
      }, $data.privileges[index].flag > 60 && $data.privileges[index].flag < 70 ? {} : {}, {
        d: $data.privileges[index].maxbr === 999e3
      }, $data.privileges[index].maxbr === 999e3 ? {} : {}, {
        e: common_vendor.t(item.ar[0].name),
        f: common_vendor.t(item.al.name),
        g: index,
        h: common_vendor.o(($event) => $options.handleToDetail(item.id))
      });
    }),
    m: !$data.isLoading
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7d5e07c6"], ["__file", "E:/WebCase/Uni-app/NetEaseCloudMusic/neteaseMusic/pages/list/list.vue"]]);
wx.createPage(MiniProgramPage);
