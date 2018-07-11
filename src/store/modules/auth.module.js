import { UsersService } from '@/api'
import { LOGIN, CHECK_AUTH } from '@/store/types/actions'
import { SET_AUTH, PURGE_AUTH, SET_ERROR } from '@/store/types/mutations'

const state = {
  errors: null,
  user: null,
  isAuthenticated: false
}

const getters = {
  currentUser (state) {
    return state.user
  },
  isAuthenticated (state) {
    return state.user ? state.user.authenticated() : false
  }
}

const actions = {
  [LOGIN] (context, credentials) {
    return UsersService.login(credentials)
      .then(data => {
        context.commit(SET_AUTH, data)
        return data
      })
  },
  //   [LOGOUT] (context) {
  //     context.commit(PURGE_AUTH)
  //   },
  //   [REGISTER] (context, credentials) {
  //     return new Promise((resolve, reject) => {
  //       ApiService
  //         .post('users', {user: credentials})
  //         .then(({data}) => {
  //           context.commit(SET_AUTH, data.user)
  //           resolve(data)
  //         })
  //         .catch(({response}) => {
  //           context.commit(SET_ERROR, response.data.errors)
  //         })
  //     })
  //   },
  [CHECK_AUTH] (context) {
    console.log(state.isAuthenticated)
    return state.isAuthenticated
  }
//   [UPDATE_USER] (context, payload) {
//     const {email, username, password, image, bio} = payload
//     const user = {
//       email,
//       username,
//       bio,
//       image
//     }
//     if (password) {
//       user.password = password
//     }

//     return ApiService
//       .put('user', user)
//       .then(({data}) => {
//         context.commit(SET_AUTH, data.user)
//         return data
//       })
//   }
}

const mutations = {
  [SET_ERROR] (state, error) {
    state.errors = error
  },
  [SET_AUTH] (state, user) {
    state.isAuthenticated = true
    state.user = user
    state.errors = {}
  },
  [PURGE_AUTH] (state) {
    state.isAuthenticated = false
    state.user = {}
    state.errors = {}
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
