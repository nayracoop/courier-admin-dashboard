<template>
  <div class="animated fadeIn">
    <c-shipping-data :clientList="clientList" :providerList="providerList"/>
    <div role="tablist" class="mb-3">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion1>Enviar desde</b-btn>
        </b-card-header>
        <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-address isShipping ref="addressFrom"></c-address>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion2>Enviar hasta</b-btn>
        </b-card-header>
        <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <c-address isShipping ref="addressTo"></c-address>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion3>Información del paquete</b-btn>
        </b-card-header>
        <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <!-- <c-shipping-package></c-shipping-package> -->
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion4>Información de seguimiento</b-btn>
        </b-card-header>
        <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <!-- <c-shipping-tracking></c-shipping-tracking> -->
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    <template>
      <b-row class="actions-bar">
        <b-col sm="12">
          <b-button variant="outline-primary" type="submit">Guardar</b-button>
          <b-button variant="outline-danger">Eliminar</b-button>
          <b-button variant="outline-primary">Volver</b-button>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

import modals from '@/shared/modals'
import common from '@/shared/common'
import crud from '@/shared/crud'

import { SHIPPING_SAVE, SHIPPING_EDIT, SHIPPING_DELETE, FETCH_SHIPPING, FETCH_SHIPPING_PROVIDERS, FETCH_CLIENTS, FETCH_CLIENT, FETCH_PROVIDER, SHIPPING_RESET_STATE } from '@/store/types/actions'

import CShippingData from '@/components/ShippingData'
import CAddress from '@/components/Address'
import CShippingPackage from '@/components/ShippingPackage'
import CShippingTracking from '@/components/ShippingTracking'

export default {
  name: 'v-shipping',
  components: {
    CShippingData,
    CAddress,
    CShippingPackage,
    CShippingTracking
  },
  computed: {
    ...mapGetters([ 'isLoading', 'clients', 'providers', 'shipping' ])
  },
  props: {
    clientId: { type: String, default: null },
    providerId: { type: String, default: null }
  },
  mounted () {
    this.isEdit = !!this.shipping.objectId
    this.cleanObject = this._.cloneDeep(this.shipping)
    // si estoy editando, el envío ya existe
    // busco al cliente y al proveedor asociados
    if (this.isEdit) {
      this.fetchProvider(this.shipping.provider)
      this.fetchClient(this.shipping.client)
    }
    if (this.clientId) {
      this.fetchClient(this.clientId)
      this.shipping.client = this.clientId
    }
    if (this.providerId) {
      this.fetchProvider(this.providerId)
      this.shipping.provider = this.providerId
    }
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

    this.fetchClients().then(() => {
      this.clientList = this.clients.map(client => {
        return ({ value: client.objectId, text: client.name })
      })
    })
    this.fetchProviders().then(() => {
      this.providerList = this.providers.map(provider => {
        return ({ value: provider.objectId, text: provider.name })
      })
    })
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(SHIPPING_RESET_STATE)
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.shipping)
    })
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the shipping
    await store.dispatch(SHIPPING_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(FETCH_SHIPPING,
        to.params.id,
        to.params.previousShipping
      )
    }
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.shipping)
    })
  },
  async beforeRouteLeave (to, from, next) {
    if (!this.dirtyCheck(this.shipping) || this.returnConfirmed) {
      await store.dispatch(SHIPPING_RESET_STATE)
      next()
    } else {
      this.showReturnModal(to.path)
      next(false)
    }
  },
  data () {
    return {
      cleanObject: null,
      clientList: [],
      providerList: [],
      isEdit: false
    }
  },
  methods: {
    fetchClients () {
      return this.$store.dispatch(FETCH_CLIENTS)
    },
    fetchProviders () {
      return this.$store.dispatch(FETCH_SHIPPING_PROVIDERS)
    },
    fetchProvider (id) {
      this.$store.dispatch(FETCH_PROVIDER, id, null)
    },
    fetchClient (id) {
      this.$store.dispatch(FETCH_CLIENT, id, null).then(() => {
        this.$eventHub.$emit('refreshAddresses')
      })
    },
    saveShipping (shipping) {
      this.save(shipping, this.isEdit ? SHIPPING_EDIT : SHIPPING_SAVE, 'Editar Envío')
    },
    deleteShipping () {
      this.deleteEl(SHIPPING_DELETE, '/envios')
    }
  }
}
</script>
