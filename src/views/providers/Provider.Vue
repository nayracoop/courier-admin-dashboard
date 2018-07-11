<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
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
              <b-col sm="6">
                <b-form-group>
                  <label for="name">Nombre</label>
                  <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Nombre o razón social de tu cliente"></i>
                  <b-form-input type="text" id="name" placeholder="" v-model="provider.name"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-form-group>
                  <label for="code">Código</label>
                  <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Código identificatorio que asignaste a tu cliente. Campo opcional"></i>
                  <b-form-input type="text" id="code" placeholder="" v-model="provider.userCode"></b-form-input>
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
                  <b-form-input id="idNumber" type="text" pattern="[0-9]+" placeholder="" v-model="provider.taxId"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="6">
                <b-form-group>
                  <label for="ivaCond">Condición IVA</label>
                  <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Condición frente al Impuesto al Valor Agregado de tu cliente"></i>
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
                  <b-form-input type="text" id="postalCode" placeholder="" :value="provider.postalCode"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row-->
            <b-row>
              <b-col sm="6">
                <b-form-group>
                  <label for="phone">Teléfono</label>
                  <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Número de teléfono del proveedor"></i>
                  <b-form-input type="tel" id="phone" pattern="[0-9]+" placeholder="" v-model="provider.phone"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-form-group>
                  <label for="address">Domicilio</label>
                  <i class="fa fa-question-circle fa-sm" v-b-tooltip.hover title="Calle y número del proveedor"></i>
                  <b-form-input type="text" id="address" placeholder="" v-model="provider.address"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="6">
                <b-form-group>
                  <label for="country">País</label>
                  <b-form-input type="text" id="country" placeholder="" v-model="provider.country"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-form-group label="Provincia" label-for="state" :label-cols="3" :horizontal="false">
                  <b-form-select id="state" :plain="true" :options="['Buenos Aires', 'Catamarca', 'Chaco', 'Chubut']" v-model="provider.province">
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- <b-row>
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
                  <b-form-select id="" :plain="true" :options="['Crear cuenta contable']" value="">
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row> -->
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
                  <b-button variant="outline-primary" :disabled="inProgress" type="submit" >Guardar</b-button>
                  <b-button variant="outline-primary" :disabled="inProgress" v-if="isEdit" @click="deleteProvider(provider.objectId)">Eliminar</b-button>
                  <b-button variant="outline-primary" @click="$router.go(-1)">Volver</b-button>
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
import {
  mapGetters
} from 'vuex'
import store from '@/store'
import CErrorList from '@/components/ErrorList'
import {
  PROVIDER_SAVE,
  PROVIDER_EDIT,
  PROVIDER_DELETE,
  FETCH_PROVIDER,
  PROVIDER_RESET_STATE
} from '@/store/types/actions'
import {
  taxType,
  idType
} from '@/store/const'

export default {
  name: 'v-provider',
  components: {
    CErrorList
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
      taxTypes: taxType,
      idTypes: idType
    }
  },
  computed: {
    ...mapGetters(['provider']),
    isEdit () {
      return !!this.provider.objectId
    }
  },
  methods: {
    onSave (id, provider) {
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
    }
  }
}
</script>
