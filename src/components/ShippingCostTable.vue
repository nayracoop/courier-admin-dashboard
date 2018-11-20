<template>
  <section>
    <b-row>
      <b-col sm="12">
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-table hover outlined small fixed responsive="sm" v-if="pricing !== null"
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :foot-clone="true"
        :per-page="perPage">
          <template slot="concept" slot-scope="data">
            <b-form-input readonly type="text" placeholder="Producto / servicio" v-model="data.item.concept"></b-form-input>
          </template>
          <!-- <template slot="taxDetails" slot-scope="data">
            <b-form-input readonly type="text" placeholder="0%" :value="data.item.taxDetails"></b-form-input>
          </template> -->
          <template slot="cost" slot-scope="data">
            <b-form-input readonly type="number" placeholder="0" :value="data.item.cost"></b-form-input>
          </template>
          <!-- <template slot="tax" slot-scope="data">
            <b-form-input type="number" placeholder="0" v-model="data.item.tax"></b-form-input>
          </template> -->
          <!-- <template slot="total" slot-scope="data">
            <b-form-input type="number" placeholder="0" v-model="data.item.total"></b-form-input>
          </template> -->
          <template slot="subtotal" slot-scope="data">
            <b-form-input type="number" placeholder="0" v-model="data.item.subtotal"></b-form-input>
          </template>
          <template slot="actions" slot-scope="data">
            <template v-if="data.item.edit">
              <b-button size="sm" variant="primary" @click.prevent="applyEdit(data.item)">
                <i class="fa fa-check"></i> Aplicar
              </b-button>
              <b-button size="sm" variant="warning" @click.prevent="revertEdit(data.item.concept)">
                Cancelar
              </b-button>
            </template>
            <template v-else-if="!data.item.static">
              <b-button size="sm" variant="primary" @click.prevent="enableEdit(data.item.concept, $event)">
                <i class="fa fa-edit"></i> Editar
              </b-button>
            </template>
          </template>

          <!-- NEW ROW FOOTER -->
          <template slot="FOOT_concept" slot-scope="data">
            <b-form-input v-model="newRow.weight" readonly></b-form-input>
          </template>
          <!-- <template slot="FOOT_taxDetails" slot-scope="data">
            <b-form-input type="number" placeholder="Precio bruto" v-model="newRow.grossPrice" ref="inputPrice" :disabled="inProgress"></b-form-input>
          </template> -->
          <template slot="FOOT_cost" slot-scope="data">
            <b-form-input type="number" placeholder="Precio neto" v-model="newRow.grossPrice" ref="inputPrice" :disabled="inProgress"></b-form-input>
          </template>
          <!-- <template slot="FOOT_tax" slot-scope="data">
            <b-form-input type="number" placeholder="% Descuento Costo" v-model="newRow.costDiscount" :disabled="inProgress"></b-form-input>
          </template> -->
          <!-- <template slot="FOOT_total" slot-scope="data">
            <b-form-input type="number" v-model="cost" readonly></b-form-input>
          </template> -->
          <template slot="FOOT_subtotal" slot-scope="data">
            <b-form-input type="number" v-model="cost" readonly></b-form-input>
          </template>
          <template slot="FOOT_actions" slot-scope="data">
            <b-button size="sm" variant="success" @click.prevent="add">
              <i class="fa fa-plus"></i> Agregar
            </b-button>
          </template>

        </b-table>
        --
        {{ pricing }}
        --
        {{ items }}
      </b-col>
    </b-row>
    <!-- <pre>{{ `proveedor CT: ${JSON.stringify(this.provider && this.provider.costsTable, null, 2)}` }}</pre>
    <pre>{{ `cliente CT: ${JSON.stringify(this.client && this.client.costsTable, null, 2)}` }}</pre> -->
  </section>
</template>
<script>
import { shippingTypes, serviceTypes, packageTypes, shippingZones } from '@/store/const'
import { mapGetters } from 'vuex'
import { FETCH_PROVIDER, FETCH_SHIPPING } from '@/store/types/actions'

export default {
  name: 'c-cost-table',
  props: {
    pricing: null,
    filter: { type: String },
    variant: { type: String }, // variant puede ser: client, provider, shipping
    providerList: { type: Array }
  },
  data () {
    return {
      fields: [
        { key: 'concept', label: 'Concepto' },
        // { key: 'taxDetails', label: 'Tasa IVA' },
        { key: 'cost', label: 'Importe Neto' },
        // { key: 'tax', label: 'Importe IVA' },
        // { key: 'total', label: 'Importe' },
        { key: 'subtotal', label: 'Subtotal' },
        { key: 'actions', label: 'Acciones', class: 'cost-actions' }
      ],

      // el cliente también va a necesitar la lista de proveedores
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingZones: [],
      // si el proveedor tiene costsTable, uso la primera posición
      providerCostsTableIndex: -1,
      clientCostsTableIndex: -1,
      items: [],
      costsFilter: {},
      newRow: {
        weight: null, // presente en cliente y proveedor
        grossPrice: null, // proveedor, usado en cliente
        costDiscount: null, // proveedor
        saleDiscount: null // cliente
      },
      inProgress: false,
      // inEdit tiene que compartirse con el parent
      // para el botón guardar
      inEdit: false,
      oldRow: {},
      hasWeight: false,
      perPage: 10,
      currentPage: 1,
      totalRows: 1
    }
  },
  // en created lo que hago es setear la serie de valores iniciales para los filtros, y la tabla de costos que corresponde
  async created () {

    let total = this.pricing.grossPrice
    this.items.push({
      concept: 'Envío',
      taxDetails: '0%',
      cost: this.pricing.grossPrice,
      tax: 0,
      total: this.pricing.grossPrice,
      subtotal: total,
      static: true
    })
    if(this.pricing.costDiscount > 0) {
      total += total * -(this.pricing.costDiscount / 100)
      this.items.push({
        concept: this.pricing.costDiscount + '% descuento',
        taxDetails: '0%',
        cost: this.pricing.grossPrice * -(this.pricing.costDiscount / 100),
        tax: 0,
        total: this.pricing.grossPrice * -(this.pricing.costDiscount / 100),
        subtotal: total,
        static: true
      })
    }
    if(this.pricing.saleDiscount > 0) {
      total += total * -(this.pricing.saleDiscount / 100)
      this.items.push({
        concept: this.pricing.saleDiscount + '% descuento cliente',
        taxDetails: '0%',
        cost: this.pricing.grossPrice * -(this.pricing.saleDiscount / 100),
        tax: 0,
        total: this.pricing.grossPrice * -(this.pricing.saleDiscount / 100),
        subtotal: total,
        static: true
      })
    }


  },
  methods: {
    resetFilter () {
      // lo que hace es buscar dentro de las tablas de costos,
      // los registros que corresponden a los valores seleccionados
      this.inProgress = true
      this.providerCostsTableIndex = -1
      this.clientCostsTableIndex = -1

      let providerCostFound = []
      let clientCostFound = []
      let providerCosts = []
      let clientCosts = []

      if (this.provider && this.provider.costsTable && this.provider.costsTable.length > 0) {
        providerCostFound = this.provider.costsTable.filter(
          (cost, i) => {
            if (cost.shippingType === this.costsFilter.shippingType &&
            cost.serviceType === this.costsFilter.serviceType &&
            cost.packageType === this.costsFilter.packageType &&
            cost.shippingZone === this.costsFilter.shippingZone) {
              this.providerCostsTableIndex = i
              return true
            }
          })
      }

      providerCosts = (providerCostFound && providerCostFound.length > 0 ? providerCostFound[0].costs : [])

      if (this.client && this.client.costsTable && this.client.costsTable.length > 0) {
        clientCostFound = this.client.costsTable.filter(
          (cost, i) => {
            if (cost.providerId === this.costsFilter.providerId &&
            cost.shippingType === this.costsFilter.shippingType &&
            cost.serviceType === this.costsFilter.serviceType &&
            cost.packageType === this.costsFilter.packageType &&
            cost.shippingZone === this.costsFilter.shippingZone) {
              this.clientCostsTableIndex = i
              return true
            }
          })
      }

      clientCosts = (clientCostFound && clientCostFound.length > 0 ? clientCostFound[0].costs : [])

      // primero que nada: esto no mantiene referencia
      this.items = [...providerCosts.concat(clientCosts).reduce((m, o) => m.set(o.weight, Object.assign(m.get(o.weight) || {}, o)), new Map()).values()]

      // en caso de que no haya definido un filtro
      // el número total de filas son todos los ítems
      if (!this.filter) {
        this.totalRows = this.items.length
      }
      this.setWeight()
      this.inProgress = false
    },
    setHasWeight () {
      this.hasWeight = this.costsFilter.packageType !== 3
    },
    setWeight () {
      this.setHasWeight()
      if (!this.hasWeight) {
        this.newRow.weight = '-'
      } else {
        let newWeight = 0.5
        let lastIndex = -1
        if (this.providerCostsTableIndex !== -1) {
          lastIndex = this.provider.costsTable[this.providerCostsTableIndex].costs.length - 1
        }
        if (lastIndex !== -1) {
          let lastWeight = this.provider.costsTable[this.providerCostsTableIndex].costs[lastIndex].weight
          newWeight = lastWeight >= 71 ? lastWeight + 1 : lastWeight + 0.5
        }
        this.newRow.weight = newWeight
      }
    },
    add (el) {
      let newRow = {}
      if (this.$refs.inputPrice) this.$refs.inputPrice.$el.focus()
      // valido los datos
      switch (this.variant) {
        case 'provider':
          if (!this.validateNumericValues(this.newRow)) return
          newRow = {
            weight: this.newRow.weight,
            grossPrice: Number(this.newRow.grossPrice),
            costDiscount: Number(this.newRow.costDiscount) | 0
          }
          if (this.providerCostsTableIndex === -1) {
            // si es el primer registro, lo inserto directo
            this.provider.costsTable.push({
              shippingType: this.costsFilter.shippingType,
              serviceType: this.costsFilter.serviceType,
              packageType: this.costsFilter.packageType,
              shippingZone: this.costsFilter.shippingZone,
              costs: [newRow]
            })
            this.providerCostsTableIndex = this.provider.costsTable.length - 1
          } else {
            // si había un índice seleccionado, inserto en esa posición una nueva entrada
            this.provider.costsTable[this.providerCostsTableIndex].costs.push(newRow)
          }
          break
        case 'client':
          if (!this.validateNumericValues(el)) return
          newRow = {
            weight: el.weight,
            saleDiscount: Number(el.saleDiscount) | 0
          }
          if (this.clientCostsTableIndex === -1) {
            // si es el primer registro, lo inserto directo
            this.client.costsTable.push({
              providerId: this.costsFilter.providerId,
              shippingType: this.costsFilter.shippingType,
              serviceType: this.costsFilter.serviceType,
              packageType: this.costsFilter.packageType,
              shippingZone: this.costsFilter.shippingZone,
              costs: [newRow]
            })
            this.clientCostsTableIndex = this.client.costsTable.length - 1
          } else {
            // si había un índice seleccionado, inserto en esa posición una nueva entrada
            this.client.costsTable[this.clientCostsTableIndex].costs.push(newRow)
          }
          break
        case 'shipping':
          break
        default:
          break
      }
      // reseteo todo y el filtro
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
      this.newRow.grossPrice = null
      this.newRow.costDiscount = null
      this.newRow.saleDiscount = null
      this.resetFilter()
    },
    enableEdit (selectedWeight, event) {
      if (selectedWeight !== undefined && selectedWeight !== null && selectedWeight > -1 && !this.inEdit) {
        this.inEdit = true
        event.target.parentNode.parentNode.querySelector('td:nth-child(' + (this.variant === 'client' ? 5 : 2) + ') input').focus()
        let selRow = this.provider.costsTable[this.providerCostsTableIndex].costs.find(el => el.weight === selectedWeight)
        // esta asignación mantiene los datos previos a la edición
        // para revertirlos si es necesario, así que tengo que mantener si es cliente o proveedor
        switch (this.variant) {
          case 'provider':
            Object.assign(this.oldRow, selRow)
            break
          case 'client':
            let clientCost = {}
            if (this.client && this.client.costsTable && this.client.costsTable.length > 0 && this.clientCostsTableIndex !== -1) {
              clientCost = this.client.costsTable[this.clientCostsTableIndex].costs.find(el => el.weight === selectedWeight)
            }
            Object.assign(this.oldRow, clientCost)
            break
        }
        selRow.edit = true
        // el filtro se reseta en todos los casos, para replicar
        // los cambios en la lista en los items de la tabla
        this.resetFilter()
      } else {
        this.$toasted.global.error_toast({ message: 'No se pueden editar dos filas a la vez' })
      }
    },
    applyEdit (el) {
      let selectedWeight = el.weight
      if (selectedWeight !== undefined && selectedWeight !== null && selectedWeight > -1) {
        if (!this.validateNumericValues(el)) return
        let selRow = this.provider.costsTable[this.providerCostsTableIndex].costs.find(el => el.weight === selectedWeight)
        switch (this.variant) {
          case 'provider':
            if (el.grossPrice !== this.oldRow.grossPrice ||
              el.costDiscount !== this.oldRow.costDiscount) {
              selRow.grossPrice = el.grossPrice
              selRow.costDiscount = el.costDiscount
              this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
            }
            break
          case 'client':
            let clientCost = null
            // busco el costo
            if (this.client && this.client.costsTable && this.client.costsTable.length > 0 && this.clientCostsTableIndex !== -1) {
              clientCost = this.client.costsTable[this.clientCostsTableIndex].costs.find(el => el.weight === selectedWeight)
            }
            // si existe, lo voy a editar
            if (clientCost) {
              // si cambió, lo edito
              if (el.saleDiscount !== this.oldRow.saleDiscount) {
                clientCost.saleDiscount = el.saleDiscount
                this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
              }
            } else {
              this.add(el)
            }
            break
        }

        delete selRow.edit
        this.oldRow = {}
        this.resetFilter()
      }
      this.inEdit = false
    },
    revertEdit (selectedWeight) {
      if (selectedWeight !== undefined && selectedWeight !== null && selectedWeight > -1) {
        let selRow = this.provider.costsTable[this.providerCostsTableIndex].costs.find(el => el.weight === selectedWeight)
        // revierte la asignación seteando la fila a los valores que tenía antes
        Object.assign(selRow, this.oldRow)
        delete selRow.edit
        this.oldRow = {}
        this.resetFilter()
      }
      this.inEdit = false
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
    },
    filtered (totalRows) {
      this.totalRows = totalRows.length
    },
    fetchProvider () {
      this.$store.dispatch(FETCH_PROVIDER, this.costsFilter.providerId, null).then(() => {
        this.resetFilter()
      })
    }
  },
  computed: {
    // agregar a los map getters la lista de proveedores y el cliente
    // para pivotear entre una y otra entidad
    ...mapGetters(['provider', 'client']),

    // esto se usa para calcular el precio al aplicar el primer descuento
    // el precio al que se le aplica % de descuento de costo es el gross. Y el resultado es para el cliente
    // netPrice: {
    //   get: function () {
    //     return this.newRow.grossPrice - (this.newRow.grossPrice * this.newRow.saleDiscount / 100)
    //   },
    //   set: function (val) { }
    // },
    // esto se usa para calcular el precio al aplicar el segundo descuento
    // el precio al que se le aplica % de descuento de costo es el gross. Y el resultado es para referencia de costo interno
    cost: {
      get: function () {
        return this.newRow.grossPrice - (this.newRow.grossPrice * this.newRow.costDiscount / 100)
      },
      set: function (val) { }
    }
  }
}
</script>
