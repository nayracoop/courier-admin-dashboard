<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header">
            <strong>{{ isEdit ? client.name : 'Nuevo cliente' }}</strong>
          </div>
          <c-client-detail ref="clientDetail" :isEdit="isEdit"></c-client-detail>
        </b-card>
      </b-col>
    </b-row>
    <div role="tablist" class="mb-3">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion1>Direcciones</b-btn>
        </b-card-header>
        <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-address />
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    <b-row class="actions-bar">
      <b-col sm="12">
        <b-button variant="primary" :disabled="inProgress" @click="saveClient(client)">Guardar <i class="fa fa-save ml-1"></i></b-button>
        <b-button variant="outline-danger" :disabled="inProgress" v-if="isEdit" @click="showDeleteModal(client.objectId)">Eliminar <i class="fa fa-trash ml-1"></i></b-button>
        <b-button variant="outline-primary" @click="goNavigate('/clientes', client)">Volver <i class="fa fa-arrow-left ml-1"></i></b-button>
      </b-col>
    </b-row>
    <!-- <pre>{{ JSON.stringify(cleanObject, null, 4) }}</pre>
    <pre>{{ JSON.stringify(client, null, 4) }}</pre> -->
    <c-confirmation-modal classModal="delete-modal" promptMessage="¿Desea eliminar definitivamente el registro seleccionado?"
      ref="deleteModal" :modalTitle="'Eliminar cliente ' + client.name"
      confirmationMessage="Sí, deseo eliminarlo" cancellationMessage="Cancelar"
      confirmationMethod="confirmDelete" cancellationMethod="cancelDelete"
      @confirmDelete="deleteClient()" @cancelDelete="hideDeleteModal()" />
    <c-confirmation-modal classModal="return-modal" promptMessage="El registro fue editado ¿desea abandonar esta pantalla?"
      ref="returnModal" modalTitle="Confirmación"
      confirmationMessage="Sí, deseo descartar los cambios" cancellationMessage="Cancelar"
      confirmationMethod="confirmReturn" cancellationMethod="cancelReturn"
      @confirmReturn="confirmReturn(returnTo, client)" @cancelReturn="hideReturnModal()" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

import modals from '@/shared/modals'
import common from '@/shared/common'
import crud from '@/shared/crud'

import CConfirmationModal from '@/components/ConfirmationModal'
import CAddress from '@/components/Address'
import CClientDetail from '@/components/ClientDetail'
import { CLIENT_SAVE, CLIENT_EDIT, CLIENT_DELETE, FETCH_CLIENT, CLIENT_RESET_STATE } from '@/store/types/actions'

export default {
  name: 'v-client',
  components: { CConfirmationModal, CAddress, CClientDetail },
  props: {
    previousClient: {
      type: Object,
      required: false
    }
  },
  created () {
    this.cleanObject = this._.cloneDeep(this.client)
    this.showDeleteModal = modals.showDeleteModal.bind(this)
    this.hideDeleteModal = modals.hideDeleteModal.bind(this)
    this.showReturnModal = modals.showReturnModal.bind(this)
    this.hideReturnModal = modals.hideReturnModal.bind(this)
    this.hideImportModal = modals.hideImportModal.bind(this)

    this.confirmReturn = common.confirmReturn.bind(this)
    this.goNavigate = common.goNavigate.bind(this)
    this.dirtyCheck = common.dirtyCheck.bind(this)

    this.save = crud.save.bind(this)
    this.deleteEl = crud.deleteEl.bind(this)
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(CLIENT_RESET_STATE)
    return next()
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(CLIENT_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(FETCH_CLIENT,
        to.params.id,
        to.params.previousClient
      )
    }
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.client)
    })
  },
  async beforeRouteLeave (to, from, next) {
    if (!this.dirtyCheck(this.client) || this.returnConfirmed) {
      await store.dispatch(CLIENT_RESET_STATE)
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
    ...mapGetters(['client']),
    isEdit () {
      return !!this.client.objectId
    }
  },
  methods: {
    saveClient (client) {
      this.$refs.clientDetail.validateBeforeSubmit().then(res => {
        if (!res) {
          this.$toasted.global.error_toast({ message: 'Hay campos que no se completaron correctamente. Corríjalos y vuelva a guardar' })
          return false
        }
        this.save(client, this.isEdit ? CLIENT_EDIT : CLIENT_SAVE, 'Editar Cliente')
      })
    },
    deleteClient () {
      this.deleteEl(CLIENT_DELETE, '/clientes')
    }
  }
}
</script>
