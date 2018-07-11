import Parse from 'parse'

export default {
  login (credentials) {
    return Parse.User.logIn(credentials.username, credentials.password)
  }
}
