// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
// import { CHECK_AUTH } from '@/store/types/actions'

import ApiService from '@/api'
import DateFilter from '@/common/filters/date'
import ErrorFilter from '@/common/filters/error'

import Parse from 'parse'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)
Vue.use(BootstrapVue)

Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JAVASCRIPT_KEY)
Parse.serverURL = process.env.PARSE_URI

Vue.filter('date', DateFilter)
Vue.filter('error', ErrorFilter)

ApiService.init()
/*
router.beforeEach(
  (to, from, next) => {
    if (to.name !== 'Login') {
      return store.dispatch(CHECK_AUTH)
        .then(isAuthenticated => {
        // console.log(isAuthenticated)
          if (isAuthenticated) {
            next()
          } else {
            next({ name: 'Login' })
          }
        })
    } else {
      next()
    }
  }
)
*/
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
