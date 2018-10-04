<template>
  <div class="animated fadeIn">
    <b-form @submit.prevent="saveShipping">
      <!-- <template>
        <b-row class="actions-bar">
          <b-col sm="12">
            <b-button variant="primary" type="submit">Guardar <i class="fa fa-save ml-1"></i></b-button>
          </b-col>
        </b-row>
      </template> -->
      <b-row>
        <b-col sm="12">
          <c-shipping-data :clientList="clientList" :providerList="providerList" ref="shippingDataForm"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-card>
            <div slot="header">Origen</div>
            <c-addresses isShipping ref="addressFromForm"></c-addresses>
          </b-card>
        </b-col>
        <b-col md="6">
          <b-card>
            <div slot="header">Destino</div>
            <c-addresses isShipping ref="addressToForm"></c-addresses>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-card>
            <div slot="header">Información del paquete</div>
            <c-shipping-package ref="packageForm"></c-shipping-package>
          </b-card>
        </b-col>
        <b-col md="12">
          <b-card>
            <div slot="header">Información de seguimiento</div>
            <c-shipping-tracking ref="trackingForm"></c-shipping-tracking>
          </b-card>
        </b-col>
      </b-row>
      <template>
        <b-row class="actions-bar">
          <b-col sm="12">
            <b-button variant="primary" type="submit">
              <!-- <i class="fa fa-save ml-1"></i> -->
              Añadir envío
            </b-button> o <b-link :to="{ path: '/envios' }">Cancelar</b-link>
            <!-- <b-button variant="outline-danger">Eliminar <i class="fa fa-trash ml-1"></i></b-button> -->
            <!-- <b-button variant="outline-primary">Volver <i class="fa fa-arrow-left ml-1"></i></b-button> -->
          </b-col>
        </b-row>
      </template>
    </b-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

import { modalMixin } from '@/mixins/modalMixin'
import { navigationMixin } from '@/mixins/navigationMixin'
import { crudMixin } from '@/mixins/crudMixin'

import { SHIPPING_SAVE, SHIPPING_EDIT, SHIPPING_DELETE, FETCH_SHIPPING, FETCH_SHIPPING_PROVIDERS,
  FETCH_CLIENTS, FETCH_CLIENT, FETCH_PROVIDER, SHIPPING_RESET_STATE, CLIENT_RESET_STATE, PROVIDER_RESET_STATE } from '@/store/types/actions'

import CShippingData from '@/components/ShippingData'
import CAddresses from '@/components/Addresses'
import CShippingPackage from '@/components/ShippingPackage'
import CShippingTracking from '@/components/ShippingTracking'

export default {
  name: 'v-shipping',
  components: {
    CShippingData,
    CAddresses,
    CShippingPackage,
    CShippingTracking
  },
  computed: {
    ...mapGetters([ 'shippingLoading', 'clients', 'providers', 'shipping' ])
  },
  props: {
    clientId: { type: String, default: null },
    providerId: { type: String, default: null }
  },
  mixins: [ modalMixin, navigationMixin, crudMixin ],
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
    await store.dispatch(PROVIDER_RESET_STATE)
    await store.dispatch(CLIENT_RESET_STATE)
    next(vm => {
      vm.cleanObject = vm._.cloneDeep(vm.shipping)
    })
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the shipping
    await store.dispatch(SHIPPING_RESET_STATE)
    await store.dispatch(PROVIDER_RESET_STATE)
    await store.dispatch(CLIENT_RESET_STATE)
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
      await store.dispatch(PROVIDER_RESET_STATE)
      await store.dispatch(CLIENT_RESET_STATE)
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
    saveShipping () {
      // (this.$validator.validateAll()).then(res => {
      //   if (!res) {
      //     this.$toasted.global.error_toast({ message: 'Hay campos que no se completaron correctamente. Corríjalos y vuelva a guardar' })
      //     return false
      //   }
      //   // this.save(client, this.isEdit ? CLIENT_EDIT : CLIENT_SAVE, 'Editar Cliente')
      // })
      console.log(this.shipping)
      if (false) this.save(this.shipping, this.isEdit ? SHIPPING_EDIT : SHIPPING_SAVE, 'Editar Envío')
      return false
    },
    deleteShipping () {
      this.deleteEl(SHIPPING_DELETE, '/envios')
    }
  }
}
</script>
