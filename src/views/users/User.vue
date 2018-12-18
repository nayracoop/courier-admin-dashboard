<template>
  <div class="animated fadeIn">
    <b-form @submit.prevent="saveUser(user)">
      <b-card>
        <div slot="header">
          <strong>{{ isEdit ? user.username : 'Datos personales' }}</strong>
        </div>
        <c-user-detail ref="userDetail" :isEdit="isEdit"></c-user-detail>
      </b-card>
      <b-row>
        <b-col sm="12">
        </b-col>
        <b-col class="actions-bar" sm="12">
          <b-button v-if="isEdit" variant="primary" :disabled="inProgress" type="submit">Guardar cambios</b-button>
          <b-button v-else variant="primary" :disabled="inProgress" type="submit">Añadir usuario</b-button> o <b-link :to="{ path: '/usuarios' }">Cancelar</b-link>
        </b-col>
      </b-row>
    </b-form>
    <c-confirmation-modal
      classModal="delete-modal"
      ref="deleteModal"
      :modalTitle="'¿Está seguro que desea eliminar ' + user.username + '?'"
      :promptMessage="'Se eliminará el registro de la lista de usuarios. Esta acción no se puede deshacer.'"
      confirmationMessage="Sí, lo eliminaré"
      cancellationMessage="No, lo conservaré"
      confirmationMethod="confirmDelete"
      cancellationMethod="cancelDelete"
      @confirmDelete="deleteUser()"
      @cancelDelete="hideDeleteModal()" />
    <c-confirmation-modal
      classModal="return-modal"
      ref="returnModal"
      modalTitle="¿Desea descartar los cambios?"
      promptMessage="Hay cambios sin guardar en este registro. Si sale de esta pantalla se perderán. Esta acción no se puede deshacer."
      variantConfirmation="warning"
      confirmationMessage="Sí, descartar cambios"
      cancellationMessage="No, seguir editando"
      confirmationMethod="confirmReturn"
      cancellationMethod="cancelReturn"
      @confirmReturn="confirmReturn(returnTo, user)"
      @cancelReturn="hideReturnModal()" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

import { modalMixin } from '@/mixins/modalMixin'
import { navigationMixin } from '@/mixins/navigationMixin'
import { crudMixin } from '@/mixins/crudMixin'

import CCostTable from '@/components/CostTable'
import CConfirmationModal from '@/components/ConfirmationModal'
import CUserDetail from '@/components/UserDetail'
import { USER_SAVE, USER_EDIT, USER_DELETE, FETCH_USER, USER_RESET_STATE } from '@/store/types/actions'

export default {
  name: 'v-user',
  components: { CCostTable, CConfirmationModal, CUserDetail },
  props: {
    previousUser: {
      type: Object,
      required: false
    }
  },
  mixins: [ modalMixin, navigationMixin, crudMixin ],
  created () {
    this.cleanObject = this._.cloneDeep(this.user)
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(USER_RESET_STATE)
    return next()
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(USER_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(FETCH_USER,
        to.params.id,
        to.params.previousUser
      )
    }
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.user)
    })
  },
  async beforeRouteLeave (to, from, next) {
    if (!this.dirtyCheck(this.user) || this.returnConfirmed) {
      await store.dispatch(USER_RESET_STATE)
      next()
    } else {
      this.showReturnModal(to.path)
      next(false)
    }
  },
  data () {
    return {
      inProgress: false,
      cleanObject: null,
      deleteId: -1,
      returnConfirmed: false,
      returnTo: null
    }
  },
  computed: {
    ...mapGetters(['user']),
    isEdit () {
      return !!this.user.objectId
    }
  },
  methods: {
    saveUser (user) {
      this.$refs.userDetail.validateBeforeSubmit().then(res => {
        if (!res) {
          this.$toasted.global.error_toast({ message: 'Hay campos que no se completaron correctamente. Corríjalos y vuelva a guardar' })
          return false
        }
        this.save(user, this.isEdit ? USER_EDIT : USER_SAVE, 'Editar Usuario')
      })
    },
    deleteUser () {
      this.deleteEl(USER_DELETE, '/usuarios')
    }
  }
}
</script>
