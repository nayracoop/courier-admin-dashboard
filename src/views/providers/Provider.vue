<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card no-body>
          <b-tabs card>
            <b-tab v-bind:title="isEdit ? provider.name : 'Nuevo proveedor'" active>
              <div slot="header">
                <strong>{{ isEdit ? provider.name : 'Nuevo proveedor' }}</strong>
              </div>
              <c-provider-detail ref="providerDetail" :isEdit="isEdit"></c-provider-detail>
            </b-tab>
            <b-tab title="Zonas" v-if="provider.isShipping">
              <b-row class="actions-bar">
                <b-col sm="6">
                  <b-button variant="outline-primary" v-b-modal.fileDialog>Importar <i class="fa fa-file ml-1"></i></b-button>
                  <b-button variant="outline-primary" disabled>Imprimir zonas por país<i class="fa fa-print ml-1"></i></b-button>
                  <b-modal id="fileDialog" ref="fileDialogModal" hide-footer centered title="Importar zonas por país" class="import-modal">
                    <c-csv-file-dialog
                      bodyMessage="Elija un archivo para importar zonas por país. Únicamente se permiten archivos .csv"
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
              <c-zones-table :filter="filter" variant="provider"></c-zones-table>
            </b-tab>
            <b-tab title="Precios de venta" v-if="provider.isShipping">
              <b-row class="actions-bar">
                <b-col sm="6">
                  <b-button variant="outline-primary" v-b-modal.fileDialog>Importar <i class="fa fa-file ml-1"></i></b-button>
                  <b-button variant="outline-primary" disabled>Imprimir lista de precios<i class="fa fa-print ml-1"></i></b-button>
                  <b-modal id="fileDialog" ref="fileDialogModal" hide-footer centered title="Importar precios de venta" class="import-modal">
                    <c-csv-file-dialog
                      bodyMessage="Elija un archivo para importar los precios de venta. Únicamente se permiten archivos .csv"
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
              <c-cost-table :filter="filter" variant="provider"></c-cost-table>
            </b-tab>
            <b-tab title="Costo de combustible" v-if="provider.isShipping">
              <c-fuel-table :filter="filter" variant="provider"></c-fuel-table>
            </b-tab>
          </b-tabs>
          <b-col class="actions-bar" sm="12">
            <b-button variant="primary" :disabled="inProgress" @click="saveProvider(provider)">Guardar <i class="fa fa-floppy-o ml-1"></i></b-button>
            <b-button variant="outline-danger" :disabled="inProgress" v-if="isEdit" @click="showDeleteModal(provider.objectId)">Eliminar <i class="fa fa-trash ml-1"></i></b-button>
            <b-button variant="outline-primary" @click="goNavigate('/proveedores', provider)">Volver <i class="fa fa-arrow-left ml-1"></i></b-button>
          </b-col>
        </b-card>
      </b-col>
    </b-row>
    <c-confirmation-modal
      classModal="delete-modal"
      ref="deleteModal"
      :modalTitle="'¿Está seguro que desea eliminar ' + provider.name + '?'"
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
      @confirmReturn="confirmReturn(returnTo, provider)"
      @cancelReturn="hideReturnModal()"
    />
    <!-- <pre>{{ JSON.stringify(this.provider, null, 2) }}</pre>
    <pre>{{ JSON.stringify(this.cleanObject, null, 2) }}</pre> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'

import modals from '@/shared/modals'
import common from '@/shared/common'
import crud from '@/shared/crud'

import CCostTable from '@/components/CostTable'
import CZonesTable from '@/components/ZonesTable'
import CFuelTable from '@/components/FuelTable'
import CConfirmationModal from '@/components/ConfirmationModal'
import CProviderDetail from '@/components/ProviderDetail'
import CCsvFileDialog from '@/components/CsvFileDialog'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, FETCH_PROVIDER, PROVIDER_RESET_STATE } from '@/store/types/actions'

export default {
  name: 'v-provider',
  components: { CCostTable, CConfirmationModal, CProviderDetail, CCsvFileDialog, CZonesTable, CFuelTable },
  props: {
    previousProvider: {
      type: Object,
      required: false
    }
  },
  mounted () {
    this.cleanObject = this._.cloneDeep(this.provider)
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
    await store.dispatch(PROVIDER_RESET_STATE)
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.provider)
    })
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(PROVIDER_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(FETCH_PROVIDER,
        to.params.id,
        to.params.previousProvider
      )
    }
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.provider)
    })
  },
  async beforeRouteLeave (to, from, next) {
    if (!this.dirtyCheck(this.provider) || this.returnConfirmed) {
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
      filter: null
    }
  },
  computed: {
    ...mapGetters(['provider']),
    isEdit () {
      return !!this.provider.objectId
    }
  },
  methods: {
    saveProvider (provider) {
      this.$refs.providerDetail.validateBeforeSubmit().then(res => {
        if (!res) {
          this.$toasted.global.error_toast({ message: 'Hay campos que no se completaron correctamente. Corríjalos y vuelva a guardar' })
          return false
        }
        this.save(provider, this.isEdit ? PROVIDER_EDIT : PROVIDER_SAVE, 'Editar Proveedor')
      })
    },
    deleteProvider () {
      this.deleteEl(PROVIDER_DELETE, '/proveedores')
    }
  }
}
</script>
