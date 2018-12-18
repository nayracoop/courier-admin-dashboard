<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img
        src="/courieradmin/static/img/avatars/avatar.png"
        class="img-avatar"
        alt="admin@bootstrapmaster.com" />
    </template>\
    <template slot="dropdown">
      <!--b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
      <b-dropdown-item><i class="fa fa-bell-o" /> Updates
        <b-badge variant="info">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-envelope-o" /> Messages
        <b-badge variant="success">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-tasks" /> Tasks
        <b-badge variant="danger">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-comments" /> Comments
        <b-badge variant="warning">{{ itemsCount }}</b-badge>
      </b-dropdown-item-->
      <b-dropdown-header
        tag="div"
        class="text-center">
        <strong class="text-uppercase">Mi cuenta</strong>
      </b-dropdown-header>
      <!--b-dropdown-item><i class="fa fa-user" /> Mis datos</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-wrench" /> Settings</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-usd" /> Payments
        <b-badge variant="secondary">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-file" /> Projects
        <b-badge variant="primary">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-divider />
      <b-dropdown-item><i class="fa fa-shield" /> Lock Account</b-dropdown-item-->
      <b-dropdown-item @click="logout"><i class="fa fa-sign-out" /> Cerrar sesión</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
import { LOGOUT } from '@/store/types/actions'
export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  methods: {
    logout () {
      let $this = this
      $this.$store
        .dispatch(LOGOUT)
        .then(val => {
          $this.$router.push({ name: 'Login' })
        }, error => {
          $this.$toasted.global.error_toast({ message: error })
        })
    }
  }
}
</script>
