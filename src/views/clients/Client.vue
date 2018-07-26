<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header">
            <strong>{{ isEdit ? client.name : 'Nuevo cliente' }}</strong>
          </div>
          <b-form v-on:submit.prevent="onSave(client.objectId, client)">
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
              <b-form-select id="state" :plain="true" :options="['province']" v-model="client.province">
              </b-form-select>
            </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="region" v-b-tooltip.hover title="">Localidad</label>
            <b-form-input type="text" id="region" v-model="client.locality"></b-form-input>
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
                <b-form-checkbox id="perception"
                     v-model="client.hasPerception">Sí
                </b-form-checkbox>
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
            <b-form-textarea id="notes" :no-resize="true" :textarea="true" :rows="4" v-model="client.observation"></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
          <template>
            <b-row class="actions-bar">
              <b-col sm="12">
                <b-button variant="primary" :disabled="inProgress" type="submit" >Guardar</b-button>
                <b-button variant="outline-danger" :disabled="inProgress" v-if="isEdit" @click="showModal()">Eliminar</b-button>
                <b-button variant="outline-primary" @click="$router.go(-1)">Volver</b-button>
                <c-confirmation-modal @confirm="deleteClient(client.objectId)" @cancel="hideModal()" ref="confirmationModal" />
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
import { mapGetters } from 'vuex'
import store from '@/store'
import CErrorList from '@/components/ErrorList'
import CConfirmationModal from '@/components/DeleteConfirmation'
import {
  CLIENT_SAVE,
  CLIENT_EDIT,
  CLIENT_DELETE,
  FETCH_CLIENT,
  CLIENT_RESET_STATE
} from '@/store/types/actions'

import {
  idTypes,
  taxTypes
} from '@/store/const'

export default {
  name: 'v-client',
  components: { CErrorList, CConfirmationModal },
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
      errors: {},
      taxTypes: taxTypes,
      idTypes: idTypes
    }
  },
  computed: {
    ...mapGetters(['client']),
    isEdit () {
      return !!this.client.objectId
    }
  },
  methods: {
    onSave (id, client) {
      var $this = this
      let action = id ? CLIENT_EDIT : CLIENT_SAVE
      $this.inProgress = true
      $this.$store
        .dispatch(action)
        .then(myClient => {
          $this.inProgress = false
          $this.$router.push({
            name: 'Editar Cliente',
            params: {
              id: myClient.id
            }
          })
        }, error => {
          console.log(error)
        })
    },
    showModal () {
      this.$refs.confirmationModal.$refs.deleteModal.show()
    },
    hideModal () {
      this.$refs.confirmationModal.$refs.deleteModal.hide()
    },
    deleteClient (id) {
      this.$store
        .dispatch(CLIENT_DELETE, id)
        .then(res => {
          this.$router.push('/clientes')
        }, error => {
          // mostrar errores
          console.log('error')
          console.log(error)
        })
    }
  }
}
</script>
