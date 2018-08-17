<template>
  <b-form v-on:submit.prevent data-vv-scope="form-1">
    <b-row class="actions-bar" v-if="isEdit">
      <b-col sm="12">
        <b-button variant="outline-primary" :to="{ name: 'Nuevo Envío', params: { provider: provider } }">Confeccionar envío <i class="fa fa-plane ml-1"></i></b-button>
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
          <b-form-input v-validate="'required'" name="name" data-vv-as="nombre" type="text" id="name" v-model="provider.name"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('name')">{{ errors.first('name') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="code">Código</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste al proveedor. Campo opcional"></i>
          <b-form-input v-validate="'numeric'" name="ucode" data-vv-as="código" type="text" id="code" v-model="provider.userCode"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('ucode')">{{ errors.first('ucode') }}</small></span>
          </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="idType">Tipo de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Tipo de identificación del proveedor"></i>
          <b-form-select id="idType" :plain="true" :options="idTypes" v-model="provider.taxCategory">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="idNumber">N° de identificación</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número del DNI, CUIT, CUIL, etc"></i>
          <b-form-input v-validate="'numeric|min:8|max:15'" name="idNum" data-vv-as="número de identificación" id="idNumber" type="text" pattern="[0-9]+" v-model="provider.taxId"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('idNum')">{{ errors.first('idNum') }}</small></span>
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
          <b-form-input v-validate="{ email: true, regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }" name="email" data-vv-as="email" id="email" type="email" autocomplete="email" v-model="provider.email"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('email')">{{ errors.first('email') }}</small></span>
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
          <b-form-input v-validate="'numeric|min:8'" name="phone" data-vv-as="teléfono" type="tel" id="phone" v-model="provider.phone"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('phone')">{{ errors.first('phone') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="address">Domicilio</label>
          <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del proveedor"></i>
          <b-form-input v-validate="'alpha_num|alpha_spaces'" name="address" data-vv-as="domicilio" type="text" id="address" v-model="provider.address"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('address')">{{ errors.first('address') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="country">País</label>
          <b-form-input v-validate="'alpha_spaces'" name="country" data-vv-as="país" type="text" id="country" v-model="provider.country"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('country')">{{ errors.first('country') }}</small></span>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label for="province">Province</label>
          <b-form-input v-validate="'alpha_spaces'" name="province" data-vv-as="país" type="text" id="province" v-model="provider.province"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('province')">{{ errors.first('province') }}</small></span>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group>
          <label for="location">Localidad</label>
          <b-form-input v-validate="'alpha_num'" name="location" data-vv-as="localidad" type="text" id="location" v-model="provider.location"></b-form-input>
          <span><small class="inv-feedback" v-show="errors.has('location')">{{ errors.first('location') }}</small></span>
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
