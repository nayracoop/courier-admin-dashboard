<template>
    <b-form>
      <b-row>
        <b-col sm="3">
          <b-form-group>
            <label for="shippingType">Tipo de envío</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Elegir tipo de envío"></i>
            <b-form-select id="shippingType" :plain="true" :options="shippingTypes" v-model="cShippingType"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="serviceType">Servicio</label>
            <i class="fa fa-question-circle fa-sm"></i>
            <b-form-select id="serviceType" :plain="true" :options="serviceTypes" v-model="cServiceType">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="package">Tipo de embalaje</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
            <b-form-select id="package" :plain="true" :options="packageTypes" v-model="cPackageType">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="package">Zona</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Zona de envío"></i>
            <b-form-select id="package" :plain="true" :options="shippingZones" v-model="cShippingZone">
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <template>
            <b-table :hover="true" :striped="true" :bordered="true" :small="true" :fixed="true" :items="items"
              :fields="fields" :current-page="currentPage" :per-page="perPage" responsive="sm">
              <template slot="weight" slot-scope="data">
                <!-- {{ shippingWeight }} -->
                1
              </template>
              <template slot="grossPrice" slot-scope="data">
                <b-form-input type="text" id="" placeholder="Precio bruto" v-model="data.item.grossPrice"></b-form-input>
              </template>
              <template slot="saleDiscount" slot-scope="data">
                <b-form-input type="text" id="" placeholder="Descuento venta" v-model="data.item.saleDiscount"></b-form-input>
              </template>
              <template slot="netPrice" slot-scope="data">
                  {{ data.item.grossPrice - ((data.item.grossPrice * data.item.saleDiscount) / 100) }}
              </template>
              <template slot="costDiscount" slot-scope="data">
                <b-form-input type="text" id="" placeholder="% Descuento Costo" v-model="data.item.costDiscount"></b-form-input>
              </template>
              <template slot="cost" slot-scope="data">
                  {{ data.item.grossPrice - ((data.item.grossPrice * data.item.costDiscount) / 100) }}
              </template>
            </b-table>
          </template>
        </b-col>
     </b-row>
    </b-form>
</template>
<script>
import { shippingType, serviceType, packageType, shippingZone } from '@/store/const'
// import { mapGetters } from 'vuex'
// import { FETCH_PROVIDERS } from '@/store/types/actions'
export default {
  name: 'c-cost-table',
  props: [ 'provider' ],
  data () {
    return {
      fields: [
        {key: 'weight', label: 'Hasta Kgs.'},
        {key: 'grossPrice', label: 'Precio Bruto'},
        {key: 'saleDiscount', label: '% Descuento Venta'},
        {key: 'netPrice', label: 'Neto'},
        {key: 'costDiscount', label: '% Descuento Costo'},
        {key: 'cost', label: 'Costo'}
      ],
      items: [
        { grossPrice: 0, saleDiscount: 0, cost: 0, costDiscount: 0 },
        { grossPrice: 0, saleDiscount: 0, cost: 0, costDiscount: 0 }
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      shippingTypes: shippingType,
      serviceTypes: serviceType,
      packageTypes: packageType,
      shippingZones: shippingZone,
      selectedShippingType: null,
      selectedServiceType: null,
      selectedPackageType: null,
      selectedShippingZone: null
    }
  },
  computed: {
    cShippingType: {
      get: function () { return this.provider.costsTable[0].shippingType },
      set: (val) => { this.selectedShippingType = val }
    },
    cServiceType: {
      get: function () { return this.provider.costsTable[0].serviceType },
      set: val => { this.selectedServiceType = val }
    },
    cPackageType: {
      get: function () { return this.provider.costsTable[0].packageType },
      set: (val) => { this.selectedPackageType = val }
    },
    cShippingZone: {
      get: function () { return this.provider.costsTable[0].shippingZone },
      set: (val) => { this.selectedShippingZone = val }
    }
  }
}
</script>
