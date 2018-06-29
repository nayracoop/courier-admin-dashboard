import find from 'lodash/find'
import Parse from 'parse'

const _clients = [{
  id: '12',
  vatId: '123',
  taxCategory: 'Toda',
  postalCode: '1234',
  purchaseAccount: 'Cuenta',
  saleAccount: 'Venta',
  address: 'Dirección 1234',
  email: 'mail@mail.net',
  taxType: 'Bueno',
  name: 'Juan Carlos',
  observation: 'Ninguna',
  country: 'AR',
  externalId: '123',
  province: 'Argentina',
  businessName: 'Todo el nombre',
  phone: '233',
  userCode: '112'
},
{
  id: '16',
  vatId: '556',
  taxCategory: 'Toda',
  postalCode: '5678',
  purchaseAccount: 'Cuenta de compra',
  saleAccount: 'Venta2',
  address: 'DireccWenc 2456',
  email: 'mail@tumail.com',
  taxType: 'Malo',
  name: 'El nombre',
  observation: 'Esta es la observación',
  country: 'CO',
  externalId: '1234',
  province: 'Dinamarca',
  businessName: 'Nombre de negocio',
  phone: '12345',
  userCode: 'Codigo'
}]

export default {
  getAll () {
    var query = new Parse.Query('Client')
    query.ascending('name')

    const myPromise = query.find()
    return myPromise
    // return Promise.resolve({ 'clients': _clients, 'clientsCount': 2 })
  },
  get (id) {
    let client = find(_clients, { id: id })
    return Promise.resolve({ 'client': client })
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
