import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

//引入API
import API from '@/api'
Vue.prototype.$API = API;
//全局组件
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
Vue.component(Pagination.name, Pagination);
<<<<<<< HEAD
import 'echarts'
import ECharts from 'vue-echarts'
// 全局注册组件（也可以使用局部注册）
Vue.component('ECharts', ECharts)
=======
Vue.component(Tinymce.name, Tinymce);
>>>>>>> d17a5dcf3fc877ca4f055a0f0a8cb2533bdc75e6

new Vue({
  el: '#app',
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  router,
  store,
  render: h => h(App)
})
