<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card no-body>
          <b-tabs card>
            <b-tab v-bind:title="isEdit ? client.name : 'Nuevo cliente'" active>
              <div slot="header">
                <strong>{{ isEdit ? client.name : 'Nuevo cliente' }}</strong>
              </div>
              <c-client-detail ref="clientDetail" :isEdit="isEdit"></c-client-detail>
              <div role="tablist" class="mb-3">
                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-btn block href="#" v-b-toggle.accordion1>Direcciones</b-btn>
                  </b-card-header>
                  <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                      <c-addresses />
                    </b-card-body>
                  </b-collapse>
                </b-card>
              </div>
            </b-tab>
            <b-tab title="Descuentos">
              <b-row class="actions-bar">
                <b-col sm="6">
                  <b-button variant="outline-primary" v-b-modal.fileDialog>Importar <i class="fa fa-file ml-1"></i></b-button>
                  <b-button variant="outline-primary" disabled>Imprimir lista de descuentos<i class="fa fa-print  ml-1"></i></b-button>
                  <b-modal id="fileDialog" ref="fileDialogModal" hide-footer centered title="Importar lista de descuentos" class="import-modal">
                    <c-csv-file-dialog
                      bodyMessage="Elija un archivo para importar la lista de descuentos. Únicamente se permiten archivos .csv"
                      cancellationMessage="Cancelar"
                      cancellationMethod="cancelImport"
                      @cancelImport="hideImportModal()" />
                  </b-modal>
                </b-col>
                <b-form-group class="ml-auto col-6">
                  <b-input-group>
                    <b-form-input v-model="filter" placeholder="Buscar..." />
                    <b-input-group-append>
                      <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-row>
              <c-cost-table :filter="filter" variant="client" :providerList="providerList"></c-cost-table>
            </b-tab>
          </b-tabs>
          <b-col class="actions-bar" sm="12">
            <b-button variant="primary" :disabled="inProgress" @click="saveClient(client)">Guardar <i class="fa fa-save ml-1"></i></b-button>
            <b-button variant="outline-danger" :disabled="inProgress" v-if="isEdit" @click="showDeleteModal(client.objectId)">Eliminar <i class="fa fa-trash ml-1"></i></b-button>
            <b-button variant="outline-primary" @click="goNavigate('/clientes', client)">Volver <i class="fa fa-arrow-left ml-1"></i></b-button>
          </b-col>
        </b-card>
      </b-col>
    </b-row>

    <c-confirmation-modal
      classModal="delete-modal"
      ref="deleteModal"
      :modalTitle="'¿Está seguro que desea eliminar ' + client.name + '?'"
      :promptMessage="'Se eliminará el registro de la lista de clientes. Esta acción no se puede deshacer.'"
      confirmationMessage="Sí, lo eliminaré"
      cancellationMessage="No, lo conservaré"
      confirmationMethod="confirmDelete"
      cancellationMethod="cancelDelete"
      @confirmDelete="deleteClient()"
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
      @confirmReturn="confirmReturn(returnTo, client)"
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
import CAddresses from '@/components/Addresses'
import CClientDetail from '@/components/ClientDetail'
import CCsvFileDialog from '@/components/CsvFileDialog'
import { CLIENT_SAVE, CLIENT_EDIT, CLIENT_DELETE, FETCH_CLIENT, CLIENT_RESET_STATE, PROVIDER_RESET_STATE, FETCH_SHIPPING_PROVIDERS } from '@/store/types/actions'

export default {
  name: 'v-client',
  components: { CCostTable, CConfirmationModal, CAddresses, CClientDetail, CCsvFileDialog },
  props: {
    previousClient: {
      type: Object,
      required: false
    }
  },
  mixins: [ modalMixin, navigationMixin, crudMixin ],
  created () {
    this.cleanObject = this._.cloneDeep(this.client)

    this.fetchProviders().then(() => {
      this.providerList = this.providers.map(provider => {
        return ({ value: provider.objectId, text: provider.name })
      })
    })
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(CLIENT_RESET_STATE)
    await store.dispatch(PROVIDER_RESET_STATE)
    return next()
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(CLIENT_RESET_STATE)
    await store.dispatch(PROVIDER_RESET_STATE)
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
      await store.dispatch(PROVIDER_RESET_STATE)
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
      returnTo: null,
      filter: null,
      providerList: []
    }
  },
  computed: {
    ...mapGetters(['client', 'providers']),
    isEdit () {
      return !!this.client.objectId
    }
  },
  methods: {
    fetchProviders () {
      return this.$store.dispatch(FETCH_SHIPPING_PROVIDERS)
    },
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
