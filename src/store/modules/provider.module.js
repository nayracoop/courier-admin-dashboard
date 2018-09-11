import Vue from 'vue'
import { ProvidersService } from '@/api'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, PROVIDER_RESET_STATE, FETCH_PROVIDER, FETCH_PROVIDERS, FETCH_SHIPPING_PROVIDERS, FETCH_SYNC_PROVIDERS } from '@/store/types/actions'
import { RESET_STATE, SET_PROVIDER, FETCH_START, FETCH_PROVIDERS_END, FETCH_SYNC_PROVIDERS_END } from '@/store/types/mutations'

const getInitialState = () => {
  return {
    provider: {
      taxCategory: null, // categoría, condición frente al IVA
      docType: null, // CUIT, DNI, etcétera
      docValue: '', // número de DNI, CUIT, etcétera
      externalId: null,
      userCode: '',
      name: '',
      businessName: '',
      address: '',
      country: null,
      province: null, // usamos province cuando el country es argentina. Si no state
      state: null,
      city: null,
      postalCode: '',
      email: '',
      phone: '',
      observation: '',
      purchaseAccount: null,
      saleAccount: null,
      isShipping: null,
      costsTable: [],
      shippingZones: []
    },
    providers: [],
    syncProviders: [],
    providerLoading: false,
    providersCount: 0,
    syncProvidersCount: 0
  }
}

const state = getInitialState()

export const actions = {
  [PROVIDER_SAVE] ({ state }) {
    return ProvidersService.create(state.provider)
  },
  [FETCH_PROVIDERS] ({ commit }) {
    commit(FETCH_START)
    return ProvidersService.getAll()
      .then(data => {
        commit(FETCH_PROVIDERS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_SHIPPING_PROVIDERS] ({ commit }) {
    commit(FETCH_START)
    return ProvidersService.getShipping()
      .then(data => {
        commit(FETCH_PROVIDERS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_SYNC_PROVIDERS] ({ commit }) {
    commit(FETCH_START)
    return ProvidersService.getSyncProviders()
      .then(data => {
        commit(FETCH_SYNC_PROVIDERS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  [FETCH_PROVIDER] (context, providerId, prevProvider) {
    // avoid extronuous network call if object exists
    if (prevProvider !== undefined) {
      return context.commit(SET_PROVIDER, prevProvider)
    }
    return ProvidersService.get(providerId)
      .then(data => {
        context.commit(SET_PROVIDER, data)
        return data
      })
  },
  [PROVIDER_EDIT] ({ commit, state }) {
    return ProvidersService.update(state.provider.objectId, state.provider)
      .then(data => {
        commit(SET_PROVIDER, data)
        return data
      })
  },
  [PROVIDER_DELETE] (context, id) {
    return ProvidersService.delete(id)
  },
  [PROVIDER_RESET_STATE] ({ commit }) {
    commit(RESET_STATE)
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [FETCH_START] (state) {
    state.providerLoading = true
  },
  [FETCH_PROVIDERS_END] (state, providers) {
    state.providers = providers.map(function (e) {
      if (e.constructor === Object) {
        return e
      }
      return e.toJSON()
    })
    state.providersCount = providers.length
    state.providerLoading = false
  },
  [FETCH_SYNC_PROVIDERS_END] (state, providers) {
    state.syncProviders = providers.map(function (e) {
      if (e.constructor === Object) {
        return e
      }
      return e.toJSON()
    })
    state.syncProvidersCount = providers.length
    state.providerLoading = false
  },
  [SET_PROVIDER] (state, provider) {
    state.provider = provider.toJSON()
  },
  [RESET_STATE] () {
    const initialState = getInitialState()
    for (let f in state) {
      Vue.set(state, f, initialState[f])
    }
  }
}

const getters = {
  providers (state) {
    return state.providers
  },
  syncProviders (state) {
    return state.syncProviders
  },
  provider (state) {
    return state.provider
  },
  providersCount (state) {
    return state.providersCount
  },
  syncProvidersCount (state) {
    return state.syncProvidersCount
  },
  providerLoading (state) {
    return state.providerLoading // el getter providerLoading se usa en distintos lugares
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
