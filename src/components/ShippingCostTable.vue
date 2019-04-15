<template>
  <section>
    <b-row>
      <b-col sm="12">
        <p v-if="pricing === null">
          No existen costos cargados para la combinación de opciones seleccionadas.
        </p>
        <div v-else>
          <p><b>Tipo de envío</b>: {{ shippingTypeText }}. <b>Servicio</b>: {{ serviceTypeText }}. <b>Tipo de embalaje</b>: {{ packageTypeText }}. <b>Peso</b>: {{ weight }}kg. <b>Zona</b>: {{ shipping.shippingZone }}</p>
          <b-alert show variant="warning" v-if="updated && !closed" dismissible>Se realizaron cambios en las opciones del envío. Algunos valores pueden estar desactualizados. Puede actualizarlos utilizando la opción: <b><i class="fa fa-undo"></i> Auto</b> </b-alert>
          <b-table ref="shippingCosts" hover outlined small fixed responsive="sm"
          :items="itemsProvider"
          :fields="fields"
          :current-page="currentPage"
          :foot-clone="true"
          :per-page="perPage">
            <template slot="name" slot-scope="data">
              <b v-if="data.item.key !== null && data.item.key !== undefined && data.item.key !== ''" :style="data.item.styles">{{ data.item.name }}</b>
              <span v-else>{{ data.item.name }}</span>
            </template>
            <template slot="cost" slot-scope="data">
              <div v-if="data.item.cost !== null">
                <div v-if="typeof(data.item.cost) === 'object'">
                  <del v-if="Object(data.item.cost).discount > 0">${{ Object(data.item.cost).grossPrice }}</del> <b>${{ Object(data.item.cost).netPrice }}</b>
                  <!-- <br> -->
                  <!-- Descuento: {{ Object(data.item.cost).discount }}% -->
                </div>
                <b v-else-if="!data.item.discount"><span v-if="data.item.discount === true && data.item.value > 0">-</span>${{ data.item.cost }}</b>
                <span v-else><span v-if="data.item.discount === true && data.item.value > 0">-</span>${{ data.item.cost }}</span>
              </div>
            </template>
            <template slot="price" slot-scope="data">
              <div v-if="data.item.price !== null">
                <div v-if="typeof(data.item.price) === 'object'">
                  <del v-if="Object(data.item.price).discount > 0">${{ Object(data.item.price).grossPrice }}</del> <b>${{ Object(data.item.price).netPrice }}</b>
                  <!-- <br> -->
                  <!-- Descuento: {{ Object(data.item.price).discount }}% -->
                </div>
                <b v-else-if="!data.item.discount"><span v-if="data.item.discount === true && data.item.value > 0">-</span>${{ data.item.price }}</b>
                <span v-else><span v-if="data.item.discount === true && data.item.value > 0">-</span>${{ data.item.price }}</span>
              </div>
            </template>
            <template slot="vat" slot-scope="data">
              <span v-if="!isNaN(data.item.vat)">{{ String(data.item.vat).replace('.', ',') }}%</span>
              <!-- <b-form-select v-show="data.item.edit" v-model="data.item.vat" :plain="true" :options="vatOptions"></b-form-select> -->
            </template>
            <template slot="detail" slot-scope="data">
              <div v-show="!data.item.edit">
                <ul v-if="typeof(data.item.detail) === 'object'" style="margin: 0;">
                  <li v-for="(value, key) in Object(data.item.detail)" :key="key">
                    {{ key }}: {{ value }}
                  </li>
                </ul>
                <div v-else>
                  {{ data.item.detail }}
                </div>
              </div>
              <b-input-group v-show="data.item.edit">
                <b-form-input :readonly="Boolean(inProgress | !data.item.edit)" type="number" placeholder="0" :value="data.item.value" v-model="data.item.value"></b-form-input>
                <b-input-group-append v-if="data.item.percentage"><b-input-group-text>%</b-input-group-text></b-input-group-append>
              </b-input-group>
            </template>
            <template slot="actions" slot-scope="data">
              <template v-if="data.item.key !== 'total'">
                <template v-if="data.item.edit">
                  <b-button size="sm" variant="primary" @click.prevent="applyEdit(data.item, $event)">
                    <i class="fa fa-check"></i> Aplicar
                  </b-button>
                  <b-button size="sm" variant="warning" @click.prevent="revertEdit(data.item)">
                    Cancelar
                  </b-button>
                </template>
                <template v-else-if="data.item.key !== null && data.item.key !== undefined && data.item.key !== ''">
                  <b-button size="sm" variant="primary" @click.prevent="enableEdit(data.item, $event)">
                    <i class="fa fa-edit"></i> Editar
                  </b-button>
                  <b-button v-if="data.item.customized" size="sm" variant="secondary" @click.prevent="resetEdit(data.item, $event)">
                    <i class="fa fa-undo"></i> Auto
                  </b-button>
                </template>
                <template v-else>
                  <b-button size="sm" variant="danger" @click.prevent="remove(data.item)">
                    <i class="fa fa-ban"></i> Eliminar
                  </b-button>
                </template>
              </template>
            </template>
            <template v-if="!closed" slot="FOOT_name" slot-scope="data">
              <b-form-select id="product" v-model="newRow.productId" :plain="true" :options="productList"></b-form-select>
            </template>
            <template v-if="!closed" slot="FOOT_provider" slot-scope="data">
              <b-form-select id="provider" v-model="newRow.providerId" :plain="true" :options="providerList"></b-form-select>
            </template>
            <template v-if="!closed" slot="FOOT_cost" slot-scope="data">
              <div class="input-group">
                <!-- <b-input-group-prepend><b-input-group-text>USD</b-input-group-text></b-input-group-prepend> -->
                <b-form-input type="number" v-model="newRow.cost"></b-form-input>
              </div>
            </template>
            <template v-if="!closed" slot="FOOT_price" slot-scope="data">
              <div class="input-group">
                <!-- <b-input-group-prepend><b-input-group-text>USD</b-input-group-text></b-input-group-prepend> -->
                <b-form-input type="number" v-model="newRow.price"></b-form-input>
              </div>
            </template>
            <template v-if="!closed" slot="FOOT_vat" slot-scope="data">
              <b-form-select id="vat" v-model="newRow.vat" :plain="true" :options="vatOptions"></b-form-select>
              <!-- <b-form-input type="text" v-model="newRow.detail"></b-form-input> -->
            </template>
            <template v-if="!closed" slot="FOOT_detail" slot-scope="data">
              <!-- <b-form-input type="text" v-model="newRow.detail"></b-form-input> -->
            </template>
            <template v-if="!closed" slot="FOOT_actions" slot-scope="data">
              <b-button size="sm" variant="success" @click.prevent="add">
                <i class="fa fa-plus"></i> Agregar
              </b-button>
            </template>
          </b-table>
          <b-card v-if="shipping.objectId">
            <template slot="header">
              Estado de la operación
              <b-badge variant="success" pill v-if="!closed">Abierto</b-badge>
              <span v-else>
                <b-badge variant="danger" pill>Cerrado</b-badge>
                <b-badge variant="warning" pill v-if="!shipping.billingStatus">Pendiente de facturación</b-badge>
                <b-badge variant="success" pill v-else>Facturado</b-badge>
              </span>
            </template>
            <b-row v-if="pricing !== null">
              <b-col sm="12" v-if="!closed">
                <b-button @click="saveAndCloseShipping" variant="primary" v-b-modal.fileDialogZones><i class="fa fa-check ml-1"></i> Guardar cambios y cerrar envío</b-button> &nbsp; Al cerrar un envío podrá enviarlo a facturación. Las envíos cerrados no se pueden editar.
                <!-- <b-form-group>
                <b-form-checkbox v-model="closed">Cerrado</b-form-checkbox>
              </b-form-group> -->
              </b-col>
            </b-row>
            <b-row v-if="pricing !== null && this.shipping.status !== 0">
              <b-col md="3">
                <b-form-group>
                  <label for="providerName" class="required-label">Cotización del dólar</label>
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>$</b-input-group-text></b-input-group-prepend>
                    <b-form-input v-validate="'required'" v-model="shipping.pricing.dollarValue" type="number"></b-form-input>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label for="providerName" class="required-label">Fecha de cierre <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover :title="'La fecha de cierre no puede ser anterior a la fecha de ĺa operación ('+(shipping.initialDate).split('-').reverse().join('-')+')'"></i></label>
                  <div class="input-group datepicker-group">
                    <!-- <b-input-group-prepend><b-input-group-text>Fecha de cierre</b-input-group-text></b-input-group-prepend> -->
                    <flat-pickr
                    v-validate="'required|date_format:YYYY-MM-DD|after:'+ shipping.initialDate +',inclusion:true'"
                    v-model="shipping.finalDate"
                    data-vv-as="fecha de cierre"
                    name="finalDate"
                    id="finalDate"
                    class="form-control"
                    :class="{ 'is-invalid': errors.has('finalDate') }"
                    :config="config"
                    placeholder="Seleccionar fecha de cierre"></flat-pickr>
                    <b-input-group-append><b-input-group-text><a class="input-button" title="Seleccionar fecha de cierre" data-toggle><i class="fa fa-calendar"></i></a></b-input-group-text></b-input-group-append>
                  </div>
                  <!-- <span><small class="inv-feedback" v-show="errors.has('finalDate')">{{ errors.first('finalDate') }}</small></span> -->
                </b-form-group>
              </b-col>
              <b-col v-if="!shipping.billingStatus" md="12" class="---text-right">
                <p>
                  <b-button variant="primary" v-b-modal.fileDialogZones @click="confirmBill"><i class="fa fa-file ml-1"></i> Facturar <b>USD {{ shipping.pricing.price }}</b></b-button> &nbsp; Si se factura el envío, no se podrá reabrir ni volver a editar.
                </p>
                <!-- Pendiente de facturación<br /> -->
                <b-link @click.prevent="reopen">Reabrir envío</b-link>
              </b-col>
            </b-row>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <c-confirmation-modal
      classModal="return-modal"
      ref="billModal"
      :modalTitle="'¿Desea facturar USD ' + shipping.pricing.price + '?'"
      promptMessage="Al hacerlo se crearán las órdenes de compra y presupuestos en su sistema de administración. Una vez realizada esta acción, no se podrá reabrir ni editar el envío."
      variantConfirmation="warning"
      confirmationMessage="Sí, facturar"
      cancellationMessage="No, seguir editando el envío"
      confirmationMethod="confirmReturn"
      cancellationMethod="cancelReturn"
      @confirmReturn="invoice()"
      @cancelReturn="closeModal()" />
  </section>
</template>
<script>
import { shippingTypes, serviceTypes, packageTypes, countries } from '@/store/const'
import { mapGetters } from 'vuex'
import { FETCH_PRODUCTS, FETCH_PROVIDERS, CREATE_ORDERS, CREATE_BUDGET } from '@/store/types/actions'
import { UPDATE_SHIPPING_PRICING } from '@/store/types/mutations'

import { modalMixin } from '@/mixins/modalMixin'
import flatPickr from 'vue-flatpickr-component'
import { Spanish } from 'flatpickr/dist/l10n/es'
import CConfirmationModal from '@/components/ConfirmationModal'

const config = require('../../config')

export default {
  name: 'c-cost-table',
  components: {
    flatPickr,
    CConfirmationModal
  },
  mixins: [ modalMixin ],
  data () {
    return {
      shippingTypes: shippingTypes,
      serviceTypes: serviceTypes,
      packageTypes: packageTypes,
      config: {
        wrap: true,
        dateFormat: 'Y-m-d',
        locale: Spanish,
        altFormat: 'j \\de F \\de Y',
        altInput: true
        // allowInput: true
      },
      cost: 0,
      price: 0,
      profit: 0,
      additional: [ ],
      items: [ ],
      vatOptions: [
        { text: 'IVA 21%', value: 21 },
        { text: 'IVA 10,5%', value: 10.5 },
        { text: 'IVA 2,5%', value: 2.5 },
        { text: 'IVA 27%', value: 27 },
        { text: 'IVA 5%', value: 5 },
        { text: 'IVA Exento', value: 0 }
      ],
      updated: false,
      savedPricing: {},
      productList: [],
      providerList: [],
      countryList: [],
      newRow: {
        productId: null,
        providerId: null,
        name: null,
        cost: null,
        price: null,
        detail: null,
        vat: null
      },
      inEdit: false,
      // closed: false,

      inProgress: false,
      perPage: 10,
      currentPage: 1
      // totalRows: 1
    }
  },
  computed: {
    // agregar a los map getters la lista de proveedores y el cliente
    // para pivotear entre una y otra entidad
    ...mapGetters(['provider', 'client', 'shipping', 'products', 'providers']),
    fields () {
      let f = [
        { key: 'name', label: 'Concepto' },
        // { key: 'taxDetails', label: 'Tasa IVA' },
        { key: 'provider', label: 'Proveedor' },
        { key: 'cost', label: 'Costo', class: 'cost-discount' },
        { key: 'price', label: 'Precio de venta', class: 'cost-discount' },
        { key: 'vat', label: '% IVA', class: 'cost-discount' },
        { key: 'detail', label: 'Detalle' }
        // { key: 'tax', label: 'Importe IVA' },
        // { key: 'total', label: 'Importe' },
        // { key: 'subtotal', label: 'Subtotal', class: 'cost-actions' },

      ]
      if (!this.closed) f.push({ key: 'actions', label: 'Acciones', class: 'cost-actions' })
      return f
    },
    declaredValueInsurance () {
      let insurance = (this.savedPricing !== undefined && this.savedPricing !== null && Object.keys(this.savedPricing).length > 0) ? this.savedPricing.insurance : Number(this.provider.insurance)
      let value = this.shipping.package.declaredValue * (insurance / 100) // (this.provider.externalId !== null) ? this.shipping.package.declaredValue * (insurance / 100) : 0
      return this.currencyFormat(value)
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
      return Number(this.volumetricWeight > this.shipping.package.weight ? this.volumetricWeight : this.shipping.package.weight)
    },
    pricing () {
      let costDiscount = 0
      let saleDiscount = 0
      let grossPrice = 0
      let insurance = Number(this.provider.insurance)
      let isComplete = true
      let dollarValue = 0

      // if (this.provider.externalId === null) return null

      // Obtengo el precio de combustible correspondiente a la fecha del envios
      let fuelPercent = this.provider.fuelTable.find(el => {
        return this.shipping.initialDate >= el.fromDate && this.shipping.initialDate <= el.toDate
      })
      if (!fuelPercent) isComplete = false // return null
      else fuelPercent = fuelPercent.fuelPercent

      // Obtengo el precio del flete correspondiente a la zona y tipos de envío, servicio y paquete
      let costs = this.provider.costsTable.find(el => {
        return el.shippingType === this.shipping.shippingType &&
        el.serviceType === this.shipping.serviceType &&
        el.packageType === this.shipping.package.type &&
        el.shippingZone === this.shipping.shippingZone
      })
      if (!costs) isComplete = false // return null
      else {
        // La segunda condición es para los paquetes de tipo 'sobre' que tienen un único precio y el valor asignado al peso es '-'
        let sortedTable = [...costs.costs].sort((a, b) => a.weight - b.weight)
        let price = sortedTable.find(el => { return el.weight >= this.weight || (isNaN(el.weight) && costs.costs.length === 1) })
        if (!price) isComplete = false // return null
        else {
          grossPrice = price.grossPrice
          costDiscount = price.costDiscount

          // Obtengo los descuentos vinculados al cliente de acuerdo a las opciones seleccionadas
          // Puede no haber descuentos
          // if (this.client.externalId !== null) {
          let clientCosts = this.client.costsTable.find(el => {
            return el.providerId === this.provider.objectId &&
            el.shippingType === this.shipping.shippingType &&
            el.serviceType === this.shipping.serviceType &&
            el.packageType === this.shipping.package.type &&
            el.shippingZone === this.shipping.shippingZone
          })
          if (clientCosts !== undefined) {
            // La segunda condición es para los paquetes de tipo 'sobre' que tienen un único precio y el valor asignado al peso es '-'
            // let sortedClientTable = [...clientCosts.costs].sort((a, b) => a.weight - b.weight)
            // let discounts = sortedClientTable.find(el => { return el.weight >= this.weight || (isNaN(el.weight) && clientCosts.costs.length === 1) })
            let discounts = clientCosts.costs.find(el => { return el.weight >= price.weight || (isNaN(el.weight) && clientCosts.costs.length === 1) })
            if (discounts !== undefined) {
              saleDiscount = discounts.saleDiscount
            }
          }
          // }
        }
      }

      if (isComplete) {
        return {
          // cost,
          fuelPercent,
          costDiscount,
          saleDiscount,
          grossPrice,
          // netPrice,
          insurance,
          dollarValue
        }
      } else if (this.savedPricing !== undefined && this.savedPricing !== null && Object.keys(this.savedPricing).length > 0) {
        return {...this.savedPricing}
      } else return null
    },
    shippingTypeText () {
      let shippingType = this.shippingTypes.find(el => el.value === this.shipping.shippingType)
      return shippingType !== undefined ? shippingType.text : ''
    },
    serviceTypeText () {
      let serviceType = this.serviceTypes.find(el => el.value === this.shipping.serviceType)
      return serviceType !== undefined ? serviceType.text : ''
    },
    packageTypeText () {
      let packageType = this.packageTypes.find(el => el.value === this.shipping.package.type)
      return packageType !== undefined ? packageType.text : ''
    },
    closed () {
      return this.shipping.status === 1
    }
  },
  watch: {
    pricing (val) {
      let newPricing = {...this.shipping.pricing} // Object.assign({ }, this.shipping.pricing)
      // let isUpdate = false
      for (let key in val) {
        if (newPricing[key] === undefined) newPricing[key] = val[key]
        // else isUpdate = true
      }
      // if (isUpdate) {
      //   let item = this.items.find(el => { return el.customized })
      //   if (item !== null && item !== undefined) this.updated = true
      // }
      this.updateShippingPricing(newPricing)
      if (this.$refs.shippingCosts !== undefined) this.$refs.shippingCosts.refresh()
    }
  },
  // en created lo que hago es setear la serie de valores iniciales para los filtros, y la tabla de costos que corresponde
  async created () {
    this.items = [ {
      // 'Flete: ' + this.provider.businessName,
      name: 'Envío',
      key: 'grossPrice'
    },
    {
      name: '% Descuento Costo',
      percentage: true,
      discount: true,
      key: 'costDiscount',
      styles: { 'padding-left': '30px' }
    },
    {
      name: '% Descuento Venta',
      percentage: true,
      discount: true,
      key: 'saleDiscount',
      styles: { 'padding-left': '30px' }
    },
    {
      name: 'Combustible',
      percentage: true,
      key: 'fuelPercent'
    },
    {
      name: 'Seguro',
      percentage: true,
      key: 'insurance'
    } ]

    if (this.shipping.pricing.additional !== undefined) {
      this.additional = this.shipping.pricing.additional.slice()
      this.additional.forEach(el => {
        let newRow = {}
        newRow.name = el.name
        newRow.provider = el.provider
        newRow.cost = parseFloat(el.cost)
        newRow.price = parseFloat(el.price)
        newRow.vat = parseFloat(el.vat)
        newRow.productId = el.productId
        newRow.providerId = el.providerId
        this.items.push(newRow)
        if (this.$refs.shippingCosts !== undefined) this.$refs.shippingCosts.refresh()
      })
    }
    // this.closed = (this.shipping.status === 1)

    this.fetchProducts().then(() => {
      this.products.map(el => {
        this.productList.push({ value: el.externalId, text: el.name })
      })
    })

    this.fetchProviders().then(() => {
      this.providers.map(el => {
        // Solo obtengo los proveedores sincronizados con Xubio
        if (el.externalId) {
          this.providerList.push({ value: el.externalId, text: el.name })
        }
      })
    })

    // cargo las listas de país
    countries.map(el => {
      this.countryList.push({ code: el.numericCode, name: el.name })
    })

    this.savedPricing = {...this.shipping.pricing}
  },
  methods: {
    /* Genera los datos para la tabla, luego actualiza el precio final */
    itemsProvider (ctx) {
      if (!this.inEdit) {
        this.updated = false
        for (let key in this.pricing) {
          let item = this.items.find(el => { return el.key === key })
          if (item) {
            if (this.shipping.pricing[key] !== undefined && this.shipping.pricing[key] !== null) {
              // item.cost = this.shipping.pricing[key]
              // item.price = this.shipping.pricing[key]
              item.customized = (this.pricing[key] !== this.shipping.pricing[key])
              this.updated = this.updated || item.customized
            } else {
              // item.cost = this.pricing[key]
              // item.price = this.pricing[key]
            }
          }
        }
      }

      // this.items[0].vat = 0
      this.items[0].value = this.shipping.pricing.grossPrice
      this.items[0].cost = {
        grossPrice: this.shipping.pricing.grossPrice,
        discount: this.shipping.pricing.costDiscount,
        netPrice: this.currencyFormat(this.shipping.pricing.grossPrice - (this.shipping.pricing.grossPrice * this.shipping.pricing.costDiscount / 100))
      }
      this.items[0].price = {
        grossPrice: this.shipping.pricing.grossPrice,
        discount: this.shipping.pricing.saleDiscount,
        netPrice: this.currencyFormat(this.shipping.pricing.grossPrice - (this.shipping.pricing.grossPrice * this.shipping.pricing.saleDiscount / 100))
      }
      this.items[0].provider = this.provider.name
      this.items[0].detail = '$' + this.shipping.pricing.grossPrice

      this.items[1].cost = this.currencyFormat(this.shipping.pricing.grossPrice * this.shipping.pricing.costDiscount / 100)
      this.items[1].price = null
      this.items[1].value = this.shipping.pricing.costDiscount
      this.items[1].detail = this.shipping.pricing.costDiscount + '%'

      this.items[2].cost = null
      this.items[2].price = this.currencyFormat(this.shipping.pricing.grossPrice * this.shipping.pricing.saleDiscount / 100)
      this.items[2].value = this.shipping.pricing.saleDiscount
      this.items[2].detail = this.shipping.pricing.saleDiscount + '%'

      // this.items[3].vat = 0
      this.items[3].cost = this.currencyFormat(this.items[0].cost.netPrice * this.shipping.pricing.fuelPercent / 100)
      this.items[3].price = this.currencyFormat(this.items[0].price.netPrice * this.shipping.pricing.fuelPercent / 100)
      this.items[3].value = this.shipping.pricing.fuelPercent
      this.items[3].detail = this.shipping.pricing.fuelPercent + '%'

      // this.items[4].vat = 0
      this.items[4].cost = this.declaredValueInsurance
      this.items[4].price = this.declaredValueInsurance
      this.items[4].value = this.shipping.pricing.insurance
      this.items[4].detail = this.shipping.pricing.insurance + '% del valor declarado ($' + this.shipping.package.declaredValue + ')'

      this.updateSubtotals()
      let itemsResult = [...this.items]
      itemsResult.push({
        name: 'Total',
        key: 'total',
        cost: this.cost,
        price: this.price,
        detail: 'Beneficio: $' + this.profit
        // _rowVariant: 'secondary'
      })
      return itemsResult || []
    },
    updateShippingPricing (newPricing) {
      return this.$store.commit(UPDATE_SHIPPING_PRICING, newPricing)
    },
    updateSubtotals () {
      this.cost = 0
      this.price = 0
      this.items.forEach(el => {
        let costValue = Math.abs(Number(el.cost === null ? 0 : (typeof el.cost === 'object' ? el.value : el.cost)))
        let priceValue = Math.abs(Number(el.price === null ? 0 : (typeof el.price === 'object' ? el.value : el.price)))
        if (el.discount) {
          this.cost -= costValue
          this.price -= priceValue
        } else {
          this.cost += costValue
          this.price += priceValue
        }
        // el.subtotal = Number(parseFloat(this.cost).toFixed(2))
      })
      this.profit = this.currencyFormat(this.price - this.cost)
      this.cost = this.currencyFormat(this.cost)
      this.price = this.currencyFormat(this.price)
      let newPricing = {...this.shipping.pricing} // Object.assign({ }, this.shipping.pricing)
      newPricing.cost = this.cost
      newPricing.price = this.price
      this.updateShippingPricing(newPricing)
    },
    add (el) {
      let newRow = {...this.newRow} // Object.assign({ }, this.newRow)
      if (newRow.providerId === null || newRow.productId === null || newRow.cost === null || newRow.price === null) {
        this.$toasted.global.error_toast({ message: 'Debe completar todos los campos para agregar un nuevo elemento.' })
        return
      }

      let product = this.products.find(el => el.externalId === newRow.productId)
      let provider = this.providers.find(el => el.externalId === newRow.providerId)
      console.log(newRow.providerId)
      console.log(this.providers)
      console.log(provider)
      newRow.name = product.name
      newRow.provider = provider.name
      newRow.cost = parseFloat(newRow.cost)
      newRow.price = parseFloat(newRow.price)
      newRow.vat = parseFloat(newRow.vat)
      this.newRow.providerId = null
      this.newRow.productId = null
      this.newRow.cost = null
      this.newRow.price = null
      this.newRow.detail = null
      this.newRow.vat = null

      this.items.push(newRow)
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en "Guardar cambios" para registrar los cambios' })
      this.$refs.shippingCosts.refresh()

      this.additional.push({
        'productId': product.externalId,
        'providerId': provider.externalId,
        'name': product.name,
        'code': product.code,
        'provider': provider.name,
        'cost': newRow.cost,
        'price': newRow.price,
        'vat': newRow.vat
      })

      let newPricing = {...this.shipping.pricing} // Object.assign({ }, this.shipping.pricing)
      newPricing.additional = this.additional
      this.updateShippingPricing(newPricing)
    },
    remove (selectedItem) {
      let product = this.additional.find(el => el.productId === selectedItem.productId && el.cost === selectedItem.cost)
      let index = this.additional.indexOf(product)
      if (index > -1) {
        this.additional.splice(index, 1)
      }

      index = this.items.indexOf(selectedItem)
      if (index > -1) {
        this.items.splice(index, 1)
        this.$refs.shippingCosts.refresh()
      }

      let newPricing = Object.assign({ }, this.shipping.pricing)
      newPricing.additional = this.additional
      this.updateShippingPricing(newPricing)
    },
    enableEdit (selectedItem, event) {
      if (selectedItem !== undefined && selectedItem !== null && !this.inEdit) {
        let selRow = this.items.find(el => el.key === selectedItem.key)
        this.inEdit = true
        selRow.edit = true
        this.$refs.shippingCosts.refresh()
        event.target.parentNode.parentNode.querySelector('input').focus()
      } else {
        this.$toasted.global.error_toast({ message: 'No se pueden editar dos filas a la vez' })
      }
    },
    applyEdit (selectedItem, event) {
      this.inEdit = false
      if (selectedItem !== undefined && selectedItem !== null) {
        // if (!this.validateNumericValues(selectedItem)) return
        let selRow = this.items.find(el => el.key === selectedItem.key)
        let newPricing = {...this.shipping.pricing} // Object.assign({ }, this.shipping.pricing)

        if (selectedItem.value === '' || selectedItem.value === undefined || selectedItem.value === null) {
          event.target.parentNode.parentNode.querySelector('input').value = selectedItem.value = Math.abs(this.pricing[selectedItem.key])
          selectedItem.customized = false
          delete newPricing[selectedItem.key]
        } else {
          selectedItem.value = Math.abs(selectedItem.value)
          if (selectedItem.value !== this.pricing[selectedItem.key]) {
            selectedItem.customized = true
          }
          newPricing[selectedItem.key] = selectedItem.value
        }
        // this.shipping.pricing = newPricing
        this.updateShippingPricing(newPricing)
        this.savedPricing = {...this.shipping.pricing}
        this.$refs.shippingCosts.refresh()
        delete selRow.edit
      }
    },
    revertEdit (selectedItem) {
      if (selectedItem !== undefined && selectedItem !== null) {
        let selRow = this.items.find(el => el.key === selectedItem.key)
        event.target.parentNode.parentNode.querySelector('input').value = selectedItem.value = (this.shipping.pricing[selectedItem.key] !== undefined && this.shipping.pricing[selectedItem.key] !== null) ? this.shipping.pricing[selectedItem.key] : this.pricing[selectedItem.key]

        delete selRow.edit
      }
      this.inEdit = false
      this.$refs.shippingCosts.refresh()
    },
    resetEdit (selectedItem, event) {
      this.inEdit = false
      if (selectedItem !== undefined && selectedItem !== null) {
        let selRow = this.items.find(el => el.key === selectedItem.key)
        let newPricing = {...this.shipping.pricing} // Object.assign({ }, this.shipping.pricing)

        newPricing[selectedItem.key] = selectedItem.value = this.pricing[selectedItem.key]
        this.updateShippingPricing(newPricing)

        selectedItem.customized = false
        this.savedPricing = {...this.shipping.pricing}
        this.$refs.shippingCosts.refresh()
        delete selRow.edit

        // let item = this.items.find(el => { return el.customized })
        // if (item === null && item === undefined) this.updated = false
      }
    },
    validateNumericValues (row) {
      let retVal = true
      if (isNaN(row.cost) | row.cost === undefined | row.cost === null) {
        this.$toasted.global.error_toast({ message: 'Ingrese un valor válido' })
        retVal = false
      }
      return retVal
    },
    validate () {
      return this.$validator.validateAll()
    },
    fetchProviders () {
      return this.$store.dispatch(FETCH_PROVIDERS)
    },
    fetchProducts () {
      return this.$store.dispatch(FETCH_PRODUCTS)
    },
    currencyFormat (val) {
      return Number(parseFloat(val).toFixed(2))
    },
    saveAndCloseShipping () {
      // this.closed = true
      this.$emit('close')
    },
    reopen () {
      this.$toasted.global.info_toast({ message: 'El envío fue reabierto y se puede editar. Haga clic en "Guardar cambios" cuando haya finalizado.' })
      this.shipping.status = 0
    },
    confirmBill () {
      this.validate().then(res => {
        if (!res) {
          this.$toasted.global.error_toast({ message: 'Por favor, complete o corrija los campos requeridos.' })
          return false
        }
        this.$refs.billModal.$refs.confirmationModal.show()
      })
    },
    closeModal () {
      if (this.$refs.billModal.waiting === false) {
        this.$refs.billModal.$refs.confirmationModal.hide()
      }
    },
    bill () {
      let items = [ ]
      let shippingProvider = this.providers.find(el => { return el.objectId === this.shipping.providerId })
      let shippingProduct = this.products.find(el => { return el.externalId === (process.env.NODE_ENV === 'production' ? config.build.xubioShippingProductId : config.dev.xubioShippingProductId) })
      let shippingItem = { }
      shippingItem.date = this.shipping.finalDate
      shippingItem.dollarValue = this.shipping.pricing.dollarValue
      shippingItem.providerId = shippingProvider.externalId
      shippingItem.provider = shippingProvider.name
      shippingItem.products = [{
        'id': shippingProduct.externalId,
        'name': shippingProduct.name,
        'code': shippingProduct.code,
        'value': (this.shipping.pricing.grossPrice * (100 - this.shipping.pricing.costDiscount) / 100) * ((100 + this.shipping.pricing.fuelPercent) / 100) + (this.shipping.package.declaredValue * this.shipping.pricing.insurance / 100),
        'vat': 0
      }]
      shippingItem.description = 'Envío: ' + this.shipping.objectId + '. ' +
                                  'Número de guía: ' + this.shipping.tracking.guide + '. ' +
                                  'Peso: ' + this.shipping.package.weight + '. ' +
                                  'Número de referencia: ' + this.shipping.package.reference + '. ' +
                                  'Destino: ' + this.shipping.destination.streetAddress + ', ' + this.shipping.destination.city + ', ' + this.shipping.destination.state + ', ' + this.countryList.find(element => element.code === this.shipping.destination.country).name + '. '
      items.push(shippingItem)

      // Esto es para crear ordenes de compra separadas por producto
      for (const additionalItem of this.shipping.pricing.additional) {
        let item = { }
        item.date = this.shipping.finalDate
        item.dollarValue = this.shipping.pricing.dollarValue
        item.providerId = additionalItem.providerId
        item.provider = additionalItem.provider
        item.products = [{
          'id': additionalItem.productId,
          'name': additionalItem.name,
          'code': additionalItem.code,
          'value': additionalItem.cost,
          'vat': additionalItem.vat
        }]
        item.description = 'Envío: ' + this.shipping.objectId + '. ' +
                            'Número de guía: ' + this.shipping.tracking.guide + '. ' +
                            'Peso: ' + this.shipping.package.weight + '. ' +
                            'Número de referencia: ' + this.shipping.package.reference + '. ' +
                            'Destino: ' + this.shipping.destination.streetAddress + ', ' + this.shipping.destination.city + ', ' + this.shipping.destination.state + ', ' + this.countryList.find(element => element.code === this.shipping.destination.country).name + '. '
        items.push(item)
      }

      // Esto es para crear ordenes de compra separadas por proveedor
      // for (const additionalItem of this.shipping.pricing.additional) {
      //   let itemsListIndex = -1
      //   let product = { }
      //   items.filter((item, i) => {
      //     if (item.providerId === additionalItem.providerId) {
      //       itemsListIndex = i
      //       return true
      //     }
      //   })
      //   if (itemsListIndex === -1) {
      //     let item = { }
      //     item.date = this.shipping.finalDate
      //     item.dollarValue = this.shipping.pricing.dollarValue
      //     item.providerId = additionalItem.providerId
      //     item.provider = additionalItem.provider
      //     item.products = [ ]
      //     items.push(item)
      //     itemsListIndex = items.length - 1
      //   }
      //   product.id = additionalItem.productId
      //   product.name = additionalItem.name
      //   product.code = additionalItem.code
      //   product.value = additionalItem.cost
      //   product.vat = additionalItem.vat
      //   items[itemsListIndex].products.push(product)
      // }
      // console.log(items)
      return this.$store.dispatch(CREATE_ORDERS, items)
    },
    budget () {
      let budget = { }
      // let items = [ ]
      // let shippingProvider = this.providers.find(el => { return el.objectId === this.shipping.providerId })
      let shippingProduct = this.products.find(el => { return el.externalId === (process.env.NODE_ENV === 'production' ? config.build.xubioShippingProductId : config.dev.xubioShippingProductId) })
      // let shippingItem = { }
      budget.date = this.shipping.finalDate
      budget.dollarValue = this.shipping.pricing.dollarValue
      budget.clientId = this.client.externalId
      budget.client = this.client.name
      budget.items = [ ]
      budget.items.push({
        'id': shippingProduct.externalId,
        'name': shippingProduct.name,
        'code': shippingProduct.code,
        'value': (this.shipping.pricing.grossPrice * (100 - this.shipping.pricing.saleDiscount) / 100) * ((100 + this.shipping.pricing.fuelPercent) / 100) + (this.shipping.package.declaredValue * this.shipping.pricing.insurance / 100),
        'vat': 0
      })

      for (const additionalItem of this.shipping.pricing.additional) {
        let product = { }
        product.id = additionalItem.productId
        product.name = additionalItem.name
        product.code = additionalItem.code
        product.value = additionalItem.price
        product.vat = additionalItem.vat
        budget.items.push(product)
      }

      budget.description = 'Envío: ' + this.shipping.objectId + '. ' +
                            'Número de guía: ' + this.shipping.tracking.guide + '. ' +
                            'Peso: ' + this.shipping.package.weight + '. ' +
                            'Número de referencia: ' + this.shipping.package.reference + '. ' +
                            'Destino: ' + this.shipping.destination.streetAddress + ', ' + this.shipping.destination.city + ', ' + this.shipping.destination.state + ', ' + this.countryList.find(element => element.code === this.shipping.destination.country).name + '. '

      // console.log(budget.items)
      return this.$store.dispatch(CREATE_BUDGET, budget)
    },
    invoice () {
      if (this.$refs.billModal.waiting === false) {
        let promises = [
          this.bill(),
          this.budget()
        ]
        this.$refs.billModal.wait()
        Promise.all(promises).then(() => {
          this.$toasted.global.success_toast({ message: `Envío facturado.` })
          this.$refs.billModal.stopWaiting()
          this.closeModal()
          this.$emit('invoice')
        }, error => {
          this.$toasted.global.error_toast({ message: error.message.error.error })
          this.$refs.billModal.stopWaiting()
        })
      }
    },
    formatProduct () {
      let product = { }
      return product
    }
  }
}
</script>
