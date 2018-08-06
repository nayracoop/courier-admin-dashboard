<template>
  <b-form>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="myAddresses">Direcciones guardadas</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-select id="myAddresses" :plain="true" :options="addressList" v-model="addressDefault" />
        </b-form-group>
        <b-form-group v-show="!isNew">
          <b-list-group class="info-address">
            <b-list-group-item>Depósito San Justo, Román Ramos</b-list-group-item>
            <b-list-group-item>Tata 242, 2c, 1182 Caseros, Buenos Aires</b-list-group-item>
            <b-list-group-item>AR</b-list-group-item>
            <b-list-group-item>nayracoop@gmail.com, 01150461094</b-list-group-item>
          </b-list-group>
          <b-link href="#">Editar dirección <i class="fa fa-pencil"></i></b-link>
        </b-form-group>
      </b-col>
    </b-row>
    <b-form-group v-show="isNew">
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <label for="country">País</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="País de la dirección"></i>
            <b-form-select id="country" :plain="true" :options="['Argentina','Bolivia']" value="5" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group>
            <label for="addressName">Nombre de la dirección</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Ingrese un nombre para identificar la dirección"></i>
            <b-form-input type="text" id="addressName" placeholder="Ej: Depósito San Justo" />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="contactName">Nombre del contacto</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre de contacto"></i>
            <b-form-input type="text" id="contactName" placeholder="Ej: Román Ramos" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group>
            <label for="address">Dirección</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del proveedor"></i>
            <b-form-input type="text" id="address" placeholder="Ej: Balbín 2422" />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="province">Provincia</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
            <b-form-input type="text" id="province" placeholder="Ej: Buenos Aires" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group>
            <label for="country">Localidad</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
            <b-form-input type="text" id="country" placeholder="Ej: San Justo" />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="region">Código postal</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
            <b-form-input type="text" id="region" placeholder="Ej: 1182" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-form-group label="Es una dirección residencial?">
            <b-form-checkbox id="isResidential">Sí</b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group>
            <label for="email">Email</label>
            <b-form-input id="email" type="email" autocomplete="email" placeholder="Ej: envios@empresa.com" />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="phone">Teléfono</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del proveedor"></i>
            <b-form-input type="tel" id="phone" placeholder="Ej: 4892-1242 " />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group label="Guardar dirección?">
            <b-check id="saveAddress" v-model="saveAddress">Sí</b-check>
          </b-form-group>
          {{ saveAddress }}
        </b-col>
        <b-col sm="6" v-show="saveAddress">
          <b-form-group>
            <label for="alias">Alias</label>
            <b-form-input id="alias" type="text" placeholder="Ej: Dirección de casa" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  name: 'c-address',
  props: {
    client: Object,
    newEntry: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedAddress: -1,
      saveAddress: false
    }
  },
  computed: {
    addressList: function () {
      let addressList = [{ value: -1, text: 'Nueva dirección' }]
      if (this.client.addresses.length) {
        this.client.addresses.map((el, index) => {
          addressList.push({ value: index, text: el.addressName })
        })
      }
      return addressList
    },
    addressDefault: {
      get: function () {
        let retVal = -1
        if (this.client.addresses.length) {
          this.client.addressess.find((address, index) => {
            if (address.default) {
              retVal = index
            }
          })
        }
        return retVal
      },
      set: function (val) {
        this.selectedAddress = val
      }
    },
    isNew: function () {
      return this.selectedAddress === -1
    }
  }
}
</script>
