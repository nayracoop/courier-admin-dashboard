export default {
  items: [
    {
      title: true,
      name: 'Courier'
    },
    {
      name: 'Courier',
      url: '/courier',
      children: [
        {
          name: 'Proveedores',
          url: '/courier/proveedores'
        },
        {
          name: 'Clientes',
          url: '/courier/clientes'
        }
      ]
    }
  ]
}
