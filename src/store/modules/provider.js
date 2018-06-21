import Vue from 'vue'
import { ProvidersService } from '@/api'
import {
  PROVIDER_SAVE,
  PROVIDER_EDIT,
  PROVIDER_DELETE,
  PROVIDER_RESET_STATE,
  FETCH_PROVIDER
} from '@/store/types/actions'
import {
  RESET_STATE,
  SET_PROVIDER
  // UPDATE_PROVIDER_IN_LIST
} from '@/store/types/mutations'

const initialState = {
  provider: {
    id: -1,
    vatId: '',
    taxCategory: '',
    postalCode: '',
    purchaseAccount: '',
    saleAccount: '',
    address: '',
    email: '',
    taxType: '',
    name: '',
    observation: '',
    country: '',
    externalId: '',
    province: '',
    businessName: '',
    phone: '',
    userCode: ''
  }
}

const state = Object.assign({}, initialState)

export const actions = {
  [FETCH_PROVIDER] (context, providerId, prevProvider) {
    // avoid extronuous network call if article exists
    if (prevProvider !== undefined) {
      return context.commit(SET_PROVIDER, prevProvider)
    }
    return ProvidersService.get(providerId)
      .then(data => {
        context.commit(SET_PROVIDER, data.provider)
        return data
      })
  },
  [PROVIDER_SAVE] ({ state }) {
    return ProvidersService.create(state.Provider)
  },
  [PROVIDER_DELETE] (context, id) {
    return ProvidersService.destroy(id)
  },
  [PROVIDER_EDIT] ({ state }) {
    return ProvidersService.update(state.Provider.id, state.Provider)
  },
  [PROVIDER_RESET_STATE] ({ commit }) {
    commit(RESET_STATE)
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_PROVIDER] (state, Provider) {
    state.Provider = Provider
  },
  [RESET_STATE] () {
    for (let f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  provider (state) {
    return state.Provider
  },
  comments (state) {
    return state.comments
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
