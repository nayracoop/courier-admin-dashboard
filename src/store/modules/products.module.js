import Vue from 'vue'
import { ProductsService } from '@/api'
import { FETCH_PRODUCTS } from '@/store/types/actions'
import { FETCH_START, RESET_STATE, FETCH_PRODUCTS_END } from '@/store/types/mutations'

const getInitialState = () => {
  return {
    products: [],
    productsLoading: false,
    productsCount: 0
  }
}

const state = getInitialState()

export const actions = {
  [FETCH_PRODUCTS] ({ commit }) {
    commit(FETCH_START)
    return ProductsService.getAll()
      .then(data => {
        commit(FETCH_PRODUCTS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [FETCH_START] (state) {
    state.productsLoading = true
  },
  [FETCH_PRODUCTS_END] (state, products) {
    console.log('esto termino')
    console.log(products)
    state.products = products.map(function (e) {
      if (e.constructor === Object) {
        return e
      }
      return e.toJSON()
    })
    state.productsCount = state.products.length
    state.productsLoading = false
  },
  [RESET_STATE] () {
    const initialState = getInitialState()
    for (let f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  products (state) {
    return state.products
  },
  productsCount (state) {
    return state.productsCount
  },
  productsLoading (state) {
    return state.productsLoading
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
