import {
  Upload
} from "element-ui";
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

  // 專卷管理
  getDataByTopicId(data) {
    return req("post", "UserTopic/getDataByTopicId", data);
  },
  getUserTopic(data) {
    return req("post", "UserTopic/getUserTopic", data);
  },
  getTopology(data) {
    return req("post", "Topology/getTopology", data);
  },

  // 分析功能
  /* 即時分析 */
  getEntities(data) {
    return req("post", "Entities/getEntities", data);
  },
  /* 關鍵字分析 */
  getKeyWord(data) {
    return req("post", "KeyWord/getKeyWord", data);
  },

  // 排程管理
  /* 排程查詢 */
  getScheduleList(data) {
    return req("post", "Schedule/getScheduleList", data)
  },
  /* 排程設定、手動執行 */
  addSchedule(data) {
    return req("post", "Schedule/addSchedule", data);
  },
  updateSchedule(data) {
    return req("post", "Schedule/updateSchedule", data);
  },
  deleteSchedule(data) {
    return req("post", "Schedule/deleteSchedule", data);
  },
  /* 回朔分析 */
  addBacktrack(data) {
    return req("post", "Schedule/addBacktrack", data);
  },

  // 實體詞庫管理
  /* 實體分類 */
  getCatList(data) {
    return req("post", "CustDefsCat/getCatList", data);
  },
  /* 新增實體分類 */
  addCat(data) {
    return req("post", "CustDefsCat/addCat", data);
  },
  /* 修改實體分類 */
  updateCat(data) {
    return req("post", "CustDefsCat/updateCat", data);
  },
  /* 刪除實體分類 */
  deleteCat(data) {
    return req("post", "CustDefsCat/deleteCat", data);
  },
  /* 實體管理 */
  getCustDefsList(data) {
    return req("post", "CustDefs/getCustDefsList", data);
  },
  /* 新增實體管理 */
  addCustDefs(data) {
    return req("post", "CustDefs/addCustDefs", data);
  },
  /* 修改實體管理 */
  updateCustDefs(data) {
    return req("post", "CustDefs/updateCustDefs", data);
  },
  /* 刪除實體管理 */
  deleteCustDefs(data) {
    return req("post", "CustDefs/deleteCustDefs", data);
  },

  /* 詞庫維護 */
  /* 獲取 */
  getTermInfoList(data) {
    return req("post", "TermInfo/getTermInfoList", data);
  },
  /* 獲取詞庫類別 */
  getTermTypeList(data) {
    return req("post", "TermType/getTermTypeList", data);
  },
  /* 獲取實體詞 */
  getEntityTypeList(data) {
    return req("post", "EntityType/getEntityTypeList", data);
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

  // 管理報表
  /* 系統登入紀錄 */
  getUserLogin(data) {
    return req("post", "UserLogin/getUserLogin", data);
  },
  /* 系統操作紀錄 */
  getUserAction(data) {
    return req("post", "UserLogin/getUserAction", data);
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
  },

  // 帳號管理
  /* 改密碼 */
  updateUserPassword(data) {
    return req("post", "User/updateUserPassword", data)
  },

  // 上傳
  upload(data) {
    return req("post", "Upload", data);
  }
};

export default api;