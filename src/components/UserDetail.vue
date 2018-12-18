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
          <b-form-input :class="{ danger: errors.has('email') }" v-validate="'required'" name="email" data-vv-as="email" type="text" id="email" v-model="user.email" placeholder="Ej: juan@email.com"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('email')">{{ errors.first('email') }}</small></span>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col sm="6">
        <b-form-group>
          <label for="name">Rol</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Rol del usuario"></i>
          <b-form-select id="role" :plain="true" :options="rolesList" v-model="user.role.objectId"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="name">Password</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Password para el usuario"></i>
          <b-form-input :class="{ danger: errors.has('password') }" v-validate="'required'" name="password" data-vv-as="password" type="password" id="password" v-model="user.password" placeholder="Ej: password123"></b-form-input>
        </b-form-group>
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script>
import { FETCH_ROLES } from '@/store/types/actions'
import { mapGetters } from 'vuex'

export default {
  name: 'c-user-detail',
  data () {
    return {
      inProgress: false,
      rolesList: []
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
      this.$store.dispatch(FETCH_ROLES).then(() => {
        this.rolesList = this.roles.map(role => {
          return {value: role.objectId, text: role.name}
        })
      })
    }
  }
}
</script>
