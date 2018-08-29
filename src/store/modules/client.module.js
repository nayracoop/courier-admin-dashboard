import Vue from 'vue'
import { ClientsService } from '@/api'
import { CLIENT_SAVE, CLIENT_EDIT, CLIENT_DELETE, CLIENT_RESET_STATE, FETCH_CLIENT, FETCH_CLIENTS } from '@/store/types/actions'
import { RESET_STATE, SET_CLIENT, FETCH_START, FETCH_CLIENTS_END } from '@/store/types/mutations'

const getInitialState = () => {
  return {
    client: {
      taxCategory: null, // categoría, condición frente al IVA
      docType: null, // CUIT, DNI, etcétera
      docValue: '', // número de DNI, CUIT, etcétera
      externalId: '',
      userCode: '',
      name: '',
      businessName: '',
      address: '',
      country: null,
      state: null,
      province: null,
      location: null,
      postalCode: '',
      email: '',
      phone: '',
      notifications: null,
      observation: '',
      purchaseAccount: null,
      saleAccount: null,
      cbu: '',
      hasPerception: null,
      addresses: []
    },
    clients: [],
    isLoading: false, // isLoading se usa en distintos lugares
    clientsCount: 0
  }
}

const state = getInitialState()

export const actions = {
  [CLIENT_SAVE] ({ state }) {
    return ClientsService.create(state.client)
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
  },
  [FETCH_CLIENT] (context, clientId, prevClient) {
    // avoid extronuous network call if object exists
    if (prevClient !== undefined) {
      return context.commit(SET_CLIENT, prevClient)
    }
    return ClientsService.get(clientId)
      .then(data => {
        context.commit(SET_CLIENT, data)
        return data
      })
  },
  [CLIENT_EDIT] ({ commit, state }) {
    return ClientsService.update(state.client.objectId, state.client)
      .then(data => {
        commit(SET_CLIENT, data)
        return data
      })
  },
  [CLIENT_DELETE] (context, id) {
    return ClientsService.delete(id)
  },
  [CLIENT_RESET_STATE] ({ commit }) {
    commit(RESET_STATE)
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [FETCH_START] (state) {
    state.isLoading = true
  },
  [FETCH_CLIENTS_END] (state, clients) {
    state.clients = clients.map(function (e) {
      return e.toJSON()
    })
    state.clientsCount = clients.length
    state.isLoading = false
  },
  [SET_CLIENT] (state, client) {
    state.client = client.toJSON()
  },
  [RESET_STATE] () {
    const initialState = getInitialState()
    for (let f in state) {
      Vue.set(state, f, initialState[f])
    }
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
