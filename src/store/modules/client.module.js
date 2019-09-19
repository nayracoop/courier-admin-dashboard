import Vue from 'vue'
import { ClientsService } from '@/api'
import { CLIENT_SAVE, CLIENT_EDIT, CLIENT_DELETE, CLIENT_RESET_STATE, FETCH_CLIENT, FETCH_CLIENTS, FETCH_CLIENTS_SYNC_DIFFERENCES, CLIENTS_SYNC } from '@/store/types/actions'
import { RESET_STATE, SET_CLIENT, FETCH_CLIENT_START, SYNCH_CLIENT_START, FETCH_CLIENTS_END, FETCH_CLIENTS_SYNC_DIFFERENCES_END, SYNC_CLIENTS_END } from '@/store/types/mutations'

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

      address: {
        streetAddress: '',
        city: '',
        postalCode: '',
        state: '',
        province: null,
        country: null
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
    clientLoading: false, // clientLoading se usa en distintos lugares
    clientSynching: false,
    clientsCount: 0,
    clientsCanSync: false,
    clientsImport: 0,
    clientsExport: 0
  }
}

const state = getInitialState()

export const actions = {
  [CLIENT_SAVE] ({ state }) {
    return ClientsService.create(state.client)
  },
  [FETCH_CLIENTS] ({ commit }) {
    commit(FETCH_CLIENT_START)
    return ClientsService.getAll()
      .then(data => {
        commit(FETCH_CLIENTS_END, data)
      })
      .catch((error) => {
        throw error
      })
  },
  [FETCH_CLIENTS_SYNC_DIFFERENCES] ({ commit }) {
    commit(SYNCH_CLIENT_START)
    return ClientsService.getClientsSyncDifferences()
      .then((syncDifferencesDetails) => {
        commit(FETCH_CLIENTS_SYNC_DIFFERENCES_END, syncDifferencesDetails)
      })
      .catch((error) => {
        commit(FETCH_CLIENTS_SYNC_DIFFERENCES_END)
        throw error
      })
  },
  [CLIENTS_SYNC] ({ commit }) {
    commit(SYNCH_CLIENT_START)
    return ClientsService.syncClients()
      .then((results) => {
        commit(SYNC_CLIENTS_END)
        return results
      })
      .catch((error) => {
        commit(SYNC_CLIENTS_END)
        throw error
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
  [FETCH_CLIENT_START] (state) {
    state.clientLoading = true
  },
  [SYNCH_CLIENT_START] (state) {
    state.clientLoading = true
    state.clientSynching = true
  },
  [FETCH_CLIENTS_END] (state, clients) {
    state.clients = clients.map(function (e) {
      return e.toJSON()
    })
    state.clientsCount = clients.length
    state.clientLoading = false
  },
  [FETCH_CLIENTS_SYNC_DIFFERENCES_END] (state, syncDifferencesDetails = null) {
    if (syncDifferencesDetails) {
      state.clientsCanSync = syncDifferencesDetails.canSync
      state.clientsImport = syncDifferencesDetails.xubio
      state.clientsExport = syncDifferencesDetails.parse
    }
    state.clientSynching = false
    state.clientLoading = false
  },
  [SYNC_CLIENTS_END] (state) {
    state.clientSynching = false
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
  client (state) {
    return state.client
  },
  clientsCount (state) {
    return state.clientsCount
  },
  clientLoading (state) {
    return state.clientLoading // el getter clientLoading se usa en distintos lugares
  },
  clientSynching (state) {
    return state.clientSynching
  },
  clientSyncDifferencesDetails (state) {
    return {
      canSync: state.clientsCanSync,
      import: state.clientsImport,
      export: state.clientsExport
    }
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
