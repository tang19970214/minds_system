import req from "./https";

// 全域 api 掛載於 Vue.prototype
// 使用方式 this.$api
// api 命名原則 首字大寫爾後駝峰
const api = {
  /* 登入 */
  login(data) {
    return req("post", "Login", data);
  },

  /* 獲取使用者 */
  getuserlist(data) {
    return req("post", "getuserlist", data);
  },

  /* 獲取菜單 */
  getMenu(data) {
    return req("post", "Menu/getMenu", data);
  },

  /* 獲取首頁資料 */
  getNewsList(data) {
    return req("post", "NewsData/getNewsList", data);
  },
};

export default api;