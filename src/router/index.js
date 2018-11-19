import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'
import { CHECK_AUTH } from '@/store/types/actions'

// Containers
import DefaultContainer from '@/containers/DefaultContainer'

// Views
import Dashboard from '@/views/Dashboard'

// Courier
import Providers from '@/views/providers/Providers'
import Provider from '@/views/providers/Provider'

import Clients from '@/views/clients/Clients'
import Client from '@/views/clients/Client'

import Shippings from '@/views/shippings/Shippings'
import Shipping from '@/views/shippings/Shipping'

import Users from '@/views/users/Users'
import User from '@/views/users/User'

// Views - Pages
import Page404 from '@/views/pages/Page404'
import Login from '@/views/pages/Login'
// import Page500 from '@/views/pages/Page500'
// import Register from '@/views/pages/Register'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: String(process.env.BASE_URL),
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
        },
        {
          path: 'usuarios',
          name: 'Usuarios',
          component: Users
        },
        {
          path: 'usuarios/nuevo',
          name: 'Nuevo Usuario',
          props: true,
          component: User
        },
        {
          path: 'usuarios/editar/:id',
          name: 'Editar Usuario',
          props: true,
          component: User
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

router.beforeEach(
  (to, from, next) => {
    if (to.name !== 'Login') {
      return store.dispatch(CHECK_AUTH)
        .then(isAuthenticated => {
          if (isAuthenticated) {
            next()
          } else {
            next({ name: 'Login' })
          }
        }, error => {
          console.log(error)
          next({ name: 'Login' })
        })
    } else {
      next()
    }
  }
)

export default router
