<template>
  <b-form>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="myAddresses">Direcciones guardadas</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-select id="myAddresses" :plain="true" :options="addressList" v-model="selAddressId" @input="changeAddress" />
        </b-form-group>
        <b-form-group v-show="!isNew">
          <b-list-group class="info-address">
            <b-list-group-item>{{ `${currentAddress.name}, ${currentAddress.contactName}` }}</b-list-group-item>
            <b-list-group-item>{{ `${currentAddress.address1}, ${currentAddress.address2}, CP: ${currentAddress.postalCode}, ${currentAddress.city}, ${currentAddress.state}` }}</b-list-group-item>
            <b-list-group-item>{{ this.selectedCountry && this.selectedCountry.alpha2Code }}</b-list-group-item>
            <b-list-group-item>{{ `${currentAddress.email}, ${currentAddress.phone}` }}</b-list-group-item>
          </b-list-group>
          <b-link @click.prevent="edit=true">Editar dirección <i class="fa fa-pencil"></i></b-link>
        </b-form-group>
      </b-col>
    </b-row>
    <b-form-group v-show="isNew || edit">
      <b-row>
        <b-col sm="3">
          <b-form-group>
            <label for="countryIso">Sigla del país</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="ISO 3 del país"></i>
            <b-form-select id="countryIso" :plain="true" :options="countryIsoList" v-model="currentAddress.country" />
          </b-form-group>
        </b-col>
        <b-col sm="9">
          <b-form-group>
            <label for="country">País</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="País de la dirección"></i>
            <b-form-select id="country" :plain="true" :options="countryList" v-model="currentAddress.country" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group>
            <label for="addressName">Nombre o compañía</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Ingrese un nombre para identificar la dirección"></i>
            <b-form-input :class="{ danger: errors.has('addressName') }" v-validate="'required'" name="addressName" data-vv-as="nombre de dirección" type="text" id="addressName" v-model="currentAddress.name" placeholder="Ej: Depósito Ramos"></b-form-input>
          <!-- El campo es requerido, no puede estar vacío -->
          <span><small class="inv-feedback" v-show="errors.has('addressName')">{{ errors.first('addressName') }}</small></span>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="contactName">Nombre del contacto</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre de contacto"></i>
            <b-form-input :class="{ danger: errors.has('name') }" v-validate="'required'" name="contactName" data-vv-as="nombre del contacto" type="text" id="contactName" v-model="currentAddress.contactName" placeholder="Ej: Ricardo Romero"></b-form-input>
            <!-- El campo es requerido, no puede estar vacío -->
            <span><small class="inv-feedback" v-show="errors.has('contactName')">{{ errors.first('contactName') }}</small></span>
        </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group>
            <label for="address1">Dirección</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número, edificio, departamento, etcétera"></i>
            <div class="form-group">
              <div sm="12">
                <b-form-input v-validate="{ regex: /[^\s*]$/ }" type="text" id="address1" placeholder="Calle y número" v-model="currentAddress.address1" />
              </div>
            </div>
            <div class="form-group">
              <div sm="12">
                <b-form-input type="text" id="address2" placeholder="Unidad, edificio, piso, departamento, etcétera"  v-model="currentAddress.address2" />
              </div>
            </div>
            <div class="form-group">
              <div sm="12">
               <b-form-input type="text" id="address3" placeholder="Sección o departamento, ℅ (a nombre de), etcétera" v-model="currentAddress.address3" />
              </div>
            </div>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="province">Provincia</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
            <b-form-input type="text" id="province" v-model="currentAddress.state" placeholder="Ej: Buenos Aires" />
            <!-- -->
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
        <b-form-group>
          <label for="city">Localidad</label>
          <b-form-input v-validate="{ regex: /[^\s*]$/ }" name="city" data-vv-as="localidad" type="text" id="city" v-model="currentAddress.city" placeholder="Ej: San Justo"></b-form-input>
          <!-- No puede tener espacios en blanco intermedios ni puede ser únicamente un espacio en blanco  -->
          <span><small class="inv-feedback" v-show="errors.has('city')">{{ errors.first('city') }}</small></span>
        </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="region">Código postal</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
            <b-form-input v-validate="'alpha_num'" name="postalCode" type="text" id="postalCode" placeholder="Ej: 1182" v-model="currentAddress.postalCode" />
          <!-- Debe contener caracteres numéricos -->
          <span><small class="inv-feedback" v-show="errors.has('postalCode')">{{ errors.first('postalCode') }}</small></span>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-form-group label="Es una dirección residencial?">
            <b-form-checkbox id="isResidential" v-model="currentAddress.isResidential">Sí</b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group>
          <label for="email">Email</label>
          <b-form-input v-validate="{ email: true, regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }" name="email" data-vv-as="email" id="email" type="email" autocomplete="email" v-model="currentAddress.email" placeholder="Ej: envios@empresa.com"></b-form-input>
          <!-- Debe ser un email válido (Matchea mínimo de caracteres, caracteres inválidos, etc)  -->
          <span><small class="inv-feedback" v-show="errors.has('email')">{{ errors.first('email') }}</small></span>
        </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="phone">Teléfono</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del cliente. Este campo debe tener al menos 8 dígitos y no puede contener espacios ni letras"></i>
            <b-form-input v-validate="{ min: 8, regex: /^[^a-zA-Z\s][0-9\-\.\(\)]+$/ }" name="phone" data-vv-as="teléfono" type="tel" id="phone" v-model="currentAddress.phone" placeholder="Ej: 4892-1242"></b-form-input>
            <!-- Debe tener mínimo 8 caracteres y no puede tener espacios ni caracteres alfabéticos -->
            <span><small class="inv-feedback" v-show="errors.has('phone')">{{ errors.first('phone') }}</small></span>
        </b-form-group>
        </b-col>
      </b-row>
      <b-row v-show="isShipping">
        <b-col sm="6">
          <b-form-group label="Guardar dirección?">
            <b-check id="saveAddress" v-model="saveAddress">Sí</b-check>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-show="saveAddress || !isShipping">
        <b-col sm="6">
          <b-form-group label="Dirección por defecto?">
            <b-check id="defaultAddress" v-model="currentAddress.isDefault" @change="changeDefault">Sí</b-check>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <label for="alias">Alias</label>
            <b-form-input id="alias" type="text" v-model="currentAddress.alias" placeholder="Ej: Depósito" />
            <!-- -->
          </b-form-group>
        </b-col>
      </b-row>
    </b-form-group>
    <!-- <pre>{{ JSON.stringify(currentAddress, null, 4) }}</pre>
    <pre>{{ JSON.stringify(client.addresses, null, 4) }}</pre> -->
  </b-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { countries } from '@/store/const'

export default {
  name: 'c-address',
  props: {
    isShipping: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      saveAddress: false,
      selAddressId: -1,
      addressList: [],
      countryIsoList: [],
      countryList: [],
      edit: false,
      currentAddress: {
        country: '',
        name: '',
        contactName: '',
        address1: '',
        address2: '',
        address3: '',
        postalCode: '',
        city: '',
        state: '',
        isResidential: false,
        email: '',
        phone: '',
        alias: '',
        isDefault: false
      }
    }
  },
  created () {
    // cargo la lista de direcciones
    this.$eventHub.$on('saveSuccess', this.saveSuccess)
    this.setAddressList()
    // cargo las listas de país ISO y nombre
    countries.map(el => {
      this.countryIsoList.push({ value: el.numericCode, text: el.alpha2Code })
      this.countryList.push({ value: el.numericCode, text: el.translations.es || el.name })
    })
  },
  beforeDestroy: function () {
    this.$eventHub.$off('saveSuccess', this.saveSuccess)
  },
  computed: {
    ...mapGetters(['client']),
    isNew: function () {
      return this.selAddressId === -1
    },
    selectedCountry: function () {
      return countries.find(el => {
        return el.numericCode === this.currentAddress.country
      })
    }
  },
  methods: {
    changeAddress: function () {
      this.edit = false
      if (this.selAddressId === -1) {
        let newIndex = this.client.addresses.length
        // valido que la posición anterior no esté vacía
        let hasName = this.client.addresses[newIndex - 1].name !== ''
        let hasAlias = this.client.addresses[newIndex - 1].alias !== ''
        if (!hasName && !hasAlias) {
          --newIndex
        }
        this.currentAddress = {
          country: '',
          name: '',
          contactName: '',
          address1: '',
          address2: '',
          address3: '',
          province: '',
          postalCode: '',
          city: '',
          state: '',
          isResidential: false,
          email: '',
          phone: '',
          alias: '',
          isDefault: false
        }
        this.client.addresses[newIndex] = this.currentAddress
      } else {
        this.currentAddress = this.client.addresses[this.selAddressId]
      }
    },
    setAddressList: function () {
      let addressList = [{ value: -1, text: 'Nueva dirección' }]
      if (this.client.addresses.length) {
        // si está recargando la página no quiero volver a meter un registro
        // evaluo la primer posición a ver si está vacía
        let text = ''
        let hasName = this.client.addresses[0].name !== ''
        let hasAlias = this.client.addresses[0].alias !== ''

        if (hasName || hasAlias) {
          this.client.addresses.map((el, index) => {
            if (el.alias === undefined || el.alias === '' || el.alias === null) {
              text = el.name
            } else {
              text = el.alias
            }

            if (el.isDefault) {
              this.selAddressId = index
              this.currentAddress = this.client.addresses[index]
            }
            if (el.alias !== '' || el.name !== '') {
              addressList.push({ value: index, text: text })
            }
          })
        } else {
          // la lista está vacía
          this.client.addresses[0] = this.currentAddress
        }
      } else {
        // la lista está vacía
        this.client.addresses[0] = this.currentAddress
      }
      this.addressList = addressList
    },
    saveSuccess (savedObject) {
      this.setAddressList()
    },
    changeDefault (checked) {
      if (this.client.addresses.length && checked) {
        for (let i = 0; i < this.client.addresses.length; i++) {
          if (i !== this.selAddressId) {
            this.client.addresses[i].isDefault = false
          }
        }
      }
    }
  }
}
</script>
