<template>
  <b-form>
    <b-row>
      <b-col sm="2" v-if="variant === 'client'">
        <b-form-group>
          <label for="providerId">Proveedor</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Proveedor asociado"></i>
          <b-form-select id="providerId" :plain="true" :disabled="inProgress" :options="providerList" v-model="costsFilter.providerId" @input="resetFilter(); fetchProvider();">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="2">
        <b-form-group>
          <label for="shippingType">Tipo de envío</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de envío"></i>
          <b-form-select id="shippingType" :plain="true" :disabled="inProgress" :options="shippingTypes" v-model="costsFilter.shippingType" @input="resetFilter()">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="2">
        <b-form-group>
          <label for="serviceType">Servicio</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de servicio"></i>
          <b-form-select id="serviceType" :plain="true" :disabled="inProgress" :options="serviceTypes" v-model="costsFilter.serviceType" @input="resetFilter()">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="2">
        <b-form-group>
          <label for="packageType">Tipo de embalaje</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de embalaje del paquete"></i>
          <b-form-select id="packageType" :plain="true" :disabled="inProgress" :options="packageTypes" v-model="costsFilter.packageType" @input="resetFilter()">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="2">
        <b-form-group>
          <label for="shippingZone">Zona</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Zona de envío"></i>
          <b-form-select id="shippingZone" :plain="true" :disabled="inProgress" :options="shippingZones" v-model="costsFilter.shippingZone" @input="resetFilter()">
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-table hover striped bordered small fixed responsive="sm"
        :items="items"
        :fields="fields"
        :foot-clone="(hasWeight || costsTableIndex === -1) && variant === 'provider'"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        @filtered="filtered">
          <template slot="weight" slot-scope="data">
            <b-form-input readonly type="text" placeholder="Hasta Kgs." v-model="data.item.weight"></b-form-input>
          </template>
          <!-- estos dos están deshabilitados siempre en el client -->
          <template slot="grossPrice" slot-scope="data">
            <b-form-input :readonly="((inProgress || !data.item.edit) || variant === 'client') ? true : false" type="number" placeholder="Precio bruto" v-model="data.item.grossPrice"></b-form-input>
          </template>
          <template slot="costDiscount" slot-scope="data">
            <b-form-input :readonly="((inProgress || !data.item.edit) || variant === 'client') ? true : false" type="number" placeholder="% Descuento Costo" v-model="data.item.costDiscount"></b-form-input>
          </template>
          <template slot="cost" slot-scope="data">
            <b-form-input readonly type="number" placeholder="Costo" :value="data.item.grossPrice - (data.item.grossPrice * data.item.costDiscount / 100)"></b-form-input>
          </template>
          <!-- este está está deshabilitado siempre en el provider. Aparte de que para el provider está invisible -->
          <template slot="saleDiscount" slot-scope="data">
            <b-form-input :readonly="((inProgress | !data.item.edit) || variant === 'provider') ? true : false" type="number" placeholder="% Descuento venta" v-model="data.item.saleDiscount"></b-form-input>
          </template>
          <template slot="netPrice" slot-scope="data">
            <b-form-input readonly type="number" placeholder="Neto" :value="data.item.grossPrice - (data.item.grossPrice * data.item.saleDiscount / 100)"></b-form-input>
          </template>
          <template slot="actions" slot-scope="data">
            <template v-if="data.item.edit">
              <b-button v-b-tooltip.hover title="Descartar cambios" variant="warning" @click.prevent="revertEdit(data.item.weight)">
                <i class="fa fa-undo"></i>
              </b-button>
              <b-button v-b-tooltip.hover title="Aplicar cambios" variant="primary" @click.prevent="applyEdit(data.item.weight)">
                <strong><i class="fa fa-check"></i></strong>
              </b-button>
            </template>
            <template v-else>
              <b-button  v-b-tooltip.hover title="Editar fila" variant="primary" @click.prevent="enableEdit(data.item.weight)">
                <strong><i class="fa fa-edit"></i></strong>
              </b-button>
            </template>
          </template>

          <!-- NEW ROW FOOTER -->
          <template slot="FOOT_weight" slot-scope="data">
            <b-form-input v-model="newRow.weight" readonly></b-form-input>
          </template>
          <template slot="FOOT_grossPrice" slot-scope="data">
            <b-form-input type="number" placeholder="Precio bruto" v-model="newRow.grossPrice" :disabled="inProgress"></b-form-input>
          </template>
          <template slot="FOOT_costDiscount" slot-scope="data">
            <b-form-input type="number" placeholder="% Descuento Costo" v-model="newRow.costDiscount" :disabled="inProgress"></b-form-input>
          </template>
          <template slot="FOOT_cost" slot-scope="data">
            <b-form-input type="number" v-model="cost" readonly></b-form-input>
          </template>
          <!-- estos dos no tienen más sentido en agregar -->
          <!-- <template slot="FOOT_saleDiscount" slot-scope="data">
            <b-form-input type="number" placeholder="% Descuento venta" v-model="newRow.saleDiscount" :disabled="inProgress"></b-form-input>
          </template>
          <template slot="FOOT_netPrice" slot-scope="data">
            <b-form-input type="number" v-model="netPrice" readonly></b-form-input>
          </template> -->
          <template slot="FOOT_actions" slot-scope="data">
            <b-button v-b-tooltip.hover title="Añadir costo" variant="secondary" @click.prevent="add">
              <strong><i class="fa fa-plus"></i></strong>
            </b-button>
          </template>

        </b-table>
      </b-col>
    </b-row>
    <nav>
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="Anterior" next-text="Siguiente" :limit="8" />
    </nav>
    <pre>{{ `proveedor CT: ${JSON.stringify(this.provider && this.provider.costsTable, null, 2)}` }}</pre>
    <pre>{{ `cliente CT: ${JSON.stringify(this.client && this.client.costsTable, null, 2)}` }}</pre>
  </b-form>
</template>
<script>
import { shippingTypes, serviceTypes, packageTypes, shippingZones } from '@/store/const'
import { mapGetters } from 'vuex'
import { FETCH_PROVIDER } from '@/store/types/actions'

export default {
  name: 'c-cost-table',
  props: {
    filter: { type: String },
    variant: { type: String }, // variant puede ser: client, provider, shipping
    providerList: { type: Array }
  },
  data () {
    return {
      fields: [
        { key: 'weight', label: 'Hasta Kgs.', class: 'cost-weight' },
        { key: 'grossPrice', label: 'Precio Bruto' },
        { key: 'costDiscount', label: '% Descuento Costo', class: 'cost-discount' },
        { key: 'cost', label: 'Costo' },
        { key: 'saleDiscount', label: '% Descuento Venta', class: `cost-discount${this.variant === 'provider' ? ' d-none' : ''}` },
        { key: 'netPrice', label: 'Neto', class: (this.variant === 'provider' ? ' d-none' : '') },
        { key: 'actions', label: 'Acciones', class: 'cost-actions' }
      ],
      // el cliente también va a necesitar la lista de proveedores
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      shippingZones: shippingZones,
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
    // si tengo cliente, voy a usar el provider asociado al primer registro de la tabla de costos del cliente
    if (this.client && this.client.costsTable && this.client.costsTable.length > 0) {
      await this.fetchProvider(this.provider.costsTable[0].providerId)
    }
    // si el proveedor en cuestión no tiene costos asociados, tampoco le voy a poder asociar descuentos
    // entonces, si costsTableIndex es -1 acá, fin para el vínculo cliente <-> proveedor
    this.providerCostsTableIndex = (this.provider.costsTable && this.provider.costsTable.length > 0 ? 0 : -1)
    this.costsFilter = {
      // acá si es cliente, voy a necesitar también el proveedor
      shippingType: (this.provider.costsTable && this.provider.costsTable.length > 0 ? this.provider.costsTable[0].shippingType : 1),
      serviceType: (this.provider.costsTable && this.provider.costsTable.length > 0 ? this.provider.costsTable[0].serviceType : 1),
      packageType: (this.provider.costsTable && this.provider.costsTable.length > 0 ? this.provider.costsTable[0].packageType : 1),
      shippingZone: (this.provider.costsTable && this.provider.costsTable.length > 0 ? this.provider.costsTable[0].shippingZone : 1),
      providerId: (this.provider ? this.provider.objectId : '-1')
    }

    // el proveedor tiene: weight / grossPrice / costDiscount
    // el cliente tiene:   weight / saleDiscount
    let providerCosts = (this.provider.costsTable && this.provider.costsTable.length > 0 ? this.provider.costsTable[0].costs : [])
    let clientCosts = []

    // si hay cliente, busco los items a través del set de filtros
    if (this.client && this.client.costsTable && this.client.costsTable.length > 0) {
      let filtered = []
      if (this.client.costsTable) {
        filtered = this.client.costsTable.filter(
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
      if (filtered && filtered.length !== 0 && !filtered[0]) {
        clientCosts = filtered
      }
    }

    // tengo la lista de items asociados al proveedor, si el cliente existe, tengo que mergear los arrays a través de weight
    // gran manera en ES6 de combinar dos Arrays, basada en un campo
    this.items = [...providerCosts.concat(clientCosts).reduce((m, o) => m.set(o.weight, Object.assign(m.get(o.weight) || {}, o)), new Map()).values()]

    // inicializo hasWeight
    this.hasWeight = this.costsFilter.packageType !== 3
    this.totalRows = this.items.length
    this.setWeight()
  },
  methods: {
    resetFilter () {
      // lo que hace es buscar dentro de las tablas de costos,
      // los registros que corresponden a los valores seleccionados
      this.inProgress = true
      this.providerCostsTableIndex = -1

      let providerCostFound = []
      let clientCostFound = []
      let providerCosts = []
      let clientCosts = []

      if (this.provider && this.provider.costsTable && this.provider.costsTable.length > 0) {
        if (this.provider.costsTable) {
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
      }

      providerCosts = (providerCostFound && providerCostFound.length > 0 ? providerCostFound[0].costs : [])

      if (this.client && this.client.costsTable && this.client.costsTable.length > 0) {
        if (this.client.costsTable) {
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
      }

      clientCosts = (clientCostFound && clientCostFound.length > 0 ? clientCostFound[0].costs : [])

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
    add () {
      // valido los datos
      // agregar solo va a servir para proveedor
      if (!this.validateNumericValues(this.newRow)) return

      // creo la nueva fila así no queda referenciado
      let newRow = {
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
      // reseteo todo y el filtro
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
      this.newRow.grossPrice = null
      this.newRow.costDiscount = null
      this.resetFilter()
    },
    enableEdit (selectedWeight) {
      if (selectedWeight !== undefined && selectedWeight !== null && selectedWeight > -1 && !this.inEdit) {
        this.inEdit = true
        let selRow = this.provider.costsTable[this.providerCostsTableIndex].costs.find(el => el.weight === selectedWeight)
        // esta asignación mantiene los datos previos a la edición
        // para revertirlos si es necesario
        Object.assign(this.oldRow, selRow)
        selRow.edit = true
        // el filtro se reseta en todos los casos, para replicar
        // los cambios en la lista del provider en los items de la tabla
        this.resetFilter()
      } else {
        this.$toasted.global.error_toast({ message: 'No se pueden editar dos filas a la vez' })
      }
    },
    applyEdit (selectedWeight) {
      if (selectedWeight !== undefined && selectedWeight !== null && selectedWeight > -1) {
        // acá es donde hay que cambiar por variant
        let selRow = this.provider.costsTable[this.providerCostsTableIndex].costs.find(el => el.weight === selectedWeight)
        if (!this.validateNumericValues(selRow)) return
        delete selRow.edit
        if (selRow.grossPrice !== this.oldRow.grossPrice ||
          selRow.saleDiscount !== this.oldRow.saleDiscount ||
          selRow.costDiscount !== this.oldRow.costDiscount) {
          this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en Guardar para registrar los cambios' })
        }
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
