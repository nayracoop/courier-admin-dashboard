<template>
  <section>
    <b-row v-if="pricing !== null">
      <b-col sm="5">
        <b-form-group>
          <b-form-checkbox v-model="closed">Cerrado</b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-if="pricing !== null && this.shipping.status !== 0">
      <b-col sm="5">
        <b-form-group>
          <div class="input-group datepicker-group">
            <b-input-group-prepend><b-input-group-text>Fecha de cierre</b-input-group-text></b-input-group-prepend>
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
            &nbsp;<i class="fa fa-question-circle fa-sm" v-b-tooltip.hover :title="'La fecha de cierre no puede ser anterior a la fecha de ĺa operación ('+shipping.initialDate+')'"></i>
          </div>
          <!-- <span><small class="inv-feedback" v-show="errors.has('finalDate')">{{ errors.first('finalDate') }}</small></span> -->
        </b-form-group>
      </b-col>
      <b-col sm="7" class="text-right">
        <!-- Pendiente de facturación<br /> -->
        <b-button variant="primary" v-b-modal.fileDialogZones><i class="fa fa-file ml-1"></i> Facturar <b>USD {{ shipping.pricing.cost }}</b></b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <p v-if="pricing === null">
          No existen costos cargados para la combinación de opciones seleccionadas.
        </p>
        <div v-else>
          <p><b>Tipo de envío</b>: {{ shippingTypeText }}. <b>Servicio</b>: {{ serviceTypeText }}. <b>Tipo de embalaje</b>: {{ packageTypeText }}. <b>Peso</b>: {{ weight }}kg. <b>Zona</b>: {{ shipping.shippingZone }}</p>
          <b-alert show variant="warning" v-if="updated" dismissible>Se realizaron cambios en las opciones del envío. Algunos valores pueden estar desactualizados. Puede actualizarlos utilizando la opción: <b><i class="fa fa-undo"></i> Auto</b> </b-alert>
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
                <b v-else><span v-if="data.item.discount === true && data.item.value > 0">-</span>${{ data.item.cost }}</b>
              </div>
            </template>
            <template slot="price" slot-scope="data">
              <div v-if="data.item.price !== null">
                <div v-if="typeof(data.item.price) === 'object'">
                  <del v-if="Object(data.item.price).discount > 0">${{ Object(data.item.price).grossPrice }}</del> <b>${{ Object(data.item.price).netPrice }}</b>
                  <!-- <br> -->
                  <!-- Descuento: {{ Object(data.item.price).discount }}% -->
                </div>
                <b v-else><span v-if="data.item.discount === true && data.item.value > 0">-</span>${{ data.item.price }}</b>
              </div>
            </template>
            <template slot="detail" slot-scope="data">
              <div v-if="Boolean(inProgress | !data.item.edit)">
                <ul v-if="typeof(data.item.detail) === 'object'" style="margin: 0;">
                  <li v-for="(value, key) in Object(data.item.detail)">
                    {{ key }}: {{ value }}
                  </li>
                </ul>
                <div v-else>
                  {{ data.item.detail }}
                </div>
              </div>
              <b-input-group v-else>
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
            <template slot="FOOT_name" slot-scope="data">
              <b-form-select id="product" v-model="newRow.productId" :plain="true" :options="productList"></b-form-select>
            </template>
            <template slot="FOOT_cost" slot-scope="data">
              <div class="input-group datepicker-group">
                <!-- <b-input-group-prepend><b-input-group-text>USD</b-input-group-text></b-input-group-prepend> -->
                <b-form-input type="number" v-model="newRow.cost"></b-form-input>
              </div>
            </template>
            <template slot="FOOT_price" slot-scope="data">
              <div class="input-group datepicker-group">
                <!-- <b-input-group-prepend><b-input-group-text>USD</b-input-group-text></b-input-group-prepend> -->
                <b-form-input type="number" v-model="newRow.price"></b-form-input>
              </div>
            </template>
            <template slot="FOOT_detail" slot-scope="data">
            </template>
            <template slot="FOOT_actions" slot-scope="data">
              <b-button size="sm" variant="success" @click.prevent="add">
                <i class="fa fa-plus"></i> Agregar
              </b-button>
            </template>
          </b-table>
          {{ shipping.pricing }}
        </div>
      </b-col>
    </b-row>
  </section>
</template>
<script>
import { shippingTypes, serviceTypes, packageTypes } from '@/store/const'
import { mapGetters } from 'vuex'
import { FETCH_PRODUCTS } from '@/store/types/actions'
import { UPDATE_SHIPPING_PRICING } from '@/store/types/mutations'

import flatPickr from 'vue-flatpickr-component'
import { Spanish } from 'flatpickr/dist/l10n/es'

export default {
  name: 'c-cost-table',
  components: {
    flatPickr
  },
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
      fields: [
        { key: 'name', label: 'Concepto' },
        // { key: 'taxDetails', label: 'Tasa IVA' },
        { key: 'provider', label: 'Proveedor' },
        { key: 'cost', label: 'Costo', class: 'cost-discount' },
        { key: 'price', label: 'Precio de venta', class: 'cost-discount' },
        { key: 'detail', label: 'Detalle' },
        // { key: 'tax', label: 'Importe IVA' },
        // { key: 'total', label: 'Importe' },
        // { key: 'subtotal', label: 'Subtotal', class: 'cost-actions' },
        { key: 'actions', label: 'Acciones', class: 'cost-actions' }
      ],
      cost: 0,
      additional: [ ],
      items: [ ],
      updated: false,
      savedPricing: {},
      productList: [],
      newRow: {
        productId: null,
        name: null,
        value: null
      },
      inEdit: false,
      closed: false,

      inProgress: false,
      perPage: 10,
      currentPage: 1
      // totalRows: 1
    }
  },
  computed: {
    // agregar a los map getters la lista de proveedores y el cliente
    // para pivotear entre una y otra entidad
    ...mapGetters(['provider', 'client', 'shipping', 'products']),
    declaredValueInsurance () {
      let insurance = (this.savedPricing !== undefined && this.savedPricing !== null && Object.keys(this.savedPricing).length > 0) ? this.savedPricing.insurance : this.provider.insurance
      let value = (this.provider.externalId !== null) ? this.shipping.package.declaredValue * (insurance / 100) : 0
      return value
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
      let insurance = this.declaredValueInsurance
      let isComplete = true

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
        let price = costs.costs.find(el => { return el.weight >= this.weight || (isNaN(el.weight) && costs.costs.length === 1) })
        if (!price) isComplete = false // return null
        else {
          grossPrice = price.grossPrice
          costDiscount = price.costDiscount

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
          insurance
        }
      } else if (this.savedPricing !== undefined && this.savedPricing !== null && Object.keys(this.savedPricing).length > 0) {
        return {...this.savedPricing}
      } else return null
    },
    shippingTypeText () {
      return (this.shippingTypes.find(el => el.value === this.shipping.shippingType)).text
    },
    serviceTypeText () {
      return (this.serviceTypes.find(el => el.value === this.shipping.serviceType)).text
    },
    packageTypeText () {
      return (this.packageTypes.find(el => el.value === this.shipping.package.type)).text
    }
  },
  watch: {
    pricing (val) {
      let newPricing = Object.assign({ }, this.shipping.pricing)
      let isUpdate = false
      for (let key in val) {
        if (newPricing[key] === undefined) newPricing[key] = val[key]
        else isUpdate = true
      }
      if (isUpdate) {
        let item = this.items.find(el => { return el.customized })
        if (item !== null && item !== undefined) this.updated = true
      }
      this.updateShippingPricing(newPricing)
      if (this.$refs.shippingCosts !== undefined) this.$refs.shippingCosts.refresh()
    },
    closed (val) {
      this.shipping.status = Number(val)
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
        newRow.cost = parseFloat(el.cost)
        newRow.productId = el.productId
        this.items.push(newRow)
        if (this.$refs.shippingCosts !== undefined) this.$refs.shippingCosts.refresh()
      })
    }
    this.closed = (this.shipping.status === 1)

    this.fetchProducts().then(() => {
      this.products.map(el => {
        this.productList.push({ value: el.externalId, text: el.name })
      })
    })

    this.savedPricing = {...this.shipping.pricing}
  },
  methods: {
    /* Genera los datos para la tabla, luego actualiza el precio final */
    itemsProvider (ctx) {
      if (!this.inEdit) {
        for (let key in this.pricing) {
          let item = this.items.find(el => { return el.key === key })
          if (item) {
            if (this.shipping.pricing[key] !== undefined && this.shipping.pricing[key] !== null) {
              //item.cost = this.shipping.pricing[key]
              //item.price = this.shipping.pricing[key]
              item.customized = (this.pricing[key] !== this.shipping.pricing[key])
            } else {
              //item.cost = this.pricing[key]
              //item.price = this.pricing[key]
            }
          }
        }
      }

      // this.items[0] = {
      //   name: 'Envío',
      //   key: 'grossPrice',
      //   cost: {
      //     grossPrice: this.shipping.pricing.grossPrice,
      //     discount: this.shipping.pricing.costDiscount,
      //     netPrice: this.shipping.pricing.grossPrice - (this.shipping.pricing.grossPrice * this.shipping.pricing.costDiscount / 100)
      //   },
      //   price: this.shipping.pricing.grossPrice
      // }
      this.items[0].value = this.shipping.pricing.grossPrice
      this.items[0].cost = {
        grossPrice: this.shipping.pricing.grossPrice,
        discount: this.shipping.pricing.costDiscount,
        netPrice: this.shipping.pricing.grossPrice - (this.shipping.pricing.grossPrice * this.shipping.pricing.costDiscount / 100)
      }
      this.items[0].price = {
        grossPrice: this.shipping.pricing.grossPrice,
        discount: this.shipping.pricing.saleDiscount,
        netPrice: this.shipping.pricing.grossPrice - (this.shipping.pricing.grossPrice * this.shipping.pricing.saleDiscount / 100)
      }
      this.items[0].provider = this.provider.name
      this.items[0].detail = '$' + this.shipping.pricing.grossPrice

      // {
      //     'Tipo de envío': 'Importación',
      //     'Servicio': 'Doméstico',
      //     'Tipo de embalaje': 'Caja',
      //     'Peso': '1kg',
      //     'Zona': '1',
      //     'Precio': '$80'
      // }

      this.items[1].cost = this.shipping.pricing.grossPrice * this.shipping.pricing.costDiscount / 100
      this.items[1].price = null
      this.items[1].value = this.shipping.pricing.costDiscount
      this.items[1].detail = this.shipping.pricing.costDiscount + '%'

      this.items[2].cost = null
      this.items[2].price = this.shipping.pricing.grossPrice * this.shipping.pricing.saleDiscount / 100
      this.items[2].value = this.shipping.pricing.saleDiscount
      this.items[2].detail = this.shipping.pricing.saleDiscount + '%'

      this.items[3].cost = this.shipping.pricing.grossPrice * this.shipping.pricing.fuelPercent / 100
      this.items[3].price = this.shipping.pricing.grossPrice * this.shipping.pricing.fuelPercent / 100
      this.items[3].value = this.shipping.pricing.fuelPercent
      this.items[3].detail = this.shipping.pricing.fuelPercent + '% del precio bruto ($' + this.shipping.pricing.grossPrice + ')'

      this.items[4].cost = this.declaredValueInsurance
      this.items[4].price = this.declaredValueInsurance
      this.items[4].value = this.shipping.pricing.insurance
      this.items[4].detail = this.shipping.pricing.insurance + '% del valor declarado ($' + this.shipping.package.declaredValue + ')'

      // {
      //   name: '% Combustible',
      //   percentage: true,
      //   key: 'fuelPercent'
      // },
      // {
      //   name: 'Seguro',
      //   key: 'insurance'
      // }

      this.updateSubtotals()
      let itemsResult = [...this.items]
      itemsResult.push({
        name: 'Total',
        key: 'total'
        // _rowVariant: 'secondary'
      })
      return itemsResult || []
    },
    updateShippingPricing (newPricing) {
      return this.$store.commit(UPDATE_SHIPPING_PRICING, newPricing)
    },
    updateSubtotals () {
      this.cost = 0
      this.items.forEach(el => {
        if (el.percentage) {
          this.cost += this.cost * (el.cost / 100) * (el.discount ? -1 : 1)
        } else {
          this.cost += el.cost
        }
        el.subtotal = Number(parseFloat(this.cost).toFixed(2))
      })
      this.cost = Number(parseFloat(this.cost).toFixed(2))
      let newPricing = Object.assign({ }, this.shipping.pricing)
      newPricing.cost = this.cost
      this.updateShippingPricing(newPricing)
    },
    add (el) {
      let newRow = Object.assign({ }, this.newRow)
      let product = this.products.find(el => el.externalId === newRow.productId)

      newRow.name = product.name
      newRow.cost = parseFloat(newRow.cost)
      newRow.price = parseFloat(newRow.price)
      this.newRow.productId = null
      this.newRow.cost = null
      this.newRow.price = null

      this.items.push(newRow)
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en "Guardar cambios" para registrar los cambios' })
      this.$refs.shippingCosts.refresh()

      this.additional.push({
        'productId': product.externalId,
        'name': product.name,
        'code': product.code,
        'cost': newRow.cost,
        'price': newRow.price
      })

      let newPricing = Object.assign({ }, this.shipping.pricing)
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
        console.log(selRow)
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
        let newPricing = {...this.shipping.pricing} //Object.assign({ }, this.shipping.pricing)

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
        // this.shipping.pricing = newPricing
        this.updateShippingPricing(newPricing)
        this.$refs.shippingCosts.refresh()
        delete selRow.edit

        this.savedPricing = {...this.shipping.pricing}
      }
    },
    revertEdit (selectedItem) {
      if (selectedItem !== undefined && selectedItem !== null) {
        let selRow = this.items.find(el => el.key === selectedItem.key)
        event.target.parentNode.parentNode.querySelector('input').cost = selectedItem.cost = (this.shipping.pricing[selectedItem.key] !== undefined && this.shipping.pricing[selectedItem.key] !== null) ? this.shipping.pricing[selectedItem.key] : this.pricing[selectedItem.key]

        delete selRow.edit
      }
      this.inEdit = false
      this.$refs.shippingCosts.refresh()
    },
    resetEdit (selectedItem, event) {
      this.inEdit = false
      if (selectedItem !== undefined && selectedItem !== null) {
        let selRow = this.items.find(el => el.key === selectedItem.key)
        let newPricing = Object.assign({ }, this.shipping.pricing)

        newPricing[selectedItem.key] = selectedItem.cost = this.pricing[selectedItem.key]
        this.updateShippingPricing(newPricing)

        selectedItem.customized = false
        this.$refs.shippingCosts.refresh()
        delete selRow.edit

        let item = this.items.find(el => { return el.customized })
        if (item === null && item === undefined) this.updated = false
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
    fetchProducts () {
      return this.$store.dispatch(FETCH_PRODUCTS)
    }
  }
}
</script>
