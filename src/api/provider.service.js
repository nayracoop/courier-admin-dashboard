import find from 'lodash/find'

const _providers = [{
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
    return Promise.resolve({ 'providers': _providers, 'providersCount': 2 })
  },
  get (id) {
    let provider = find(_providers, { id: id })
    return Promise.resolve({ 'provider': provider })
  }
}
