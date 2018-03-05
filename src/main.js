// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入全局css样式
import "./public/style/common.css"


import $ from 'jquery'

window.LAN=getUrlParam('lang') || window.localStorage.getItem('lang') || 'zh-CN'

// vue国际化
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

Vue.config.lang = getUrlParam('lang') || window.localStorage.getItem('lang') || 'zh-CN'

const i18n = new VueI18n({
    locale: Vue.config.lang,
    messages:{
      ja: require('./public/lang/jp'),
      en: require('./public/lang/en'),
      'zh-CN': require('./public/lang/zh'),
      'zh-TW':require('./public/lang/hk'),
      ko:require('./public/lang/kr')
    }
})

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})


function getUrlParam (param) {
  var reg = new RegExp('[&?]' + param + '=([^\\&]*)', 'i')
  var hrefStr = window.location.search
  hrefStr = decodeURIComponent(decodeURIComponent(hrefStr))
  var value = reg.exec(hrefStr)
  return value ? value[1] : ''
}