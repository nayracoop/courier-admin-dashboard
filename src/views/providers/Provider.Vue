<template>
<div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>          
          <div slot="header">
            <strong>{{ provider.name }}</strong>
          </div>
          <b-form v-on:submit.prevent="onSave(provider.id, provider)">
            <template>      
            <b-row class="actions-bar">
                <b-col sm="12">
                  <b-button variant="outline-primary" :to="{ name: 'NewShipping' }">Confeccionar envío</b-button>
                  <b-button variant="outline-primary">Imprimir lista de precios</b-button>
                </b-col>
          </b-row>
          </template>
          <b-row>          
            <b-col sm="6">
              <b-form-group>
                <label for="name">Nombre</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social de tu cliente"></i>
                <b-form-input type="text" id="name" placeholder="" :value="provider.name"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
            <label for="code" v-b-tooltip.hover title="">Código</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste a tu cliente. Campo opcional"></i>
            <b-form-input type="text" id="code" placeholder="" :value="provider.userCode"></b-form-input>
          </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
            <b-form-group>
              <label for="idType" label >Tipo de identificación</label>
            <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste a tu cliente. Campo opcional"></i>
            <b-form-select id="idType"
              :plain="true"
              :options="idTypes"
              value="Sin identificar / venta global diaria">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="idNumber">N° de identificación</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número del DNI, CUIT, CUIL, etc"></i>
            <b-form-input type="text" pattern="[0-9]" id="idNumber" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="ivaCond">Condición IVA</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Condición frente al Impuesto al Valor Agregado de tu cliente"></i>
            <b-form-select id="ivaCond"
              :plain="true"
              :options="taxTypes"
              value="Sin identificar / venta global diaria">
            </b-form-select>
            </b-form-group>
            </b-col> 
            <b-col sm="6">
              <b-form-group>
                <label for="email">Email</label>
            <b-form-input id="email" type="email" autocomplete="email"></b-form-input>
          </b-form-group>
            </b-col> 
          </b-row>
          <!--b-row>
            <b-col sm="6">
              <b-form-group>
            <label for="postalCode">Código Postal</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title=""></i>
                <b-form-input type="text" id="postalCode" placeholder="" :value="provider.postalCode"></b-form-input>
          </b-form-group>
            </b-col>
          </b-row-->
          <b-row>            
            <b-col sm="6">
              <b-form-group>
                <label for="phone">Teléfono</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del proveedor"></i>
            <b-form-input type="tel" id="phone" pattern="[0-9]" placeholder="" :value="provider.phone"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="address">Domicilio</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del proveedor"></i>
            <b-form-input type="text" id="address" placeholder="" :value="provider.address"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>            
            <b-col sm="6">
              <b-form-group>
                <label for="country">País</label>
            <b-form-input type="text" id="country" placeholder=""  :value="provider.country"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
            label="Provincia"
            label-for="state"
            :label-cols="3"
            :horizontal="false">
            <b-form-select id="state"
              :plain="true"
              :options="['Buenos Aires','Catamarca', 'Chaco', 'Chubut']"
              value="">
            </b-form-select>
            </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="region">Localidad</label>
            <b-form-input type="text" id="region" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="pricesList">Cuenta Contable</label>  
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Cuenta contable en la que impactarán las compras a este proveedor. Te surgerimos mantener la cuenta que viene preconfigurada. Si estás familiarizado con el plan de cuentas modificala por la cuenta que prefieras"></i>          
            <b-form-select id=""
              :plain="true"
              :options="['Crear cuenta contable']"
              value="">
            </b-form-select>
            </b-form-group>
            </b-col>
          </b-row>          
          <b-row>
            <b-col sm="12">
              <b-form-group>
                <label label-for="notes">Observaciones</label>
            <b-form-textarea id="notes" :no-resize="true" :textarea="true" :rows="4"  :value="provider.observation"></b-form-textarea>
          </b-form-group>
            </b-col>            
          </b-row>
          <template>      
            <b-row class="actions-bar">
                <b-col sm="12">
                  <b-button variant="outline-primary">Guardar</b-button>
                  <b-button variant="outline-primary">Eliminar</b-button>
                  <b-button variant="outline-primary">Volver</b-button>
                </b-col>
          </b-row>
          </template>
        </b-form>
        </b-card>
      </b-col>
      </b-row>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import store from "@/store";
import CListErrors from "@/components/ListErrors";
import {
  PROVIDER_SAVE,
  PROVIDER_EDIT,
  FETCH_PROVIDER,
  PROVIDER_RESET_STATE
} from "@/store/types/actions";
import { taxType } from "@/store/const/constVars";
import { idType } from "@/store/const/constVars";

export default {
  name: "v-provider",
  components: { CListErrors },
  props: {
    previousProvider: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate(to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(PROVIDER_RESET_STATE);
    return next();
  },
  async beforeRouteEnter(to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(PROVIDER_RESET_STATE);
    if (to.params.id !== undefined) {
      await store.dispatch(
        FETCH_PROVIDER,
        to.params.id,
        to.params.previousProvider
      );
    }
    return next();
  },
  async beforeRouteLeave(to, from, next) {
    await store.dispatch(PROVIDER_RESET_STATE);
    next();
  },
  data() {
    return {
      inProgress: false,
      errors: {},
      taxTypes: taxType,
      idTypes: idType
    };
  },
  computed: {
    ...mapGetters(["provider"])
  },
  methods: {
    onSave(id, provider) {
      let action = id ? PROVIDER_EDIT : PROVIDER_SAVE;
      this.inProgress = true;
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false;
          this.$router.push({
            name: "provider",
            params: { id: data.provider.id }
          });
        })
        .catch(({ response }) => {
          this.inProgress = false;
          this.errors = response.data.errors;
        });
    }
  }
};
</script>
