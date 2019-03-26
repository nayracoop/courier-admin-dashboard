import Vue from 'vue'
import { ShippingService, PurchaseOrderService, BudgetService } from '@/api'
import { SHIPPING_SAVE, SHIPPING_EDIT, SHIPPING_DELETE, SHIPPING_RESET_STATE, FETCH_SHIPPING, FETCH_SHIPPINGS, CREATE_ORDERS, CREATE_BUDGET } from '@/store/types/actions'
import { RESET_STATE, SET_SHIPPING, FETCH_START, FETCH_SHIPPINGS_END, UPDATE_SHIPPING_PRICING } from '@/store/types/mutations'

const getInitialState = () => {
  return {
    shipping: {
      clientId: '',
      providerId: '',
      shippingType: null,
      serviceType: null,
      initialDate: '',
      finalDate: '',

      origin: {
        country: '',
        name: '',
        contactName: '',
        streetAddress: '',
        floor: '',
        apartment: '',
        postalCode: '',
        state: '',
        province: '',
        city: '',
        isResidential: false,
        email: '',
        phone: '',
        comments: ''
      },

      destination: {
        country: '',
        name: '',
        contactName: '',
        streetAddress: '',
        floor: '',
        apartment: '',
        postalCode: '',
        state: '',
        province: '',
        city: '',
        isResidential: false,
        email: '',
        phone: '',
        comments: ''
      },
      shippingZone: '',

      package: {
        type: null,
        reference: '',
        declaredValue: null,
        weight: null,
        length: null,
        width: null,
        height: null
      },

      tracking: {
        guide: '',
        flightDate: '',
        attachment: ''
      },

      pricing: { },
      status: 0,
      billingStatus: false

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
  },
  [CREATE_ORDERS] ({ commit, state }, orderList) {
    return PurchaseOrderService.create(state.shipping.objectId, orderList)
      .then(data => {
        // commit(SET_SHIPPING, data)
        return data
      })
    // return ShippingService.update(state.shipping.objectId, state.shipping)
    //   .then(data => {
    //     commit(SET_SHIPPING, data)
    //     return data
    //   })
  },
  [CREATE_BUDGET] ({ commit, state }, budget) {
    return BudgetService.create(state.shipping.objectId, budget)
      .then(data => {
        // commit(SET_SHIPPING, data)
        return data
      })
    // return ShippingService.update(state.shipping.objectId, state.shipping)
    //   .then(data => {
    //     commit(SET_SHIPPING, data)
    //     return data
    //   })
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
  [UPDATE_SHIPPING_PRICING] (state, pricing) {
    state.shipping.pricing = pricing
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
