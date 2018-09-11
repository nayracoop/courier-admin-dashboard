<template>
  <b-form v-on:submit.prevent>
    <b-row class="actions-bar" v-if="isEdit && provider.isShipping">
      <b-col sm="12">
        <b-button variant="outline-primary" :to="{ name: 'Nuevo Envío', params: { providerId: provider.objectId } }">Confeccionar envío <i class="fa fa-plane ml-1"></i></b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12" class="cont-is-shipping mb-3">
        <label for="isShipping">¿Es proveedor de tipo envíos?</label>
        <b-form-checkbox id="isShipping" v-model="provider.isShipping"></b-form-checkbox>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="name">Nombre</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social del proveedor"></i>
          <b-form-input :class="{ danger: errors.has('name') }" v-validate="'required'" name="name" data-vv-as="nombre" type="text" id="name" v-model="provider.name" placeholder="Ej: Ramos Revestimientos"></b-form-input>
          <!-- El campo es requerido, no puede estar vacío -->
          <span><small class="inv-feedback" v-show="errors.has('name')">{{ errors.first('name') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="userCode">Código</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste al proveedor."></i>
          <b-form-input v-validate="'alpha_num'" name="userCode" data-vv-as="código" type="text" id="userCode" v-model="provider.userCode" placeholder="227716623"></b-form-input>
          <!-- Debe contener caracteres alfanuméricos  -->
          <span><small class="inv-feedback" v-show="errors.has('userCode')">{{ errors.first('userCode') }}</small></span>
          </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="docType">Tipo de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de identificación del proveedor"></i>
          <b-form-select id="docType" :plain="true" :options="docTypes" v-model="provider.docType">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="docValue">N° de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de DNI, CUIT, CUIL. Este campo solo puede contener números y tiene que tener un mínimo de 8 dígitos"></i>
          <b-form-input v-validate="'alpha_dash|min:8|max:20'" name="docValue" data-vv-as="número de identificación" id="docValue" type="text" v-model="provider.docValue" placeholder="Ej: 20320508742"></b-form-input>
          <!-- Debe ser numérico, tener un mínimo de 8 caracteres y un máximo de 20 -->
          <span><small class="inv-feedback" v-show="errors.has('docValue')">{{ errors.first('docValue') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="taxCategory">Condición IVA</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Condición frente al Impuesto al Valor Agregado del proveedor"></i>
          <b-form-select id="taxCategory" :plain="true" :options="taxCategories" v-model="provider.taxCategory">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="email">Email</label>
          <b-form-input v-validate="{ email: true, regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }" name="email" data-vv-as="email" id="email" type="email" autocomplete="email" v-model="provider.email" placeholder="Ej: envios@empresa.com"></b-form-input>
          <!-- Debe ser un email válido (Matchea mínimo de caracteres, caracteres inválidos, etc)  -->
          <span><small class="inv-feedback" v-show="errors.has('email')">{{ errors.first('email') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="phone">Teléfono</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del proveedor. Este campo debe tener al menos 8 dígitos y no puede contener espacios ni letras"></i>
          <b-form-input v-validate="{ min: 8, regex: /^[^a-zA-Z\s][0-9\-\.\(\)]+$/ }" name="phone" data-vv-as="teléfono" type="tel" id="phone" v-model="provider.phone" placeholder="Ej: 4892-1242"></b-form-input>
          <!-- Debe tener mínimo 8 caracteres y no puede tener espacios ni caracteres alfabéticos -->
          <span><small class="inv-feedback" v-show="errors.has('phone')">{{ errors.first('phone') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="address">Domicilio</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del proveedor"></i>
          <b-form-input v-validate="{ regex: /[^\s*]$/ }" name="address" data-vv-as="domicilio" type="text" id="address" v-model="provider.address" placeholder="Calle y número"></b-form-input>
          <!-- No puede tener espacios en blanco intermedios ni puede ser únicamente un espacio en blanco  -->
          <span><small class="inv-feedback" v-show="errors.has('address')">{{ errors.first('address') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="country">País</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre del país"></i>
          <b-form-select id="country" :plain="true" :options="countryList" v-model="provider.country"></b-form-select>
          <!-- Debe contener caracteres alfabéticos -->
          <span><small class="inv-feedback" v-show="errors.has('country')">{{ errors.first('country') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group v-if="provider.country === '032'">
          <label for="province">Provincia / estado</label>
          <b-form-select id="province" :plain="true" :options="argProvinceList" v-model="provider.province"></b-form-select>
          <span><small class="inv-feedback" v-show="errors.has('province')">{{ errors.first('province') }}</small></span>
        </b-form-group>
        <b-form-group v-else>
          <label for="state">Provincia / estado</label>
          <b-form-input v-validate="''" name="state" data-vv-as="país" type="text" id="state" v-model="provider.state"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('state')">{{ errors.first('state') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="city">Localidad / ciudad</label>
          <b-form-input v-validate="{ regex: /[^\s*]$/ }" name="city" data-vv-as="localidad" type="text" id="city" v-model="provider.city" placeholder="Ej: San Justo"></b-form-input>
          <!-- No puede tener espacios en blanco intermedios ni puede ser únicamente un espacio en blanco  -->
          <span><small class="inv-feedback" v-show="errors.has('city')">{{ errors.first('city') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6" v-if="provider.isShipping">
        <b-form-group>
          <label for="city">Seguro (porcentaje)</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Ingrese el porcentaje de descuento. Este campo solo puede contener números y puntos."></i>
          <b-input-group>
            <b-form-input v-validate="{ max_value: 100, regex: /^[0-9.,]+$/ }" name="insurance" data-vv-as="seguro" type="text" id="insurance" v-model="provider.insurance" placeholder="Ej: 50"></b-form-input>
            <b-input-group-append><b-input-group-text>%</b-input-group-text></b-input-group-append>
          </b-input-group>
          <!-- No puede tener espacios en blanco intermedios ni puede ser únicamente un espacio en blanco  -->
          <span><small class="inv-feedback" v-show="errors.has('insurance')">{{ errors.first('insurance') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label label-for="observation">Observaciones</label>
          <b-form-textarea id="observation" :no-resize="true" :textarea="true" :rows="4" v-model="provider.observation" placeholder="Escriba una observación..."></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { taxCategories, docTypes, countries, argProvinces } from '@/store/const'
import { mapGetters } from 'vuex'

export default {
  name: 'c-provider-detail',
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
    ...mapGetters(['provider'])
  },
  methods: {
    validateBeforeSubmit () {
      return this.$validator.validateAll()
    }
  }
}
</script>
