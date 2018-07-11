<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card no-body class="p-4">
            <form v-on:submit.prevent="onSubmit(username, password)">
              <b-card-body>
                <h1>Login</h1>
                <p class="text-muted">Ingresá a tu cuenta</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="Usuario" v-model="username">
                </b-input-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                  <input type="password" class="form-control" placeholder="Password" v-model="password">
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" type="submit">Login</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <b-button disabled variant="link" class="px-0">Olvidaste la contraseña?</b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </form>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { LOGIN } from '@/store/types/actions'

export default {
  name: 'Login',
  data () {
    return {
      username: null,
      password: null
    }
  },
  methods: {
    onSubmit (username, password) {
      this.$store
        .dispatch(LOGIN, { username, password })
        .then(() => {
          this.$router.push({ name: 'Home' })
        }, error => {
          console.log(error)
        })
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
}
</script>
