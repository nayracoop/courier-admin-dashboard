import Parse from 'parse'

// Only one role admited
const assignRole = async (user) => {
  await user.fetch({useMasterKey: true})
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
    const {email, username, password} = params
    const user = new Parse.User()
    const createdUser = await user.save({email, username, password}, {useMasterKey: true})
    await assignToRole(createdUser, params.role.objectId)
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
    const {email, username, password} = params
    const query = new Parse.Query(Parse.User)

    try {
      const user = await query.get(id)
      await assignToRole(user, params.role.objectId)
      await user.save({email, username, password}, {useMasterKey: true})
      return user
    } catch (error) {
      throw new Error(error)
    }
  },
  delete (id) {
    const query = new Parse.Query(Parse.User)

    return query.get(id, {
      success: function (user) {
        const d = new Date()
        const n = d.toISOString()
        user.set('deletedAt', n)
        return user.save({}, { useMasterKey: true })
      },
      error: function (user, error) {
        throw new Error(error)
      }
    })
  }
}
