import Vue from 'vue'
import { UsersService, RolesService } from '@/api'
import { USER_SAVE, USER_EDIT, USER_DELETE, USER_RESET_STATE, FETCH_USER, FETCH_USERS, FETCH_ROLES } from '@/store/types/actions'
import { RESET_STATE, SET_USER, FETCH_START, FETCH_USERS_END, FETCH_ROLES_END } from '@/store/types/mutations'

const getInitialState = () => {
  return {
    user: {
      username: '',
      email: '',
      password: '',
      role: {}
    },
    users: [],
    roles: [],
    userLoading: false,
    usersCount: 0
  }
}

const state = getInitialState()

export const actions = {
  [USER_SAVE] ({ state }) {
    return UsersService.create(state.user)
  },
  async [FETCH_USERS] ({ commit }) {
    commit(FETCH_START)
    try {
      const users = await UsersService.getAll()
      commit(FETCH_USERS_END, users)
      return users
    } catch (error) {
      console.error(error)
      commit(FETCH_USERS_END, [{}])
      throw new Error(error)
    }
  },
  async [FETCH_USER] ({ commit, state }, userId, prevUser) {
    commit(FETCH_START)
    // avoid extronuous network call if object exists
    if (prevUser !== undefined) {
      return commit(SET_USER, prevUser)
    }
    try {
      const user = await UsersService.get(userId)
      commit(SET_USER, user)
      return user
    } catch (error) {
      console.error(error)
      commit(SET_USER, {})
      throw new Error(error)
    }
  },
  async [USER_EDIT] ({ commit, state }) {
    try {
      const user = await UsersService.update(state.user)
      commit(SET_USER, user)
      return user
    } catch (error) {
      console.error(error)
      commit(SET_USER, {})
      throw new Error(error)
    }
  },
  [USER_DELETE] (context, id) {
    return UsersService.delete(id)
  },
  [USER_RESET_STATE] ({ commit }) {
    commit(RESET_STATE)
  },
  [FETCH_ROLES] ({ commit }) {
    return RolesService.getAll()
      .then(data => {
        commit(FETCH_ROLES_END, data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [FETCH_START] (state) {
    state.userLoading = true
  },
  [FETCH_USERS_END] (state, users) {
    state.users = users.map(function (e) {
      if (e.constructor === Object) {
        return e
      }
      return e.toJSON()
    })
    state.usersCount = users.length
    state.userLoading = false
  },
  [SET_USER] (state, user) {
    state.user = user.constructor === Object ? user : user.toJSON()
    state.userLoading = true
  },
  [RESET_STATE] () {
    const initialState = getInitialState()
    for (let f in state) {
      Vue.set(state, f, initialState[f])
    }
  },
  [FETCH_ROLES_END] (state, roles) {
    state.roles = roles.map(function (e) {
      return e.toJSON()
    })
  }
}

const getters = {
  users (state) {
    return state.users
  },
  user (state) {
    return state.user
  },
  usersCount (state) {
    return state.usersCount
  },
  userLoading (state) {
    return state.userLoading
  },
  roles (state) {
    return state.roles
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
