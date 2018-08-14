<template>
  <b-form v-on:submit.prevent>
    <b-row class="actions-bar" v-if="isEdit">
      <b-col sm="12">
        <b-button variant="outline-primary" :to="{ name: 'Nuevo Envío', params: { provider: provider } }">Confeccionar envío <i class="fa fa-plane"></i></b-button>
        <b-button variant="outline-primary" disabled>Imprimir lista de precios</b-button>
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
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social de tu cliente"></i>
          <b-form-input type="text" id="name" v-model="provider.name"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="code">Código</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste al proveedor. Campo opcional"></i>
          <b-form-input type="text" id="code" v-model="provider.userCode"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="idType">Tipo de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste a tu cliente. Campo opcional"></i>
          <b-form-select id="idType" :plain="true" :options="idTypes" v-model="provider.taxCategory">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="idNumber">N° de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número del DNI, CUIT, CUIL, etc"></i>
          <b-form-input id="idNumber" type="text" pattern="[0-9]+" v-model="provider.taxId"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="ivaCond">Condición IVA</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Condición frente al Impuesto al Valor Agregado del proveedor"></i>
          <b-form-select id="ivaCond" :plain="true" :options="taxTypes" v-model="provider.taxType">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="email">Email</label>
          <b-form-input id="email" type="email" autocomplete="email" v-model="provider.email"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <!--b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="postalCode">Código Postal</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
          <b-form-input type="text" id="postalCode" :value="provider.postalCode"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row-->
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="phone">Teléfono</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del proveedor"></i>
          <b-form-input type="tel" id="phone" pattern="[0-9]+" v-model="provider.phone"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="address">Domicilio</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del proveedor"></i>
          <b-form-input type="text" id="address" v-model="provider.address"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="country">País</label>
          <b-form-input type="text" id="country" v-model="provider.country"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group label="Provincia" label-for="state" :label-cols="3" :horizontal="false">
          <b-form-select id="state" :plain="true" :options="['province']" v-model="provider.province">
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="location">Localidad</label>
          <b-form-input type="text" id="location" v-model="provider.location"></b-form-input>
        </b-form-group>
      </b-col>
      <!--b-col sm="6">
        <b-form-group>
          <label for="pricesList">Cuenta Contable</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Cuenta contable en la que impactarán las compras a este proveedor. Te surgerimos mantener la cuenta que viene preconfigurada. Si estás familiarizado con el plan de cuentas modificala por la cuenta que prefieras"></i>
          <b-form-select id="" :plain="true" :options="['Crear cuenta contable']" value="">
          </b-form-select>
        </b-form-group>
      </b-col-->
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label label-for="notes">Observaciones</label>
          <b-form-textarea id="notes" :no-resize="true" :textarea="true" :rows="4" v-model="provider.observation"></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { taxTypes, idTypes } from '@/store/const'
import { mapGetters } from 'vuex'

export default {
  name: 'c-provider-detail',
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
    ...mapGetters(['provider'])
  }
}
</script>
