import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  /* 1 首頁 */
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 資料詳情 */
  {
    path: '/infoDetail/:id',
    name: 'infoDetail',
    component: () => import('../views/infoDetail.vue'),
    meta: {
      hideMenu: true
    }
  },
  /* 註冊 */
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      hideMenu: true
    }
  },
  /* 2 智能搜尋 */
  {
    path: '/smartSearch',
    name: 'smartSearch',
    component: () => import('../views/smartSearch.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 3 專卷管理 */
  /* 3.1 專卷管理/專卷查詢 */
  {
    path: '/projSearch',
    name: 'projSearch',
    component: () => import('../views/proj/projSearch.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 3.2 專卷管理/專卷維護 */
  {
    path: '/projMaintain',
    name: 'projMaintain',
    component: () => import('../views/proj/projMaintain.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 4 分析功能 */
  /* 4.1 分析功能/即時分析 */
  {
    path: '/instantAnalysis',
    name: 'instantAnalysis',
    component: () => import('../views/analysis/instantAnalysis.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 4.2 分析功能/關鍵字分析 */
  {
    path: '/keywordAnalysis',
    name: 'keywordAnalysis',
    component: () => import('../views/analysis/keywordAnalysis.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 5 排程管理 */
  /* 5.1 排程管理/排程查詢 */
  {
    path: '/scheduleSearch',
    name: 'scheduleSearch',
    component: () => import('../views/schedule/scheduleSearch.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 5.2 排程管理/排程設定 */
  {
    path: '/scheduleSetting',
    name: 'scheduleSetting',
    component: () => import('../views/schedule/scheduleSetting.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 5.3 排程管理/手動執行 */
  {
    path: '/manualExecute',
    name: 'manualExecute',
    component: () => import('../views/schedule/manualExecute.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 5.4 排程管理/回朔分析 */
  {
    path: '/backtrackAnalysis',
    name: 'backtrackAnalysis',
    component: () => import('../views/schedule/backtrackAnalysis.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 6 實體詞庫管理 */
  /* 6.1 實體詞庫管理/實體管理 */
  {
    path: '/entityManage',
    name: 'entityManage',
    component: () => import('../views/entityWordManage/entityManage.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 6.2 實體詞庫管理/詞庫管理 */
  {
    path: '/wordManage',
    name: 'wordManage',
    component: () => import('../views/entityWordManage/wordManage.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 7 管理報表 */
  /* 7.1 管理報表/系統登入紀錄 */
  {
    path: '/loginRecord',
    name: 'loginRecord',
    component: () => import('../views/systemManage/loginRecord.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 7.2 管理報表/系統操作紀錄 */
  {
    path: '/operateRecord',
    name: 'operateRecord',
    component: () => import('../views/systemManage/operateRecord.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 8 帳號管理 */
  {
    path: '/accountManage',
    name: 'accountManage',
    component: () => import('../views/accountManage.vue'),
    meta: {
      hideMenu: false
    }
  },

  /* 專卷編輯 */
  {
    path: '/projEdit',
    name: 'projEdit',
    component: () => import('../views/proj/projEdit.vue'),
    meta: {
      hideMenu: true
    }
  },
  /* 關聯分析 */
  {
    path: '/relationAnalysis',
    name: 'relationAnalysis',
    component: () => import('../views/relationAnalysis.vue'),
    meta: {
      hideMenu: true
    }
  }
]

const router = new VueRouter({
  routes
})

export default router