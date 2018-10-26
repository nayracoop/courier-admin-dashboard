<template>
  <b-form v-on:submit.prevent>
    <b-form-row>
      <b-col sm="9">
        <b-form-group>
          <label for="name">Nombre</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social del cliente"></i>
          <b-form-input :class="{ danger: errors.has('name') }" v-validate="'required'" name="name" data-vv-as="nombre" type="text" id="name" v-model="client.name" placeholder="Ej: Ramos Revestimientos"></b-form-input>
          <!-- El campo es requerido, no puede estar vacío -->
          <span><small class="inv-feedback" v-show="errors.has('name')">{{ errors.first('name') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <b-form-group>
          <label for="code">Código</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste al cliente"></i>
          <b-form-input v-validate="'alpha_num'" name="ucode" data-vv-as="código" type="text" id="code" v-model="client.userCode" placeholder="Ej: 227716623"></b-form-input>
          <!-- Debe contener caracteres alfanuméricos  -->
          <span><small class="inv-feedback" v-show="errors.has('ucode')">{{ errors.first('ucode') }}</small></span>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-row>
      <b-col sm="5">
        <b-form-row>
          <b-col sm="5">
            <b-form-group>
              <label for="idType">Tipo de identificación</label>
              <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de identificación del cliente"></i>
              <b-form-select id="idType" :plain="true" :options="docTypes" v-model="client.docType">
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col sm="7">
            <b-form-group>
              <label for="docValue">N° de identificación</label>
              <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de DNI, CUIT, CUIL. Este campo solo puede contener números y tiene que tener un mínimo de 8 dígitos"></i>
              <b-form-input v-validate="'alpha_dash|min:8|max:20'" name="docValue" data-vv-as="número de identificación" id="docValue" type="text" v-model="client.docValue" placeholder="Ej: 20320508742"></b-form-input>
              <!-- Debe ser numérico, tener un mínimo de 8 caracteres y un máximo de 20 -->
              <span><small class="inv-feedback" v-show="errors.has('docValue')">{{ errors.first('docValue') }}</small></span>
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-col>
      <b-col sm="3">
        <b-form-group>
          <label for="ivaCond">Condición IVA</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Condición frente al Impuesto al Valor Agregado del cliente"></i>
          <b-form-select id="ivaCond" :plain="true" :options="taxCategories" v-model="client.taxCategory">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="4">
        <b-form-group>
          <label for="cbu">CBU</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Clave Bancaria Unificada del cliente. Sin puntos ni espacios"></i>
          <b-form-input v-validate="'numeric'" name="cbu" data-vv-as="CBU" id="cbu" type="text" v-model="client.cbu" placeholder="Ej: 22457878784422121547"></b-form-input>
          <!-- Debe ser numérico -->
          <span><small class="inv-feedback" v-show="errors.has('cbu')">{{ errors.first('cbu') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="12">
        <b-form-group>
          <b-form-checkbox id="perception" v-model="client.hasPerception">Recibe percepciones</b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <br>
    <b-row>
      <b-col sm="12">
        <c-address-form base v-model="singleAddress"></c-address-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <!-- <b-input-group>
          <b-input-group-prepend><b-input-group-text>Alias:</b-input-group-text></b-input-group-prepend>
          <b-form-input :id="id + '_alias'" type="text" v-model="value.alias" placeholder="Ej: Depósito" />
          <b-input-group-append><b-input-group-text><b-check :id="id + '_defaultAddress'" v-model="value.isDefault">Dirección por defecto</b-check></b-input-group-text></b-input-group-append>
        </b-input-group> -->

        <b-form-group>
          <label for="email">Email</label>
          <b-input-group>
            <b-form-input v-validate="{ email: true, regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }" name="email" data-vv-as="email" id="email" type="email" autocomplete="email" v-model="client.email" placeholder="Ej: envios@empresa.com"></b-form-input>
            <b-input-group-append><b-input-group-text><b-check :id="id + '_defaultAddress'" v-model="client.notifications">Recibe notificaciones</b-check></b-input-group-text></b-input-group-append>
            <!-- Debe ser un email válido (Matchea mínimo de caracteres, caracteres inválidos, etc)  -->
            <span><small class="inv-feedback" v-show="errors.has('email')">{{ errors.first('email') }}</small></span>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="phone">Teléfono</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del cliente. Este campo debe tener al menos 8 dígitos y no puede contener espacios ni letras"></i>
          <b-form-input v-validate="{ min: 8, regex: /^[^a-zA-Z\s][0-9\-\.\(\)]+$/ }" name="phone" data-vv-as="teléfono" type="tel" id="phone" v-model="client.phone" placeholder="Ej: 4892-1242"></b-form-input>
          <!-- Debe tener mínimo 8 caracteres y no puede tener espacios ni caracteres alfabéticos -->
          <span><small class="inv-feedback" v-show="errors.has('phone')">{{ errors.first('phone') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>

      <!-- <b-col sm="6">
        <b-form-group>
          <label for="address">Domicilio</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del cliente"></i>
          <b-form-input name="address" data-vv-as="domicilio" type="text" id="address" v-model="client.address" placeholder="Calle y número"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('address')">{{ errors.first('address') }}</small></span>
        </b-form-group>
      </b-col> -->
    </b-row>
    <!-- <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="country">País</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre del país. Este campo solo puede contener letras y espacios"></i>
          <b-form-select id="country" :plain="true" :options="countryList" v-model="client.country"></b-form-select> -->
          <!-- Debe contener caracteres alfabéticos -->
          <!-- <span><small class="inv-feedback" v-show="errors.has('country')">{{ errors.first('country') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group v-if="client.country === '032'">
          <label for="province">Provincia / estado</label>
          <b-form-select id="province" :plain="true" :options="argProvinceList" v-model="client.province"></b-form-select>
          <span><small class="inv-feedback" v-show="errors.has('province')">{{ errors.first('province') }}</small></span>
        </b-form-group>
        <b-form-group v-else>
          <label for="state">Provincia / estado</label>
          <b-form-input v-validate="''" name="state" data-vv-as="país" type="text" id="state" v-model="client.state"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('state')">{{ errors.first('state') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row> -->
    <b-row>
      <!-- <b-col sm="6">
        <b-form-group>
          <label for="location">Localidad / ciudad</label>
          <b-form-input v-validate="{ regex: /[^\s*]$/ }" name="location" data-vv-as="localidad" type="text" id="location" v-model="client.location" placeholder="Ej: San Justo"></b-form-input> -->
          <!-- No puede tener espacios en blanco intermedios ni puede ser únicamente un espacio en blanco  -->
          <!-- <span><small class="inv-feedback" v-show="errors.has('location')">{{ errors.first('location') }}</small></span>
        </b-form-group>
      </b-col> -->

    </b-row>
    <b-row>
      <b-col sm="12">
        <b-form-group label="Observaciones" label-for="notes" :label-cols="3" :horizontal="false">
          <b-form-textarea id="notes" :no-resize="true" :textarea="true" :rows="2" v-model="client.observation" placeholder="Escriba una observación..."></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { taxCategories, docTypes, countries, argProvinces } from '@/store/const'
import { mapGetters } from 'vuex'

import CAddressForm from '@/components/AddressForm'

export default {
  name: 'c-client-detail',
  components: { CAddressForm },
  data () {
    return {
      inProgress: false,
      taxCategories: taxCategories,
      docTypes: docTypes,
      countryList: [],
      argProvinceList: []
    }
  },
  created () {
    countries.map(el => {
      this.countryList.push({ value: el.numericCode, text: el.name })
    })
    argProvinces.map(el => {
      this.argProvinceList.push({ value: el.provincia_id, text: el.provincia_nombre })
    })
  },
  props: {
    isEdit: { required: true }
  },
  computed: {
    ...mapGetters(['client']),
    singleAddress () {
      return { address: this.client.address }
    }
  },
  methods: {
    validateBeforeSubmit () {
      return this.$validator.validateAll()
    }
  }
}
</script>
