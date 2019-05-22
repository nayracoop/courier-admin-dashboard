import Parse from 'parse'

export default {
  create (params) {
    let Client = Parse.Object.extend('Client')
    let client = new Client()

    return client.save(params)
  },
  getAll () {
    let query = new Parse.Query('Client')
    query.ascending('name')
    query.doesNotExist('deletedAt')
    query.select(['name',
      'userCode',
      'docType',
      'docValue',
      'taxCategory',
      'cbu',
      'email',
      'notifications',
      'phone',
      'hasPerception',
      'observation',
      'externalId',
      'businessName',
      'purchaseAccount',
      'saleAccount',
      'addresses'])

    return query.find()
  },
  get (id) {
    let query = new Parse.Query('Client')
    query.doesNotExist('deletedAt')

    return query.get(id)
  },
  update (id, params) {
    let query = new Parse.Query('Client')

    return query.get(id, {
      success: function (client) {
        return client.save(params)
      },
      error: function (client, error) {
        return error
      }
    })
  },
  delete (id) {
    let query = new Parse.Query('Client')

    return query.get(id, {
      success: function (client) {
        let d = new Date()
        let n = d.toISOString()
        client.set('deletedAt', n)
        return client.save()
      },
      error: function (client, error) {
        return error
      }
    })
  },
  getSyncClients () {
    return Parse.Cloud.run('ClientSync', {})
  }
}
