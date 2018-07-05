import Parse from 'parse'

export default {
  create (params) {
    var Client = Parse.Object.extend('Client')
    var client = new Client()

    return client.save(params)
  },
  getAll () {
    var query = new Parse.Query('Client')
    query.ascending('name')

    return query.find()
  },
  get (id) {
    var query = new Parse.Query('Client')

    return query.get(id)
  },
  update (params, id) {
    var query = new Parse.Query('Client')

    query.get(id, {
      success: function (client) {
        return client.save(params)
      },
      error: function (client, error) {
        return error
      }
    })
  },
  delete (id) {
    var query = new Parse.Query('Client')

    query.get(id, {
      success: function (client) {
        return client.destroy({})
      },
      error: function (client, error) {
        return error
      }
    })
  }
}
