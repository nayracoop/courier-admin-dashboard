import Vue from 'vue'
import { ShippingService } from '@/api'
import { SHIPPING_SAVE, SHIPPING_EDIT, SHIPPING_DELETE, SHIPPING_RESET_STATE, FETCH_SHIPPING, FETCH_SHIPPINGS } from '@/store/types/actions'
import { RESET_STATE, SET_SHIPPING, FETCH_START, FETCH_SHIPPINGS_END } from '@/store/types/mutations'

const getInitialState = () => {
  return {
    shipping: {
      client: '',
      provider: '',
      shippingType: '',
      serviceType: '',
      packageType: '',
      shippingZone: '',
      initialDate: null,
      finalDate: null,
      weight: '',
      grossPrice: '',
      saleDiscount: '',
      netPrice: '',
      costDiscount: '',
      cost: ''
    },
    shippings: [],
    shippingLoading: false,
    shippingsCount: 0
  }
}

const state = getInitialState()

export const actions = {
  [SHIPPING_SAVE] ({ state }) {
    return ShippingService.create(state.shipping)
  },
  [FETCH_SHIPPINGS] ({ commit }) {
    commit(FETCH_START)
    return ShippingService.getAll()
      .then(data => {
        commit(FETCH_SHIPPINGS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_SHIPPING] (context, shippingId, prevShipping) {
    // avoid extronuous network call if object exists
    if (prevShipping !== undefined) {
      return context.commit(SET_SHIPPING, prevShipping)
    }
    return ShippingService.get(shippingId)
      .then(data => {
        context.commit(SET_SHIPPING, data)
        return data
      })
  },
  [SHIPPING_EDIT] ({ commit, state }) {
    return ShippingService.update(state.shipping.objectId, state.shipping)
      .then(data => {
        commit(SET_SHIPPING, data)
        return data
      })
  },
  [SHIPPING_DELETE] (context, id) {
    return ShippingService.delete(id)
  },
  [SHIPPING_RESET_STATE] ({ commit }) {
    commit(RESET_STATE)
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [FETCH_START] (state) {
    state.shippingLoading = true
  },
  [FETCH_SHIPPINGS_END] (state, shippings) {
    state.shippings = shippings.map(function (e) {
      return e.toJSON()
    })
    state.shippingsCount = shippings.length
    state.shippingLoading = false
  },
  [SET_SHIPPING] (state, shipping) {
    state.shipping = shipping.toJSON()
  },
  [RESET_STATE] () {
    const initialState = getInitialState()
    for (let f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  shippings (state) {
    return state.shippings
  },
  shipping (state) {
    return state.shipping
  },
  shippingsCount (state) {
    return state.shippingsCount
  },
  shippingLoading (state) {
    return state.shippingLoading // el getter shippingLoading se usa en distintos lugares
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
