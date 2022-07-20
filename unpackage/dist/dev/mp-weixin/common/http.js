"use strict";
var common_vendor = require("./vendor.js");
var common_config = require("./config.js");
const myRequest = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: common_config.baseUrl + options.url,
      method: options.method || "GET",
      data: options.data || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
      }
    });
  });
};
exports.myRequest = myRequest;
