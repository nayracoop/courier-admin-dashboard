import { UsersService } from '@/api'
import { LOGIN, LOGOUT, CHECK_AUTH, CHECK_ROLE } from '@/store/types/actions'
import { SET_ERROR } from '@/store/types/mutations'
import Parse from 'parse'

const state = {
  errors: null
}

const getters = {
  currentUser () {
    return Parse.User.current()
  },
  isAuthenticated () {
    let currentUser = Parse.User.current()
    return currentUser.authenticated()
  }
}

const actions = {
  [LOGIN] (context, credentials) {
    return UsersService.login(credentials)
      .then(data => {
        return data
      })
  },
  [LOGOUT] () {
    return UsersService.logout()
      .then(data => {
        return data
      })
  },
  [CHECK_AUTH] () {
    let currentUser = Parse.User.current() // <- Object
    let currentSession = Parse.Session.current() // <- Promise

    return currentSession
      .then(val => {
        return currentUser.authenticated()
      }, error => {
        throw new Error(error)
      })
  },
  async [CHECK_ROLE] (context, roleName) {
    const rolesQuery = new Parse.Query(Parse.Role)
    rolesQuery.equalTo('name', roleName)
    const role = await rolesQuery.first()
    const roleUsers = await role.getUsers().query().find()
    const currentUser = Parse.User.current()
    return roleUsers.some(user => user.id === currentUser.id)
  }
}

const mutations = {
  [SET_ERROR] (state, error) {
    state.errors = error
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
