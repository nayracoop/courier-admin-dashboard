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
                    <b-button variant="outline-primary" disabled>Importar <i class="fa fa-file ml-1"></i></b-button>
                  </b-col>
                </b-row>
                <c-cost-table :provider="provider"></c-cost-table>
              </b-tab>
          </b-tabs>
          <b-col class="actions-bar" sm="12">
            <b-button variant="primary" :disabled="inProgress || !dirtyCheck" @click="saveProvider(provider.objectId, provider)">Guardar <i class="fa fa-floppy-o ml-1"></i></b-button>
            <b-button variant="outline-primary" :disabled="inProgress" v-if="isEdit" @click="showModal(provider.objectId)">Eliminar <i class="fa fa-trash ml-1"></i></b-button>
            <b-button variant="outline-primary" @click="$router.go(-1)">Volver <i class="fa fa-arrow-left ml-1"></i></b-button>
          </b-col>
        </b-card>
      </b-col>
    </b-row>
    <c-confirmation-modal @confirm="confirmDelete()" @cancel="hideModal()" :count="1" ref="confirmationModal" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import CErrorList from '@/components/ErrorList'
import CCostTable from '@/components/CostTable'
import CConfirmationModal from '@/components/DeleteConfirmation'
import CProviderDetail from '@/components/ProviderDetail'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, FETCH_PROVIDER, PROVIDER_RESET_STATE } from '@/store/types/actions'

export default {
  name: 'v-provider',
  components: {
    CErrorList,
    CCostTable,
    CConfirmationModal,
    CProviderDetail
  },
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
    await store.dispatch(PROVIDER_RESET_STATE)
    next()
  },
  data () {
    return {
      inProgress: false,
      errors: {},
      originalProvider: this.provider,
      deleteId: -1
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
    showModal (id) {
      this.deleteId = id
      this.$refs.confirmationModal.$refs.deleteModal.show()
    },
    hideModal () {
      this.deleteId = -1
      this.$refs.confirmationModal.$refs.deleteModal.hide()
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
    }
  }
}
</script>
