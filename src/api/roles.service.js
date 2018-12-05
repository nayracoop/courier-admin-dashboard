import Parse from 'parse'

export default {
  getAll () {
    let query = new Parse.Query(Parse.Role)
    query.ascending('name')
    query.doesNotExist('deletedAt')

    return query.find()
  }
}
