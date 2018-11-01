import Vue from 'vue'
import Router from 'vue-router'

// Containers
import DefaultContainer from '@/containers/DefaultContainer'

// Views
import Dashboard from '@/views/Dashboard'

// import Colors from '@/views/theme/Colors'
// import Typography from '@/views/theme/Typography'

// import Charts from '@/views/Charts'
// import Widgets from '@/views/Widgets'

// Views - Components
// import Cards from '@/views/base/Cards'
// import Forms from '@/views/base/Forms'
// import Switches from '@/views/base/Switches'
// import Tables from '@/views/base/Tables'
// import Tabs from '@/views/base/Tabs'
// import Breadcrumbs from '@/views/base/Breadcrumbs'
// import Carousels from '@/views/base/Carousels'
// import Collapses from '@/views/base/Collapses'
// import Jumbotrons from '@/views/base/Jumbotrons'
// import ListGroups from '@/views/base/ListGroups'
// import Navs from '@/views/base/Navs'
// import Navbars from '@/views/base/Navbars'
// import Paginations from '@/views/base/Paginations'
// import Popovers from '@/views/base/Popovers'
// import ProgressBars from '@/views/base/ProgressBars'
// import Tooltips from '@/views/base/Tooltips'

// Views - Buttons
// import StandardButtons from '@/views/buttons/StandardButtons'
// import ButtonGroups from '@/views/buttons/ButtonGroups'
// import Dropdowns from '@/views/buttons/Dropdowns'
// import BrandButtons from '@/views/buttons/BrandButtons'

// Views - Icons
// import Flags from '@/views/icons/Flags'
// import FontAwesome from '@/views/icons/FontAwesome'
// import SimpleLineIcons from '@/views/icons/SimpleLineIcons'
// import CoreUIIcons from '@/views/icons/CoreUIIcons'

// Views - Notifications
// import Alerts from '@/views/notifications/Alerts'
// import Badges from '@/views/notifications/Badges'
// import Modals from '@/views/notifications/Modals'

// Courier
import Providers from '@/views/providers/Providers'
import Provider from '@/views/providers/Provider'

import Clients from '@/views/clients/Clients'
import Client from '@/views/clients/Client'

import Shippings from '@/views/shippings/Shippings'
import Shipping from '@/views/shippings/Shipping'

// import Providers from '@/views/providers/ProviderList'
// import ProviderSingle from '@/views/providers/ProviderSingle'
// import ClientSingle from '@/views/clients/ClientSingle'

// Views - Pages
import Page404 from '@/views/pages/Page404'
// import Page500 from '@/views/pages/Page500'
import Login from '@/views/pages/Login'
// import Register from '@/views/pages/Register'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'proveedores',
          name: 'Proveedores',
          component: Providers
        },
        {
          path: 'proveedores/nuevo',
          name: 'Nuevo Proveedor',
          props: true,
          component: Provider
        },
        {
          path: 'proveedores/editar/:id',
          name: 'Editar Proveedor',
          props: true,
          component: Provider
        },
        {
          path: 'clientes',
          name: 'Clientes',
          component: Clients
        },
        {
          path: 'clientes/editar/:id',
          name: 'Editar Cliente',
          component: Client
        },
        {
          path: 'clientes/nuevo',
          name: 'Nuevo Cliente',
          props: true,
          component: Client
        },
        {
          path: 'envios',
          name: 'Envíos',
          component: Shippings
        },
        {
          path: 'envios/nuevo',
          name: 'Nuevo Envío',
          props: true,
          component: Shipping
        },
        {
          path: 'envios/editar/:id',
          name: 'Editar Envío',
          props: true,
          component: Shipping
        }
      ]
    },
    {
      path: 'login',
      name: 'Login',
      component: Login
    },
    { path: '*', component: Page404 }
  ]
})
