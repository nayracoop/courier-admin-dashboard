import Vue from 'vue'
import Vuex from 'vuex'

import provider from './modules/provider'
import providerList from './modules/provider.list'

Vue.use(Vuex)

export default new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    provider,
    providerList
  }
})
