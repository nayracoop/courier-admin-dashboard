<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card no-body>
          <b-tabs card>
            <b-tab v-bind:title=" isEdit ? provider.name : 'Nuevo proveedor'" active>
                <div slot="header">
                  <strong>{{ isEdit ? provider.name : 'Nuevo proveedor' }}</strong>
                </div>
                <b-form v-on:submit.prevent="onSave(provider.objectId, provider)">
                  <template v-if="isEdit">
                    <b-row class="actions-bar">
                      <b-col sm="12">
                        <b-button variant="outline-primary" :to="{ name: 'Nuevo Envío', params: { provider: provider } }">Confeccionar envío</b-button>
                        <b-button variant="outline-primary" disabled>Imprimir lista de precios</b-button>
                      </b-col>
                    </b-row>
                  </template>
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
                        <b-form-select id="ivaCond" :plain="true" :options="taxTypes" v-model="provider.taxTypes">
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
                        <label for="locality">Localidad</label>
                        <b-form-input type="text" id="locality" v-model="provider.locality"></b-form-input>
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
                  <template>
                    <b-row class="actions-bar">
                      <b-col sm="12">
                        <b-button variant="primary" :disabled="inProgress" type="submit">Guardar</b-button>
                        <b-button variant="outline-danger" :disabled="inProgress" v-if="isEdit" @click="showModal()">Eliminar</b-button>
                        <b-button variant="outline-primary" @click="$router.go(-1)">Volver</b-button>
                        <c-single-delete @confirm="deleteProvider(provider.objectId)" @cancel="hideModal()" ref="confirmationModal" />
                      </b-col>
                    </b-row>
                  </template>
                </b-form>
              </b-tab>
              <b-tab title="Precios de venta" v-if="provider.isShipping">
                <c-cost-table :provider="provider"></c-cost-table>
              </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
import store from '@/store'
import CErrorList from '@/components/ErrorList'
import CCostTable from '@/components/CostTable'
import CSingleDelete from '@/components/DeleteConfirmationSingle'
import { PROVIDER_SAVE, PROVIDER_EDIT, PROVIDER_DELETE, FETCH_PROVIDER, PROVIDER_RESET_STATE } from '@/store/types/actions'
import { taxTypes, idTypes } from '@/store/const'

export default {
  name: 'v-provider',
  components: {
    CErrorList,
    CCostTable,
    CSingleDelete
  },
  props: {
    previousProvider: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate (to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(PROVIDER_RESET_STATE)
    return next()
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the provider
    await store.dispatch(PROVIDER_RESET_STATE)
    if (to.params.id !== undefined) {
      await store.dispatch(
        FETCH_PROVIDER,
        to.params.id,
        to.params.previousProvider
      )
    }
    return next()
  },
  async beforeRouteLeave (to, from, next) {
    await store.dispatch(PROVIDER_RESET_STATE)
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
    ...mapGetters(['provider']),
    isEdit () {
      return !!this.provider.objectId
    }
  },
  methods: {
    pepe () {
      this.$toasted.global.my_app_error({
        message: 'SS'
      })
    },
    onSave (id, provider) {
      console.log('s')
      var $this = this
      let action = id ? PROVIDER_EDIT : PROVIDER_SAVE
      $this.inProgress = true
      $this.$store
        .dispatch(action)
        .then(myProvider => {
          $this.inProgress = false
          $this.$router.push({
            name: 'Editar Proveedor',
            params: {
              id: myProvider.id
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
    deleteProvider (id) {
      this.$store
        .dispatch(PROVIDER_DELETE, id)
        .then(res => {
          this.$router.push('/proveedores')
        }, error => {
          // mostrar errores
          console.log('error')
          console.log(error)
        })
    }/*
    deleteProvider (id) {
      this.$store
        .dispatch(PROVIDER_DELETE, id)
        .then(res => {
          this.$router.push('/proveedores')
        }, error => {
          // mostrar errores
          console.log('error')
          console.log(error)
        })
    } */
  }
}
</script>
