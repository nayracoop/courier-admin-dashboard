<template>
  <section>
    <b-row>
      <b-col sm="12">
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <p v-if="pricing === null">
          No existen costos cargados para la combinación de opciones seleccionadas.
        </p>
        <div v-else>
          <b-table ref="shippingCosts" hover outlined small fixed responsive="sm"
          :items="itemsProvider"
          :fields="fields"
          :current-page="currentPage"
          :foot-clone="true"
          :per-page="perPage">
            <template slot="name" slot-scope="data">
              <b v-if="data.item.key !== null && data.item.key !== undefined && data.item.key !== ''">{{ data.item.name }}</b>
              <span v-else>{{ data.item.name }}</span>
              <!-- <b-form-input readonly type="text" placeholder="Producto / servicio" v-model="data.item.name"></b-form-input> -->
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
              </template>
              <template v-else-if="data.item.key !== null && data.item.key !== undefined && data.item.key !== ''">
                <b-button size="sm" variant="primary" @click.prevent="enableEdit(data.item, $event)">
                  <i class="fa fa-edit"></i> Editar
                </b-button>
              </template>
              <template v-else>
                <b-button size="sm" variant="danger" @click.prevent="remove(data.item)">
                  <i class="fa fa-ban"></i> Eliminar
                </b-button>
              </template>
              <b-button v-if="data.item.customized" size="sm" variant="secondary" @click.prevent="resetEdit(data.item, $event)">
                <i class="fa fa-undo"></i> Auto
              </b-button>
            </template>
            <template slot="subtotal" slot-scope="data">
              ${{ data.item.subtotal }}
              <!-- <b-form-input type="number" placeholder="0" v-model="data.item.subtotal"></b-form-input> -->
            </template>

            <!-- NEW ROW FOOTER -->
            <template slot="FOOT_name" slot-scope="data">
              <!-- <b-form-input v-model="newRow.weight" readonly></b-form-input> -->
              <b-form-select id="product" v-model="newRow.productId" :plain="true" :options="productList"></b-form-select>
            </template>
            <!-- <template slot="FOOT_taxDetails" slot-scope="data">
              <b-form-input type="number" placeholder="Precio bruto" v-model="newRow.grossPrice" ref="inputPrice" :disabled="inProgress"></b-form-input>
            </template> -->
            <template slot="FOOT_value" slot-scope="data">
              <!-- <b-form-input type="number" placeholder="Precio neto" v-model="newRow.grossPrice" ref="inputPrice" :disabled="inProgress"></b-form-input> -->
              <b-form-input type="number" v-model="newRow.value"></b-form-input>
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
              <strong>${{ Number(parseFloat(Number(cost) + Number(newRow.value)).toFixed(2)) }}</strong>
            </template>
          </b-table>
          <b-alert show variant="warning" v-if="updated" dismissible>Se realizaron cambios en las opciones del envío. Algunos valores pueden estar desactualizados. Puede actualizarlos utilizando la opción: <b><i class="fa fa-undo"></i> Auto</b> </b-alert>
        </div>
      </b-col>
    </b-row>
  </section>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { UPDATE_SHIPPING_PRICING } from '@/store/types/mutations'

export default {
  name: 'c-cost-table',
  data () {
    return {
      fields: [
        { key: 'name', label: 'Concepto' },
        // { key: 'taxDetails', label: 'Tasa IVA' },
        { key: 'value', label: 'Valor' },
        // { key: 'tax', label: 'Importe IVA' },
        // { key: 'total', label: 'Importe' },
        { key: 'actions', label: 'Acciones', class: 'cost-actions' },
        { key: 'subtotal', label: 'Subtotal', class: 'cost-actions' }
      ],
      // customPricing: {  },
      cost: 0,
      additional: [ ],
      items: [ ],
      updated: false,
      /* Esto vendría de Xubio */
      products: [
        {
          'productoid': 0,
          'nombre': 'Moto',
          'codigo': 'a',
          'usrcode': 'string'
        },
        {
          'productoid': 1,
          'nombre': 'Depósito',
          'codigo': 'b',
          'usrcode': 'string'
        }
      ],
      productList: [],
      newRow: {
        productId: null,
        name: null,
        value: null
      },
      inEdit: false,
      /* No está claro si esto sirve */
      inProgress: false,
      // inEdit tiene que compartirse con el parent
      // para el botón guardar
      // oldRow: {},
      // hasWeight: false,
      perPage: 10,
      currentPage: 1
      // totalRows: 1
    }
  },
  computed: {
    // agregar a los map getters la lista de proveedores y el cliente
    // para pivotear entre una y otra entidad
    ...mapGetters(['provider', 'client', 'shipping']),
    declaredValueInsurance () {
      let insurance = (this.provider.externalId !== null) ? this.shipping.package.declaredValue * (this.provider.insurance / 100) : 0
      return insurance
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
      let netPrice = 0
      let insurance = this.declaredValueInsurance

      // if (this.provider.externalId === null) return null

      // Obtengo el precio de combustible correspondiente a la fecha del envios
      let fuelPercent = this.provider.fuelTable.find(el => {
        return this.shipping.initialDate >= el.fromDate && this.shipping.initialDate <= el.toDate
      })
      if (!fuelPercent) return null
      fuelPercent = fuelPercent.fuelPercent

      // Obtengo el precio del flete correspondiente a la zona y tipos de envío, servicio y paquete
      let costs = this.provider.costsTable.find(el => {
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
  },
  watch: {
    pricing (val) {
      // this.shipping.pricing.calculated = val
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
      // this.shipping.pricing = newPricing
      this.updateShippingPricing(newPricing)
      this.$refs.shippingCosts.refresh()
      // if (isNaN(this.cost)) {
      // console.log('Is NAN')
      // this.updateShippingPricing(newPricing)
      // this.$refs.shippingCosts.refresh()
      // }
      // this.setBaseCosts()
    }
  },
  // en created lo que hago es setear la serie de valores iniciales para los filtros, y la tabla de costos que corresponde
  async created () {
    this.items = [ {
      name: 'Flete: ' + this.provider.businessName,
      key: 'grossPrice'
    },
    {
      name: '% Descuento',
      percentage: true,
      discount: true,
      key: 'costDiscount'
    },
    {
      name: '% Combustible',
      percentage: true,
      key: 'fuelPercent'
    },
    {
      name: 'Seguro',
      key: 'insurance'
    },
    {
      name: '% Descuento al cliente',
      percentage: true,
      discount: true,
      key: 'saleDiscount'
    } ]
    this.products.map(el => {
      this.productList.push({ value: el.productoid, text: el.nombre })
    })

    this.additional = this.shipping.pricing.additional.slice()
    this.additional.forEach(el => {
      let newRow = {}
      newRow.name = el.name
      newRow.value = parseFloat(el.cost)
      newRow.productId = el.productId
      this.items.push(newRow)
      this.$refs.shippingCosts.refresh()
    })

  },
  methods: {
    /* Genera los datos para la tabla, luego actualiza el precio final */
    itemsProvider (ctx) {
      if (!this.inEdit) {
        for (let key in this.pricing) {
          let item = this.items.find(el => { return el.key === key })
          if (item) {
            if (this.shipping.pricing[key] !== undefined && this.shipping.pricing[key] !== null) {
              item.value = this.shipping.pricing[key]
              item.customized = (this.pricing[key] !== this.shipping.pricing[key])
            } else {
              item.value = this.pricing[key]
            }
          }
        }
      }
      this.updateSubtotals()
      return this.items || []
    },
    updateShippingPricing (newPricing) {
      /*
      if (isNaN(this.cost)) {
        this.$refs.shippingCosts.refresh()
        this.updateSubtotals()
      }
      newPricing.cost = this.cost */
      return this.$store.commit(UPDATE_SHIPPING_PRICING, newPricing)
    },
    updateSubtotals () {
      this.cost = 0
      this.items.forEach(el => {
        if (el.percentage) {
          this.cost += this.cost * (el.value / 100) * (el.discount ? -1 : 1)
        } else {
          this.cost += el.value
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
      let product = this.products.find(el => el.productoid === newRow.productId)

      newRow.name = product.nombre
      newRow.value = parseFloat(newRow.value)
      this.newRow.productId = null
      this.newRow.value = null

      this.items.push(newRow)
      this.$toasted.global.success_toast({ message: 'Edición exitosa. Haga click en "Guardar cambios" para registrar los cambios' })
      this.$refs.shippingCosts.refresh()

      this.additional.push( {
        'productId': product.productoid,
        'name': product.nombre,
        'code': product.codigo,
        'cost': newRow.value
      } )

      let newPricing = Object.assign({ }, this.shipping.pricing)
      newPricing.additional = this.additional
      this.updateShippingPricing(newPricing)
    },
    remove (selectedItem) {
      let product = this.additional.find(el => el.productId === selectedItem.productId && el.cost === selectedItem.value)
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
        this.inEdit = true
        let selRow = this.items.find(el => el.key === selectedItem.key)
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
        let newPricing = Object.assign({ }, this.shipping.pricing)

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
        let newPricing = Object.assign({ }, this.shipping.pricing)

        newPricing[selectedItem.key] = selectedItem.value = this.pricing[selectedItem.key]
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
      if (isNaN(row.value) | row.value === undefined | row.value === null) {
        this.$toasted.global.error_toast({ message: 'Ingrese un valor válido' })
        retVal = false
      }
      return retVal
    }
  }
}
</script>
