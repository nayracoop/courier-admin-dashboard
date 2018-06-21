import { ProvidersService } from '@/api/index'
import { FETCH_PROVIDERS } from '@/store/types/actions'
import {
  FETCH_START,
  FETCH_PROVIDERS_END
} from '@/store/types/mutations'

const state = {
  providers: [],
  isLoading: true,
  providersCount: 0
}

const getters = {
  providersCount (state) {
    return state.providersCount
  },
  providers (state) {
    return state.providers
  },
  isLoading (state) {
    return state.isLoading
  }
}

const actions = {
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
const mutations = {
  [FETCH_START] (state) {
    state.isLoading = true
  },
  [FETCH_PROVIDERS_END] (state, { providers, providersCount }) {
    state.providers = providers
    state.providersCount = providersCount
    state.isLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
