import Vue from 'vue'
import { ClientsService } from '@/api'
import {
  CLIENT_SAVE,
  CLIENT_EDIT,
  CLIENT_DELETE,
  CLIENT_RESET_STATE,
  FETCH_CLIENT,
  FETCH_CLIENTS
} from '@/store/types/actions'
import {
  RESET_STATE,
  SET_CLIENT,
  FETCH_START,
  FETCH_CLIENTS_END
  // UPDATE_CLIENT_IN_LIST
} from '@/store/types/mutations'

const initialState = {
  client: {
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

const state = Object.assign({
  clients: [],
  clientsCount: 0 }, initialState)

export const actions = {
  [FETCH_CLIENT] (context, clientId, prevClient) {
    // avoid extronuous network call if article exists
    if (prevClient !== undefined) {
      return context.commit(SET_CLIENT, prevClient)
    }
    return ClientsService.get(clientId)
      .then(data => {
        context.commit(SET_CLIENT, data.client)
        return data
      })
  },
  [CLIENT_SAVE] ({ state }) {
    return ClientsService.create(state.Client)
  },
  [CLIENT_DELETE] (context, id) {
    return ClientsService.destroy(id)
  },
  [CLIENT_EDIT] ({ state }) {
    return ClientsService.update(state.Client.id, state.Client)
  },
  [CLIENT_RESET_STATE] ({ commit }) {
    commit(RESET_STATE)
  },
  [FETCH_CLIENTS] ({ commit }) {
    commit(FETCH_START)
    return ClientsService.getAll()
      .then(data => {
        commit(FETCH_CLIENTS_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_CLIENT] (state, Client) {
    state.client = Client
  },
  [RESET_STATE] () {
    for (let f in state) {
      Vue.set(state, f, initialState[f])
    }
  },
  [FETCH_START] (state) {
    state.isLoading = true
  },
  [FETCH_CLIENTS_END] (state, { clients, clientsCount }) {
    state.clients = clients
    state.clientsCount = clientsCount
    state.isLoading = false
  }
}

const getters = {
  clients (state) {
    return state.clients
  },
  client (state) {
    return state.client
  },
  clientsCount (state) {
    return state.clientsCount
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
