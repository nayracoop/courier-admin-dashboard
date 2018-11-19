import Parse from 'parse'

export default {
  login (credentials) {
    return Parse.User.logIn(credentials.username, credentials.password)
  },
  logout () {
    return Parse.User.logOut()
  },
  create (params) {
    let User = Parse.User()
    let user = new User()

    return user.save(params)
  },
  getAll () {
    let query = new Parse.Query(Parse.User)
    query.ascending('name')
    query.doesNotExist('deletedAt')

    return query.find()
  },
  get (id) {
    let query = new Parse.Query(Parse.User)
    query.doesNotExist('deletedAt')

    return query.get(id)
  },
  update (id, params) {
    let query = new Parse.Query(Parse.User)

    return query.get(id, {
      success: function (user) {
        return user.save(params)
      },
      error: function (user, error) {
        return error
      }
    })
  },
  delete (id) {
    let query = new Parse.Query(Parse.User)

    return query.get(id, {
      success: function (user) {
        let d = new Date()
        let n = d.toISOString()
        user.set('deletedAt', n)
        return user.save()
      },
      error: function (user, error) {
        return error
      }
    })
  }
}
