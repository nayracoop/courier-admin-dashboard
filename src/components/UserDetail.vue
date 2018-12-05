<template>
  <b-form v-on:submit.prevent>
    <b-form-row>
      <b-col sm="7">
        <b-form-group>
          <label for="name">Nombre</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre del usuario"></i>
          <b-form-input :class="{ danger: errors.has('username') }" v-validate="'required'" name="username" data-vv-as="nombre" type="text" id="username" v-model="user.username" placeholder="Ej: username"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('username')">{{ errors.first('username') }}</small></span>
        </b-form-group>
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'c-user-detail',
  data () {
    return {
      inProgress: false
    }
  },
  props: {
    isEdit: { required: true }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    validateBeforeSubmit () {
      return this.$validator.validateAll()
    }
  }
}
</script>
