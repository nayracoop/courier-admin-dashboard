<template>
    <b-form>
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
          <b-table hover striped bordered small fixed :items="items" :fields="fields" responsive="sm" :foot-clone="hasWeight || costsTableIndex === -1">
            <template slot="weight" slot-scope="data">
              <b-form-input readonly type="text" placeholder="Hasta Kgs." v-model="data.item.weight"></b-form-input>
            </template>
            <template slot="grossPrice" slot-scope="data">
              <b-form-input :readonly="(inProgress | !data.item.edit) ? true : false" type="number" placeholder="Precio bruto" v-model="data.item.grossPrice"></b-form-input>
            </template>
            <template slot="saleDiscount" slot-scope="data">
              <b-form-input :readonly="(inProgress | !data.item.edit) ? true : false" type="number" placeholder="% Descuento venta" v-model="data.item.saleDiscount"></b-form-input>
            </template>
            <template slot="netPrice" slot-scope="data">
              <b-form-input readonly type="number" placeholder="Neto" :value="data.item.grossPrice - (data.item.grossPrice * data.item.saleDiscount / 100)"></b-form-input>
            </template>
            <template slot="costDiscount" slot-scope="data">
              <b-form-input :readonly="(inProgress | !data.item.edit) ? true : false" type="number" placeholder="% Descuento Costo" v-model="data.item.costDiscount"></b-form-input>
            </template>
            <template slot="cost" slot-scope="data">
              <b-form-input readonly type="number" placeholder="Costo" :value="(data.item.grossPrice - (data.item.grossPrice * data.item.saleDiscount / 100)) - ((data.item.grossPrice - (data.item.grossPrice * data.item.saleDiscount / 100)) * data.item.costDiscount / 100)"></b-form-input>
            </template>
            <template slot="actions" slot-scope="data">
              <template v-if="data.item.edit">
                <b-button v-b-tooltip.hover title="Descartar cambios" variant="warning" @click.prevent="revertEdit(data.index)">
                  <i class="fa fa-undo"></i>
                </b-button>
                <b-button v-b-tooltip.hover title="Aplicar cambios" variant="primary" @click.prevent="applyEdit(data.index)">
                  <strong><i class="fa fa-check"></i></strong>
                </b-button>
              </template>
              <template v-else>
                <b-button  v-b-tooltip.hover title="Editar fila" variant="primary" @click.prevent="enableEdit(data.index)">
                  <strong><i class="fa fa-edit"></i></strong>
                </b-button>
              </template>
            </template>
            <template slot="FOOT_weight" slot-scope="data">
              <b-form-input v-model="weight" readonly></b-form-input>
            </template>
            <template slot="FOOT_grossPrice" slot-scope="data">
              <b-form-input type="number" placeholder="Precio bruto" v-model="newRow.grossPrice" :disabled="inProgress"></b-form-input>
            </template>
            <template slot="FOOT_saleDiscount" slot-scope="data">
              <b-form-input type="number" placeholder="% Descuento venta" v-model="newRow.saleDiscount" :disabled="inProgress"></b-form-input>
            </template>
            <template slot="FOOT_netPrice" slot-scope="data">
              <b-form-input type="number" v-model="netPrice" readonly></b-form-input>
            </template>
            <template slot="FOOT_costDiscount" slot-scope="data">
              <b-form-input type="number" placeholder="% Descuento Costo" v-model="newRow.costDiscount" :disabled="inProgress"></b-form-input>
            </template>
            <template slot="FOOT_cost" slot-scope="data">
              <b-form-input type="number" v-model="cost" readonly></b-form-input>
            </template>
            <template slot="FOOT_actions" slot-scope="data">
              <b-button v-b-tooltip.hover title="Añadir costo" variant="secondary" @click.prevent="add">
                <strong><i class="fa fa-plus"></i></strong>
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <!-- <pre>{{ JSON.stringify(this.provider.costsTable[this.costsTableIndex].costs[0], null, 2) }}</pre>
      <pre>{{ JSON.stringify(this.oldRow, null, 2) }}</pre> -->
    </b-form>
</template>
<script>
import { shippingTypes, serviceTypes, packageTypes, shippingZones } from '@/store/const'
import { mapGetters } from 'vuex'
import Vue from 'vue'
export default {
  name: 'c-cost-table',
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
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingZones: shippingZones,
      // si el proveedor tiene costsTable, uso la primera posición
      costsTableIndex: -1,
      items: [],
      costsFilter: {},
      newRow: {
        weight: null,
        grossPrice: null,
        saleDiscount: null,
        netPrice: null,
        costDiscount: null,
        cost: null
      },
      inProgress: false,
      // inEdit tiene que compartirse con el parent
      // para el botón guardar
      inEdit: false,
      oldRow: {}
    }
  },
  created () {
    this.costsTableIndex = this.provider.costsTable.length > 0 ? 0 : -1
    this.items = this.provider.costsTable.length > 0 ? this.provider.costsTable[0].costs : []
    this.costsFilter = {
      shippingType: this.provider.costsTable.length > 0 ? this.provider.costsTable[0].shippingType : 1,
      serviceType: this.provider.costsTable.length > 0 ? this.provider.costsTable[0].serviceType : 1,
      packageType: this.provider.costsTable.length > 0 ? this.provider.costsTable[0].packageType : 1,
      shippingZone: this.provider.costsTable.length > 0 ? this.provider.costsTable[0].shippingZone : 1
    }
  },
  methods: {
    resetFilter () {
      var $this = this
      Vue.nextTick(function () {
        var costsFilter = $this.costsFilter
        $this.inProgress = true
        $this.costsTableIndex = -1
        var filtered = []
        if ($this.provider.costsTable) {
          filtered = $this.provider.costsTable.filter(
            (cost, i) => {
              if (cost.shippingType === costsFilter.shippingType &&
              cost.serviceType === costsFilter.serviceType &&
              cost.packageType === costsFilter.packageType &&
              cost.shippingZone === costsFilter.shippingZone) {
                $this.costsTableIndex = i
                return true
              }
            })
        }
        if (!filtered || filtered.length === 0 || !filtered[0]) {
          $this.items = []
        } else {
          $this.items = filtered[0].costs
        }
        $this.inProgress = false
      })
    },
    add () {
      if (!this.validateNumericValues(this.newRow)) return
      let newRow = {
        weight: this.newRow.weight,
        grossPrice: Number(this.newRow.grossPrice),
        saleDiscount: Number(this.newRow.saleDiscount) | 0,
        netPrice: Number(this.newRow.netPrice),
        costDiscount: Number(this.newRow.costDiscount) | 0,
        cost: Number(this.newRow.cost)
      }
      if (this.costsTableIndex === -1) {
        this.provider.costsTable.push({
          shippingType: this.costsFilter.shippingType,
          serviceType: this.costsFilter.serviceType,
          packageType: this.costsFilter.packageType,
          shippingZone: this.costsFilter.shippingZone,
          costs: [newRow]
        })
        this.costsTableIndex = this.provider.costsTable.length - 1
      } else {
        this.provider.costsTable[this.costsTableIndex].costs.push(newRow)
      }
      this.newRow.grossPrice = null
      this.newRow.saleDiscount = null
      this.newRow.costDiscount = null
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
      this.resetFilter()
    },
    enableEdit (index) {
      if (index !== undefined && index !== null && index > -1 && !this.inEdit) {
        this.inEdit = true
        Object.assign(this.oldRow, this.provider.costsTable[this.costsTableIndex].costs[index])
        this.provider.costsTable[this.costsTableIndex].costs[index].edit = true
        this.resetFilter()
      } else {
        this.$toasted.global.error_toast({ message: 'No se pueden editar dos filas a la vez' })
      }
    },
    applyEdit (index) {
      if (!this.validateNumericValues(this.provider.costsTable[this.costsTableIndex].costs[index])) return
      this.inEdit = false
      if (index !== undefined && index !== null && index > -1) {
        delete this.provider.costsTable[this.costsTableIndex].costs[index].edit
        if (this.provider.costsTable[this.costsTableIndex].costs[index].grossPrice !== this.oldRow.grossPrice ||
          this.provider.costsTable[this.costsTableIndex].costs[index].saleDiscount !== this.oldRow.saleDiscount ||
          this.provider.costsTable[this.costsTableIndex].costs[index].costDiscount !== this.oldRow.costDiscount) {
          this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
        }
        this.oldRow = {}
        this.resetFilter()
      }
    },
    revertEdit (index) {
      this.inEdit = false
      if (index !== undefined && index !== null && index > -1) {
        Object.assign(this.provider.costsTable[this.costsTableIndex].costs[index], this.oldRow)
        delete this.provider.costsTable[this.costsTableIndex].costs[index].edit
        this.oldRow = {}
        this.resetFilter()
      }
    },
    validateNumericValues (row) {
      let retVal = true
      if (isNaN(row.grossPrice) | row.grossPrice === undefined | row.grossPrice === null | row.grossPrice <= 0) {
        this.$toasted.global.error_toast({ message: 'Ingrese un valor válido para Precio Bruto' })
        retVal = false
      }
      if (!row.saleDiscount) row.saleDiscount = 0
      if (isNaN(row.saleDiscount) | row.saleDiscount === undefined |
        row.saleDiscount === null | row.saleDiscount < 0 | row.saleDiscount > 100) {
        this.$toasted.global.error_toast({ message: 'Ingrese un valor válido para % Descuento venta' })
        retVal = false
      }
      if (!row.costDiscount) row.costDiscount = 0
      if (isNaN(row.costDiscount) | row.costDiscount === undefined |
        row.costDiscount === null | row.costDiscount < 0 | row.costDiscount > 100) {
        this.$toasted.global.error_toast({ message: 'Ingrese un valor válido para % Descuento Costo' })
        retVal = false
      }
      return retVal
    }
  },
  computed: {
    ...mapGetters(['provider']),
    hasWeight: function () {
      return this.costsFilter.packageType !== 3
    },
    weight: {
      get: function () {
        if (!this.hasWeight) {
          return '-'
        }

        let retVal = 0.5
        let lastIndex = -1
        if (this.costsTableIndex !== -1) {
          lastIndex = this.provider.costsTable[this.costsTableIndex].costs.length - 1
        }
        if (lastIndex !== -1) {
          let thisWeight = this.provider.costsTable[this.costsTableIndex].costs[lastIndex].weight
          retVal = thisWeight >= 71 ? thisWeight + 1 : thisWeight + 0.5
        }
        return retVal
      },
      set: function (val) {
        this.newRow.weight = val
      }
    },
    netPrice: {
      get: function () {
        return this.newRow.grossPrice - (this.newRow.grossPrice * this.newRow.saleDiscount / 100)
      },
      set: function (val) {
        this.newRow.netPrice = val
      }
    },
    cost: {
      get: function () {
        return this.netPrice - (this.netPrice * this.newRow.costDiscount / 100)
      },
      set: function (val) {
        this.newRow.cost = val
      }
    }
  }
}
</script>
