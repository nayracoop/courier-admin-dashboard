import store from '@/store'
import { CHECK_ROLE } from '@/store/types/actions'

const getMenu = async () => {
  const isAdmin = await store.dispatch(CHECK_ROLE, 'Administrador')
  const items = [
    {
      title: true,
      name: 'Courier'
    },
    {
      name: 'Proveedores',
      url: '/proveedores',
      icon: 'fa fa-truck'
    },
    {
      name: 'Clientes',
      url: '/clientes',
      icon: 'icon-people'
    },
    {
      name: 'Envios',
      url: '/envios',
      icon: 'fa fa-plane'
    }
  ]
  if (isAdmin) {
    items.push(
      {
        name: 'Usuarios',
        url: '/usuarios',
        icon: 'fa fa-users'
      })
  }
  return items
}

export default getMenu
