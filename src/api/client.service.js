// import find from 'lodash/find'
import Parse from 'parse'

export default {
  getAll () {
    var query = new Parse.Query('Client')
    query.ascending('name')

    const myPromise = query.find()
    return myPromise
    // return Promise.resolve({ 'clients': _clients, 'clientsCount': 2 })
  },
  get (id) {
    var query = new Parse.Query('Client')

    const myPromise = query.get(id)
    return myPromise
  },
  create (params) {
    console.log(Parse)
    var Client = Parse.Object.extend('Client')
    var client = new Client()

    client.save(params, {
      success: function (client) {
        console.log('exito')
      },
      error: function (client, error) {
        console.log('error')
      }
    })
  }
}
