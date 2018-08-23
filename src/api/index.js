import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from '@/common/services/jwt'
import { API_URL } from '@/common/config'

import provider from './provider.service'
import client from './client.service'
import shipping from './shipping.service'
import user from './user.service'

const ApiService = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = API_URL
  },

  setHeader () {
    // chequear si usamos headers acá
    // para user y password gcrypt con .htpasswd
    Vue.axios.defaults.headers.common['Authorization'] = `Token ${JwtService.getToken()}`
  },

  query (resource, params) {
    return Vue.axios
      .get(resource, params)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  get (resource, slug = '') {
    return Vue.axios
      .get(`${resource}/${slug}`)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  post (resource, params) {
    return Vue.axios.post(`${resource}`, params)
  },

  update (resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params)
  },

  put (resource, params) {
    return Vue.axios
      .put(`${resource}`, params)
  },

  delete (resource) {
    return Vue.axios
      .delete(resource)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  }
}

export default ApiService

export const ProvidersService = provider
export const ClientsService = client
export const UsersService = user
export const ShippingService = shipping
