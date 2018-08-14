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
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social de tu cliente"></i>
          <b-form-input type="text" id="name" v-model="client.name"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="code">Código</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste a tu cliente. Campo opcional"></i>
          <b-form-input type="text" id="code" v-model="client.userCode"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="idType">Tipo de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste a tu cliente. Campo opcional"></i>
          <b-form-select id="idType" :plain="true" :options="idTypes" v-model="client.taxCategory">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="idNumber">N° de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número del DNI, CUIT, CUIL, etc"></i>
          <b-form-input id="idNumber" type="text" pattern="[0-9]+" v-model="client.taxId"></b-form-input>
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
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Clave Bancaria Unificada de tu cliente. Campo opcional"></i>
          <b-form-input id="cbu" type="text" pattern="[0-9]+" v-model="client.cbu"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="email">Email</label>
          <b-form-input id="email" type="email" autocomplete="email" v-model="client.email"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="phone">Teléfono</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del cliente"></i>
          <b-form-input type="tel" id="phone" pattern="[0-9]+" v-model="client.phone"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="address">Domicilio</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del cliente"></i>
          <b-form-input type="text" id="address" v-model="client.address"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="country">País</label>
          <b-form-input type="text" id="country" v-model="client.country"></b-form-input>
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
          <label for="region" v-b-tooltip.hover title="">Localidad</label>
          <b-form-input type="text" id="region" v-model="client.location"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
    <!--b-col sm="6">
        <b-form-group label="Es proveedor?">
        <b-form-checkbox id="isProvider"
                value="ok">Sí
        </b-form-checkbox>
        </b-form-group>
    </b-col-->
      <b-col sm="6">
        <b-form-group label="Recibe percepciones?">
          <b-form-checkbox id="perception" v-model="client.hasPerception">Sí</b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-form-group label="Observaciones" label-for="notes" :label-cols="3" :horizontal="false">
          <b-form-textarea id="notes" :no-resize="true" :textarea="true" :rows="4" v-model="client.observation"></b-form-textarea>
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
  }
}
</script>
