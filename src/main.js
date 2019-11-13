import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import bcrypt from 'bcryptjs'

//Element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.axios = axios
Vue.prototype.bcrypt = bcrypt
Vue.prototype.qs = qs

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
