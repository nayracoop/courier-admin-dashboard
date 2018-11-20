<template>
  <div class="animated fadeIn">
    <!-- <b-form @submit.prevent="saveClient(client)">
      <b-row>
        <b-col sm="12">
          <b-card no-body>
            <b-tabs card>
              <b-tab v-bind:title="isEdit ? client.name : 'Datos personales'" active>
                <div slot="header">
                  <strong>{{ isEdit ? client.name : 'Datos personales' }}</strong>
                </div>
                <c-client-detail ref="clientDetail" :isEdit="isEdit"></c-client-detail>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
        <b-col class="actions-bar" sm="12">
          <b-button v-if="isEdit" variant="primary" :disabled="inProgress" type="submit">Guardar cambios</b-button><b-button v-else variant="primary" :disabled="inProgress" type="submit">Añadir cliente</b-button> o <b-link :to="{ path: '/clientes' }">Cancelar</b-link>
        </b-col>
      </b-row>
    </b-form>
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
      @cancelReturn="hideReturnModal()" /> -->
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import store from '@/store'

// import { modalMixin } from '@/mixins/modalMixin'
// import { navigationMixin } from '@/mixins/navigationMixin'
// import { crudMixin } from '@/mixins/crudMixin'

// import CCostTable from '@/components/CostTable'
// import CConfirmationModal from '@/components/ConfirmationModal'
// import CAddresses from '@/components/Addresses'
// import CClientDetail from '@/components/ClientDetail'
// import CCsvFileDialog from '@/components/CsvFileDialog'
// import { CLIENT_SAVE, CLIENT_EDIT, CLIENT_DELETE, FETCH_CLIENT, CLIENT_RESET_STATE, PROVIDER_RESET_STATE, FETCH_SHIPPING_PROVIDERS } from '@/store/types/actions'

export default {
  name: 'v-user'
  // components: { CCostTable, CConfirmationModal, CAddresses, CClientDetail, CCsvFileDialog },
  // props: {
  //   previousClient: {
  //     type: Object,
  //     required: false
  //   }
  // },
  // mixins: [ modalMixin, navigationMixin, crudMixin ],
  // created () {
  //   this.cleanObject = this._.cloneDeep(this.client)

  //   this.fetchProviders().then(() => {
  //     this.providerList = this.providers.map(provider => {
  //       return ({ value: provider.objectId, text: provider.name })
  //     })
  //   })
  // },
  // async beforeRouteUpdate (to, from, next) {
  //   // Reset state if user goes from /editor/:id to /editor
  //   // The component is not recreated so we use to hook to reset the state.
  //   await store.dispatch(CLIENT_RESET_STATE)
  //   await store.dispatch(PROVIDER_RESET_STATE)
  //   return next()
  // },
  // async beforeRouteEnter (to, from, next) {
  //   // SO: https://github.com/vuejs/vue-router/issues/1034
  //   // If we arrive directly to this url, we need to fetch the provider
  //   await store.dispatch(CLIENT_RESET_STATE)
  //   await store.dispatch(PROVIDER_RESET_STATE)
  //   if (to.params.id !== undefined) {
  //     await store.dispatch(FETCH_CLIENT,
  //       to.params.id,
  //       to.params.previousClient
  //     )
  //   }
  //   next(vm => {
  //     vm.cleanObject = vm._.cloneDeep(vm.client)
  //   })
  // },
  // async beforeRouteLeave (to, from, next) {
  //   if (!this.dirtyCheck(this.client) || this.returnConfirmed) {
  //     await store.dispatch(CLIENT_RESET_STATE)
  //     await store.dispatch(PROVIDER_RESET_STATE)
  //     next()
  //   } else {
  //     this.showReturnModal(to.path)
  //     next(false)
  //   }
  // },
  // data () {
  //   return {
  //     inProgress: false,
  //     cleanObject: null,
  //     deleteId: -1,
  //     returnConfirmed: false,
  //     returnTo: null,
  //     filter: null,
  //     providerList: []
  //   }
  // },
  // computed: {
  //   ...mapGetters(['client', 'providers']),
  //   isEdit () {
  //     return !!this.client.objectId
  //   }
  // },
  // methods: {
  //   fetchProviders () {
  //     return this.$store.dispatch(FETCH_SHIPPING_PROVIDERS)
  //   },
  //   saveClient (client) {
  //     // provider.fuelTable.forEach(item => {
  //     //   delete item.edit
  //     // })
  //     // provider.costsTable.forEach(cost => {
  //     //   cost.costs.forEach(item => {
  //     //     delete item.edit
  //     //   })
  //     // })
  //     this.$refs.clientDetail.validateBeforeSubmit().then(res => {
  //       if (!res) {
  //         this.$toasted.global.error_toast({ message: 'Hay campos que no se completaron correctamente. Corríjalos y vuelva a guardar' })
  //         return false
  //       }
  //       this.save(client, this.isEdit ? CLIENT_EDIT : CLIENT_SAVE, 'Editar Cliente')
  //     })
  //   },
  //   deleteClient () {
  //     this.deleteEl(CLIENT_DELETE, '/clientes')
  //   }
  // }
}
</script>
