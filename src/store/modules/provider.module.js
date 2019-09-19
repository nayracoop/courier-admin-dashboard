import Vue from 'vue'
import { ProvidersService } from '@/api'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, PROVIDER_RESET_STATE, FETCH_PROVIDER, FETCH_PROVIDERS, FETCH_SHIPPING_PROVIDERS, FETCH_PROVIDERS_SYNC_DIFFERENCES, PROVIDERS_SYNC } from '@/store/types/actions'
import { RESET_STATE, SET_PROVIDER, FETCH_PROVIDER_START, SYNCH_PROVIDER_START, FETCH_PROVIDERS_END, FETCH_PROVIDERS_SYNC_DIFFERENCES_END, SYNC_PROVIDERS_END } from '@/store/types/mutations'

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
      address: {
        streetAddress: '',
        city: '',
        postalCode: '',
        state: '',
        province: null,
        country: null
      },
      // address: '',
      // country: null,
      // province: null, // usamos province cuando el country es argentina. Si no state
      // state: null,
      // city: null,
      // postalCode: '',
      email: '',
      phone: '',
      observation: '',
      purchaseAccount: null,
      saleAccount: null,
      isShipping: null,
      costsTable: [],
      shippingZones: [],
      fuelTable: [],
      insurance: null
    },
    providers: [],
    syncProviders: [],
    providerLoading: false,
    providerSynching: false,
    providersCount: 0,
    providersCanSync: false,
    providersImport: 0,
    providersExport: 0
  }
}

const state = getInitialState()

export const actions = {
  [PROVIDER_SAVE] ({ state }) {
    return ProvidersService.create(state.provider)
  },
  [FETCH_PROVIDERS] ({ commit }) {
    commit(FETCH_PROVIDER_START)
    return ProvidersService.getAll()
      .then(data => {
        commit(FETCH_PROVIDERS_END, data)
      })
      .catch((error) => {
        throw error
      })
  },
  [FETCH_SHIPPING_PROVIDERS] ({ commit }) {
    commit(FETCH_PROVIDER_START)
    return ProvidersService.getShipping()
      .then(data => {
        commit(FETCH_PROVIDERS_END, data)
      })
      .catch((error) => {
        throw error
      })
  },
  [FETCH_PROVIDERS_SYNC_DIFFERENCES] ({ commit }) {
    commit(SYNCH_PROVIDER_START)
    return ProvidersService.getProvidersSyncDifferences()
      .then((syncDifferencesDetails) => {
        commit(FETCH_PROVIDERS_SYNC_DIFFERENCES_END, syncDifferencesDetails)
      })
      .catch((error) => {
        commit(FETCH_PROVIDERS_SYNC_DIFFERENCES_END)
        throw error
      })
  },
  [PROVIDERS_SYNC] ({ commit }) {
    commit(SYNCH_PROVIDER_START)
    return ProvidersService.syncProviders()
      .then((results) => {
        commit(SYNC_PROVIDERS_END)
        return results
      })
      .catch((error) => {
        commit(SYNC_PROVIDERS_END)
        throw error
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
  [FETCH_PROVIDER_START] (state) {
    state.providerLoading = true
  },
  [SYNCH_PROVIDER_START] (state) {
    state.providerLoading = true
    state.providerSynching = true
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
  [FETCH_PROVIDERS_SYNC_DIFFERENCES_END] (state, syncDifferencesDetails = null) {
    if (syncDifferencesDetails) {
      state.providersCanSync = syncDifferencesDetails.canSync
      state.providersImport = syncDifferencesDetails.xubio
      state.providersExport = syncDifferencesDetails.parse
    }
    state.providerLoading = false
    state.providerSynching = false
  },
  [SYNC_PROVIDERS_END] (state) {
    state.providerLoading = false
    state.providerSynching = false
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
  provider (state) {
    return state.provider
  },
  providersCount (state) {
    return state.providersCount
  },
  providerLoading (state) {
    return state.providerLoading // el getter providerLoading se usa en distintos lugares
  },
  providerSynching (state) {
    return state.providerSynching
  },
  providerSyncDifferencesDetails (state) {
    return {
      canSync: state.providersCanSync,
      import: state.providersImport,
      export: state.providersExport
    }
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
