import Parse from 'parse'

export default {
  create (params) {
    let Shipping = Parse.Object.extend('Shipping')
    let shipping = new Shipping()

    return shipping.save(params)
  },
  getAll () {
    let query = new Parse.Query('Shipping')
    query.ascending('name')
    query.doesNotExist('deletedAt')
    query.limit(1000)
    return query.find()
  },
  get (id) {
    let query = new Parse.Query('Shipping')
    query.doesNotExist('deletedAt')

    return query.get(id)
  },
  update (id, params) {
    let query = new Parse.Query('Shipping')

    return query.get(id, {
      success: function (shipping) {
        return shipping.save(params)
      },
      error: function (shipping, error) {
        return error
      }
    })
  },
  delete (id) {
    let query = new Parse.Query('Shipping')

    return query.get(id, {
      success: function (shipping) {
        let d = new Date()
        let n = d.toISOString()
        shipping.set('deletedAt', n)
        return shipping.save()
      },
      error: function (shipping, error) {
        return error
      }
    })
  }
}
