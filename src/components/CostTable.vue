<template>
    <b-form>
      <template>
        <b-row class="actions-bar">
          <b-col sm="6">
            <b-button variant="outline-primary" disabled>Importar</b-button>
          </b-col>
        </b-row>
      </template>
      <b-row>
        <b-col sm="3">
          <b-form-group>
            <label for="shippingType">Tipo de envío</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de envío"></i>
            <b-form-select id="shippingType" :plain="true" :disabled="inProgress" :options="shippingTypes" v-model="costsFilter.shippingType" @change="resetFilter()">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="serviceType">Servicio</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de servicio"></i>
            <b-form-select id="serviceType" :plain="true" :disabled="inProgress" :options="serviceTypes" v-model="costsFilter.serviceType" @change="resetFilter()">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="packageType">Tipo de embalaje</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
            <b-form-select id="packageType" :plain="true" :disabled="inProgress" :options="packageTypes" v-model="costsFilter.packageType" @change="resetFilter()">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label for="shippingZone">Zona</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Zona de envío"></i>
            <b-form-select id="shippingZone" :plain="true" :disabled="inProgress" :options="shippingZones" v-model="costsFilter.shippingZone" @change="resetFilter()">
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <template>
            <b-table :hover="true" :striped="true" :bordered="true" :small="true" :fixed="true" :items="items"
              :fields="fields" responsive="sm" foot-clone>
              <template slot="weight" slot-scope="data">
                {{ data.item.weight }}
              </template>
              <template slot="grossPrice" slot-scope="data">
                <b-form-input type="text" placeholder="Precio bruto" v-model="data.item.grossPrice" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="saleDiscount" slot-scope="data">
                <b-form-input type="text" placeholder="Descuento venta" v-model="data.item.saleDiscount" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="netPrice" slot-scope="data">
                  {{ data.item.grossPrice - ((data.item.grossPrice * data.item.saleDiscount) / 100) }}
              </template>
              <template slot="costDiscount" slot-scope="data">
                <b-form-input type="text" placeholder="% Descuento Costo" v-model="data.item.costDiscount" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="cost" slot-scope="data">
                  {{ data.item.grossPrice - ((data.item.grossPrice * data.item.costDiscount) / 100) }}
              </template>
              <template slot="actions" slot-scope="data">
                <!-- <b-button :small="true">
                  <i class="fa fa-undo"></i>
                </b-button> -->
                <b-button :small="true" class="btn-danger" @click.prevent="remove(data.index)">
                  <i class="fa fa-trash"></i>
                </b-button>
              </template>
              <template slot="FOOT_weight" slot-scope="data">
                <b-form-input type="text" placeholder="Hasta Kgs." v-model="newRow.weight" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="FOOT_grossPrice" slot-scope="data">
                <b-form-input type="text" placeholder="Precio bruto" v-model="newRow.grossPrice" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="FOOT_saleDiscount" slot-scope="data">
                <b-form-input type="text" placeholder="Descuento venta" v-model="newRow.saleDiscount" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="FOOT_netPrice" slot-scope="data">
                <b-form-input type="text" placeholder="Descuento venta" v-model="newRow.netPrice" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="FOOT_costDiscount" slot-scope="data">
                <b-form-input type="text" placeholder="% Descuento Costo" v-model="newRow.costDiscount" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="FOOT_cost" slot-scope="data">
                <b-form-input type="text" placeholder="Descuento venta" v-model="newRow.cost" :disabled="inProgress"></b-form-input>
              </template>
              <template slot="FOOT_actions" slot-scope="data">
                <b-button variant="primary" @click.prevent="add">
                  <strong><i class="fa fa-check"></i></strong>
                </b-button>
              </template>
            </b-table>
          </template>
        </b-col>
     </b-row>
    </b-form>
</template>
<script>
import { shippingTypes, serviceTypes, packageTypes, shippingZones } from '@/store/const'
import Vue from 'vue'
export default {
  name: 'c-cost-table',
  props: [ 'provider' ],
  data () {
    return {
      fields: [
        { key: 'weight', label: 'Hasta Kgs.' },
        { key: 'grossPrice', label: 'Precio Bruto' },
        { key: 'saleDiscount', label: '% Descuento Venta' },
        { key: 'netPrice', label: 'Neto' },
        { key: 'costDiscount', label: '% Descuento Costo' },
        { key: 'cost', label: 'Costo' },
        { key: 'actions', label: 'Acciones' }
      ],
      totalRows: 0,
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingZones: shippingZones,
      costsTableIndex: 0,
      items: this.provider.costsTable[0].costs,
      costsFilter: {
        shippingType: this.provider.costsTable[0].shippingType,
        serviceType: this.provider.costsTable[0].serviceType,
        packageType: this.provider.costsTable[0].packageType,
        shippingZone: this.provider.costsTable[0].shippingZone
      },
      newRow: {
        weight: null,
        grossPrice: null,
        saleDiscount: null,
        netPrice: null,
        costDiscount: null,
        cost: null
      },
      inProgress: false
    }
  },
  methods: {
    resetFilter () {
      var $this = this
      Vue.nextTick(function () {
        var costsFilter = $this.costsFilter
        $this.inProgress = true
        $this.costsTableIndex = -1

        var filtered = $this.provider.costsTable.filter(
          (cost, i) => {
            if (cost.shippingType === costsFilter.shippingType &&
            cost.serviceType === costsFilter.serviceType &&
            cost.packageType === costsFilter.packageType &&
            cost.shippingZone === costsFilter.shippingZone) {
              $this.costsTableIndex = i
              return true
            }
          })

        if (!filtered || filtered.length === 0 || !filtered[0]) {
          $this.items = []
        } else {
          $this.items = filtered[0].costs
        }
        $this.inProgress = false
      })
    },
    add () {
      if (this.costsTableIndex === -1) {
        this.provider.costsTable.push({
          shippingType: this.costsFilter.shippingType,
          serviceType: this.costsFilter.serviceType,
          packageType: this.costsFilter.packageType,
          shippingZone: this.costsFilter.shippingZone,
          costs: [{
            weight: this.newRow.weight,
            grossPrice: this.newRow.grossPrice,
            saleDiscount: this.newRow.saleDiscount,
            netPrice: this.newRow.netPrice,
            costDiscount: this.newRow.costDiscount,
            cost: this.newRow.cost
          }]
        })
        this.costsTableIndex = this.provider.costsTable.length - 1
      } else {
        this.provider.costsTable[this.costsTableIndex].costs.push({
          weight: this.newRow.weight,
          grossPrice: this.newRow.grossPrice,
          saleDiscount: this.newRow.saleDiscount,
          netPrice: this.newRow.netPrice,
          costDiscount: this.newRow.costDiscount,
          cost: this.newRow.cost
        })
      }
    },
    remove (index) {
      if (index > -1) {
        this.provider.costsTable[this.costsTableIndex].costs.splice(index, 1)
      }
    }
  }
}
</script>
