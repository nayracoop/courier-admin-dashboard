<template>
    <b-form-group>
        <b-form-row>
          <b-col sm="8">
            <b-form-group>
              <label :for="id + '_country'">País</label>
              <b-form-select :id="id + '_country'" :plain="true" :options="countryList" v-model="value.address.country" />
            </b-form-group>
          </b-col>
          <b-col sm="4">
            <b-form-group>
              <label :for="id + '_countryIso'">Cód.</label>
              <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="ISO 3 del país"></i>
              <b-form-select :id="id + '_countryIso'" :plain="true" :options="countryIsoList" v-model="value.address.country" />
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-group>
              <b-form-row>
              <b-col sm="8">
                <label :for="id + '_address1'">Dirección</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número"></i>
                <b-form-input v-validate="{ required: true, regex: /[^\s*]$/ }" :name="id + '_address1'" data-vv-as="dirección línea 1 (calle y número)" type="text" :id="id + '_address1'" placeholder="Calle y número" v-model="value.address.address1" />
                <span><small class="inv-feedback" v-show="errors.has(id + '_address1')">{{ errors.first(id + '_address1') }}</small></span>
              </b-col>
              <b-col sm="2">
                <label :for="id + '_address2'">Piso</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Piso / Unidad / Edificio"></i>
                <b-form-input type="text" :id="id + '_address2'" placeholder="Piso / Unidad / Edificio"  v-model="value.address.address2" />
              </b-col>
              <b-col sm="2">
                <label :for="id + '_address3'">Dpto.</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Departamento / Sección / ℅ (a nombre de)"></i>
               <b-form-input type="text" :id="id + '_address3'" placeholder="Departamento / Sección / ℅ (a nombre de)" v-model="value.address.address3" />
              </b-col>
            </b-form-row>
          </b-form-group>
      <b-form-row>
        <b-col sm="4">
          <b-form-group>
            <label :for="id + '_location'">Localidad / ciudad</label>
            <b-form-input v-validate="{ required: true, regex: /[^\s*]$/ }" :name="id + '_location'" data-vv-as="localidad" type="text" :id="id + '_location'" v-model="value.address.location" placeholder="Ej: San Justo"></b-form-input>
            <!-- No puede tener espacios en blanco intermedios ni puede ser únicamente un espacio en blanco  -->
            <span><small class="inv-feedback" v-show="errors.has(id + '_location')">{{ errors.first(id + '_location') }}</small></span>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label :for="id + '_postalCode'">CP</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código postal"></i>
            <b-form-input v-validate="'required|alpha_num'" :name="id + '_postalCode'" data-vv-as="código postal" type="text" :id="id + '_postalCode'" placeholder="Ej: 1182" v-model="value.address.postalCode" />
            <!-- Debe contener caracteres alphanuméricos -->
            <span><small class="inv-feedback" v-show="errors.has(id + '_postalCode')">{{ errors.first(id + '_postalCode') }}</small></span>
          </b-form-group>
        </b-col>
        <b-col sm="5">
          <b-form-group v-if="value.country === '032'">
            <label :for="id + '_province'">Provincia / estado</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
            <b-form-select :id="id + '_province'" :plain="true" :options="argProvinceList" v-model="value.address.province" @change="updateStateText"></b-form-select>
          </b-form-group>
          <b-form-group v-else>
            <label :for="id + '_state'">Provincia / estado</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
            <b-form-input type="text" :id="id + '_state'" v-model="value.address.state" placeholder="Ej: Buenos Aires" />
          </b-form-group>
        </b-col>
        <b-col sm="12" v-if="!base">
          <b-form-group>
            <b-form-checkbox :id="id + '_isResidential'" v-model="value.address.isResidential">Es una dirección residencial</b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-form-row>
      <div v-if="!base">
        <br>
        <b-form-group>
        <b-row>
          <b-col sm="6">
              <label :for="id + '_contactName'">Nombre del contacto</label>
              <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre de contacto"></i>
              <b-form-input :class="{ danger: errors.has(id + '_name') }" :name="id + '_contactName'" data-vv-as="nombre del contacto" type="text" :id="id + '_contactName'" v-model="value.address.contactName" placeholder="Ej: Ricardo Romero"></b-form-input>
              <!-- El campo es requerido, no puede estar vacío -->
              <span><small class="inv-feedback" v-show="errors.has(id + '_contactName')">{{ errors.first(id + '_contactName') }}</small></span>
          </b-col>
          <b-col sm="6">
              <label :for="id + '_addressName'">Nombre o compañía</label>
              <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Ingrese un nombre para identificar la dirección"></i>
              <b-form-input :class="{ danger: errors.has(id + '_addressName') }" v-validate="'required'" :name="id + '_addressName'" data-vv-as="nombre de dirección" type="text" :id="id + '_addressName'" v-model="value.address.name" placeholder="Ej: Depósito Ramos"></b-form-input>
            <!-- El campo es requerido, no puede estar vacío -->
            <span><small class="inv-feedback" v-show="errors.has(id + '_addressName')">{{ errors.first(id + '_addressName') }}</small></span>
          </b-col>
        </b-row>
        </b-form-group>
        <b-form-group>
        <b-row>
          <b-col sm="6">
            <label :for="id + '_email'">Email</label>
            <b-form-input v-validate="{ email: true, regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }" :name="id + '_email'" data-vv-as="email" :id="id + '_email'" type="email" autocomplete="email" v-model="value.address.email" placeholder="Ej: envios@empresa.com"></b-form-input>
            <!-- Debe ser un email válido (Matchea mínimo de caracteres, caracteres inválidos, etc)  -->
            <span><small class="inv-feedback" v-show="errors.has(id + '_email')">{{ errors.first(id + '_email') }}</small></span>
          </b-col>
          <b-col sm="6">
            <label :for="id + '_phone'">Teléfono</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del cliente. Este campo debe tener al menos 8 dígitos y no puede contener espacios ni letras"></i>
            <b-form-input v-validate="{ min: 8, regex: /^[^a-zA-Z\s][0-9\-\.\(\)]+$/ }" :name="id + '_phone'" data-vv-as="teléfono" type="tel" :id="id + '_phone'" v-model="value.address.phone" placeholder="Ej: 4892-1242"></b-form-input>
            <!-- Debe tener mínimo 8 caracteres y no puede tener espacios ni caracteres alfabéticos -->
            <span><small class="inv-feedback" v-show="errors.has(id + '_phone')">{{ errors.first(id + '_phone') }}</small></span>
          </b-col>
        </b-row>
      <b-form-group>
      </b-form-group>
        <b-row>
          <b-col sm="12">
            <label :for="id + '_comments'">Información adicional</label>
            <b-form-textarea :name="id + '_comments'" :id="id + '_comments'" rows="2" v-model="value.address.comments" placeholder="Comentarios, aclaraciones..."></b-form-textarea>
          </b-col>
        </b-row>
        </b-form-group>
        <transition>
          <b-row v-show="savable">
            <b-col sm="12">
              <label :for="id + '_alias'">Guardar como...</label>
              <b-input-group>
                <b-input-group-prepend><b-input-group-text>Alias:</b-input-group-text></b-input-group-prepend>
                <b-form-input :id="id + '_alias'" type="text" v-model="value.alias" placeholder="Ej: Depósito" />
                <b-input-group-append><b-input-group-text><b-check :id="id + '_defaultAddress'" v-model="value.isDefault">Dirección por defecto</b-check></b-input-group-text></b-input-group-append>
                <!-- <b-input-group-append><b-input-group-text><b-check :id="id + '_defaultAddress'" v-model="value.isDefault" @change="changeDefault">Dirección por defecto</b-check></b-input-group-text></b-input-group-append> -->
              </b-input-group>
            </b-col>
          </b-row>
        </transition>
      </div>
    </b-form-group>
</template>

<script>

import { countries, argProvinces } from '@/store/const'

export default {
  name: 'c-address-fields',
  props: {
    value: {
      type: Object,
      default () {
        return {
          address: {
            country: '',
            name: '',
            contactName: '',
            address1: '',
            address2: '',
            address3: '',
            postalCode: '',
            state: '',
            province: '',
            location: '',
            isResidential: false,
            email: '',
            phone: '',
            comments: ''
          },
          alias: '',
          isDefault: false
        }
      }
    },
    id: Number,
    savable: {
      type: Boolean,
      default: false
    },
    base: Boolean
  },
  data () {
    return {
      countryIsoList: [],
      countryList: [],
      argProvinceList: []
    }
  },
  created () {
    // cargo las listas de país ISO y nombre
    countries.map(el => {
      this.countryIsoList.push({ value: el.numericCode, text: el.alpha2Code })
      this.countryList.push({ value: el.numericCode, text: el.name })
    })

    argProvinces.map(el => {
      this.argProvinceList.push({ value: el.provincia_id, text: el.provincia_nombre })
    })
  },
  computed: {
    selectedCountry: function () {
      return countries.find(el => {
        return el.numericCode === this.value.country
      })
    }
  },
  methods: {
    updateStateText (value) {
      this.value.state = this.argProvinceList.find((prov) => {
        return prov.value === value
      }).text
    }
  }
}
</script>
