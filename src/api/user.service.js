import Parse from 'parse'

// Only one role admited
const assignRole = async (user) => {
  const query = new Parse.Query(Parse.Role)
  query.equalTo('users', user)
  const roles = await query.find()
  user.set('role', roles ? roles[0].toJSON() : null)
}

const assignToRole = async (user, roleId) => {
  const query = new Parse.Query(Parse.Role)
  query.get(roleId)
  const role = await query.first()
  role.getUsers().add(user)
  role.save({}, { useMasterKey: true })
}

export default {
  login (credentials) {
    return Parse.User.logIn(credentials.username, credentials.password)
  },
  logout () {
    return Parse.User.logOut()
  },
  async create (params) {
    const User = Parse.User()
    const user = new User()
    const createdUser = await user.save(params)
    await assignToRole(createdUser, params.role.id)
    return createdUser
  },
  async getAll () {
    const query = new Parse.Query(Parse.User)
    query.ascending('name')
    query.doesNotExist('deletedAt')
    const users = await query.find()
    for (const user of users) {
      await assignRole(user)
    }
    return users
  },
  async get (id) {
    const query = new Parse.Query(Parse.User)
    query.doesNotExist('deletedAt')
    const user = await query.get(id)
    await assignRole(user)
    return user
  },
  async update (id, params) {
    let query = new Parse.Query(Parse.User)

    try {
      const user = await query.get(id)
      await assignToRole(user, params.role.id)
      return user.save(params)
    } catch (error) {
      return error
    }
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
