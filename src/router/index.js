import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  /* 首頁 */
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
  /* 智能搜尋 */
  {
    path: '/smartSearch',
    name: 'smartSearch',
    component: () => import('../views/smartSearch.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 專卷管理/專卷查詢 */
  {
    path: '/projSearch',
    name: 'projSearch',
    component: () => import('../views/proj/projSearch.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 專卷管理/專卷維護 */
  {
    path: '/projMaintain',
    name: 'projMaintain',
    component: () => import('../views/proj/projMaintain.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 即時分析 */
  {
    path: '/instantAnalysis',
    name: 'instantAnalysis',
    component: () => import('../views/instantAnalysis.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 回朔分析 */
  {
    path: '/backtrackAnalysis',
    name: 'backtrackAnalysis',
    component: () => import('../views/backtrackAnalysis.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 詞庫管理 */
  {
    path: '/wordManage',
    name: 'wordManage',
    component: () => import('../views/wordManage.vue'),
    meta: {
      hideMenu: false
    }
  },
  /* 帳號管理 */
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