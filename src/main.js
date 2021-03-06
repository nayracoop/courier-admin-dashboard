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

import DateFilter from '@/common/filters/date'
import ErrorFilter from '@/common/filters/error'

import Parse from 'parse'
// import VueLocalStorage from 'vue-localstorage'
import ToastHelper from '@/common/helpers/toast'
import es from 'vee-validate/dist/locale/es'
import VeeValidate, { Validator } from 'vee-validate'
import _ from 'lodash'

Validator.localize('es', es)
// Vue.use(VueLocalStorage)
Vue.use(BootstrapVue)
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' })

Vue.set(Vue.prototype, '_', _)
// esto es una superposición con Vuex
// ¿algún alma caritativa lo corregirá en el futuro?
Vue.set(Vue.prototype, '$eventHub', new Vue())

ToastHelper.init()

Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JAVASCRIPT_KEY)
Parse.serverURL = process.env.PARSE_URI

Vue.filter('date', DateFilter)
Vue.filter('error', ErrorFilter)

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
