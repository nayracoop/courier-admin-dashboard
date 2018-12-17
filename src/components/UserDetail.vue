<template>
  <b-form v-on:submit.prevent>
    <b-form-row>
      <b-col sm="6">
        <b-form-group>
          <label for="name">Nombre</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre del usuario"></i>
          <b-form-input :class="{ danger: errors.has('username') }" v-validate="'required'" name="username" data-vv-as="nombre" type="text" id="username" v-model="user.username" placeholder="Ej: juan"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('username')">{{ errors.first('username') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="name">Email</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Email del usuario"></i>
          <b-form-input :class="{ danger: errors.has('email') }" v-validate="'required'" name="email" data-vv-as="nombre" type="text" id="email" v-model="user.email" placeholder="Ej: juan@email.com"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('email')">{{ errors.first('email') }}</small></span>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col sm="6">
        <b-form-group>
          <label for="name">Rol</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Rol del usuario"></i>
          <b-form-input :class="{ danger: errors.has('role') }" v-validate="'required'" name="role" data-vv-as="nombre" type="text" id="role" v-model="user.role.name" placeholder="Ej: Administrador"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('role')">{{ errors.first('role') }}</small></span>
        </b-form-group>
      </b-col>
    </b-form-row>
    <!-- <pre>{{ JSON.stringify(user, null, 2) }}</pre> -->
  </b-form>
</template>
<script>
import { FETCH_ROLES } from '@/store/types/actions'
import { mapGetters } from 'vuex'

export default {
  name: 'c-user-detail',
  data () {
    return {
      inProgress: false
    }
  },
  mounted () {
    this.fetchRoles()
  },
  props: {
    isEdit: { required: true }
  },
  computed: {
    ...mapGetters(['user', 'roles'])
  },
  methods: {
    validateBeforeSubmit () {
      return this.$validator.validateAll()
    },
    fetchRoles () {
      this.$store.dispatch(FETCH_ROLES)
    }
  }
}
</script>
