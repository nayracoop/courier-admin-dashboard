import Parse from 'parse'

export default {
  login (credentials) {
    return Parse.User.logIn(credentials.username, credentials.password)
  },
  logout () {
    return Parse.User.logOut()
  },
  async create (user) {
    const {email, username, password, role} = user
    const createdUser = await Parse.Cloud.run('CreateUser', {email, username, password, role})
    return createdUser
  },
  async getAll () {
    const users = await Parse.Cloud.run('GetAllUsers')
    return users
  },
  async get (id) {
    const user = await Parse.Cloud.run('GetUserById', {id})
    return user
  },
  async update (user) {
    const {objectId: id, email, username, password, role} = user
    const updatedUser = await Parse.Cloud.run('UpdateUser', {id, email, username, password, role})
    return updatedUser
  },
  delete (id) {
    const query = new Parse.Query(Parse.User)

    return query.get(id, {
      success: function (user) {
        const d = new Date()
        const n = d.toISOString()
        user.set('deletedAt', n)
        return user.save()
      },
      error: function (user, error) {
        throw new Error(error)
      }
    })
  }
}
