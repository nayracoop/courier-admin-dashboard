<template>
  <b-form v-on:submit.prevent>
    <b-row class="actions-bar">
      <b-col sm="12">
        <b-button disabled variant="outline-primary">Imprimir <i class="fa fa-print"></i></b-button>
        <b-button disabled variant="outline-primary">Adjuntar <i class="fa fa-paperclip"></i></b-button>
        <b-button disabled variant="outline-primary">Ver historial <i class="fa fa-history"></i></b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="name">Nombre</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social del cliente"></i>
          <b-form-input :class="{ danger: errors.has('name') }" v-validate="'required'" name="name" data-vv-as="nombre" type="text" id="name" v-model="client.name" placeholder="Ej: Ramos Revestimientos"></b-form-input>
          <!-- El campo es requerido, no puede estar vacío -->
          <span><small class="inv-feedback" v-show="errors.has('name')">{{ errors.first('name') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="code">Código</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste al cliente"></i>
          <b-form-input v-validate="'alpha_num'" name="ucode" data-vv-as="código" type="text" id="code" v-model="client.userCode" placeholder="Ej: 227716623"></b-form-input>
          <!-- Debe contener caracteres alfanuméricos  -->
          <span><small class="inv-feedback" v-show="errors.has('ucode')">{{ errors.first('ucode') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="idType">Tipo de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de identificación del cliente"></i>
          <b-form-select id="idType" :plain="true" :options="idTypes" v-model="client.taxCategory">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="idNumber">N° de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de DNI, CUIT, CUIL. Este campo solo puede contener números y tiene que tener un mínimo de 8 dígitos"></i>
          <b-form-input v-validate="'numeric|min:8|max:20'" name="idNum" data-vv-as="número de identificación" id="idNumber" type="text" v-model="client.taxId" placeholder="Ej: 20320508742"></b-form-input>
          <!-- Debe ser numérico, tener un mínimo de 8 caracteres y un máximo de 20 -->
          <span><small class="inv-feedback" v-show="errors.has('idNum')">{{ errors.first('idNum') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="ivaCond">Condición IVA</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Condición frente al Impuesto al Valor Agregado del cliente"></i>
          <b-form-select id="ivaCond" :plain="true" :options="taxTypes" v-model="client.taxType">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="cbu">CBU</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Clave Bancaria Unificada del cliente. Sin puntos ni espacios"></i>
          <b-form-input v-validate="'numeric'" name="cbu" data-vv-as="CBU" id="cbu" type="text" v-model="client.cbu" placeholder="Ej: 22457878784422121547"></b-form-input>
          <!-- Debe ser numérico -->
          <span><small class="inv-feedback" v-show="errors.has('cbu')">{{ errors.first('cbu') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="email">Email</label>
          <b-form-input v-validate="{ email: true, regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }" name="email" data-vv-as="email" id="email" type="email" autocomplete="email" v-model="client.email" placeholder="Ej: envios@empresa.com"></b-form-input>
          <!-- Debe ser un email válido (Matchea mínimo de caracteres, caracteres inválidos, etc)  -->
          <span><small class="inv-feedback" v-show="errors.has('email')">{{ errors.first('email') }}</small></span>
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
      <b-col sm="6">
        <b-form-group>
          <label for="address">Domicilio</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del cliente"></i>
          <b-form-input name="address" data-vv-as="domicilio" type="text" id="address" v-model="client.address" placeholder="Calle y número"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('address')">{{ errors.first('address') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="country">País</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre del país. Este campo solo puede contener letras y espacios"></i>
          <b-form-input v-validate="'alpha'" name="country" data-vv-as="país" type="text" id="country" v-model="client.country" placeholder="Ej: Argentina"></b-form-input>
          <!-- Debe contener caracteres alfabéticos -->
          <span><small class="inv-feedback" v-show="errors.has('country')">{{ errors.first('country') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group label="Provincia" label-for="state" :label-cols="3" :horizontal="false">
          <b-form-select id="state" :plain="true" :options="['province']" v-model="client.province" />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="location">Localidad</label>
          <b-form-input v-validate="{ regex: /[^\s*]$/ }" name="location" data-vv-as="localidad" type="text" id="location" v-model="client.location" placeholder="Ej: San Justo"></b-form-input>
          <!-- No puede tener espacios en blanco intermedios ni puede ser únicamente un espacio en blanco  -->
          <span><small class="inv-feedback" v-show="errors.has('location')">{{ errors.first('location') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group label="Recibe percepciones?">
          <b-form-checkbox id="perception" v-model="client.hasPerception">Sí</b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-form-group label="Observaciones" label-for="notes" :label-cols="3" :horizontal="false">
          <b-form-textarea id="notes" :no-resize="true" :textarea="true" :rows="4" v-model="client.observation" placeholder="Escriba una observación..."></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { taxTypes, idTypes } from '@/store/const'
import { mapGetters } from 'vuex'

export default {
  name: 'c-client-detail',
  data () {
    return {
      inProgress: false,
      taxTypes: taxTypes,
      idTypes: idTypes
    }
  },
  props: {
    isEdit: { required: true }
  },
  computed: {
    ...mapGetters(['client'])
  },
  methods: {
    validateBeforeSubmit () {
      return this.$validator.validateAll()
    }
  }
}
</script>
