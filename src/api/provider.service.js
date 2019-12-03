import Parse from 'parse'

export default {
  async create (params) {
    let Provider = Parse.Object.extend('Provider')
    let provider = new Provider()

    const savedProvider = await provider.save(params)
    Parse.Cloud.run('AfterSaveProvider', {providerId: savedProvider.id})

    return savedProvider
  },
  getAll () {
    let query = new Parse.Query('Provider')
    query.ascending('name')
    query.doesNotExist('deletedAt')
    query.select(['taxCategory',
      'docType',
      'docValue',
      'externalId',
      'userCode',
      'name',
      'businessName',
      'address',
      'email',
      'phone',
      'observation',
      'purchaseAccount',
      'saleAccount',
      'isShipping',
      'insurance'])
    query.limit(1000)
    return query.find()
  },
  getShipping () {
    let query = new Parse.Query('Provider')
    query.ascending('name')
    query.doesNotExist('deletedAt')
    query.equalTo('isShipping', true)
    query.select(['taxCategory',
      'docType',
      'docValue',
      'externalId',
      'userCode',
      'name',
      'businessName',
      'address',
      'email',
      'phone',
      'observation',
      'purchaseAccount',
      'saleAccount',
      'isShipping',
      'insurance'])
    query.limit(1000)
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
  getProvidersSyncDifferences () {
    return Parse.Cloud.run('FetchXubioProvidersSyncDifferences')
  },
  syncProviders () {
    return Parse.Cloud.run('SyncXubioProviders')
  }
}
