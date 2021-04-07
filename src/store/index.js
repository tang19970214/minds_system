import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false
  },
  mutations: {
    SETLOADING(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    loadingHandler(state, payload) {
      state.commit("SETLOADING", payload);
    },
  },
  modules: {}
})