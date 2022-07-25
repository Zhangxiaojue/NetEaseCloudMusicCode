"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
var store_index = require("./store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/list/list.js";
  "./pages/detail/detail.js";
  "./pages/search/search.js";
  "./pages/pinlun/pinlun.js";
}
const _sfc_main = {};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/WebCase/Uni-app/NetEaseCloudMusic/neteaseMusic/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
