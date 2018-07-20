import { UsersService } from '@/api'
import { LOGIN, CHECK_AUTH } from '@/store/types/actions'
import { SET_ERROR } from '@/store/types/mutations'
import Parse from 'parse'

const state = {
  errors: null
}

const getters = {
  currentUser () {
    return Parse.current()
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
  [CHECK_AUTH] (context) {
    let currentUser = Parse.User.current() // <- Object
    let currentSession = Parse.Session.current() // <- Promise

    return currentSession
      .then(val => {
        return currentUser.authenticated()
      }, error => {
        throw new Error(error)
      })

    // if (currentUser.authenticated()) {
    //   return false
    // } else {
    //   return false
    // }
    // console.log('current')
    // console.log()
    // console.log('currentUser')
    // console.log(currentUser)
    // console.log('session token')
    // console.log(currentUser.getSessionToken())
    // console.log('is valid')
    // console.log(currentUser.isValid())
    // return Parse.User.current().authenticated()
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
