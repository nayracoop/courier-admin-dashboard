import Parse from 'parse'

export default {
  getAll () {
    let query = new Parse.Query(Parse.Role)
    query.ascending('name')
    query.doesNotExist('deletedAt')
    query.limit(1000)
    return query.find()
  }
}
