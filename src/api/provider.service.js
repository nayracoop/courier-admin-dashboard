import Parse from 'parse'

export default {
  create (params) {
    let Provider = Parse.Object.extend('Provider')
    let provider = new Provider()

    return provider.save(params)
  },
  getAll () {
    let query = new Parse.Query('Provider')
    query.ascending('name')
    query.doesNotExist('deletedAt')

    return query.find()
  },
  getShipping () {
    let query = new Parse.Query('Provider')
    query.ascending('name')
    query.doesNotExist('deletedAt')
    query.equalTo('isShipping', true)

    return query.find()
  },
  get (id) {
    let query = new Parse.Query('Provider')
    query.doesNotExist('deletedAt')

    return query.get(id)
  },
  update (id, params) {
    let query = new Parse.Query('Provider')

    return query.get(id, {
      success: function (provider) {
        return provider.save(params)
      },
      error: function (provider, error) {
        return error
      }
    })
  },
  delete (id) {
    let query = new Parse.Query('Provider')

    return query.get(id, {
      success: function (provider) {
        let d = new Date()
        let n = d.toISOString()
        provider.set('deletedAt', n)
        return provider.save()
      },
      error: function (provider, error) {
        return error
      }
    })
  },
  getSyncProviders () {
    return Parse.Cloud.run('ProviderSync', {})
  }
}
