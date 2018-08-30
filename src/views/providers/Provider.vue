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
            <b-tab title="Precios de venta" v-if="provider.isShipping">
              <b-row class="actions-bar">
                <b-col sm="6">
                  <b-button variant="outline-primary" v-b-modal.fileDialog>Importar <i class="fa fa-file ml-1"></i></b-button>
                  <b-button variant="outline-primary" disabled>Imprimir lista de precios<i class="fa fa-print  ml-1"></i></b-button>
                  <b-modal id="fileDialog" ref="fileDialogModal"
                    hide-footer centered title="Importar precios de venta" >
                    <c-csv-file-dialog cancellationMethod="cancelImport"
                    :provider="provider" @cancelImport="hideImportModal()" />
                  </b-modal>
                </b-col>
              </b-row>
              <c-cost-table></c-cost-table>
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
    <c-confirmation-modal promptMessage="¿Desea eliminar definitivamente el registro seleccionado?"
      ref="deleteModal" title="Eliminar registro"
      confirmationMessage="Sí, deseo eliminarlo" cancellationMessage="Cancelar"
      confirmationMethod="confirmDelete" cancellationMethod="cancelDelete"
      @confirmDelete="deleteProvider()" @cancelDelete="hideDeleteModal()" />
    <c-confirmation-modal promptMessage="El registro fue editado ¿desea abandonar esta pantalla?"
      ref="returnModal" title="Confirmación"
      confirmationMessage="Sí, deseo descartar los cambios" cancellationMessage="Cancelar"
      confirmationMethod="confirmReturn" cancellationMethod="cancelReturn"
      @confirmReturn="confirmReturn(returnTo, provider)" @cancelReturn="hideReturnModal()" />
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
import CConfirmationModal from '@/components/ConfirmationModal'
import CProviderDetail from '@/components/ProviderDetail'
import CCsvFileDialog from '@/components/CsvFileDialog'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, FETCH_PROVIDER, PROVIDER_RESET_STATE } from '@/store/types/actions'

export default {
  name: 'v-provider',
  components: { CCostTable, CConfirmationModal, CProviderDetail, CCsvFileDialog },
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
      returnTo: null
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
