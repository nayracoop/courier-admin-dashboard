import Vue from 'vue'
import { ClientsService } from '@/api'
import { CLIENT_SAVE, CLIENT_EDIT, CLIENT_DELETE, CLIENT_RESET_STATE, FETCH_CLIENT, FETCH_CLIENTS, FETCH_SYNC_CLIENTS } from '@/store/types/actions'
import { RESET_STATE, SET_CLIENT, FETCH_START, FETCH_CLIENTS_END, FETCH_SYNC_CLIENTS_END } from '@/store/types/mutations'

const getInitialState = () => {
  return {
    client: {
      name: '',
      userCode: '',
      docType: null, // CUIT, DNI, etcétera
      docValue: '', // número de DNI, CUIT, etcétera
      taxCategory: null, // categoría, condición frente al IVA
      cbu: '',

      email: '',
      notifications: false,
      phone: '',

      address:  {
        address1: '',
        address2: '',
        address3: '',
        location: '',
        postalCode: '',
        state: '',
        province: '',
        country: ''
      },
      // Comentar
      // country: null,
      // state: null,
      // province: null,
      // location: null,
      // postalCode: '',
      // hasta aca

      hasPerception: null,
      observation: '',

      externalId: null,
      businessName: '',

      purchaseAccount: null,
      saleAccount: null,

      addresses: [],
      costsTable: []
    },
    clients: [],
    syncClients: [],
    clientLoading: false, // clientLoading se usa en distintos lugares
    clientsCount: 0,
    syncClientsCount: 0
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
  [FETCH_SYNC_CLIENTS] ({ commit }) {
    commit(FETCH_START)
    return ClientsService.getSyncClients()
      .then(data => {
        commit(FETCH_SYNC_CLIENTS_END, data)
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
    state.clientLoading = true
  },
  [FETCH_CLIENTS_END] (state, clients) {
    state.clients = clients.map(function (e) {
      return e.toJSON()
    })
    state.clientsCount = clients.length
    state.clientLoading = false
  },
  [FETCH_SYNC_CLIENTS_END] (state, clients) {
    state.syncClients = clients.map(function (e) {
      if (e.constructor === Object) {
        return e
      }
      return e.toJSON()
    })
    state.syncClientsCount = clients.length
    state.clientLoading = false
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
  syncClients (state) {
    return state.syncClients
  },
  client (state) {
    return state.client
  },
  clientsCount (state) {
    return state.clientsCount
  },
  syncClientsCount (state) {
    return state.syncClientsCount
  },
  clientLoading (state) {
    return state.clientLoading // el getter clientLoading se usa en distintos lugares
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
