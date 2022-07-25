"use strict";
var common_vendor = require("../../common/vendor.js");
require("../../app.js");
var common_http = require("../../common/http.js");
require("../../store/index.js");
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
      isLoading: true,
      showHide: 1,
      iconPlays: "icon-aixin1",
      color: "",
      dataList: [],
      abc: "none",
      id: ""
    };
  },
  components: {
    musichead
  },
  onLoad(e) {
    this.$store.commit("MEXT_ID", e.id);
    this.$store.commit("MEXTS_ID", e.id);
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
    let num = this.$store.state.list;
    this.dataList = num;
    num = Object.values(num);
    if (num.length === 0) {
      return;
    } else {
      for (let i = 0; i < num.length; i++) {
        if (num[i].id === parseInt(e.id)) {
          this.iconPlays = "icon-aixin-copy";
          this.color = "red";
          return;
        }
      }
    }
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
      this.bgAudioManager.onEnded(() => {
        this.getDetail(this.$store.state.nexId);
        this.getSime(this.$store.state.nexId);
        this.getComment(this.$store.state.nexId);
        this.getLyric(this.$store.state.nexId);
        this.getUrl(this.$store.state.nexId);
        console.log(this.$store.state.nexId);
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
      this.$store.commit("MEXT_ID", id);
      this.$store.commit("MEXTS_ID", id);
      this.getDetail(id);
      this.getSime(id);
      this.getComment(id);
      this.getLyric(id);
      this.getUrl(id);
    },
    cheshi() {
      this.showHide = 2;
    },
    cheshi2() {
      this.showHide = 1;
    },
    love() {
      if (this.iconPlays !== "icon-aixin-copy") {
        this.iconPlays = "icon-aixin-copy";
        this.color = "red";
        this.getList(this.songDetail.id);
      } else {
        this.$store.commit("delend", this.songDetail.id);
        let num = this.$store.state.list;
        this.dataList = num;
        this.iconPlays = "icon-aixin1";
        this.color = "";
      }
    },
    async getList(id) {
      const res = await common_http.myRequest({ url: `/song/detail?ids=${id}` });
      this.$store.commit("add", res.data.songs[0]);
      let num = this.$store.state.list;
      this.dataList = num;
    },
    handleTopNono() {
      this.abc = "";
    },
    block() {
      this.abc = "none";
    },
    handleToDelete() {
      this.$store.commit("delete");
      this.dataList = [];
      this.iconPlays = "icon-aixin1";
      this.color = "";
    },
    xiayishou() {
      if (this.$store.state.nexId !== "") {
        this.handleToSimi(this.$store.state.nexId);
      } else {
        return;
      }
    },
    shangyishou() {
      if (this.$store.state.nexsId !== "") {
        this.handleToSimi(this.$store.state.nexsId);
      } else {
        return;
      }
    },
    pinlun() {
      common_vendor.index.navigateTo({
        url: `/pages/pinlun/pinlun?id=${this.songDetail.id}`
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
  return common_vendor.e({
    a: `url(${$data.songDetail.al.picUrl})`,
    b: common_vendor.p({
      title: $data.songDetail.name,
      icon: "true",
      color: "white"
    }),
    c: $data.showHide === 1
  }, $data.showHide === 1 ? common_vendor.e({
    d: $data.songDetail.al.picUrl !== " "
  }, $data.songDetail.al.picUrl !== " " ? {
    e: common_vendor.o((...args) => $options.cheshi && $options.cheshi(...args)),
    f: $data.songDetail.al.picUrl,
    g: $data.isPlayRotate ? 1 : ""
  } : {}, {
    h: common_vendor.o((...args) => $options.love && $options.love(...args)),
    i: common_vendor.n($data.iconPlays),
    j: `${$data.color}`,
    k: common_vendor.o((...args) => $options.pinlun && $options.pinlun(...args))
  }) : $data.showHide === 2 ? {
    m: common_vendor.f($data.songLyric, (item, index, i0) => {
      return {
        a: common_vendor.t(item.lyric),
        b: $data.lryicIndex === index ? 1 : "",
        c: index
      };
    }),
    n: "translateY(" + -($data.lryicIndex - 1) * 82 + "rpx)",
    o: common_vendor.o((...args) => $options.cheshi2 && $options.cheshi2(...args))
  } : $data.showHide === 3 ? {
    q: common_vendor.f($data.songSimi, (item, index, i0) => {
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
    })
  } : $data.showHide === 4 ? {
    s: common_vendor.f($data.songComment, (item, index, i0) => {
      return {
        a: item.user.avatarUrl,
        b: common_vendor.t(item.user.nickname),
        c: common_vendor.t(item.timeStr),
        d: common_vendor.t(item.likedCount),
        e: common_vendor.t(item.content),
        f: index
      };
    })
  } : {}, {
    l: $data.showHide === 2,
    p: $data.showHide === 3,
    r: $data.showHide === 4,
    t: common_vendor.o((...args) => $options.shangyishou && $options.shangyishou(...args)),
    v: common_vendor.o((...args) => $options.handleToplay && $options.handleToplay(...args)),
    w: common_vendor.n($data.iconPlay),
    x: common_vendor.o((...args) => $options.xiayishou && $options.xiayishou(...args)),
    y: common_vendor.o((...args) => $options.handleTopNono && $options.handleTopNono(...args)),
    z: !$data.isLoading,
    A: common_vendor.o((...args) => $options.block && $options.block(...args)),
    B: common_vendor.t($data.dataList.length),
    C: common_vendor.o((...args) => $options.handleToDelete && $options.handleToDelete(...args)),
    D: common_vendor.f($data.dataList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.songDetail.id === item.id ? "red" : "",
        c: common_vendor.t(item.ar[0].name),
        d: $data.songDetail.id === item.id ? "red" : "",
        e: index,
        f: common_vendor.o(($event) => $options.handleToSimi(item.id))
      };
    }),
    E: common_vendor.n($data.abc)
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3e159eb4"], ["__file", "E:/WebCase/Uni-app/NetEaseCloudMusic/neteaseMusic/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
