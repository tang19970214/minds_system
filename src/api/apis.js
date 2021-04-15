import req from "./https";

// 全域 api 掛載於 Vue.prototype
// 使用方式 this.$api
// api 命名原則 首字大寫爾後駝峰
const api = {
  // 登入
  login(data) {
    return req("post", "Login", data);
  },

  // 登出
  logout(data) {
    return req("post", "Login/Logout", data);
  },

  // 獲取使用者
  getUserList(data) {
    return req("post", "User/getUserList", data);
  },

  // 獲取菜單
  getMenu(data) {
    return req("post", "Menu/getMenu", data);
  },

  // 首頁
  /* 獲取首頁資料 */
  getNewsList(data) {
    return req("post", "NewsData/getNewsList", data);
  },
  /* 獲取首頁圖表 */
  getNewsStatics(data) {
    return req("post", "NewsData/getNewsStatics", data);
  },
  /* 獲取新聞詳情 */
  getNewsDetail(data) {
    return req("post", "NewsData/getNewsDetail", data);
  },

  // 專卷
  getDataByTopicId(data) {
    return req("post", "UserTopic/getDataByTopicId", data);
  },
  getUserTopic(data) {
    return req("post", "UserTopic/getUserTopic", data);
  },

  // 即時分析
  getEntities(data) {
    return req("post", "Entities/getEntities", data);
  },

  //  關鍵字分析
  getKeyWord(data) {
    return req("post", "KeyWord/getKeyWord", data);
  },

  // 詞庫維護
  /* 獲取 */
  // getTermList(data) {
  //   return req("post", "TermInfo/getTermInfoList", data);
  // },
  /* 獲取詞庫類別 */
  getTermTypeList(data) {
    return req("post", "TermType/getTermTypeList", data);
  },
  /* 獲取實體詞 */
  getEntityTypeList(data) {
    return req("post", "TermType/getEntityTypeList", data);
  },
  /* 新增 */
  addTermInfo(data) {
    return req("post", "TermInfo/addTermInfo", data);
  },
  /* 編輯 */
  updateTermInfo(data) {
    return req("post", "TermInfo/updateTermInfo", data);
  },
  /* 刪除 */
  deleteTermInfo(data) {
    return req("post", "TermInfo/deleteTermInfo", data);
  },

  // 專卷分類
  /* 新增 */
  addUserTopic(data) {
    return req("post", "UserTopic/addUserTopic", data);
  },
  /* 編輯 */
  updateUserTopic(data) {
    return req("post", "UserTopic/updateUserTopic", data);
  },
  /* 刪除 */
  deleteUserTopic(data) {
    return req("post", "UserTopic/deleteUserTopic", data);
  },

  // 帳號管理
  /* 新增 */
  addUser(data) {
    return req("post", "User/addUser", data);
  },
  /* 修改 */
  /* 刪除 */

  // 專卷編輯
  /* 新增 */
  addDataTopic(data) {
    return req("post", "UserTopic/addData2Topic", data)
  }
};

export default api;