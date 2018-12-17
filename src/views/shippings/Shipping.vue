<template>
  <div class="animated fadeIn">
    <b-form @submit.prevent="saveShipping" enctype="multipart/form-data">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Datos de envío" active>
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
    </b-tab>
    <b-tab title="Direcciones">
      <b-row>
        <b-col md="6">
          <b-card>
            <div slot="header">Origen</div>
            <c-addresses v-if="!isEdit" isShipping @saved-address-updated="clientAddressUpdated" @address-updated="originAddressUpdated" ref="addressOriginForm"></c-addresses>
            <c-address-form v-else v-model="singleOriginAddress"></c-address-form>
          </b-card>
        </b-col>
        <b-col md="6">
          <b-card>
            <div slot="header">Destino</div>
            <c-addresses v-if="!isEdit" isShipping @saved-address-updated="clientAddressUpdated" @address-updated="destinationAddressUpdated" ref="addressDestinationForm"></c-addresses>
            <c-address-form v-else v-model="singleDestinationAddress"></c-address-form>
          </b-card>
        </b-col>
      </b-row>

    </b-tab>
    <b-tab title="Paquete">
      <b-row>
        <b-col md="12">
          <!-- <b-card> -->
            <!-- <div slot="header">Información del paquete</div> -->
            <c-shipping-package ref="packageForm"></c-shipping-package>
          <!-- </b-card> -->
        </b-col>
      </b-row>
    </b-tab>
    <b-tab title="Seguimiento">
      <b-row>
        <b-col md="12">
          <!-- <b-card> -->
            <!-- <div slot="header">Información de seguimiento</div> -->
            <c-shipping-tracking ref="trackingForm"></c-shipping-tracking>
          <!-- </b-card> -->
        </b-col>
      </b-row>
    </b-tab>
    <b-tab title="Costos">
      <!-- <c-shipping-cost-table :pricing="pricing"></c-shipping-cost-table> -->
      <c-shipping-cost-table></c-shipping-cost-table>
    </b-tab>
    <b-tab title="Cierre y facturación" v-if="isEdit">

    </b-tab>
      </b-tabs>
    </b-card>
    <b-card bg-variant="light" v-if="shipping.pricing.cost !== '' && shipping.pricing.cost !== undefined && shipping.pricing.cost !== null">
      <p class="card-text">Total: <b>${{ shipping.pricing.cost }}</b></p>
    </b-card>
    <template>
      <b-row class="actions-bar">
        <b-col sm="12">
          <!-- <b-button variant="primary" type="submit"><i class="fa fa-save ml-1"></i> Añadir envío</b-button> -->
          <b-button v-if="isEdit" variant="primary" type="submit">Guardar cambios</b-button><b-button v-else variant="primary" type="submit">Añadir envío</b-button> o <b-link :to="{ path: '/envios' }">Cancelar</b-link>
          <!-- <b-button variant="outline-danger">Eliminar <i class="fa fa-trash ml-1"></i></b-button> -->
          <!-- <b-button variant="outline-primary">Volver <i class="fa fa-arrow-left ml-1"></i></b-button> -->
        </b-col>
      </b-row>
    </template>
    </b-form>
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

import { SHIPPING_SAVE, SHIPPING_EDIT, SHIPPING_DELETE, CLIENT_SAVE, FETCH_SHIPPING, FETCH_SHIPPING_PROVIDERS,
  FETCH_CLIENTS, FETCH_CLIENT, FETCH_PROVIDER, SHIPPING_RESET_STATE, CLIENT_RESET_STATE, PROVIDER_RESET_STATE } from '@/store/types/actions'

import CShippingData from '@/components/ShippingData'
import CAddresses from '@/components/Addresses'
import CAddressForm from '@/components/AddressForm'
import CShippingPackage from '@/components/ShippingPackage'
import CShippingTracking from '@/components/ShippingTracking'
import CShippingCostTable from '@/components/ShippingCostTable'
import CConfirmationModal from '@/components/ConfirmationModal'

export default {
  name: 'v-shipping',
  components: {
    CShippingData,
    CAddresses,
    CAddressForm,
    CShippingPackage,
    CShippingTracking,
    CShippingCostTable,
    CConfirmationModal
  },
  computed: {
    ...mapGetters([ 'shippingLoading', 'clients', 'providers', 'shipping' ]),
    singleOriginAddress () {
      return { address: this.shipping.origin }
    },
    singleDestinationAddress () {
      return { address: this.shipping.destination }
    },
    volumetricWeight () {
      if (this.shipping.package.type !== 1 || !this.shipping.package.length || !this.shipping.package.width || !this.shipping.package.height) {
        return 0
      }
      let roundFactor = 0.5
      let weightDivisor = 5000
      let originalVolume = this.shipping.package.length * this.shipping.package.width * this.shipping.package.height
      return roundFactor * Math.ceil((originalVolume / weightDivisor) / roundFactor)
    },
    weight () {
      return this.volumetricWeight > this.shipping.package.weight ? this.volumetricWeight : this.shipping.package.weight
    },
    declaredValueInsurance () {
      let provider = this.providers.find(el => { return el.objectId === this.shipping.providerId })
      return (provider !== undefined) ? this.shipping.package.declaredValue * (provider.insurance / 100) : 0
    },
    shippingZone () {
      let zone = null
      let country
      let type
      let provider = this.providers.find(el => { return el.objectId === this.shipping.providerId })

      if (provider) type = provider.shippingZones.find(el => { return el.shippingType === this.shipping.shippingType })
      if (type) country = type.countries.find(el => { return el.numericCode === this.shipping.destination.country })
      if (country) zone = country.zone

      return zone
    },
    isEdit () {
      return !!this.shipping.objectId
    }
    /*
      pricing () {
      // let cost = 0
      let costDiscount = 0
      let saleDiscount = 0
      let grossPrice = 0
      let netPrice = 0

      // Obtengo los precios vinculados al proveedor de acuerdo a las opciones seleccionadas
      // Si no hay precios devuelve null
      let provider = this.providers.find(el => { return el.objectId === this.shipping.providerId })
      if (!provider) return null

      // Obtengo el precio de combustible correspondiente a la fecha del envios
      let fuelPercent = provider.fuelTable.find(el => {
        return this.shipping.initialDate >= el.fromDate && this.shipping.initialDate <= el.toDate
      })
      if (!fuelPercent) return null
      fuelPercent = fuelPercent.fuelPercent

      let costs = provider.costsTable.find(el => {
        return el.shippingType === this.shipping.shippingType &&
        el.serviceType === this.shipping.serviceType &&
        el.packageType === this.shipping.package.type &&
        el.shippingZone === this.shipping.shippingZone
      })
      if (!costs) return null

      // La segunda condición es para los paquetes de tipo 'sobre' que tienen un único precio y el valor asignado al peso es '-'
      let price = costs.costs.find(el => { return el.weight >= this.weight || (isNaN(el.weight) && costs.costs.length === 1) })
      if (!price) return null

      grossPrice = price.grossPrice
      costDiscount = price.costDiscount

      // Obtengo los descuentos vinculados al cliente de acuerdo a las opciones seleccionadas
      // Puede no haber descuentos
      let client = this.clients.find(el => { return el.objectId === this.shipping.clientId })
      if (client !== undefined) {
        let clientCosts = client.costsTable.find(el => {
          return el.providerId === provider.objectId &&
          el.shippingType === this.shipping.shippingType &&
          el.serviceType === this.shipping.serviceType &&
          el.packageType === this.shipping.package.type &&
          el.shippingZone === this.shipping.shippingZone
        })
        if (clientCosts !== undefined) {
          // La segunda condición es para los paquetes de tipo 'sobre' que tienen un único precio y el valor asignado al peso es '-'
          let discounts = clientCosts.costs.find(el => { return el.weight === price.weight || (isNaN(el.weight) && clientCosts.costs.length === 1) })
          if (discounts !== undefined) {
            saleDiscount = discounts.saleDiscount
          }
        }
      }

      // Calculo el costo final

      return {
        // cost,
        fuelPercent,
        costDiscount,
        saleDiscount,
        grossPrice,
        netPrice,
        insurance: this.declaredValueInsurance
      }
    },
    */
  },
  props: {
    clientId: { type: String, default: null },
    providerId: { type: String, default: null }
  },
  mixins: [ modalMixin, navigationMixin, crudMixin ],
  mounted () {
    // this.isEdit = !!this.shipping.objectId
    this.cleanObject = this._.cloneDeep(this.shipping)
    // si estoy editando, el envío ya existe
    // busco al cliente y al proveedor asociados
    if (this.isEdit) {
      this.fetchProvider(this.shipping.providerId)
      this.fetchClient(this.shipping.clientId)
    }
    if (this.clientId) {
      this.fetchClient(this.clientId)
      this.shipping.clientId = this.clientId
    }
    if (this.providerId) {
      this.fetchProvider(this.providerId)
      this.shipping.providerId = this.providerId
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
      addressUpdated: false
      // isEdit: false
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
      Promise.all([
        this.$refs.shippingDataForm.validate(),
        this.$refs.addressOriginForm.validate(),
        this.$refs.addressDestinationForm.validate()
      ]).then(values => {
        let errors = values.find(el => el === false)
        if (errors === undefined) {
          if (this.addressUpdated) this.save(this.client, CLIENT_SAVE, 'Editar Cliente')
          this.save(this.shipping, this.isEdit ? SHIPPING_EDIT : SHIPPING_SAVE, 'Editar Envío')
        }
      })
      // this.$refs.shippingDataForm.validate()
      // this.$refs.addressOriginForm.validate()
      // this.$refs.addressDestinationForm.validate()
      // this.$refs.packageForm.validate()
      // this.$refs.trackingForm.validate()
    },
    deleteShipping () {
      this.deleteEl(SHIPPING_DELETE, '/envios')
    },
    clientAddressUpdated (updated) {
      this.addressUpdated = Boolean(updated)
    },
    originAddressUpdated (addressData) {
      this.shipping.origin = addressData
    },
    destinationAddressUpdated (addressData) {
      this.shipping.destination = addressData
    }
    /*,
    updateShippingCost () {
      this.shipping.pricing.cost = this.shipping.pricing.grossPrice * (1 - this.shipping.pricing.costDiscount / 100) * (1 - this.shipping.pricing.saleDiscount / 100) + this.shipping.pricing.insurance
      this.shipping.pricing.cost = parseFloat(this.shipping.pricing.cost).toFixed(2)
    }
    */
  },
  watch: {
    shippingZone (val) {
      this.shipping.shippingZone = val
    }
    /*
    pricing (val) {
      if (val !== null) {
        // this.shipping.pricing.cost = this.pricing.cost
        this.shipping.pricing.costDiscount = this.pricing.costDiscount
        this.shipping.pricing.saleDiscount = this.pricing.saleDiscount
        this.shipping.pricing.grossPrice = this.pricing.grossPrice
        this.shipping.pricing.netPrice = this.pricing.netPrice
      } else {
        // this.shipping.pricing.cost = 0
        this.shipping.pricing.costDiscount = 0
        this.shipping.pricing.saleDiscount = 0
        this.shipping.pricing.grossPrice = 0
        this.shipping.pricing.netPrice = 0
      }
      this.updateShippingCost()
    },
    declaredValueInsurance (val) {
      this.shipping.pricing.insurance = val
      this.updateShippingCost()
    }
    */
  },
  created () {
    this.shipping.shippingZone = this.shippingZone
  }
}
</script>
