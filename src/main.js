import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JsonCSV from 'vue-json-csv'
import TextHighlight from 'vue-text-highlight';

import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import './assets/all.scss'
import api from "@/api/apis.js"

library.add(fas)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(require('vue-moment'))
Vue.component('downloadCsv', JsonCSV)
Vue.component('text-highlight', TextHighlight)
Vue.component("font-awesome-icon", FontAwesomeIcon)

Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
