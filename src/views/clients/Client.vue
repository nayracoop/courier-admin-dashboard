<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header">
            <strong>{{ client.name }}</strong>
          </div>
          <template>
            <b-row class="actions-bar">
                <b-col sm="12">
              <b-button variant="outline-primary">Imprimir</b-button>
              <b-button variant="outline-primary">Adjuntar</b-button>
              <b-button variant="outline-primary">Ver historial</b-button>
                </b-col>
          </b-row>
          </template>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="name">Nombre</label>
                <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social de tu cliente"></i>
                <b-form-input type="text" id="name" placeholder="" :value="client.name"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
            <label for="code" v-b-tooltip.hover title="Código identificatorio que asignaste a tu cliente. Campo opcional">Código</label>
            <b-form-input type="text" id="code" placeholder=""></b-form-input>
          </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
            <b-form-group
            label="Tipo de identificación"
            label-for="idType"
            :label-cols="3"
            :horizontal="false">
            <b-form-select id="idType"
              :plain="true"
              :options="['Sin identificar / venta global diaria','DNI', 'CUIL', 'CUIT']"
              value="Sin identificar / venta global diaria">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="idNumber" v-b-tooltip.hover title="Número del DNI, CUIT, CUIL, etc">N° de identificación</label>
            <b-form-input type="text" pattern="[0-9]" id="idNumber" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
            label="Condición IVA"
            label-for="ivaCond"
            :label-cols="3"
            :horizontal="false"
            v-b-tooltip.hover title="Condición frente al Impuesto al Valor Agregado de tu cliente"
            >
            <b-form-select id="ivaCond"
              :plain="true"
              :options="['Consumidor final','Exento', 'Exterior', 'IVA no alcanzado', 'Monotributista', 'Responsable inscripto']"
              value="Sin identificar / venta global diaria">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
            label="Recibe percepciones?"
            label-for="perception"
            :label-cols="3"
            :horizontal="false">
            <b-form-checkbox-group id="perception">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="perceptionOk" value="1">
                <label class="custom-control-label" for="perceptionOk">Sí</label>
              </div>
            </b-form-checkbox-group>
          </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
            label="Email"
            label-for="email"
            :horizontal="false">
            <b-form-input id="email" type="email" autocomplete="email"></b-form-input>
          </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="phone" v-b-tooltip.hover title="">Teléfono</label>
            <b-form-input type="tel" id="phone" pattern="[0-9]" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="address" v-b-tooltip.hover title="">Domicilio</label>
            <b-form-input type="text" id="address" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="country" v-b-tooltip.hover title="">País</label>
            <b-form-input type="text" id="country" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
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
            <b-col sm="6">
              <b-form-group>
                <label for="region" v-b-tooltip.hover title="">Localidad</label>
            <b-form-input type="text" id="region" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
            label="Lista de precios"
            label-for="pricesList"
            :label-cols="3"
            :horizontal="false">
            <b-form-select id="pricesListate"
              :plain="true"
              :options="['Crear lista de precio']"
              value="">
            </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="cbu" v-b-tooltip.hover title="Clave Bancaria Unificada de tu cliente. Campo opcional">CBU</label>
            <b-form-input type="text" pattern="[0-9]" id="cbu" placeholder=""></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
            label="Es proveedor"
            label-for="isProvider"
            :label-cols="3"
            :horizontal="false">
            <b-form-checkbox-group id="isProvider">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="isProvider" value="1">
                <label class="custom-control-label" for="isProvider">Sí</label>
              </div>
            </b-form-checkbox-group>
          </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
            label="Posee sucursales?"
            label-for="haveSuc"
            :label-cols="3"
            :horizontal="false">
            <b-form-checkbox-group id="haveSuc?">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" class="custom-control-input" id="haveSucOk" value="1">
                <label class="custom-control-label" for="haveSucOk">Sí</label>
              </div>
            </b-form-checkbox-group>
          </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <b-form-group
            label="Observaciones"
            label-for="notes"
            :label-cols="3"
            :horizontal="false">
            <b-form-textarea id="notes" :no-resize="true" :textarea="true" :rows="4"></b-form-textarea>
          </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import CListErrors from '@/components/ListErrors'
import {
  CLIENT_SAVE,
  CLIENT_EDIT,
  FETCH_CLIENT,
  CLIENT_RESET_STATE
} from '@/store/types/actions'

export default {
  name: 'v-client',
  components: { CListErrors },
  props: {
    previousClient: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(CLIENT_RESET_STATE)
    return next()
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(CLIENT_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(FETCH_CLIENT,
        to.params.id,
        to.params.previousClient
      )
    }
    return next()
  },
  async beforeRouteLeave (to, from, next) {
    await store.dispatch(CLIENT_RESET_STATE)
    next()
  },
  data () {
    return {
      inProgress: false,
      errors: {}
    }
  },
  computed: {
    ...mapGetters([
      'client'
    ])
  },
  methods: {
    onSave (id, client) {
      let action = id ? CLIENT_EDIT : CLIENT_SAVE
      this.inProgress = true
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false
          this.$router.push({
            name: 'client',
            params: { id: data.client.id }
          })
        })
        .catch(({ response }) => {
          this.inProgress = false
          this.errors = response.data.errors
        })
    }
  }
}
</script>


