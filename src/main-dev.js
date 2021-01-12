import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import NProgress from 'nprogress'
 import 'nprogress/nprogress.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://api.zreai.com:606/api/private/v1'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

import VueQuillEditor from 'vue-quill-editor'


import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// import { config } from 'webpack';
// import nProgress from 'nprogress';

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter('time', function (timeValue) {
  const dt = new Date(timeValue)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+1+'').padStart(2,'0')
  const hh = (dt.getHours()+1+'').padStart(2,'0')
  const mm = (dt.getMinutes()+1+'').padStart(2,'0')
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')
  return `${y}- ${m} - ${d}  ${hh}:${mm}:${ss}` 
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
