import Vue from 'vue'
import Vuex from 'vuex'

import provider from './modules/provider.module'
import client from './modules/client.module'
import auth from './modules/auth.module'

Vue.use(Vuex)

export default new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    provider,
    client,
    auth
  }
})
