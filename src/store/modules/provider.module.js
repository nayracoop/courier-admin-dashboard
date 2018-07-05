import Vue from 'vue'
import { ProvidersService } from '@/api'
import {
  PROVIDER_SAVE,
  PROVIDER_EDIT,
  PROVIDER_DELETE,
  PROVIDER_RESET_STATE,
  FETCH_PROVIDER,
  FETCH_PROVIDERS
} from '@/store/types/actions'
import {
  RESET_STATE,
  SET_PROVIDER,
  FETCH_START,
  FETCH_PROVIDERS_END
  // UPDATE_PROVIDER_IN_LIST
} from '@/store/types/mutations'

const initialState = {
  provider: {
    id: '',
    externalId: 'external',
    userCode: '12345',
    name: 'Juanca',
    businessName: 'Business name',
    taxId: '2032760990',
    taxCategory: 'CUIT',
    taxType: 'Exento', // capaz condition?
    address: 'Noogoosda',
    country: 'Argentina',
    province: 'Buenos Aires',
    postalCode: '1234',
    email: 'pehuen@mil.net',
    phone: '0293219321',
    observation: 'Observaction',
    purchaseAccount: '',
    saleAccount: ''
  }
}

const state = Object.assign({
  providers: [],
  isLoading: true, // isLoading se usa en distintos lugares
  providersCount: 0 }, initialState)

export const actions = {
  [FETCH_PROVIDER] (context, providerId, prevProvider) {
    // avoid extronuous network call if article exists
    if (prevProvider !== undefined) {
      return context.commit(SET_PROVIDER, prevProvider)
    }
    return ProvidersService.get(providerId)
      .then(data => {
        context.commit(SET_PROVIDER, data)
        return data
      })
  },
  [PROVIDER_SAVE] ({ state }) {
    return ProvidersService.create(state.provider)
  },
  [PROVIDER_DELETE] (context, id) {
    return ProvidersService.destroy(id)
  },
  [PROVIDER_EDIT] ({ state }) {
    return ProvidersService.update(state.provider.id, state.provider)
  },
  [PROVIDER_RESET_STATE] ({ commit }) {
    commit(RESET_STATE)
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
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_PROVIDER] (state, provider) {
    state.provider = provider.toJSON()
  },
  [RESET_STATE] () {
    for (let f in state) {
      Vue.set(state, f, initialState[f])
    }
  },
  [FETCH_START] (state) {
    state.isLoading = true
  },
  [FETCH_PROVIDERS_END] (state, providers) {
    state.providers = providers.map(function (e) {
      return e.toJSON()
    })
    state.providersCount = providers.length
    state.isLoading = false
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
  isLoading (state) {
    return state.isLoading // el getter isLoading se usa en distintos lugares
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
