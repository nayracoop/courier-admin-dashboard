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
                <c-provider-detail :provider="provider" :isEdit="isEdit"></c-provider-detail>
              </b-tab>
              <b-tab title="Precios de venta" v-if="provider.isShipping">
                <b-row class="actions-bar">
                  <b-col sm="6">
                    <b-button variant="outline-primary" v-b-modal.fileDialog>Importar <i class="fa fa-file ml-1"></i></b-button>
                    <b-modal id="fileDialog" ref="fileDialogModal"
                      hide-footer centered title="Importar" >
                      <c-csv-file-dialog confirmationMethod="confirmImport" cancellationMethod="cancelImport"
                      :provider="provider"
                      @confirmImport="confirmImport" @cancelImport="hideImportModal" />
                    </b-modal>
                  </b-col>
                </b-row>
                <c-cost-table :provider="provider"></c-cost-table>
              </b-tab>
          </b-tabs>
          <b-col class="actions-bar" sm="12">
            <b-button variant="primary" :disabled="inProgress || !dirtyCheck" @click="saveProvider(provider.objectId, provider)">Guardar <i class="fa fa-floppy-o ml-1"></i></b-button>
            <b-button variant="outline-danger" :disabled="inProgress" v-if="isEdit" @click="showDeleteModal(provider.objectId)">Eliminar <i class="fa fa-trash ml-1"></i></b-button>
            <b-button variant="outline-primary" @click="goNavigate('/proveedores')">Volver <i class="fa fa-arrow-left ml-1"></i></b-button>
          </b-col>
        </b-card>
      </b-col>
    </b-row>
    <c-confirmation-modal promptMessage="¿Desea eliminar definitivamente el registro seleccionado?"
      ref="deleteModal" title="Confirmación"
      confirmationMessage="Sí, deseo eliminarlo" cancellationMessage="No, volveré atrás"
      confirmationMethod="confirmDelete" cancellationMethod="cancelDelete"
      @confirmDelete="confirmDelete" @cancelDelete="hideDeleteModal" />
    <c-confirmation-modal promptMessage="El registro fue editado ¿desea abandonar esta pantalla?"
      ref="returnModal" title="Confirmación"
      confirmationMessage="Sí, deseo descartar los cambios" cancellationMessage="No, volveré a editar"
      confirmationMethod="confirmReturn" cancellationMethod="cancelReturn"
      @confirmReturn="confirmReturn" @cancelReturn="hideReturnModal" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import CErrorList from '@/components/ErrorList'
import CCostTable from '@/components/CostTable'
import CConfirmationModal from '@/components/ConfirmationModal'
import CProviderDetail from '@/components/ProviderDetail'
import CCsvFileDialog from '@/components/CsvFileDialog'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, FETCH_PROVIDER, PROVIDER_RESET_STATE } from '@/store/types/actions'

export default {
  name: 'v-provider',
  components: { CErrorList, CCostTable, CConfirmationModal, CProviderDetail, CCsvFileDialog },
  props: {
    previousProvider: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(PROVIDER_RESET_STATE)
    return next()
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(PROVIDER_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(
        FETCH_PROVIDER,
        to.params.id,
        to.params.previousProvider
      )
    }
    return next()
  },
  async beforeRouteLeave (to, from, next) {
    if (!this.dirtyCheck || this.returnConfirmed) {
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
      errors: {},
      originalProvider: this.provider,
      deleteId: -1,
      returnConfirmed: false,
      returnTo: null
    }
  },
  computed: {
    ...mapGetters(['provider', 'cleanProvider']),
    isEdit () {
      return !!this.provider.objectId
    },
    dirtyCheck () {
      return JSON.stringify(this.cleanProvider) !== JSON.stringify(this.provider)
    }
  },
  methods: {
    saveProvider (id, provider) {
      var $this = this
      $this.inProgress = true
      let action = $this.isEdit ? PROVIDER_EDIT : PROVIDER_SAVE
      $this.$store
        .dispatch(action)
        .then(myProvider => {
          $this.inProgress = false
          $this.$router.push({
            name: 'Editar Proveedor',
            params: {
              id: myProvider.id
            }
          })
          store.dispatch(FETCH_PROVIDER, myProvider.id)
          $this.$toasted.global.success_toast({ message: id ? 'Registro editado con éxito' : 'Registro creado con éxito' })
        }, error => {
          $this.inProgress = false
          $this.$toasted.global.error_toast({ message: error })
        })
    },
    showDeleteModal (id) {
      this.deleteId = id
      this.$refs.deleteModal.$refs.confirmationModal.show()
    },
    hideDeleteModal () {
      this.deleteId = -1
      this.$refs.deleteModal.$refs.confirmationModal.hide()
    },
    confirmDelete () {
      this.inProgress = true
      this.$store
        .dispatch(PROVIDER_DELETE, this.deleteId)
        .then(res => {
          this.inProgress = false
          this.deleteId = -1
          this.$router.push('/proveedores')
          this.$toasted.global.success_toast({ message: 'Registro eliminado con éxito' })
        }, error => {
          this.inProgress = false
          this.deleteId = -1
          this.$toasted.global.error_toast({ message: error })
        })
    },
    showReturnModal (returnTo) {
      this.returnTo = returnTo
      this.$refs.returnModal.$refs.confirmationModal.show()
    },
    hideReturnModal () {
      this.returnConfirmed = false
      this.$refs.returnModal.$refs.confirmationModal.hide()
    },
    confirmReturn () {
      this.returnConfirmed = true
      this.goNavigate()
    },
    confirmImport (event) {
      console.log(event)
    },
    hideImportModal () {
      this.$refs.fileDialogModal.hide()
    },
    goNavigate (returnTo) {
      if (returnTo) this.returnTo = returnTo
      if (!this.dirtyCheck || this.returnConfirmed) {
        this.$router.push(this.returnTo)
      } else {
        this.showReturnModal()
      }
    }
  }
}
</script>
