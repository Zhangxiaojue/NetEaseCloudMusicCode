"use strict";
var common_vendor = require("../../common/vendor.js");
require("../../app.js");
var common_http = require("../../common/http.js");
require("../../common/config.js");
const musichead = () => "../../components/musichead/musichead.js";
const _sfc_main = {
  data() {
    return {
      songDetail: {
        al: {
          picUrl: " "
        }
      },
      songSimi: [],
      songComment: [],
      songLyric: [],
      lryicIndex: 0,
      iconPlay: "icon-zanting",
      isPlayRotate: true,
      timer: null,
      isLoading: true
    };
  },
  components: {
    musichead
  },
  onLoad(e) {
    common_vendor.index.showLoading({
      title: "\u73A9\u547D\u52A0\u8F7D\u4E2D...",
      icon: "loading"
    });
    this.isLoading = true;
    this.getDetail(e.id);
    this.getSime(e.id);
    this.getComment(e.id);
    this.getLyric(e.id);
    this.getUrl(e.id);
  },
  onUnload() {
    this.cancelLyricIndex();
  },
  onHide() {
    this.cancelLyricIndex();
  },
  methods: {
    async getDetail(ids) {
      const res = await common_http.myRequest({ url: `/song/detail?ids=${ids}` });
      this.songDetail = res.data.songs[0];
    },
    async getSime(id) {
      const res = await common_http.myRequest({ url: `/simi/song?id=${id}` });
      this.songSimi = res.data.songs;
    },
    async getComment(id) {
      const res = await common_http.myRequest({ url: `/comment/music?id=${id}` });
      this.songComment = res.data.hotComments;
    },
    async getLyric(id) {
      const res = await common_http.myRequest({ url: `/lyric?id=${id}` });
      let lyric = res.data.lrc.lyric;
      let re = /\[([^\]]+)\]([^\[]+)/g;
      var result = [];
      lyric.replace(re, ($0, $1, $2) => {
        result.push({ "time": this.formatTimeToSec($1), "lyric": $2 });
      });
      this.songLyric = result;
    },
    async getUrl(id) {
      const res = await common_http.myRequest({ url: `/song/url?id=${id}` });
      this.bgAudioManager = common_vendor.index.getBackgroundAudioManager();
      this.bgAudioManager.title = this.songDetail.name;
      this.bgAudioManager.src = res.data.data[0].url || "";
      this.bgAudioManager.onPlay(() => {
        this.iconPlay = "icon-zanting";
        this.isPlayRotate = true;
        this.listenLyricIndex();
      });
      this.bgAudioManager.onPause(() => {
        this.iconPlay = "icon-bofang";
        this.isPlayRotate = false;
        this.cancelLyricIndex();
      });
      this.isLoading = false;
      common_vendor.index.hideLoading();
    },
    formatTimeToSec(value) {
      let arr = value.split(":");
      return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1);
    },
    handleToplay() {
      if (this.bgAudioManager.paused) {
        this.bgAudioManager.play();
      } else {
        this.bgAudioManager.pause();
        this.cancelLyricIndex();
      }
    },
    listenLyricIndex() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        for (let i = 0; i < this.songLyric.length; i++) {
          if (this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i + 1].time) {
            this.lryicIndex = i;
          }
          if (this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time) {
            this.lryicIndex = this.songLyric.length - 1;
            break;
          }
        }
      }, 500);
    },
    cancelLyricIndex() {
      clearInterval(this.timer);
      this.timer = null;
    },
    handleToSimi(id) {
      this.getDetail(id);
      this.getSime(id);
      this.getComment(id);
      this.getLyric(id);
      this.getUrl(id);
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
    a: `url(${$data.songDetail.al.picUrl})`,
    b: common_vendor.p({
      title: $data.songDetail.name,
      icon: "true",
      color: "white"
    }),
    c: $data.songDetail.al.picUrl !== " "
  }, $data.songDetail.al.picUrl !== " " ? {
    d: $data.songDetail.al.picUrl,
    e: $data.isPlayRotate ? 1 : ""
  } : {}, {
    f: common_vendor.n($data.iconPlay),
    g: common_vendor.o((...args) => $options.handleToplay && $options.handleToplay(...args)),
    h: common_vendor.f($data.songLyric, (item, index, i0) => {
      return {
        a: common_vendor.t(item.lyric),
        b: $data.lryicIndex === index ? 1 : "",
        c: index
      };
    }),
    i: "translateY(" + -($data.lryicIndex - 1) * 82 + "rpx)",
    j: common_vendor.f($data.songSimi, (item, index, i0) => {
      return common_vendor.e({
        a: item.album.picUrl,
        b: common_vendor.t(item.name),
        c: item.privilege.flag > 60 && item.privilege.flag < 70
      }, item.privilege.flag > 60 && item.privilege.flag < 70 ? {} : {}, {
        d: item.privilege.maxbr === 999e3
      }, item.privilege.maxbr === 999e3 ? {} : {}, {
        e: common_vendor.t(item.album.artists[0].name),
        f: common_vendor.t(item.album.name),
        g: index,
        h: common_vendor.o(($event) => $options.handleToSimi(item.id))
      });
    }),
    k: common_vendor.f($data.songComment, (item, index, i0) => {
      return {
        a: item.user.avatarUrl,
        b: common_vendor.t(item.user.nickname),
        c: common_vendor.t(item.timeStr),
        d: common_vendor.t(item.likedCount),
        e: common_vendor.t(item.content),
        f: index
      };
    }),
    l: !$data.isLoading
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3e159eb4"], ["__file", "E:/WebCase/Uni-app/NetEaseCloudMusic/neteaseMusic/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
