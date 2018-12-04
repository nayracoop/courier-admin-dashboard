<template>
  <section>
    <b-row>
      <b-col sm="12">
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-table id="shipping-costs" hover outlined small fixed responsive="sm" v-if="pricing !== null"
        :items="itemsProvider"
        :fields="fields"
        :current-page="currentPage"
        :foot-clone="true"
        :per-page="perPage">
          <template slot="concept" slot-scope="data">
            {{ data.item.concept }}
            <!-- <b-form-input readonly type="text" placeholder="Producto / servicio" v-model="data.item.concept"></b-form-input> -->
          </template>
          <!-- <template slot="taxDetails" slot-scope="data">
            <b-form-input readonly type="text" placeholder="0%" :value="data.item.taxDetails"></b-form-input>
          </template> -->
          <template slot="value" slot-scope="data">
            <b-input-group>
              <b-form-input :readonly="Boolean(inProgress | !data.item.edit)" type="number" placeholder="0" :value="data.item.value" v-model="data.item.value"></b-form-input>
              <!-- <b-form-input horizontal type="number" id="weight" placeholder="Peso en kilogramos" v-model="shipping.package.weight"></b-form-input> -->
              <b-input-group-append v-if="data.item.percentage"><b-input-group-text>%</b-input-group-text></b-input-group-append>
            </b-input-group>
          </template>
          <!-- <template slot="tax" slot-scope="data">
            <b-form-input type="number" placeholder="0" v-model="data.item.tax"></b-form-input>
          </template> -->
          <!-- <template slot="total" slot-scope="data">
            <b-form-input type="number" placeholder="0" v-model="data.item.total"></b-form-input>
          </template> -->
          <template slot="actions" slot-scope="data">
            <template v-if="data.item.edit">
              <b-button size="sm" variant="primary" @click.prevent="applyEdit(data.item, $event)">
                <i class="fa fa-check"></i> Aplicar
              </b-button>
              <b-button size="sm" variant="warning" @click.prevent="revertEdit(data.item)">
                Cancelar
              </b-button>
              <b-button v-if="data.item.customized" size="sm" variant="primary" @click.prevent="resetEdit(data.item, $event)">
                <i class="fa fa-calculator"></i> Reestablecer
              </b-button>
            </template>
            <template v-else>
              <b-button size="sm" variant="primary" @click.prevent="enableEdit(data.item, $event)">
                <i class="fa fa-edit"></i> Editar
              </b-button>
            </template>
          </template>
          <template slot="subtotal" slot-scope="data">
            ${{ data.item.subtotal }}
            <!-- <b-form-input type="number" placeholder="0" v-model="data.item.subtotal"></b-form-input> -->
          </template>

          <!-- NEW ROW FOOTER -->
          <template slot="FOOT_concept" slot-scope="data">
            <b-form-input v-model="newRow.weight" readonly></b-form-input>
          </template>
          <!-- <template slot="FOOT_taxDetails" slot-scope="data">
            <b-form-input type="number" placeholder="Precio bruto" v-model="newRow.grossPrice" ref="inputPrice" :disabled="inProgress"></b-form-input>
          </template> -->
          <template slot="FOOT_value" slot-scope="data">
            <!-- <b-form-input type="number" placeholder="Precio neto" v-model="newRow.grossPrice" ref="inputPrice" :disabled="inProgress"></b-form-input> -->
            <b-form-input type="number"></b-form-input>
          </template>
          <!-- <template slot="FOOT_tax" slot-scope="data">
            <b-form-input type="number" placeholder="% Descuento Costo" v-model="newRow.costDiscount" :disabled="inProgress"></b-form-input>
          </template> -->
          <!-- <template slot="FOOT_total" slot-scope="data">
            <b-form-input type="number" v-model="cost" readonly></b-form-input>
          </template> -->
          <template slot="FOOT_actions" slot-scope="data">
            <b-button size="sm" variant="success" @click.prevent="add">
              <i class="fa fa-plus"></i> Agregar
            </b-button>
          </template>
          <template slot="FOOT_subtotal" slot-scope="data">
            <strong>${{ cost }}</strong>
          </template>

        </b-table>
        <pre>{{pricing}}</pre>
        <pre>{{ customPricing }}</pre>
      </b-col>
    </b-row>
    <!-- <pre>{{ `proveedor CT: ${JSON.stringify(this.provider && this.provider.costsTable, null, 2)}` }}</pre>
    <pre>{{ `cliente CT: ${JSON.stringify(this.client && this.client.costsTable, null, 2)}` }}</pre> -->
  </section>
</template>
<script>
import { shippingTypes, serviceTypes, packageTypes } from '@/store/const'
// shippingZones } from '@/store/const'
import { mapGetters } from 'vuex'
import { FETCH_PROVIDER } from '@/store/types/actions'
// FETCH_SHIPPING } from '@/store/types/actions'

export default {
  name: 'c-cost-table',
  props: {
    // pricing: null,
    // provider: { type: String },
    // filter: { type: String },
    // variant: { type: String }, // variant puede ser: client, provider, shipping
    // providerList: { type: Array },
  },
  data () {
    return {
      fields: [
        { key: 'concept', label: 'Concepto' },
        // { key: 'taxDetails', label: 'Tasa IVA' },
        { key: 'value', label: 'Valor' },
        // { key: 'tax', label: 'Importe IVA' },
        // { key: 'total', label: 'Importe' },
        { key: 'actions', label: 'Acciones', class: 'cost-actions' },
        { key: 'subtotal', label: 'Subtotal', class: 'cost-actions' }
      ],
      customPricing: { saleDiscount: null },
      cost: 0,
      items: [ ],

      // el cliente también va a necesitar la lista de proveedores
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingZones: [],
      // si el proveedor tiene costsTable, uso la primera posición
      providerCostsTableIndex: -1,
      clientCostsTableIndex: -1,
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
  computed: {
    // agregar a los map getters la lista de proveedores y el cliente
    // para pivotear entre una y otra entidad
    ...mapGetters(['provider', 'client', 'shipping']),
    declaredValueInsurance () {
      return (this.provider.externalId !== null) ? this.shipping.package.declaredValue * (this.provider.insurance / 100) : 0
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
    pricing () {
      // let cost = 0
      let costDiscount = 0
      let saleDiscount = 0
      let grossPrice = 0
      // let netPrice = 0
      let insurance = this.declaredValueInsurance

      console.log('--->')

      // if(this.provider.externalId === null) return null

      // Obtengo el precio de combustible correspondiente a la fecha del envios
      let fuelPercent = this.provider.fuelTable.find(el => {
        return this.shipping.initialDate >= el.fromDate && this.shipping.initialDate <= el.toDate
      })
      if (!fuelPercent) return null
      fuelPercent = fuelPercent.fuelPercent

      console.log('---> 2')
      // Obtengo el precio del flete correspondiente a la zona y tipos de envío, servicio y paquete
      let costs = this.provider.costsTable.find(el => {
        return el.shippingType === this.shipping.shippingType &&
        el.serviceType === this.shipping.serviceType &&
        el.packageType === this.shipping.package.type &&
        el.shippingZone === this.shipping.shippingZone
      })
      if (!costs) return null

      console.log('---> 3')
      // La segunda condición es para los paquetes de tipo 'sobre' que tienen un único precio y el valor asignado al peso es '-'
      let price = costs.costs.find(el => { return el.weight >= this.weight || (isNaN(el.weight) && costs.costs.length === 1) })
      if (!price) return null

      grossPrice = price.grossPrice
      costDiscount = price.costDiscount

      console.log('---> 4')
      // Obtengo los descuentos vinculados al cliente de acuerdo a las opciones seleccionadas
      // Puede no haber descuentos
      if (this.client.externalId !== null) {
        let clientCosts = this.client.costsTable.find(el => {
          return el.providerId === this.provider.objectId &&
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

      return {
        // cost,
        fuelPercent,
        costDiscount,
        saleDiscount,
        grossPrice,
        // netPrice,
        insurance
      }
    }

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
    /* cost: {
      get: function () {
        return this.newRow.grossPrice - (this.newRow.grossPrice * this.newRow.costDiscount / 100)
      },
      set: function (val) { }
    } */
  },
  watch: {
    pricing () {
      this.$root.$emit('bv::refresh::table', 'shipping-costs')
      // this.setBaseCosts()
    }
  },
  // en created lo que hago es setear la serie de valores iniciales para los filtros, y la tabla de costos que corresponde
  async created () {
    this.items = [ {
      concept: 'Flete: ' + this.provider.businessName,
      key: 'grossPrice'
    },
    {
      concept: '% Descuento',
      percentage: true,
      discount: true,
      key: 'costDiscount'
    },
    {
      concept: '% Combustible',
      percentage: true,
      key: 'fuelPercent'
    },
    {
      concept: 'Seguro',
      key: 'insurance'
    },
    {
      concept: '% Descuento al cliente',
      percentage: true,
      discount: true,
      key: 'saleDiscount'
    } ]

    /* this.items.push({
      concept: '% Descuento al cliente',
      taxDetails: '',
      value: 111,
      tax: 0,
      subtotal: 111,
      static: true
    }) */

    /* let total = this.pricing.grossPrice
    this.items.push({
      concept: 'Flete',
      value: this.pricing.grossPrice,
      tax: 0,
      subtotal: parseFloat(total).toFixed(2),
      static: true
    })

    if(this.pricing.costDiscount > 0) {
      total += total * -(this.pricing.costDiscount / 100)
      this.items.push({
        concept: '% Descuento',
        taxDetails: '',
        value: this.pricing.costDiscount,
        tax: 0,
        subtotal: parseFloat(total).toFixed(2),
        static: true
      })
    }

    if(this.pricing.fuelPercent > 0) {
      total += total * this.pricing.fuelPercent / 100
      this.items.push({
        concept: '% Combustible',
        taxDetails: '',
        value: this.pricing.fuelPercent,
        tax: 0,
        subtotal: parseFloat(total).toFixed(2),
        static: true
      })
    }

    if(this.pricing.insurance > 0) {
      total += this.pricing.insurance
      this.items.push({
        concept: 'Seguro',
        taxDetails: '',
        value: this.pricing.insurance,
        tax: 0,
        subtotal: parseFloat(total).toFixed(2),
        static: true
      })
    }

    if(this.pricing.saleDiscount > 0) {
      console.log(this.pricing.saleDiscount)
      total += total * -(this.pricing.saleDiscount / 100)
      this.items.push({
        concept: '% Descuento al cliente',
        taxDetails: '',
        value: this.pricing.saleDiscount,
        tax: 0,
        subtotal: parseFloat(total).toFixed(2),
        static: true
      })
    }
*/
  },
  methods: {
    itemsProvider (ctx) {
      if (!this.inEdit) {
        for (let key in this.pricing) {
          let item = this.items.find(el => { return el.key === key })
          if (item) {
            item.value = (this.customPricing[key] !== undefined && this.customPricing[key] !== null) ? this.customPricing[key] : this.pricing[key]
          }
        }

        // let grossPrice = this.customPricing.grossPrice || this.pricing.grossPrice
        // this.items[0].value = grossPrice

        // this.items[0] = {
        //   concept: 'Flete: ' + this.provider.businessName,
        //   value: grossPrice,
        //   key: 'grossPrice'
        // }

        // let costDiscount = this.customPricing.costDiscount || this.pricing.costDiscount
        // this.items[1] = {
        //   concept: '% Descuento',
        //   value: (costDiscount > 0) ? -costDiscount : 0,
        //   percentage: true,
        //   key: 'costDiscount'
        // }

        // let fuelPercent = this.customPricing.fuelPercent || this.pricing.fuelPercent
        // this.items[2] = {
        //   concept: '% Combustible',
        //   value: (fuelPercent > 0) ? fuelPercent : 0,
        //   percentage: true,
        //   key: 'fuelPercent'
        // }

        // let insurance = this.customPricing.insurance || this.pricing.insurance
        // this.items[3] = {
        //   concept: 'Seguro',
        //   value: (insurance > 0) ? insurance : 0,
        //   key: 'insurance'
        // }
        // let saleDiscount = this.customPricing.saleDiscount || this.pricing.saleDiscount
        // this.items[4] = {
        //   concept: '% Descuento al cliente',
        //   value: (saleDiscount > 0) ? -saleDiscount : 0,
        //   percentage: true,
        //   key: 'saleDiscount'
        // }
      }

      this.updateSubtotals()
      return this.items || []
    },

    updateSubtotals () {
      this.cost = 0
      this.items.forEach(el => {
        if (el.percentage) {
          this.cost += this.cost * (el.value / 100) * (el.discount ? -1 : 1)
        } else {
          this.cost += el.value
        }
        el.subtotal = parseFloat(this.cost).toFixed(2)
      })
      this.cost = parseFloat(this.cost).toFixed(2)
    },
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
    enableEdit (selectedItem, event) {
      if (selectedItem !== undefined && selectedItem !== null && !this.inEdit) {
        this.inEdit = true
        event.target.parentNode.parentNode.querySelector('input').focus()
        let selRow = this.items.find(el => el.key === selectedItem.key)

        // esta asignación mantiene los datos previos a la edición
        // para revertirlos si es necesario, así que tengo que mantener si es cliente o proveedor
        // switch (this.variant) {
        //   case 'provider':
        //     Object.assign(this.oldRow, selRow)
        //     break
        //   case 'client':
        //     let clientCost = {}
        //     if (this.client && this.client.costsTable && this.client.costsTable.length > 0 && this.clientCostsTableIndex !== -1) {
        //       clientCost = this.client.costsTable[this.clientCostsTableIndex].costs.find(el => el.weight === selectedWeight)
        //     }
        //     Object.assign(this.oldRow, clientCost)
        //     break
        // }
        selRow.edit = true
        this.$root.$emit('bv::refresh::table', 'shipping-costs')
        // el filtro se reseta en todos los casos, para replicar
        // los cambios en la lista en los items de la tabla
        // this.resetFilter()
      } else {
        this.$toasted.global.error_toast({ message: 'No se pueden editar dos filas a la vez' })
      }
    },
    applyEdit (selectedItem, event) {
      if (selectedItem !== undefined && selectedItem !== null) {
        // if (!this.validateNumericValues(selectedItem)) return
        let selRow = this.items.find(el => el.key === selectedItem.key)
        let newPricing = Object.assign({ }, this.customPricing)

        if (selectedItem.value === '' || selectedItem.value === undefined || selectedItem.value === null) {
          event.target.parentNode.parentNode.querySelector('input').value = selectedItem.value = Math.abs(this.pricing[selectedItem.key])
          selectedItem.customized = false
          delete newPricing[selectedItem.key]
        } else {
          selectedItem.value = Math.abs(selectedItem.value)
          if (selectedItem.value !== this.pricing[selectedItem.key]) {
            selectedItem.customized = true
            newPricing[selectedItem.key] = selectedItem.value
          }
        }
        this.customPricing = newPricing
        delete selRow.edit
        // this.oldRow = {}
        // this.resetFilter()
      }
      this.inEdit = false
      this.$root.$emit('bv::refresh::table', 'shipping-costs')
    },
    revertEdit (selectedItem) {
      if (selectedItem !== undefined && selectedItem !== null) {
        let selRow = this.items.find(el => el.key === selectedItem.key)
        event.target.parentNode.parentNode.querySelector('input').value = selectedItem.value = (this.customPricing[selectedItem.key] !== undefined && this.customPricing[selectedItem.key] !== null) ? this.customPricing[selectedItem.key] : this.pricing[selectedItem.key]
        // revierte la asignación seteando la fila a los valores que tenía antes
        // Object.assign(selRow, this.oldRow)
        // delete selRow.edit
        // this.oldRow = {}
        // this.resetFilter()
        delete selRow.edit
      }
      this.inEdit = false
      this.$root.$emit('bv::refresh::table', 'shipping-costs')
    },
    resetEdit (selectedItem, event) {
      if (selectedItem !== undefined && selectedItem !== null) {
        let selRow = this.items.find(el => el.key === selectedItem.key)
        let newPricing = Object.assign({ }, this.customPricing)

        event.target.parentNode.parentNode.querySelector('input').value = selectedItem.value = Math.abs(this.pricing[selectedItem.key])
        selectedItem.customized = false
        delete newPricing[selectedItem.key]
        // revierte la asignación seteando la fila a los valores que tenía antes
        // Object.assign(selRow, this.oldRow)
        // delete selRow.edit
        // this.oldRow = {}
        // this.resetFilter()
        this.customPricing = newPricing
        delete selRow.edit
      }
      this.inEdit = false
      this.$root.$emit('bv::refresh::table', 'shipping-costs')
    },
    validateNumericValues (row) {
      let retVal = true
      if (isNaN(row.value) | row.value === undefined | row.value === null) {
        this.$toasted.global.error_toast({ message: 'Ingrese un valor válido' })
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
  }
}
</script>
