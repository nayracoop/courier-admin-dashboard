import Parse from 'parse'

export default {
  create (params) {
    var Provider = Parse.Object.extend('Provider')
    var provider = new Provider()

    return provider.save(params)
  },
  getAll () {
    var query = new Parse.Query('Provider')
    query.ascending('name')

    return query.find()
  },
  get (id) {
    var query = new Parse.Query('Provider')

    return query.get(id)
  },
  update (params, id) {
    var query = new Parse.Query('Provider')

    query.get(id, {
      success: function (provider) {
        return provider.save(params)
      },
      error: function (provider, error) {
        return error
      }
    })
  },
  delete (id) {
    var query = new Parse.Query('Provider')

    query.get(id, {
      success: function (provider) {
        return provider.destroy({})
      },
      error: function (provider, error) {
        return error
      }
    })
  }
}
