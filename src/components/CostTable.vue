<template>
    <b-form>
        <!--b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="clientName">Cliente</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social del cliente"></i>
                <b-form-select id="clientName" :plain="true" :options="['Sivori','AT Capital']">
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="providerName">Proveedor</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social del proveedor"></i>
                <b-form-select id="providerName" :plain="true" :options="providerOptions">
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row-->
      <b-row>
        <b-col sm="3">
          <b-form-group>
            <label for="shippingType">Tipo de envío</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Elegir tipo de envío"></i>
            <b-form-select id="shippubgType" :plain="true" :options="shippingTypes" value="1">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="serviceType">Servicio</label>
            <i class="fa fa-question-circle fa-sm"></i>
            <b-form-select id="serviceType" :plain="true" :options="serviceTypes" value="Tipo de servicio">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="package">Tipo de embalaje</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
            <b-form-select id="package" :plain="true" :options="packageTypes" value="Tipo de embalaje">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="package">Zona</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Zona de envío"></i>
            <b-form-select id="package" :plain="true" :options="shippingZones">
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <template>
            <b-table :hover="hover"
                :striped="striped"
                :bordered="bordered"
                :small="small"
                :fixed="fixed"
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                responsive="sm">
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
import {
  shippingType,
  serviceType,
  packageType,
  shippingZone,
  shippingWeight
} from '@/store/const'
// import { mapGetters } from 'vuex'
// import { FETCH_PROVIDERS } from '@/store/types/actions'
export default {
  name: 'c-cost-table',
  props: {
    hover: {type: Boolean, default: true},
    striped: {type: Boolean, default: false},
    bordered: {type: Boolean, default: true},
    small: {type: Boolean, default: false},
    fixed: {type: Boolean, default: false}
  },
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
      shippingWeights: shippingWeight
    }
  }/* ,
  computed: {
    ...mapGetters([
      'providersCount',
      'isLoading',
      'providers'
    ]),
    providerOptions () {
      return this.providers.map(val => {
        return {
          value: val.objectId,
          text: val.name
        }
      })
    }
  }
  mounted () {
    this.fetchProviders()
  },
  methods: {
    fetchProviders () {
      this.$store.dispatch(FETCH_PROVIDERS)
    }
  } */
}
</script>
